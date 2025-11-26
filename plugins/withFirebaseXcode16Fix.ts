import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Config plugin to fix React Native Firebase build issues with Xcode 16.1
 * 
 * Addresses:
 * - PrecompileModule errors for RNFBApp and other Firebase modules
 * - iOS deployment target warnings (9.0 -> 12.0)
 * - Module verification failures with new architecture
 */
const withFirebaseXcode16Fix: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );

      if (!fs.existsSync(podfilePath)) {
        console.warn('⚠️  Podfile not found, skipping Firebase Xcode 16.1 fix');
        return config;
      }

      let contents = fs.readFileSync(podfilePath, 'utf-8');

      // Post-install hook specifically for Firebase + Xcode 16.1 compatibility
      const firebaseFixHook = `
  post_install do |installer|
    # Fix for Xcode 16.1 + React Native Firebase + New Architecture
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        # Fix deployment target - Xcode 16.1 requires minimum iOS 12.0
        deployment_target = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if deployment_target && deployment_target.to_f < 12.0
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
        end

        # Disable module verification - fixes PrecompileModule errors
        config.build_settings['CLANG_ENABLE_MODULE_VERIFIER'] = 'NO'
        
        # Disable explicit modules for Firebase compatibility
        config.build_settings['CLANG_ENABLE_EXPLICIT_MODULES'] = 'NO'
        
        # Use whole module optimization for Swift
        config.build_settings['SWIFT_COMPILATION_MODE'] = 'wholemodule'
        
        # Disable module debugging
        config.build_settings['CLANG_ENABLE_MODULE_DEBUGGING'] = 'NO'
        
        # Additional Firebase-specific fixes
        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end

    # Project-level settings
    installer.pods_project.build_configurations.each do |config|
      config.build_settings['CLANG_ENABLE_MODULE_VERIFIER'] = 'NO'
      config.build_settings['CLANG_ENABLE_EXPLICIT_MODULES'] = 'NO'
    end

    # React Native specific configurations for new architecture
    installer.aggregate_targets.each do |aggregate_target|
      aggregate_target.user_project.native_targets.each do |target|
        target.build_configurations.each do |config|
          config.build_settings['ONLY_ACTIVE_ARCH'] = 'NO'
          config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64' if ENV['CI']
        end
      end
    end
  end`;

      // Check if post_install already exists
      if (contents.includes('post_install do |installer|')) {
        console.log('⚠️  Existing post_install hook found in Podfile');
        
        // Check if our fixes are already applied
        if (!contents.includes('CLANG_ENABLE_MODULE_VERIFIER')) {
          console.log('✅ Adding Firebase Xcode 16.1 fixes to existing post_install');
          
          // Insert our configuration inside existing post_install
          const postInstallRegex = /(post_install do \|installer\|)([\s\S]*?)(^  end)/m;
          
          contents = contents.replace(postInstallRegex, (match, opening, body, closing) => {
            return opening + body + `
    # Firebase Xcode 16.1 compatibility fixes
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        deployment_target = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if deployment_target && deployment_target.to_f < 12.0
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
        end
        config.build_settings['CLANG_ENABLE_MODULE_VERIFIER'] = 'NO'
        config.build_settings['CLANG_ENABLE_EXPLICIT_MODULES'] = 'NO'
        config.build_settings['SWIFT_COMPILATION_MODE'] = 'wholemodule'
        config.build_settings['CLANG_ENABLE_MODULE_DEBUGGING'] = 'NO'
        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end
    installer.pods_project.build_configurations.each do |config|
      config.build_settings['CLANG_ENABLE_MODULE_VERIFIER'] = 'NO'
      config.build_settings['CLANG_ENABLE_EXPLICIT_MODULES'] = 'NO'
    end
` + closing;
          });
          
          fs.writeFileSync(podfilePath, contents);
          console.log('✅ Firebase Xcode 16.1 fixes applied successfully');
        } else {
          console.log('✅ Firebase fixes already present in Podfile');
        }
      } else {
        // Add new post_install hook
        console.log('✅ Adding new post_install hook for Firebase Xcode 16.1 compatibility');
        contents = contents.replace(/end\s*$/, firebaseFixHook + '\nend');
        fs.writeFileSync(podfilePath, contents);
        console.log('✅ Post-install hook added successfully');
      }

      return config;
    },
  ]);
};

export default withFirebaseXcode16Fix;

