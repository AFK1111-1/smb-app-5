# iOS Build Configuration - Final Working Setup

This document describes the complete, working iOS CI/CD configuration for GitHub Actions with Xcode 16.1, Expo, and Fastlane.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [GitHub Secrets Configuration](#github-secrets-configuration)
3. [Workflow Structure](#workflow-structure)
4. [Fastlane Configuration](#fastlane-configuration)
5. [Key Dependencies](#key-dependencies)
6. [Build Process Flow](#build-process-flow)
7. [File Structure](#file-structure)

---

## System Requirements

### CI Environment
- **OS**: macOS (GitHub Actions `macos-latest`)
- **Xcode**: 16.1
- **Node.js**: 18.x
- **Ruby**: 3.2.9
- **Fastlane**: 2.228.0+

### Development Tools
- CocoaPods (installed via Bundler)
- Expo CLI
- Git (for Match repository access)

---

## GitHub Secrets Configuration

### Required Secrets

#### 1. `ENCODED_PIPELINE_SECRET`
Base64-encoded JSON containing all environment variables:

```json
{
  "APP_STORE_CONNECT_API_KEY_ID": "ABC123XYZ",
  "APP_STORE_CONNECT_ISSUER_ID": "12345678-1234-1234-1234-123456789012",
  "MATCH_PASSWORD": "your-match-repo-password",
  "APP_STORE_CONNECT_API_KEY_BASE64": "-----BEGIN PRIVATE KEY-----\nMIGT...base64content...\n-----END PRIVATE KEY-----",
  "FASTLANE_MATCH_DEPLOY_KEY": "-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----",
  "IOS_GOOGLE_SERVICE_INFO_PLIST": "base64-encoded-plist",
  "GITHUB_TOKEN": "${{ secrets.GITHUB_TOKEN }}"
}
```

**To create**:
```bash
# Create JSON file
cat > secrets.json << EOF
{
  "APP_STORE_CONNECT_API_KEY_ID": "your-key-id",
  ...
}
EOF

# Base64 encode
cat secrets.json | base64 > encoded_secret.txt

# Add to GitHub Secrets as SMBAPP4_THISSMB40A6EDFC_CUSTOMSTAGING_APP_D05935D_ENV_3A67391
```

#### Secret Descriptions

| Secret Key | Description | Format |
|------------|-------------|--------|
| `APP_STORE_CONNECT_API_KEY_ID` | App Store Connect API Key ID | Plain text (e.g., `ABC123XYZ`) |
| `APP_STORE_CONNECT_ISSUER_ID` | App Store Connect Issuer ID | UUID format |
| `MATCH_PASSWORD` | Password for encrypted Match repository | Plain text |
| `APP_STORE_CONNECT_API_KEY_BASE64` | Apple API private key (.p8 file) | PEM format (multiline) |
| `FASTLANE_MATCH_DEPLOY_KEY` | SSH private key for Match repo access | OpenSSH private key format |
| `IOS_GOOGLE_SERVICE_INFO_PLIST` | Firebase config for iOS | Base64-encoded plist |

---

## Workflow Structure

### Complete GitHub Actions Workflow

Location: `.github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml`

### Key Steps Overview

```yaml
jobs:
  build-and-release:
    runs-on: macos-latest
    steps:
      # 1. Setup
      - Checkout repository
      - Decode secrets
      - Setup Node.js 18
      - Setup Ruby 3.2
      - Install dependencies
      
      # 2. Credentials
      - Create credential directories
      - Setup Apple API Key (.p8 file)
      - Setup Google Services (Firebase)
      - Setup SSH for Match
      
      # 3. Expo Build
      - Run expo prebuild (iOS only)
      - Run pod install (generate workspace)
      
      # 4. Xcode Setup
      - Select Xcode 16.1
      - Run first launch setup
      - Accept licenses
      
      # 5. Code Signing
      - Create temporary keychain
      - Unlock keychain
      
      # 6. Build & Deploy
      - Run Fastlane (qa_release lane)
      - Upload artifacts
      - Create GitHub release
      
      # 7. Cleanup
      - Delete temporary keychain
```

### Critical Workflow Sections

#### A. Secret Decoding
```yaml
- name: 'Run :: Decoding Secrets'
  run: |
    if [ ! -x "$(command -v jq)" ]; then
      echo "jq not found, installing..."
      sudo apt-get update
      sudo apt-get install -y jq
    fi
    echo "${{ env.ENCODED_PIPELINE_SECRET }}" | base64 --decode | jq -r 'to_entries[] | "\(.key)=\(.value)"' | while read line; do 
      echo "$line" >> $GITHUB_ENV
      echo "::add-mask::${line#*=}"
    done
```

#### B. AuthKey.p8 Setup
```yaml
- name: Setup Apple API Key for Fastlane Match
  run: |
    mkdir -p credentials/ios
    
    # Extract base64 content: remove headers and all spaces/newlines
    base64_content=$(echo "$APP_STORE_CONNECT_API_KEY_BASE64" | \
      sed 's/-----BEGIN PRIVATE KEY-----//g' | \
      sed 's/-----END PRIVATE KEY-----//g' | \
      tr -d ' \n\r\t')
    
    # Write properly formatted .p8 file
    echo "-----BEGIN PRIVATE KEY-----" > credentials/ios/AuthKey.p8
    echo "$base64_content" | fold -w 64 >> credentials/ios/AuthKey.p8
    echo "-----END PRIVATE KEY-----" >> credentials/ios/AuthKey.p8
  env:
    APP_STORE_CONNECT_API_KEY_BASE64: ${{ env.APP_STORE_CONNECT_API_KEY_BASE64 }}
```

#### C. SSH Key Setup
```yaml
- name: Setup SSH
  run: |
    mkdir -p ~/.ssh
    
    # Write SSH key
    if echo "$FASTLANE_MATCH_DEPLOY_KEY" | head -c 5 | grep -q "^-----"; then
      echo "$FASTLANE_MATCH_DEPLOY_KEY" > ~/.ssh/id_rsa
    else
      echo "$FASTLANE_MATCH_DEPLOY_KEY" | base64 --decode > ~/.ssh/id_rsa
    fi
    
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts
  env:
    FASTLANE_MATCH_DEPLOY_KEY: ${{ env.FASTLANE_MATCH_DEPLOY_KEY }}
```

#### D. Expo Prebuild + CocoaPods
```yaml
- name: Expo Prebuild (iOS only)
  run: npm run prebuild -- --clean --platform ios

- name: Install CocoaPods dependencies
  run: |
    cd ios
    pod install
    cd ..
    echo "✅ CocoaPods installation complete"
    ls -la ios/*.xcworkspace || echo "❌ Workspace not found!"
```

#### E. Xcode Setup
```yaml
- name: Setup Xcode 16.1
  uses: maxim-lobanov/setup-xcode@v1
  with:
    xcode-version: '16.1'

- name: Setup Xcode First Launch
  run: |
    sudo xcodebuild -runFirstLaunch
    sudo xcodebuild -license accept || echo "License already accepted"
```

#### F. Temporary Keychain
```yaml
- name: Create temporary keychain for code signing
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
    security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME" 2>/dev/null || true

- name: Cleanup temporary keychain
  if: always()
  run: |
    security delete-keychain "${{ env.KEYCHAIN_NAME }}" 2>/dev/null || true
```

---

## Fastlane Configuration

### Fastfile Structure

Location: `fastlane/Fastfile`

### `qa_release` Lane (Complete)

```ruby
platform :ios do
  desc "Submit a new QA build to TestFlight"
  lane :qa_release do
    # 1. Setup App Store Connect API
    api_key = app_store_connect_api_key(
      key_id: ENV['APP_STORE_CONNECT_API_KEY_ID'],
      issuer_id: ENV['APP_STORE_CONNECT_ISSUER_ID'],
      key_filepath: "#{Dir.pwd}/../credentials/ios/AuthKey.p8"
    )

    # 2. Download certificates and provisioning profiles
    match(
      type: "appstore",
      readonly: false,
      app_identifier: "com.insighture.smbmobile",
      git_url: "git@github.com:insighture/smb-mobile-fastlane.git",
      api_key: api_key,
      force_for_new_devices: true,
      keychain_password: ENV['KEYCHAIN_PASSWORD'],
      keychain_name: ENV['KEYCHAIN_NAME']
    )
    
    # 3. Configure code signing (per-target)
    update_code_signing_settings(
      use_automatic_signing: false,
      path: "ios/smbmobile.xcodeproj",
      team_id: "96W7U4JYV4",
      profile_name: "match AppStore com.insighture.smbmobile",
      code_sign_identity: "iPhone Distribution",
      targets: ["smbmobile"]  # Only main app, not pods
    )

    # 4. Increment version and build number
    increment_version_number(
      xcodeproj: "ios/smbmobile.xcodeproj",
      bump_type: "patch"
    )
    increment_build_number(
      xcodeproj: "ios/smbmobile.xcodeproj"
    )

    # 5. Build archive
    archive_path = "#{Dir.pwd}/../ios/build/smbmobile.xcarchive"
    
    sh("cd #{Dir.pwd}/.. && " \
       "xcodebuild archive " \
       "-workspace ./ios/smbmobile.xcworkspace " \
       "-scheme smbmobile " \
       "-configuration Release " \
       "-destination 'generic/platform=iOS' " \
       "-archivePath '#{archive_path}' " \
       "ONLY_ACTIVE_ARCH=NO " \
       "ENABLE_BITCODE=NO " \
       "COMPILER_INDEX_STORE_ENABLE=NO " \
       "-allowProvisioningUpdates")
    
    # 6. Export IPA
    build_ios_app(
      skip_build_archive: true,
      archive_path: archive_path,
      workspace: "ios/smbmobile.xcworkspace",
      scheme: "smbmobile",
      export_method: "app-store",
      output_directory: "./ios/build",
      export_options: {
        method: "app-store",
        provisioningProfiles: {
          "com.insighture.smbmobile" => "match AppStore com.insighture.smbmobile"
        },
        teamID: "96W7U4JYV4"
      },
      output_name: "smbmobile.ipa"
    )

    # 7. Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )

    # 8. Generate changelog
    changelog_from_git_commits
  end
end
```

### Key Configuration Points

#### Build Command Breakdown
```bash
xcodebuild archive \
  -workspace ./ios/smbmobile.xcworkspace \    # Must use workspace for CocoaPods
  -scheme smbmobile \                         # Scheme name (not target)
  -configuration Release \                    # Build configuration
  -destination 'generic/platform=iOS' \       # Xcode 16 compatible destination
  -archivePath '/path/to/archive' \          # Output archive path
  ONLY_ACTIVE_ARCH=NO \                      # Build all architectures
  ENABLE_BITCODE=NO \                        # Bitcode disabled
  COMPILER_INDEX_STORE_ENABLE=NO \           # Faster builds
  -allowProvisioningUpdates                  # Allow profile updates
```

#### Why Each Parameter Matters

| Parameter | Purpose |
|-----------|---------|
| `-workspace` | Required for CocoaPods; includes all pod targets |
| `-scheme` | Defines build targets and dependencies |
| `-destination 'generic/platform=iOS'` | Xcode 16 compatible, bypasses simulator requirement |
| `ONLY_ACTIVE_ARCH=NO` | Builds arm64 for all devices (App Store requirement) |
| `ENABLE_BITCODE=NO` | Bitcode deprecated in Xcode 14+ |
| `-allowProvisioningUpdates` | Allows Xcode to download profiles if needed |

---

## Key Dependencies

### Gemfile
```ruby
source "https://rubygems.org"

gem "fastlane"
gem "cocoapods"
```

### package.json Scripts
```json
{
  "scripts": {
    "prebuild": "expo prebuild",
    "ios": "expo run:ios",
    "android": "expo run:android"
  }
}
```

### Podfile Configuration
```ruby
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '13.0'
install! 'cocoapods', :deterministic_uuids => false

target 'smbmobile' do
  use_expo_modules!
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true
  )

  post_install do |installer|
    react_native_post_install(installer)
  end
end
```

---

## Build Process Flow

### Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GitHub Actions Workflow Triggered                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Environment Setup                                          │
│    - Checkout code                                            │
│    - Decode ENCODED_PIPELINE_SECRET                           │
│    - Install Node.js, Ruby, dependencies                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Credential Preparation                                     │
│    - Create credentials/ios/ directory                        │
│    - Format and write AuthKey.p8 (Apple API key)             │
│    - Setup SSH key for Match repo access                      │
│    - Write GoogleService-Info.plist                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Expo Prebuild                                              │
│    - Run: npm run prebuild -- --clean --platform ios         │
│    - Generates: ios/smbmobile.xcodeproj                      │
│    - Creates: ios/ directory structure                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. CocoaPods Install                                          │
│    - Run: cd ios && pod install                               │
│    - Generates: ios/smbmobile.xcworkspace                    │
│    - Installs: All Expo module dependencies                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Xcode Configuration                                        │
│    - Select Xcode 16.1                                        │
│    - Run first launch setup                                   │
│    - Accept licenses                                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Keychain Setup                                             │
│    - Create temporary keychain (build.keychain)               │
│    - Generate random password                                 │
│    - Set as default keychain                                  │
│    - Configure access permissions                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Fastlane: qa_release Lane                                  │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ 8a. App Store Connect API Setup                     │   │
│    └───┬─────────────────────────────────────────────────┘   │
│        │                                                       │
│        ▼                                                       │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ 8b. Match - Download Certificates                   │   │
│    │     - Clones Match repository via SSH               │   │
│    │     - Decrypts certificates using MATCH_PASSWORD    │   │
│    │     - Imports into temporary keychain               │   │
│    └───┬─────────────────────────────────────────────────┘   │
│        │                                                       │
│        ▼                                                       │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ 8c. Update Code Signing Settings                    │   │
│    │     - Configure smbmobile target only                │   │
│    │     - Set team ID: 96W7U4JYV4                        │   │
│    │     - Set profile: match AppStore com.insi...        │   │
│    └───┬─────────────────────────────────────────────────┘   │
│        │                                                       │
│        ▼                                                       │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ 8d. Increment Version & Build Number                │   │
│    │     - Bump patch version (e.g., 1.0.0 → 1.0.1)      │   │
│    │     - Increment build number (e.g., 1 → 2)          │   │
│    └───┬─────────────────────────────────────────────────┘   │
│        │                                                       │
│        ▼                                                       │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ 8e. Build Archive (xcodebuild archive)              │   │
│    │     - Builds all pod dependencies first              │   │
│    │     - Compiles main app with Expo modules            │   │
│    │     - Creates: smbmobile.xcarchive                   │   │
│    └───┬─────────────────────────────────────────────────┘   │
│        │                                                       │
│        ▼                                                       │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ 8f. Export IPA (build_ios_app)                      │   │
│    │     - Exports archive to IPA                         │   │
│    │     - Signs for App Store distribution               │   │
│    │     - Output: ios/build/smbmobile.ipa                │   │
│    └───┬─────────────────────────────────────────────────┘   │
│        │                                                       │
│        ▼                                                       │
│    ┌─────────────────────────────────────────────────────┐   │
│    │ 8g. Upload to TestFlight                            │   │
│    │     - Uploads IPA to App Store Connect               │   │
│    │     - Submits for TestFlight processing              │   │
│    └─────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Artifact Upload & GitHub Release                           │
│    - Upload IPA as GitHub Actions artifact                    │
│    - Create GitHub release with version tag                   │
│    - Mark as pre-release                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. Cleanup                                                   │
│     - Delete temporary keychain                               │
│     - Remove sensitive files                                  │
└─────────────────────────────────────────────────────────────┘
```

### Build Time Estimates

| Phase | Duration |
|-------|----------|
| Environment Setup | ~2-3 minutes |
| Expo Prebuild | ~1-2 minutes |
| CocoaPods Install | ~2-3 minutes |
| Xcode Setup | ~1 minute |
| Match (Certificate Download) | ~5-10 seconds |
| Archive Build | ~15-18 minutes |
| IPA Export | ~1-2 minutes |
| TestFlight Upload | ~1-2 minutes |
| **Total** | **~22-30 minutes** |

---

## File Structure

### Project Directory Layout

```
mobile-app/
├── .github/
│   └── workflows/
│       └── this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml
├── ios/
│   ├── smbmobile/                      # Main app code
│   ├── smbmobile.xcodeproj/            # Xcode project (generated by Expo)
│   ├── smbmobile.xcworkspace/          # Xcode workspace (generated by CocoaPods)
│   ├── Podfile                         # CocoaPods dependencies
│   ├── Podfile.lock                    # Locked pod versions
│   └── build/                          # Build outputs (gitignored)
│       ├── smbmobile.xcarchive/        # Archive
│       └── smbmobile.ipa               # Final IPA
├── fastlane/
│   ├── Fastfile                        # Fastlane lanes
│   ├── Appfile                         # App identifiers
│   └── Matchfile                       # Match configuration (optional)
├── credentials/                        # Runtime credentials (gitignored)
│   └── ios/
│       └── AuthKey.p8                  # Apple API key
├── docs/
│   ├── IOS_BUILD_TROUBLESHOOTING_GUIDE.md
│   └── IOS_BUILD_CONFIGURATION.md      # This file
├── Gemfile                             # Ruby dependencies
├── Gemfile.lock                        # Locked gem versions
├── package.json                        # Node dependencies
├── package-lock.json                   # Locked npm versions
├── app.json                            # Expo configuration
└── .gitignore
```

### Important Gitignore Entries

```gitignore
# iOS
ios/build/
ios/Pods/
*.xcarchive
*.ipa
*.dSYM.zip

# Credentials
credentials/
*.p8
*.p12
*.mobileprovision

# Fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/test_output/
fastlane/*.cer
fastlane/*.p12
```

---

## Environment Variables Reference

### Required in CI/CD

| Variable | Used By | Purpose |
|----------|---------|---------|
| `APP_STORE_CONNECT_API_KEY_ID` | Fastlane Match | Authenticate with App Store Connect |
| `APP_STORE_CONNECT_ISSUER_ID` | Fastlane Match | Identify API key issuer |
| `MATCH_PASSWORD` | Fastlane Match | Decrypt certificates repository |
| `KEYCHAIN_PASSWORD` | Fastlane Match | Access temporary keychain |
| `KEYCHAIN_NAME` | Fastlane Match | Specify which keychain to use |
| `APP_STORE_CONNECT_API_KEY_BASE64` | Workflow | AuthKey.p8 file content |
| `FASTLANE_MATCH_DEPLOY_KEY` | Workflow | SSH key for Match repo |

### Optional Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `FASTLANE_SKIP_UPDATE_CHECK` | `false` | Skip fastlane update check |
| `FASTLANE_HIDE_TIMESTAMP` | `false` | Hide timestamps in logs |
| `MATCH_READONLY` | `false` | Prevent Match from creating new certs |

---

## Security Considerations

### 1. Secrets Management
- ✅ All secrets stored in GitHub Secrets (encrypted at rest)
- ✅ Secrets masked in logs with `::add-mask::`
- ✅ Temporary keychain with random password
- ✅ Credentials deleted after build

### 2. SSH Key Security
- ✅ Deploy key has read-only access to Match repository
- ✅ Key stored in `ENCODED_PIPELINE_SECRET` (base64 encoded)
- ✅ SSH known_hosts validated

### 3. Code Signing
- ✅ Certificates encrypted in Match repository
- ✅ Match password required for decryption
- ✅ Certificates never committed to main repository
- ✅ Temporary keychain deleted after build

### 4. API Keys
- ✅ AuthKey.p8 recreated on each build (not persisted)
- ✅ API key has minimal required permissions
- ✅ Key ID and Issuer ID kept separate from private key

---

## Maintenance & Updates

### Regular Maintenance Tasks

#### Weekly
- [ ] Monitor build times for performance degradation
- [ ] Check TestFlight processing status
- [ ] Review GitHub Actions usage minutes

#### Monthly
- [ ] Update Fastlane: `bundle update fastlane`
- [ ] Update CocoaPods: `pod repo update`
- [ ] Review and update dependencies

#### Quarterly
- [ ] Rotate SSH deploy keys
- [ ] Review and regenerate certificates (if needed)
- [ ] Update Xcode version as needed
- [ ] Audit GitHub Secrets

### Updating Xcode Version

```yaml
# In workflow file
- name: Setup Xcode
  uses: maxim-lobanov/setup-xcode@v1
  with:
    xcode-version: '16.2'  # Update version here
```

### Updating Ruby/Node Versions

```yaml
# Node.js
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Update version

# Ruby
- name: Install Ruby and Fastlane
  uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.3'  # Update version
```

---

## Monitoring & Logging

### Key Metrics to Track

1. **Build Success Rate**: Target >95%
2. **Build Duration**: Average ~25 minutes
3. **TestFlight Processing**: ~10-20 minutes after upload
4. **Certificate Expiration**: Monitor 30 days in advance

### Log Analysis

#### Successful Build Indicators
```
✅ Archive created successfully!
✅ IPA exported successfully
✅ Upload to TestFlight successful
```

#### Common Warning Messages (Safe to Ignore)
```
note: Disabling previews because SWIFT_VERSION is set
warning: Run script build phase ... will be run during every build
```

#### Critical Error Patterns
```
error: Unable to find module dependency
error: does not support provisioning profiles
xcodebuild: error: Unable to find a destination
```

---

## Rollback Procedures

### If Build Fails

1. **Check the troubleshooting guide** for known issues
2. **Review GitHub Actions logs** for specific errors
3. **Verify secrets** are properly configured
4. **Test locally** if possible:
   ```bash
   fastlane ios qa_release
   ```

### Emergency Rollback

If the workflow is broken and blocking deployments:

1. **Use manual build**:
   ```bash
   # On local Mac
   expo prebuild --clean --platform ios
   cd ios && pod install && cd ..
   fastlane ios qa_release
   ```

2. **Or revert to previous workflow**:
   ```bash
   git checkout HEAD~1 .github/workflows/[workflow-file]
   git commit -m "Revert to working workflow"
   git push
   ```

---

## Support & Resources

### Internal Resources
- Troubleshooting Guide: `docs/IOS_BUILD_TROUBLESHOOTING_GUIDE.md`
- Workflow Optimizations: `docs/IOS_WORKFLOW_OPTIMIZATIONS.md`

### External Documentation
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [Expo Documentation](https://docs.expo.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Xcode Build Settings Reference](https://developer.apple.com/documentation/xcode/build-settings-reference)

### Community Support
- Fastlane Slack: [fastlane.slack.com](https://fastlane.slack.com)
- Expo Forums: [forums.expo.dev](https://forums.expo.dev)
- Stack Overflow Tags: `fastlane`, `expo`, `xcode`

---

**Document Version**: 1.0  
**Last Updated**: November 19, 2024  
**Maintained By**: Development Team  
**Review Cycle**: Quarterly

