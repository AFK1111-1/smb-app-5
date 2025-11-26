# iOS Workflow Optimizations & Cleanup

This document provides optimization strategies, caching improvements, and cleanup recommendations for the iOS CI/CD pipeline.

---

## Table of Contents

1. [Current Performance Analysis](#current-performance-analysis)
2. [Caching Strategies](#caching-strategies)
3. [Workflow Optimizations](#workflow-optimizations)
4. [Build Time Improvements](#build-time-improvements)
5. [Resource Cleanup](#resource-cleanup)
6. [Cost Optimization](#cost-optimization)
7. [Recommended Workflow Changes](#recommended-workflow-changes)

---

## Current Performance Analysis

### Build Time Breakdown

| Phase | Current Duration | Optimization Potential |
|-------|-----------------|----------------------|
| Environment Setup | 2-3 min | ⚡ High (caching) |
| npm install | 1-2 min | ⚡ High (caching) |
| Expo Prebuild | 1-2 min | 🟡 Medium (conditional) |
| CocoaPods Install | 2-3 min | ⚡ High (caching) |
| Xcode First Launch | 1 min | 🔴 Low |
| Match Download | 5-10 sec | ⚡ High (caching) |
| Archive Build | 15-18 min | 🟡 Medium (incremental builds) |
| IPA Export | 1-2 min | 🔴 Low |
| TestFlight Upload | 1-2 min | 🔴 Low |
| **Total** | **22-30 min** | **Target: 12-18 min** |

---

## Caching Strategies

### 1. Node Modules Caching (Already Implemented) ✅

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: npm
    node-version: '18'
```

**Impact**: Saves 1-2 minutes  
**Status**: Already implemented

---

### 2. CocoaPods Caching (Recommended) ⚡

Add CocoaPods caching to avoid re-downloading pods on every build:

```yaml
- name: Cache CocoaPods
  uses: actions/cache@v4
  with:
    path: |
      ios/Pods
      ~/Library/Caches/CocoaPods
      ~/.cocoapods
    key: ${{ runner.os }}-pods-${{ hashFiles('ios/Podfile.lock') }}
    restore-keys: |
      ${{ runner.os }}-pods-

- name: Install CocoaPods dependencies
  run: |
    cd ios
    # Only install if cache missed or Podfile.lock changed
    if [ ! -d "Pods" ]; then
      pod install
    else
      echo "✅ Using cached CocoaPods"
    fi
    cd ..
```

**Impact**: Saves 2-3 minutes  
**Priority**: High 🔥

---

### 3. Fastlane Match Certificate Caching (Recommended) ⚡

Cache downloaded certificates to avoid git clone on every build:

```yaml
- name: Cache Fastlane Match Certificates
  uses: actions/cache@v4
  with:
    path: |
      ~/.fastlane
      ~/Library/Caches/org.carthage.CarthageKit
    key: ${{ runner.os }}-match-${{ hashFiles('fastlane/Matchfile') }}-${{ secrets.MATCH_PASSWORD }}
    restore-keys: |
      ${{ runner.os }}-match-
```

**Impact**: Saves 5-10 seconds (minor but reduces git operations)  
**Priority**: Low

---

### 4. Expo Prebuild Caching (Conditional) 🟡

Cache prebuild output to skip if native code hasn't changed:

```yaml
- name: Cache Expo Prebuild
  uses: actions/cache@v4
  with:
    path: |
      ios
      android
    key: ${{ runner.os }}-prebuild-${{ hashFiles('app.json', 'package.json') }}
    restore-keys: |
      ${{ runner.os }}-prebuild-

- name: Expo Prebuild (iOS only)
  run: |
    if [ ! -d "ios/smbmobile.xcodeproj" ]; then
      npm run prebuild -- --clean --platform ios
    else
      echo "✅ Using cached prebuild output"
    fi
```

**Impact**: Saves 1-2 minutes (when cache hits)  
**Priority**: Medium  
**Note**: May cause issues if native dependencies change; use with caution

---

### 5. Derived Data Caching (Advanced) 🟡

Cache Xcode derived data for incremental builds:

```yaml
- name: Cache Xcode Derived Data
  uses: actions/cache@v4
  with:
    path: ~/Library/Developer/Xcode/DerivedData
    key: ${{ runner.os }}-xcode-deriveddata-${{ hashFiles('ios/**/*.swift', 'ios/**/*.m', 'ios/Podfile.lock') }}
    restore-keys: |
      ${{ runner.os }}-xcode-deriveddata-
```

**Impact**: Saves 3-5 minutes on incremental builds  
**Priority**: Medium  
**Note**: Large cache size (~2-5 GB); may cause slower cache restore

---

## Workflow Optimizations

### 1. Remove Redundant Checkout Steps

**Current Issue**: Multiple `checkout` actions in the same job

```yaml
# Current (redundant)
- name: 'Run :: Checkout repository'
  uses: actions/checkout@v4

- name: Setup Node.js
  ...

- name: 'Run :: Checkout repository'  # ❌ Duplicate
  uses: actions/checkout@v4
```

**Optimization**:
```yaml
# Optimized (single checkout)
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # For changelog generation

# All other steps follow...
```

**Impact**: Saves 5-10 seconds

---

### 2. Parallelize Independent Steps

**Current**: All steps run sequentially  
**Optimization**: Run independent credential setups in parallel

```yaml
jobs:
  setup-credentials:
    runs-on: ubuntu-latest  # Faster for file operations
    steps:
      - Checkout
      - Decode secrets
      - Setup AuthKey.p8
      - Setup Google Services
      - Upload artifacts

  build-and-release:
    needs: setup-credentials
    runs-on: macos-latest
    steps:
      - Download credential artifacts
      - Setup Xcode
      - Build
```

**Impact**: Saves 1-2 minutes  
**Priority**: Medium (requires workflow restructuring)

---

### 3. Conditional Execution for Debug Steps

Wrap debug steps in conditional execution:

```yaml
- name: Debug - Log Environment Variables
  if: ${{ runner.debug || false }}  # Only run if debug mode enabled
  run: |
    echo "=== Environment Variables Debug ==="
    # ... debug output
```

**Impact**: Saves 10-20 seconds  
**Priority**: Low

---

### 4. Skip Versioning on Non-Release Branches

```yaml
# In Fastfile
lane :qa_release do
  # Only increment version on main/release branches
  if ENV['BRANCH_NAME'] =~ /^(main|release\/.+)$/
    increment_version_number(
      xcodeproj: "ios/smbmobile.xcodeproj",
      bump_type: "patch"
    )
  end
  
  # Always increment build number
  increment_build_number(
    xcodeproj: "ios/smbmobile.xcodeproj"
  )
  
  # ... rest of lane
end
```

**Impact**: Prevents version conflicts on feature branches  
**Priority**: High 🔥

---

## Build Time Improvements

### 1. Compiler Optimizations (Already Implemented) ✅

```ruby
xcodebuild archive \
  COMPILER_INDEX_STORE_ENABLE=NO \  # ✅ Disables indexing
  ENABLE_BITCODE=NO \                # ✅ Bitcode disabled
  ONLY_ACTIVE_ARCH=NO                # ✅ All architectures
```

---

### 2. Reduce Debug Symbols Size

Add to `xcodebuild` command:

```ruby
xcodebuild archive \
  DEBUG_INFORMATION_FORMAT="dwarf-with-dsym" \
  GCC_GENERATE_DEBUGGING_SYMBOLS=YES \
  DWARF_DSYM_FOLDER_PATH="$(CONFIGURATION_BUILD_DIR)" \
  # ... other flags
```

**Impact**: Minimal impact on build time, reduces archive size

---

### 3. Disable Unused Features

```ruby
xcodebuild archive \
  ENABLE_TESTABILITY=NO \           # Disable for release builds
  SWIFT_COMPILATION_MODE=wholemodule \  # Faster incremental builds
  # ... other flags
```

**Impact**: Saves 30-60 seconds

---

### 4. Use Xcode Cloud (Alternative) 💰

**Pros**:
- Purpose-built for iOS builds
- Faster build machines
- Better caching
- Integrated with App Store Connect

**Cons**:
- Additional cost ($14.99+/month)
- Less flexibility than GitHub Actions

**When to Consider**: If build times consistently exceed 30 minutes

---

## Resource Cleanup

### 1. Workflow File Cleanup

**Remove commented-out code blocks:**

```yaml
# ❌ Remove these sections from workflow file:
# - name: Select Xcode version (commented)
# - name: Check available Xcode version (commented)
# - name: Verify iOS project structure (commented)
```

**Clean up Android steps** (since iOS-only build):

```yaml
# ❌ Remove these sections:
# - name: Setup Android Keystore from secrets
# - name: Setup Google Play Service Key
# - name: Build and Release Android
# - name: Upload Android Release AAB
```

---

### 2. Remove Temporary Debug Steps

Once build is stable, remove:

```yaml
# ❌ Remove after confirming build stability
- name: Debug APP_STORE_CONNECT_API_KEY_BASE64 Before Decode
- name: Debug Apple Key File
- name: Debug - Log Environment Variables
```

**Keep only essential logging:**

```yaml
# ✅ Keep minimal logging
- name: Verify Xcode Setup
  run: |
    xcodebuild -version
    xcodebuild -showsdks
```

---

### 3. Cleanup Fastfile Debug Code

Remove debug logging from `Fastfile`:

```ruby
# ❌ Remove extensive debug logging
# UI.message "🔍 Checking MATCH_PASSWORD..."
# UI.message "Length: #{ENV['MATCH_PASSWORD']&.length || 0}"

# ✅ Keep only essential logs
UI.message "🔨 Building iOS app..."
UI.success "✅ Archive created successfully!"
```

---

### 4. File Artifact Cleanup

Add automatic cleanup of old artifacts:

```yaml
- name: Upload iOS Release IPA
  uses: actions/upload-artifact@v4
  with:
    name: ios-release-ipa-${{ github.run_number }}  # Include run number
    path: ios/build/smbmobile.ipa
    retention-days: 7  # Reduce from 30 to 7 days
```

---

### 5. Keychain Cleanup Enhancement

Ensure keychain cleanup even on cancellation:

```yaml
- name: Cleanup temporary keychain
  if: always()  # ✅ Already implemented
  run: |
    security delete-keychain "${{ env.KEYCHAIN_NAME }}" 2>/dev/null || true
    
    # Also cleanup any orphaned keychains
    security list-keychains -d user | grep -E 'build.*keychain' | xargs -I {} security delete-keychain {} 2>/dev/null || true
```

---

## Cost Optimization

### GitHub Actions Minutes Usage

**Current Cost** (macos-latest):
- Average build time: 25 minutes
- macOS multiplier: 10x
- Effective minutes used: 250 minutes per build

**Optimization Strategies**:

#### 1. Use Caching (Recommended) 🔥
```
Before: 25 minutes × 10x = 250 minutes
After:  18 minutes × 10x = 180 minutes
Savings: 70 minutes per build (28%)
```

#### 2. Reduce Build Frequency
- Build only on `push` to `main/release/*` branches
- Use `paths` filters to skip builds when only docs change

```yaml
on:
  push:
    branches: [main, 'release/*']
    paths-ignore:
      - 'docs/**'
      - '**.md'
      - '.github/workflows/**'  # Except this workflow
      - '.trivyignore'
```

#### 3. Use Larger Runners (If Available)
- GitHub Actions larger runners (macos-xlarge)
- Faster builds but higher per-minute cost
- May be cost-effective for very frequent builds

---

## Recommended Workflow Changes

### Optimized Workflow Structure

```yaml
name: iOS QA Release (Optimized)

on:
  push:
    branches: [staging, 'release/*']
    paths-ignore:
      - 'docs/**'
      - '**.md'

jobs:
  build-and-release:
    runs-on: macos-latest
    
    steps:
      # 1. Setup (with caching)
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Decode secrets
        run: |
          echo "${{ env.ENCODED_PIPELINE_SECRET }}" | base64 --decode | jq -r 'to_entries[] | "\(.key)=\(.value)"' | while read line; do 
            echo "$line" >> $GITHUB_ENV
            echo "::add-mask::${line#*=}"
          done
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          cache: npm
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      # 2. Setup Ruby & Fastlane
      - name: Install Ruby and Fastlane
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      
      # 3. Cache CocoaPods
      - name: Cache CocoaPods
        uses: actions/cache@v4
        with:
          path: |
            ios/Pods
            ~/Library/Caches/CocoaPods
          key: ${{ runner.os }}-pods-${{ hashFiles('ios/Podfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-pods-
      
      # 4. Credentials
      - name: Setup credentials
        run: |
          mkdir -p credentials/ios
          
          # AuthKey.p8
          base64_content=$(echo "$APP_STORE_CONNECT_API_KEY_BASE64" | \
            sed 's/-----BEGIN PRIVATE KEY-----//g' | \
            sed 's/-----END PRIVATE KEY-----//g' | \
            tr -d ' \n\r\t')
          echo "-----BEGIN PRIVATE KEY-----" > credentials/ios/AuthKey.p8
          echo "$base64_content" | fold -w 64 >> credentials/ios/AuthKey.p8
          echo "-----END PRIVATE KEY-----" >> credentials/ios/AuthKey.p8
          
          # SSH key
          mkdir -p ~/.ssh
          echo "$FASTLANE_MATCH_DEPLOY_KEY" | base64 --decode > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts
          
          # Google Services
          echo "$IOS_GOOGLE_SERVICE_INFO_PLIST" | base64 --decode > GoogleService-Info.plist
        env:
          APP_STORE_CONNECT_API_KEY_BASE64: ${{ env.APP_STORE_CONNECT_API_KEY_BASE64 }}
          FASTLANE_MATCH_DEPLOY_KEY: ${{ env.FASTLANE_MATCH_DEPLOY_KEY }}
          IOS_GOOGLE_SERVICE_INFO_PLIST: ${{ env.IOS_GOOGLE_SERVICE_INFO_PLIST }}
      
      # 5. Expo Prebuild
      - name: Expo Prebuild (iOS only)
        run: npm run prebuild -- --clean --platform ios
      
      # 6. CocoaPods Install
      - name: Install CocoaPods dependencies
        run: |
          cd ios
          if [ ! -d "Pods" ] || [ ! -f "Pods/Manifest.lock" ]; then
            pod install
          else
            echo "✅ Using cached CocoaPods"
          fi
          cd ..
      
      # 7. Xcode Setup
      - name: Setup Xcode 16.1
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '16.1'
      
      - name: Xcode First Launch
        run: |
          sudo xcodebuild -runFirstLaunch
          sudo xcodebuild -license accept || true
      
      # 8. Keychain Setup
      - name: Create temporary keychain
        run: |
          KEYCHAIN_PASSWORD=$(openssl rand -base64 32)
          KEYCHAIN_NAME="build.keychain"
          echo "KEYCHAIN_PASSWORD=$KEYCHAIN_PASSWORD" >> $GITHUB_ENV
          echo "KEYCHAIN_NAME=$KEYCHAIN_NAME" >> $GITHUB_ENV
          
          security delete-keychain "$KEYCHAIN_NAME" 2>/dev/null || true
          security create-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"
          EXISTING_KEYCHAINS=$(security list-keychains -d user | tr -d '"' | tr '\n' ' ')
          security list-keychains -d user -s "$KEYCHAIN_NAME" $EXISTING_KEYCHAINS
          security default-keychain -s "$KEYCHAIN_NAME"
          security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"
          security set-keychain-settings -t 3600 -u "$KEYCHAIN_NAME"
      
      # 9. Build & Deploy
      - name: Build and Release iOS
        run: fastlane ios qa_release
        env:
          APP_STORE_CONNECT_API_KEY_ID: ${{ env.APP_STORE_CONNECT_API_KEY_ID }}
          APP_STORE_CONNECT_ISSUER_ID: ${{ env.APP_STORE_CONNECT_ISSUER_ID }}
          MATCH_PASSWORD: ${{ env.MATCH_PASSWORD }}
          KEYCHAIN_PASSWORD: ${{ env.KEYCHAIN_PASSWORD }}
          KEYCHAIN_NAME: ${{ env.KEYCHAIN_NAME }}
      
      # 10. Artifacts & Release
      - name: Upload IPA
        uses: actions/upload-artifact@v4
        with:
          name: ios-release-${{ github.run_number }}
          path: ios/build/smbmobile.ipa
          retention-days: 7
      
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: qa-v${{ github.run_number }}
          name: iOS QA Release v${{ github.run_number }}
          body: |
            ## iOS QA Build
            
            **Build**: #${{ github.run_number }}
            **Commit**: ${{ github.sha }}
            **Branch**: ${{ github.ref_name }}
          prerelease: true
          files: ios/build/smbmobile.ipa
          token: ${{ env.GITHUB_TOKEN }}
      
      # 11. Cleanup
      - name: Cleanup
        if: always()
        run: |
          security delete-keychain "${{ env.KEYCHAIN_NAME }}" 2>/dev/null || true
          rm -rf credentials/
```

---

## Implementation Priority

### Phase 1: Quick Wins (1-2 hours) 🔥
1. ✅ Add CocoaPods caching
2. ✅ Remove redundant checkout steps
3. ✅ Remove commented-out code
4. ✅ Reduce artifact retention to 7 days
5. ✅ Add conditional version bumping

**Expected Savings**: 2-4 minutes per build

---

### Phase 2: Medium Effort (1-2 days) 🟡
1. Add Expo prebuild caching (with testing)
2. Implement derived data caching
3. Parallelize credential setup
4. Add branch-based build filtering

**Expected Savings**: 3-6 minutes per build

---

### Phase 3: Advanced Optimizations (1 week) 🔵
1. Evaluate Xcode Cloud migration
2. Implement incremental build strategy
3. Add build performance monitoring
4. Create build time dashboard

**Expected Savings**: 5-10 minutes per build (or move to Xcode Cloud)

---

## Monitoring Build Performance

### Add Build Time Tracking

```yaml
- name: Start build timer
  run: echo "BUILD_START=$(date +%s)" >> $GITHUB_ENV

- name: Build and Release iOS
  run: fastlane ios qa_release
  # ...

- name: Calculate build duration
  if: always()
  run: |
    BUILD_END=$(date +%s)
    DURATION=$((BUILD_END - BUILD_START))
    echo "🕐 Build duration: $((DURATION / 60)) minutes $((DURATION % 60)) seconds"
    echo "BUILD_DURATION=$DURATION" >> $GITHUB_ENV
```

### Track Metrics Over Time

Create a GitHub Issue or comment with build metrics:

```yaml
- name: Post build metrics
  if: always()
  uses: actions/github-script@v7
  with:
    script: |
      const duration = process.env.BUILD_DURATION;
      const status = '${{ job.status }}';
      const comment = `
      ## Build Metrics
      - **Status**: ${status}
      - **Duration**: ${Math.floor(duration / 60)}m ${duration % 60}s
      - **Commit**: ${context.sha.substring(0, 7)}
      - **Branch**: ${context.ref}
      `;
      // Post as comment or create issue
```

---

## Next Steps

### Immediate Actions (This Week)
- [ ] Implement CocoaPods caching
- [ ] Remove commented-out code from workflow
- [ ] Clean up debug steps in Fastfile
- [ ] Reduce artifact retention period

### Short Term (This Month)
- [ ] Add conditional version bumping
- [ ] Implement build time tracking
- [ ] Test Expo prebuild caching
- [ ] Review and optimize Fastfile

### Long Term (This Quarter)
- [ ] Evaluate Xcode Cloud
- [ ] Implement advanced caching strategies
- [ ] Create build performance dashboard
- [ ] Establish build time SLAs

---

## Success Metrics

### Target Goals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Average Build Time | 25 min | 18 min | 🎯 In Progress |
| Build Success Rate | 95%+ | 98%+ | ✅ Achieved |
| Cache Hit Rate | N/A | 80%+ | 🎯 To Implement |
| GitHub Actions Cost | High | -30% | 🎯 In Progress |

---

**Document Version**: 1.0  
**Last Updated**: November 19, 2024  
**Next Review**: December 19, 2024

