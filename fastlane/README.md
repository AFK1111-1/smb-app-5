fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android dev_build

```sh
[bundle exec] fastlane android dev_build
```

Build Android debug APK for development

### android qa_release

```sh
[bundle exec] fastlane android qa_release
```

Submit a new internal test build to play store

### android stg_release

```sh
[bundle exec] fastlane android stg_release
```

Submit a new staging build to play store

### android production_release

```sh
[bundle exec] fastlane android production_release
```

Submit a new production build to play store

----


## iOS

### ios dev_build

```sh
[bundle exec] fastlane ios dev_build
```

Build iOS simulator app for development

### ios qa_release

```sh
[bundle exec] fastlane ios qa_release
```

Submit a new QA build to TestFlight

### ios stg_release

```sh
[bundle exec] fastlane ios stg_release
```

Submit a new staging build to TestFlight

### ios production_release

```sh
[bundle exec] fastlane ios production_release
```

Submit a new production build to App Store

### ios release

```sh
[bundle exec] fastlane ios release
```

Submit a new production build to App Store (legacy)

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
