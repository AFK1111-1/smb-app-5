# CI/CD Pipeline Setup Guide

This guide explains how to set up the GitHub Actions CI/CD pipeline for the SMB Mobile React Native Expo app.

## Overview

The pipeline consists of three main workflows:

1. **Dev Preview Build** (`.github/workflows/dev-preview.yml`)
   - Triggers on PR creation/updates to `main` branch
   - Builds debug APK and iOS simulator app
   - Uploads artifacts for testing

2. **QA Release Build** (`.github/workflows/qa-release.yml`)
   - Triggers on push to `main` branch
   - Builds release AAB and IPA files
   - Creates GitHub release with artifacts

3. **Promote Release** (`.github/workflows/promote-release.yml`)
   - Manual workflow for promoting builds to staging/production
   - Uses Fastlane for deployment to stores

## Required GitHub Secrets

### Environment Variables
```
KINDE_DOMAIN=your-kinde-domain
KINDE_CLIENT_ID=your-kinde-client-id
KINDE_SCOPES=your-kinde-scopes
PUBLIC_API_URL=your-api-url
```

### Android Signing
```
ANDROID_KEYSTORE_BASE64=base64-encoded-keystore-file
ANDROID_KEYSTORE_PASSWORD=your-keystore-password
ANDROID_KEY_ALIAS=your-key-alias
ANDROID_KEY_PASSWORD=your-key-password
```

### iOS Signing
```
FASTLANE_APPLE_API_KEY=your-apple-api-key
```

### Google Play Store
```
GOOGLE_PLAY_JSON_KEY=your-google-play-service-account-key
```

## Setup Instructions

### 1. Generate Android Keystore

```bash
keytool -genkey -v -keystore smb-mobile-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias smb-mobile-key
```

### 2. Encode Keystore for GitHub Secrets

```bash
base64 -i smb-mobile-keystore.jks | tr -d '\n'
```

### 3. Configure iOS Export Options

Update `ios/ExportOptions.plist` with your Apple Team ID:

```xml
<key>teamID</key>
<string>YOUR_APPLE_TEAM_ID</string>
```

### 4. Setup Fastlane Match (Optional but Recommended)

For iOS code signing, consider using Fastlane Match:

```bash
# Initialize match
bundle exec fastlane match init

# Setup certificates and provisioning profiles
bundle exec fastlane match development
bundle exec fastlane match appstore
```

### 5. Configure App Store Connect API Key

1. Go to App Store Connect
2. Navigate to Users and Access
3. Create a new API Key
4. Download the `.p8` file
5. Add the key content to GitHub secrets as `FASTLANE_APPLE_API_KEY`

## Environment Strategy

- **Dev**: Debug builds for PR testing
- **QA**: Release builds from main branch to TestFlight/Internal Testing
- **Production**: App Store/Play Store releases

## Security Notes

- Never commit keystore files or API keys to the repository
- Use GitHub secrets for all sensitive information
- Regularly rotate API keys and certificates
- Monitor GitHub Actions logs for sensitive data exposure

## Support

For issues with the CI/CD pipeline:
1. Check GitHub Actions logs
2. Verify all secrets are configured correctly
3. Test builds locally first