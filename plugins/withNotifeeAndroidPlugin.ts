import { ConfigPlugin, withProjectBuildGradle } from 'expo/config-plugins';

// Fix for android build error when using Notifee
// This file addes Notifee repo maven line to project build.gradle file.
const withNotifeeAndroidPlugin: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;
    const mavenNotifeeRepoLine = `maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }`;

    if (!buildGradle.includes(mavenNotifeeRepoLine)) {
      const allProjectsBlock = /allprojects\s*{\s*repositories\s*{/;
      if (allProjectsBlock.test(buildGradle)) {
        buildGradle = buildGradle.replace(
          allProjectsBlock,
          (match) => `${match}\n ${mavenNotifeeRepoLine}`,
        );
      } else {
        console.warn(
          '[withAndroidPlugin] Could not find allprojects.repositories block in build.gradle.',
        );
      }
    }

    config.modResults.contents = buildGradle;
    return config;
  });
};

export default withNotifeeAndroidPlugin;
