# iOS CI/CD Documentation

Complete documentation for the iOS build and deployment pipeline using GitHub Actions, Expo, and Fastlane.

---

## 📚 Documentation Index

### 1. [Troubleshooting Guide](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md)
**When to use**: When builds fail or you encounter errors

Comprehensive guide covering:
- ✅ All issues encountered and their fixes
- ✅ Error messages and solutions
- ✅ Debugging techniques
- ✅ Quick reference table
- ✅ Best practices

**Key sections**:
- Environment Variables & Secrets
- AuthKey.p8 File Corruption
- Match Password Issues
- Xcode Project Structure
- Xcode 16 Destination Validation
- CocoaPods Dependencies
- Code Signing Conflicts
- IPA Export Failures
- Keychain Access Issues

---

### 2. [Build Configuration](./IOS_BUILD_CONFIGURATION.md)
**When to use**: Setting up the pipeline or understanding how it works

Complete reference documentation:
- ✅ System requirements
- ✅ GitHub Secrets configuration
- ✅ Complete workflow breakdown
- ✅ Fastlane lane configuration
- ✅ Build process flow diagram
- ✅ File structure
- ✅ Security considerations

**Key sections**:
- Workflow structure and steps
- Fastfile configuration
- Secret management
- Build flow visualization
- Maintenance procedures
- Rollback strategies

---

### 3. [Workflow Optimizations](./IOS_WORKFLOW_OPTIMIZATIONS.md)
**When to use**: Improving build performance and reducing costs

Optimization strategies including:
- ✅ Caching strategies (CocoaPods, npm, Match)
- ✅ Build time improvements
- ✅ Resource cleanup recommendations
- ✅ Cost optimization
- ✅ Implementation priorities
- ✅ Performance monitoring

**Key sections**:
- Performance analysis
- Caching implementations
- Workflow cleanup
- Build time reduction strategies
- Cost analysis and savings

---

## 🚀 Quick Start

### For New Team Members

1. **Read this order**:
   - Start with [Build Configuration](./IOS_BUILD_CONFIGURATION.md) to understand the system
   - Keep [Troubleshooting Guide](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md) handy when issues arise
   - Review [Workflow Optimizations](./IOS_WORKFLOW_OPTIMIZATIONS.md) for improvements

2. **Verify your access**:
   - [ ] GitHub repository access
   - [ ] Access to GitHub Secrets
   - [ ] Apple Developer account (if needed)
   - [ ] Fastlane Match repository access

3. **Test locally** (if possible):
   ```bash
   # Install dependencies
   npm install
   bundle install
   
   # Run prebuild
   npm run prebuild -- --clean --platform ios
   
   # Install pods
   cd ios && pod install && cd ..
   
   # Test Fastlane (requires credentials)
   fastlane ios qa_release
   ```

---

## 🛠️ Common Tasks

### Triggering a Build

**Via Git Push**:
```bash
git push origin staging  # Triggers workflow automatically
```

**Via GitHub UI**:
1. Go to Actions tab
2. Select the workflow
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow"

---

### Checking Build Status

1. **GitHub Actions Tab**: View real-time build logs
2. **Artifacts**: Download IPA from completed builds
3. **Releases**: Check GitHub Releases for build artifacts
4. **TestFlight**: Verify upload in App Store Connect

---

### Updating Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Find `SMBAPP4_THISSMB40A6EDFC_CUSTOMSTAGING_APP_D05935D_ENV_3A67391`
3. Decode current value:
   ```bash
   echo "$SECRET_VALUE" | base64 --decode | jq .
   ```
4. Update the JSON
5. Re-encode:
   ```bash
   cat updated.json | base64
   ```
6. Update secret in GitHub

---

### Debugging Failed Builds

**Step 1**: Check the error message in GitHub Actions logs

**Step 2**: Look up the error in [Troubleshooting Guide](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md)

**Step 3**: Common quick fixes:
```bash
# Re-run the workflow (transient errors)
# Check secrets are configured correctly
# Verify Xcode version is correct
# Confirm Match repository is accessible
```

**Step 4**: If not resolved, check:
- [ ] Certificate expiration dates
- [ ] Provisioning profile validity
- [ ] GitHub Actions runner status
- [ ] Apple Developer portal status

---

## 📊 Current Configuration

### Environment
- **OS**: macOS (GitHub Actions macos-latest)
- **Xcode**: 16.1
- **Node.js**: 18.x
- **Ruby**: 3.2.9
- **Fastlane**: 2.228.0+

### Build Times
- **Average**: 22-30 minutes
- **Target**: 12-18 minutes (with optimizations)
- **Cost**: ~250 GitHub Actions minutes per build (25 min × 10x multiplier)

### Success Metrics
- **Build Success Rate**: 95%+
- **TestFlight Upload**: ~2 minutes after build
- **Processing Time**: 10-20 minutes in TestFlight

---

## 🔐 Security Notes

### Sensitive Information
**Never commit**:
- ❌ `credentials/` directory
- ❌ `.p8` files (Apple API keys)
- ❌ `.p12` files (certificates)
- ❌ `.mobileprovision` files
- ❌ SSH private keys
- ❌ Passwords or API keys

**Always**:
- ✅ Store secrets in GitHub Secrets
- ✅ Use base64 encoding for binary files
- ✅ Rotate credentials quarterly
- ✅ Use temporary keychains in CI/CD
- ✅ Delete sensitive files after build

