# iOS CI/CD Implementation Checklist

Quick action checklist for implementing optimizations and cleanup tasks.

---

## 🎯 Phase 1: Quick Wins (1-2 hours)

**Expected Impact**: Save 2-4 minutes per build, reduce clutter

### 1. Add CocoaPods Caching

**File**: `.github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml`

- [ ] Add caching step before "Install CocoaPods dependencies"

```yaml
- name: Cache CocoaPods
  uses: actions/cache@v4
  with:
    path: |
      ios/Pods
      ~/Library/Caches/CocoaPods
    key: ${{ runner.os }}-pods-${{ hashFiles('ios/Podfile.lock') }}
    restore-keys: |
      ${{ runner.os }}-pods-
```

- [ ] Update "Install CocoaPods dependencies" step:

```yaml
- name: Install CocoaPods dependencies
  run: |
    cd ios
    if [ ! -d "Pods" ] || [ ! -f "Pods/Manifest.lock" ]; then
      pod install
    else
      echo "✅ Using cached CocoaPods"
    fi
    cd ..
```

---

### 2. Remove Debug Steps

**File**: `.github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml`

- [ ] Remove: `Debug APP_STORE_CONNECT_API_KEY_BASE64 Before Decode` step (lines ~508-532)
- [ ] Remove: `Debug Apple Key File` step (lines ~565-577)
- [ ] Keep: `Debug - Log Environment Variables` (but make conditional)

```yaml
- name: Debug - Log Environment Variables
  if: ${{ runner.debug || false }}
  run: |
    # ... existing debug code
```

---

### 3. Reduce Artifact Retention

**File**: `.github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml`

- [ ] Update "Upload iOS Release IPA" step:

```yaml
- name: Upload iOS Release IPA
  uses: actions/upload-artifact@v4
  with:
    name: ios-release-${{ github.run_number }}
    path: ios/build/smbmobile.ipa
    retention-days: 7  # Changed from 30
```

---

### 4. Clean Up Fastfile Debug Code

**File**: `fastlane/Fastfile`

- [ ] Remove excessive debug logging (lines ~120-144)
- [ ] Keep only essential logs:

```ruby
# Keep these
UI.message "🔨 Building iOS app using workspace..."
UI.success "✅ Archive created successfully!"
UI.error "❌ Build failed:"

# Remove these
# UI.message "🔍 Checking MATCH_PASSWORD..."
# UI.message "Length: #{ENV['MATCH_PASSWORD']&.length || 0}"
```

---

### 5. Enhance Keychain Cleanup

**File**: `.github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml`

- [ ] Update "Cleanup temporary keychain" step:

```yaml
- name: Cleanup temporary keychain
  if: always()
  run: |
    # Delete our keychain
    security delete-keychain "${{ env.KEYCHAIN_NAME }}" 2>/dev/null || true
    
    # Also cleanup any orphaned build keychains
    security list-keychains -d user | grep -E 'build.*keychain' | xargs -I {} security delete-keychain {} 2>/dev/null || true
    
    echo "✅ Cleanup complete"
```

---

## 🔄 Phase 2: Medium Effort (1-2 days)

**Expected Impact**: Save 3-6 minutes per build

### 6. Add npm Cache Verification

- [ ] Verify npm caching is working:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: npm  # ✅ Already present
    node-version: '18'
```

---

### 7. Add Build Time Tracking

**File**: `.github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml`

- [ ] Add before "Build and Release iOS":

```yaml
- name: Start build timer
  run: echo "BUILD_START=$(date +%s)" >> $GITHUB_ENV
```

- [ ] Add after "Build and Release iOS":

```yaml
- name: Calculate build duration
  if: always()
  run: |
    BUILD_END=$(date +%s)
    DURATION=$((BUILD_END - BUILD_START))
    echo "🕐 Build duration: $((DURATION / 60))m $((DURATION % 60))s"
```

---

### 8. Add Conditional Version Bumping

**File**: `fastlane/Fastfile`

- [ ] Update `qa_release` lane:

```ruby
# Only increment version on main/release branches
if ENV['GITHUB_REF_NAME'] =~ /^(main|staging|release\/.+)$/
  increment_version_number(
    xcodeproj: "ios/smbmobile.xcodeproj",
    bump_type: "patch"
  )
  UI.success "✅ Version incremented"
else
  UI.message "⏭️  Skipping version increment (not on release branch)"
end

# Always increment build number
increment_build_number(
  xcodeproj: "ios/smbmobile.xcodeproj"
)
```

- [ ] Pass branch name to Fastlane in workflow:

```yaml
- name: Build and Release iOS
  run: fastlane ios qa_release
  env:
    # ... existing env vars
    GITHUB_REF_NAME: ${{ github.ref_name }}
```

---

### 9. Add Build Failure Notifications

**File**: `.github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml`

- [ ] Add at the end of job:

```yaml
- name: Notify build failure
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: `iOS Build Failed - ${context.sha.substring(0, 7)}`,
        body: `
        ## Build Failure
        
        - **Commit**: ${context.sha}
        - **Branch**: ${context.ref}
        - **Run**: https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}
        
        Please check the logs and troubleshooting guide.
        `,
        labels: ['ci/cd', 'ios', 'build-failure']
      })
