# iOS Build Troubleshooting Guide

This guide documents all the issues encountered and resolved during the iOS CI/CD pipeline setup on GitHub Actions with Xcode 16.1, Expo, and Fastlane.

---

## Table of Contents

1. [Environment Variables & Secrets](#1-environment-variables--secrets)
2. [AuthKey.p8 File Corruption](#2-authkeyp8-file-corruption)
3. [Match Password Issues](#3-match-password-issues)
4. [Xcode Project Structure](#4-xcode-project-structure)
5. [Xcode 16 Destination Validation](#5-xcode-16-destination-validation)
6. [CocoaPods Dependencies Missing](#6-cocoapods-dependencies-missing)
7. [Code Signing Profile Conflicts](#7-code-signing-profile-conflicts)
8. [IPA Export Failures](#8-ipa-export-failures)
9. [Keychain Access Issues](#9-keychain-access-issues)

---

## 1. Environment Variables & Secrets

### Problem
Environment variables were not accessible in the workflow, showing:
```
APP_STORE_CONNECT_API_KEY_ID is set: false
APP_STORE_CONNECT_ISSUER_ID is set: false
```

### Root Cause
- Variables were stored in `ENCODED_PIPELINE_SECRET` as base64-encoded JSON
- Needed to be decoded and added to `$GITHUB_ENV`
- GitHub Actions masks secret values (shows `***`)

### Solution
**Step 1**: Decode secrets early in workflow
```yaml
- name: 'Run :: Decoding Secrets'
  run: |
    echo "${{ env.ENCODED_PIPELINE_SECRET }}" | base64 --decode | jq -r 'to_entries[] | "\(.key)=\(.value)"' | while read line; do 
      echo "$line" >> $GITHUB_ENV
      echo "::add-mask::${line#*=}"
    done
```

**Step 2**: Pass to Fastlane via environment block
```yaml
- name: Build and Release iOS
  run: fastlane ios qa_release
  env:
    APP_STORE_CONNECT_API_KEY_ID: ${{ env.APP_STORE_CONNECT_API_KEY_ID }}
    APP_STORE_CONNECT_ISSUER_ID: ${{ env.APP_STORE_CONNECT_ISSUER_ID }}
    MATCH_PASSWORD: ${{ env.MATCH_PASSWORD }}
```

### Debugging Tip
To see masked values in logs, base64 encode them:
```bash
echo "APP_STORE_CONNECT_API_KEY_ID (base64): $(echo -n "$APP_STORE_CONNECT_API_KEY_ID" | base64)"
```

---

## 2. AuthKey.p8 File Corruption

### Problem
```
string contains null byte
invalid curve name
```

### Root Cause
The `AuthKey.p8` file (Apple API private key) contained:
- Spaces within base64 content
- Inconsistent line wrapping
- Multiple newlines or null bytes

### Solution
Clean and reformat the `.p8` file programmatically:

```bash
# Extract base64 content: remove headers and all spaces/newlines
base64_content=$(echo "$APP_STORE_CONNECT_API_KEY_BASE64" | \
  sed 's/-----BEGIN PRIVATE KEY-----//g' | \
  sed 's/-----END PRIVATE KEY-----//g' | \
  tr -d ' \n\r\t')

# Write properly formatted .p8 file
echo "-----BEGIN PRIVATE KEY-----" > credentials/ios/AuthKey.p8
echo "$base64_content" | fold -w 64 >> credentials/ios/AuthKey.p8
echo "-----END PRIVATE KEY-----" >> credentials/ios/AuthKey.p8
```

### Key Points
- PEM files must have exactly 64 characters per line (except headers)
- No spaces allowed within base64 content
- Must have proper headers: `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Validation
```bash
# Check for null bytes
hexdump -C credentials/ios/AuthKey.p8 | head -20

# Verify format
head -n 3 credentials/ios/AuthKey.p8
tail -n 1 credentials/ios/AuthKey.p8
```

---

## 3. Match Password Issues

### Problem
```
Invalid password passed via 'MATCH_PASSWORD'
```

### Root Cause
- Password wasn't being passed to the temporary keychain
- Match couldn't decrypt certificates repository

### Solution
**Step 1**: Create temporary keychain with password
```yaml
- name: Create temporary keychain for code signing
  run: |
    KEYCHAIN_PASSWORD=$(openssl rand -base64 32)
    KEYCHAIN_NAME="build.keychain"
    echo "KEYCHAIN_PASSWORD=$KEYCHAIN_PASSWORD" >> $GITHUB_ENV
    echo "KEYCHAIN_NAME=$KEYCHAIN_NAME" >> $GITHUB_ENV
    
    security create-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"
    security default-keychain -s "$KEYCHAIN_NAME"
    security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"
    security set-keychain-settings -t 3600 -u "$KEYCHAIN_NAME"
```

**Step 2**: Pass keychain info to Match
```ruby
match(
  type: "appstore",
  readonly: false,
  app_identifier: "com.insighture.smbmobile",
  git_url: "git@github.com:insighture/smb-mobile-fastlane.git",
  api_key: api_key,
  keychain_password: ENV['KEYCHAIN_PASSWORD'],
  keychain_name: ENV['KEYCHAIN_NAME']
)
```

**Step 3**: Cleanup
```yaml
- name: Cleanup temporary keychain
  if: always()
  run: |
    security delete-keychain "${{ env.KEYCHAIN_NAME }}" 2>/dev/null || true
```

---

## 4. Xcode Project Structure

### Problem
```
Workspace file not found at path '/path/to/ios/smbmobile.xcworkspace'
```

### Root Cause
- Expo `prebuild` generates `.xcodeproj` but not `.xcworkspace`
- CocoaPods generates `.xcworkspace` during `pod install`
- Missing `pod install` step after `expo prebuild`

### Solution
Add CocoaPods installation step:
```yaml
- name: Install CocoaPods dependencies
  run: |
    cd ios
    pod install
    cd ..
    echo "✅ CocoaPods installation complete"
```

### Verification
```yaml
echo "📁 Checking for workspace file:"
ls -la ios/*.xcworkspace || echo "❌ Workspace not found!"
```

---

## 5. Xcode 16 Destination Validation

### Problem
```
xcodebuild: error: Unable to find a destination matching the provided destination specifier:
{ generic:1, platform:iOS }
```

### Root Cause
Xcode 16 requires iOS simulator runtimes for destination validation, even for device builds. GitHub Actions runners don't include these by default.

### Solution
Use `generic/platform=iOS` destination format:
```ruby
sh("xcodebuild archive " \
   "-workspace ./ios/smbmobile.xcworkspace " \
   "-scheme smbmobile " \
   "-destination 'generic/platform=iOS' " \
   "-archivePath '#{archive_path}'")
```

### Why This Works
- `generic/platform=iOS` builds for any iOS device without requiring simulator
- Bypasses simulator runtime validation
- Produces valid App Store builds

### What Doesn't Work in Xcode 16
❌ `-sdk iphoneos` alone  
❌ `-destination 'generic/platform=iOS,name=Any iOS Device'`  
❌ `-destination 'platform=iOS'`  

---

## 6. CocoaPods Dependencies Missing

### Problem
```
error: Unable to find module dependency: 'ExpoImage'
error: Unable to find module dependency: 'ExpoImagePicker'
error: Unable to find module dependency: 'ExpoKeepAwake'
[...20+ similar errors]
```

### Root Cause
Building with `-project` and `-target` **skips CocoaPods dependencies**. All Expo module pods weren't being compiled.

### Solution
**Use workspace + scheme instead of project + target:**

❌ **Wrong (skips pods):**
```ruby
xcodebuild build \
  -project ./ios/smbmobile.xcodeproj \
  -target smbmobile
```

✅ **Correct (includes all pods):**
```ruby
xcodebuild archive \
  -workspace ./ios/smbmobile.xcworkspace \
  -scheme smbmobile
```

### Why This Matters
- `.xcworkspace` includes all CocoaPods targets
- Xcode builds pods first, then main app
- Main app can import all Expo modules
- Build order is automatically managed

### Key Rule
**Always use workspace for CocoaPods projects!**

---

## 7. Code Signing Profile Conflicts

### Problem
```
React-graphics does not support provisioning profiles, but provisioning profile 
'match AppStore com.insighture.smbmobile' has been manually specified.
```

### Root Cause
Applying code signing via `xcodebuild` command-line arguments applies to **ALL targets** in the workspace, including library pods that don't need provisioning profiles.

### Solution
**Remove code signing from xcodebuild command:**

❌ **Wrong (applies to all targets):**
```ruby
xcodebuild archive \
  CODE_SIGN_IDENTITY='iPhone Distribution' \
  PROVISIONING_PROFILE_SPECIFIER='match AppStore com.insighture.smbmobile' \
  DEVELOPMENT_TEAM='96W7U4JYV4'
```

✅ **Correct (applies to main app only):**
```ruby
# Configure signing per-target first
update_code_signing_settings(
  use_automatic_signing: false,
  path: "ios/smbmobile.xcodeproj",
  team_id: "96W7U4JYV4",
  profile_name: "match AppStore com.insighture.smbmobile",
  code_sign_identity: "iPhone Distribution",
  targets: ["smbmobile"]  # Only main app!
)

# Then build without code signing params
xcodebuild archive \
  -workspace ./ios/smbmobile.xcworkspace \
  -scheme smbmobile \
  -allowProvisioningUpdates
```

### Key Principle
- Use `update_code_signing_settings` for **per-target** configuration
- Avoid command-line code signing parameters with workspaces
- Let Xcode read project settings

---

## 8. IPA Export Failures

### Problem
```
Couldn't automatically detect the project file, please provide a path
```

### Root Cause
When using `skip_build_archive: true`, Fastlane's `build_ios_app` still needs to know which project/workspace to use for reading metadata during IPA export.

### Solution
Specify workspace and scheme for IPA export:
```ruby
build_ios_app(
  skip_build_archive: true,
  archive_path: archive_path,
  workspace: "ios/smbmobile.xcworkspace",  # Required!
  scheme: "smbmobile",                      # Required!
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
```

### Build Flow
1. **Archive**: `xcodebuild archive` → creates `.xcarchive`
2. **Export**: `build_ios_app(skip_build_archive: true)` → creates `.ipa`
3. **Upload**: `upload_to_testflight` → sends to TestFlight

---

## 9. Keychain Access Issues

### Problem
```
Keychain password for /Users/runner/Library/Keychains/login.keychain-db was not specified
Could not configure imported keychain item (certificate) to prevent UI permission popup
```

### Root Cause
- GitHub Actions runners use the default `login.keychain`
- No password is set on the default keychain
- Certificate import requires keychain password

### Solution
Create a temporary keychain with a known password:

```yaml
- name: Create temporary keychain for code signing
  run: |
    KEYCHAIN_PASSWORD=$(openssl rand -base64 32)
    KEYCHAIN_NAME="build.keychain"
    echo "KEYCHAIN_PASSWORD=$KEYCHAIN_PASSWORD" >> $GITHUB_ENV
    echo "KEYCHAIN_NAME=$KEYCHAIN_NAME" >> $GITHUB_ENV
    
    # Remove if exists
    security delete-keychain "$KEYCHAIN_NAME" 2>/dev/null || true
    
    # Create new keychain
    security create-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"
    
    # Add to keychain search list
    EXISTING_KEYCHAINS=$(security list-keychains -d user | tr -d '"' | tr '\n' ' ')
    security list-keychains -d user -s "$KEYCHAIN_NAME" $EXISTING_KEYCHAINS
    
    # Set as default
    security default-keychain -s "$KEYCHAIN_NAME"
    
    # Unlock and configure
    security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"
    security set-keychain-settings -t 3600 -u "$KEYCHAIN_NAME"
    
    # Allow codesign to access without UI popup
    security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME" 2>/dev/null || true
```

### Unlock Before Build
```yaml
- name: Unlock keychain before build
  run: |
    security unlock-keychain -p "${{ env.KEYCHAIN_PASSWORD }}" "${{ env.KEYCHAIN_NAME }}"
```

### Cleanup
```yaml
- name: Cleanup temporary keychain
  if: always()
  run: |
    security delete-keychain "${{ env.KEYCHAIN_NAME }}" 2>/dev/null || true
```

---

## 10. TestFlight Upload - Duplicate Build Number

### Problem
```
The bundle version must be higher than the previously uploaded version: '14'
```

### Root Cause
`increment_build_number` increments from the Xcode project file, not from the latest build in TestFlight. If you've previously uploaded build 14, and the project file resets to 1, it tries to upload build 2.

### Solution
Fetch the latest build number from TestFlight first:

```ruby
begin
  latest_build = latest_testflight_build_number(
    app_identifier: "com.insighture.smbmobile",
    api_key: api_key
  )
  
  increment_build_number(
    xcodeproj: "ios/smbmobile.xcodeproj",
    build_number: latest_build + 1
  )
rescue => ex
  # Fallback to local increment if fetch fails
  increment_build_number(
    xcodeproj: "ios/smbmobile.xcodeproj"
  )
end
```

### Alternative: Manual Reset

If you want to reset build numbers locally:

```bash
# In App Store Connect, delete all TestFlight builds
# Then in Xcode project, set build number to 1
agvtool new-version -all 1
```

**Note**: This requires all previous builds to be removed from TestFlight first.

---

## Quick Reference: Common Issues

| Error Message | Fix |
|---------------|-----|
| `string contains null byte` | Reformat AuthKey.p8 with proper line wrapping |
| `Unable to find module dependency` | Use workspace instead of project |
| `does not support provisioning profiles` | Remove code signing from xcodebuild command |
| `Unable to find a destination` | Use `-destination 'generic/platform=iOS'` |
| `Workspace file not found` | Run `pod install` after `expo prebuild` |
| `Invalid password passed via MATCH_PASSWORD` | Create temporary keychain and pass password to Match |
| `Couldn't automatically detect the project file` | Add workspace + scheme to `build_ios_app` |
| `bundle version must be higher than previously uploaded` | Fetch latest build number from TestFlight first |

---

## Debugging Tips

### 1. Check Environment Variables
```yaml
- name: Debug Environment Variables
  run: |
    echo "Variable length: ${#APP_STORE_CONNECT_API_KEY_ID}"
    echo "Base64 encoded: $(echo -n "$APP_STORE_CONNECT_API_KEY_ID" | base64)"
```

### 2. Verify File Contents
```bash
# Check for binary corruption
hexdump -C credentials/ios/AuthKey.p8 | head -20

# Verify workspace exists
ls -la ios/*.xcworkspace
```

### 3. Check Keychain Status
```bash
security list-keychains
security default-keychain
security find-identity -v -p codesigning
```

### 4. Validate Xcode Configuration
```bash
xcode-select -p
xcodebuild -version
xcodebuild -showsdks
xcrun simctl list runtimes
```

---

## Best Practices

1. **Always use workspace for CocoaPods projects**
2. **Configure code signing per-target, not globally**
3. **Create temporary keychains for CI/CD**
4. **Clean up resources in `if: always()` steps**
5. **Use base64 encoding for debugging masked secrets**
6. **Validate file formats (especially PEM files)**
7. **Run `pod install` after any `expo prebuild`**
8. **Use Xcode 16 compatible destination format**

---

## Additional Resources

- [Fastlane Match Documentation](https://docs.fastlane.tools/actions/match/)
- [Expo Prebuild Documentation](https://docs.expo.dev/workflow/prebuild/)
- [Xcode Build Settings Reference](https://developer.apple.com/documentation/xcode/build-settings-reference)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Last Updated**: November 19, 2024  
**Xcode Version**: 16.1  
**Fastlane Version**: 2.228.0  
**Expo SDK**: Latest