### Secret Rotation Schedule
- **SSH Keys**: Every 6 months
- **Certificates**: Before expiration (yearly)
- **API Keys**: Yearly or if compromised
- **Passwords**: Quarterly

---

## 🎯 Success Story

### The Journey

**Before** (2 weeks of troubleshooting):
- ❌ Multiple blocking errors
- ❌ Inconsistent builds
- ❌ Manual intervention required
- ❌ No documentation

**After** (Working pipeline):
- ✅ Automated builds on every push
- ✅ Consistent success rate (95%+)
- ✅ Automatic TestFlight upload
- ✅ Complete documentation
- ✅ Clear troubleshooting path

### Key Achievements
1. ✅ **Xcode 16 Compatibility**: Resolved destination validation issues
2. ✅ **CocoaPods Integration**: Fixed missing Expo module dependencies
3. ✅ **Code Signing**: Proper per-target configuration
4. ✅ **Secret Management**: Secure credential handling
5. ✅ **Automated Deployment**: End-to-end automation

---

## 📞 Support & Resources

### Internal
- **Troubleshooting**: See [Troubleshooting Guide](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md)
- **Configuration**: See [Build Configuration](./IOS_BUILD_CONFIGURATION.md)
- **Optimizations**: See [Workflow Optimizations](./IOS_WORKFLOW_OPTIMIZATIONS.md)

### External
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [Expo Documentation](https://docs.expo.dev/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Xcode Build Settings](https://developer.apple.com/documentation/xcode/build-settings-reference)

### Community
- [Fastlane Slack](https://fastlane.slack.com)
- [Expo Forums](https://forums.expo.dev)
- [Stack Overflow - `fastlane` tag](https://stackoverflow.com/questions/tagged/fastlane)

---

## 🔄 Maintenance

### Weekly
- [ ] Monitor build times
- [ ] Check TestFlight processing
- [ ] Review GitHub Actions usage

### Monthly
- [ ] Update Fastlane: `bundle update fastlane`
- [ ] Update CocoaPods: `pod repo update`
- [ ] Review dependencies for security updates

### Quarterly
- [ ] Rotate SSH deploy keys
- [ ] Review certificates (renew if < 30 days)
- [ ] Update Xcode version
- [ ] Audit GitHub Secrets
- [ ] Review and update documentation

---

## 📝 Quick Reference

### Common Commands

```bash
# Local testing
fastlane ios qa_release

# Update dependencies
npm install
bundle install
pod repo update

# Clean build
cd ios
rm -rf build Pods
pod install
cd ..

# Format AuthKey.p8 (if corrupted)
base64_content=$(cat AuthKey.p8 | sed 's/-----BEGIN PRIVATE KEY-----//g' | sed 's/-----END PRIVATE KEY-----//g' | tr -d ' \n\r\t')
echo "-----BEGIN PRIVATE KEY-----" > AuthKey_fixed.p8
echo "$base64_content" | fold -w 64 >> AuthKey_fixed.p8
echo "-----END PRIVATE KEY-----" >> AuthKey_fixed.p8
```

### Common Issues & Quick Fixes

| Issue | Quick Fix | Documentation |
|-------|-----------|---------------|
| Build fails with module not found | Check workspace is used, not project | [Troubleshooting #6](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md#6-cocoapods-dependencies-missing) |
| Provisioning profile error | Check code signing configuration | [Troubleshooting #7](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md#7-code-signing-profile-conflicts) |
| Workspace not found | Run `pod install` after `expo prebuild` | [Troubleshooting #4](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md#4-xcode-project-structure) |
| Destination validation error | Use `generic/platform=iOS` | [Troubleshooting #5](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md#5-xcode-16-destination-validation) |
| Keychain access error | Create temporary keychain | [Troubleshooting #9](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md#9-keychain-access-issues) |

---

## 🎓 Learning Path

### For Junior Developers
1. Read [Build Configuration](./IOS_BUILD_CONFIGURATION.md) - Overview
2. Watch a build run in GitHub Actions
3. Review the Fastfile to understand the steps
4. Try triggering a build manually

### For Mid-Level Developers
1. Deep dive into [Build Configuration](./IOS_BUILD_CONFIGURATION.md)
2. Study the [Troubleshooting Guide](./IOS_BUILD_TROUBLESHOOTING_GUIDE.md)
3. Implement optimizations from [Workflow Optimizations](./IOS_WORKFLOW_OPTIMIZATIONS.md)
4. Test builds locally

### For Senior Developers
1. Review all documentation
2. Identify optimization opportunities
3. Implement advanced caching strategies
4. Set up monitoring and alerting
5. Mentor team on CI/CD best practices

---

## 📈 Roadmap

### Completed ✅
- [x] Working iOS build pipeline
- [x] Automated TestFlight upload
- [x] Comprehensive documentation
- [x] Troubleshooting guide
- [x] Optimization recommendations

### In Progress 🚧
- [ ] Implement CocoaPods caching
- [ ] Add build time monitoring
- [ ] Clean up debug code

### Planned 📋
- [ ] Android build pipeline
- [ ] Production release automation
- [ ] Build performance dashboard
- [ ] Automated testing integration

---

**Last Updated**: November 19, 2024  
**Maintained By**: Development Team  
**Version**: 1.0

---

## 🎉 Congratulations!

You now have a fully documented, working iOS CI/CD pipeline! 🚀

This documentation represents 2 weeks of intensive troubleshooting and problem-solving. Use it well, keep it updated, and share the knowledge with your team.

**Happy Building!** 📱✨