```

---

## 🚀 Phase 3: Advanced (Optional, 1 week)

**Expected Impact**: Save 5-10 minutes or move to specialized platform

### 10. Evaluate Xcode Cloud

- [ ] Review [Xcode Cloud pricing](https://developer.apple.com/xcode-cloud/)
- [ ] Calculate cost comparison:
  - GitHub Actions: Current cost
  - Xcode Cloud: $14.99/month + overages
- [ ] Test migration with a branch
- [ ] Document decision

---

### 11. Implement Derived Data Caching

**File**: `.github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml`

- [ ] Add before "Build and Release iOS":

```yaml
- name: Cache Xcode Derived Data
  uses: actions/cache@v4
  with:
    path: ~/Library/Developer/Xcode/DerivedData
    key: ${{ runner.os }}-xcode-deriveddata-${{ hashFiles('ios/**/*.swift', 'ios/**/*.m', 'ios/Podfile.lock') }}
    restore-keys: |
      ${{ runner.os }}-xcode-deriveddata-
```

⚠️ **Warning**: Large cache size (2-5 GB), test thoroughly

---

### 12. Add Build Performance Dashboard

- [ ] Create GitHub Action to track metrics
- [ ] Store build times in a CSV or database
- [ ] Create visualization (GitHub Pages or external tool)
- [ ] Set up alerts for degraded performance

---

## 📋 Verification Checklist

After implementing changes, verify:

### Build Success
- [ ] Build completes successfully
- [ ] IPA is generated in `ios/build/`
- [ ] TestFlight upload succeeds
- [ ] GitHub Release is created

### Caching
- [ ] CocoaPods cache hits on second build
- [ ] npm cache hits on second build
- [ ] Build time reduced by 2-4 minutes

### Cleanup
- [ ] No orphaned keychains after build
- [ ] Artifacts expire after 7 days
- [ ] Temporary files deleted

### Monitoring
- [ ] Build duration is logged
- [ ] Build failures create issues
- [ ] Metrics are tracked

---

## 🔍 Testing Procedure

### Local Testing (if possible)

1. **Test Fastfile changes locally**:
   ```bash
   fastlane ios qa_release
   ```

2. **Verify secrets**:
   ```bash
   # Check AuthKey.p8 format
   head -n 3 credentials/ios/AuthKey.p8
   tail -n 1 credentials/ios/AuthKey.p8
   ```

3. **Test CocoaPods caching**:
   ```bash
   cd ios
   pod install
   # Second run should be faster
   pod install
   cd ..
   ```

### CI/CD Testing

1. **Create a test branch**:
   ```bash
   git checkout -b test/workflow-optimizations
   ```

2. **Implement Phase 1 changes**

3. **Push and verify**:
   ```bash
   git push origin test/workflow-optimizations
   ```

4. **Monitor GitHub Actions**:
   - Check build succeeds
   - Verify caching is working
   - Compare build times

5. **Merge if successful**:
   ```bash
   git checkout staging
   git merge test/workflow-optimizations
   git push origin staging
   ```

---

## 📊 Success Metrics

### Before Optimization

| Metric | Value |
|--------|-------|
| Average Build Time | 25 minutes |
| CocoaPods Install | 2-3 minutes |
| npm install | 1-2 minutes |
| Cache Hit Rate | 0% |
| GitHub Actions Cost | 250 minutes/build |

### Target After Phase 1

| Metric | Target |
|--------|--------|
| Average Build Time | 20-22 minutes |
| CocoaPods Install | 10-30 seconds (cached) |
| npm install | 15-30 seconds (cached) |
| Cache Hit Rate | 80%+ |
| GitHub Actions Cost | 200-220 minutes/build |

### Target After Phase 2

| Metric | Target |
|--------|--------|
| Average Build Time | 18-20 minutes |
| CocoaPods Install | 10-30 seconds (cached) |
| npm install | 15-30 seconds (cached) |
| Cache Hit Rate | 85%+ |
| GitHub Actions Cost | 180-200 minutes/build |

---

## 🚨 Rollback Plan

If optimizations cause issues:

### Quick Rollback

```bash
# Revert the workflow file
git checkout HEAD~1 .github/workflows/this-smb-4-0a6edfc_custom-staging_app_d05935d_env_3a67391.yaml

# Revert Fastfile
git checkout HEAD~1 fastlane/Fastfile

# Commit and push
git commit -m "Rollback: Revert workflow optimizations"
git push origin staging
```

### Selective Rollback

If only specific changes are problematic:

1. Identify the problematic change
2. Comment out that step in the workflow
3. Test again
4. Document the issue in troubleshooting guide

---

## 📞 Support

### If You Get Stuck

1. **Check documentation**:
   - [Troubleshooting Guide](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md)
   - [Build Configuration](./IOS_BUILD_CONFIGURATION.md)
   - [Workflow Optimizations](./IOS_WORKFLOW_OPTIMIZATIONS.md)

2. **Review logs**:
   - GitHub Actions logs
   - Fastlane output
   - Xcode build logs

3. **Verify environment**:
   - Secrets are correct
   - Xcode version matches
   - Dependencies are up to date

4. **Ask for help**:
   - Internal team
   - Fastlane community
   - GitHub Support

---

## ✅ Final Checklist

Before marking complete:

- [ ] All Phase 1 tasks implemented
- [ ] Tests pass on test branch
- [ ] Build times improved
- [ ] No new errors introduced
- [ ] Documentation updated
- [ ] Team notified of changes
- [ ] Rollback plan documented
- [ ] Monitoring in place

---

## 🎉 Completion

When all phases are complete:

- [ ] Update this checklist with completion dates
- [ ] Document actual build time improvements
- [ ] Share results with team
- [ ] Schedule quarterly review
- [ ] Celebrate! 🎊

---

**Started**: ___________  
**Phase 1 Complete**: ___________  
**Phase 2 Complete**: ___________  
**Phase 3 Complete**: ___________  

**Build Time Before**: _______ minutes  
**Build Time After**: _______ minutes  
**Improvement**: _______ %

---

**Last Updated**: November 19, 2024  
**Version**: 1.0

