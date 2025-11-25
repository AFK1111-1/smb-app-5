# React Native Expo Boilerplate

A modern boilerplate for building cross-platform mobile applications using React Native with Expo and a powerful set of tools for state management, networking, validation, and builds. This boilerplate is built for scalability, developer experience, and fast iteration.

## Description

This project provides a solid foundation for developing scalable and maintainable mobile applications using Expo and React Native. It's built with TypeScript and includes robust tools for navigation, state management, form handling, data fetching, and validation. It is designed for teams and individuals who want a ready-to-use starting point for rapid app development.

## Tech Stack

| Feature                    | Tech                                                                      |
| -------------------------- | ------------------------------------------------------------------------- |
| **Framework**              | [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)      |
| **Language**               | [TypeScript](https://www.typescriptlang.org/)                             |
| **Navigation**             | [React Navigation](https://reactnavigation.org/)                          |
| **Authentication Service** | [Kinde Auth](https://kinde.com/)                                          |
| **API State**              | [React Query](https://react-query.tanstack.com/)                          |
| **UI State**               | [Zustand](https://github.com/pmndrs/zustand)                              |
| **Forms & Validation**     | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Build & Deploy**         | [EAS (Expo Application Services)](https://docs.expo.dev/eas/)             |
| **Styling**                | [ReactNative Paper](https://reactnativepaper.com/) (if used)              |
| **i18n**                   | [React i18next](https://react.i18next.com/)            |
| **Versioning**             | Manual via `app.json`                                                     |

## Setting Up Kinde Dashboard for Development

### 1. Create a Kinde Account

Go to https://kinde.com and create an account (or log in).

---

### 2. Create a New Application in Kinde

Go to the **Applications** tab in your [Kinde dashboard](https://kinde.com).

Click **“Add application”**.

Fill out the form:

- **Name**: `Mobile Dev App`
- **Type**: `Mobile`

Click **Create Application**.

---

Here’s a properly formatted version of **Step 3: Configure Application Settings** for your `README.md` using clear indentation, spacing, and Markdown best practices:

---

### 3. Configure Application Settings

After creating your application in Kinde, configure the **Redirect URIs** as follows:

Redirect URIs (for Expo Dev Client)

Add the following:

```
exp://127.0.0.1:19000
exp://192.168.x.x:19000
```

> Replace `192.168.x.x` with your **local IP address**, shown in the Expo CLI output when starting the dev server.

---

#### Redirect URIs/ Callback URI (for Mobile Build)

Add the URI scheme format for mobile platforms:

```
<your-app-scheme>://callback
```

> 📌 The `scheme` should match what you define in your `app.config.js` or `app.json`:

```json
{
  "expo": {
    "scheme": "your-app-scheme"
  }
}
```

---

### 4. Get Credentials

From the Application settings, note down:

You can format those items as bullet points in your `README.md` like this:

---

### 🔐 Kinde Environment Variables

Make sure to set the following environment variables:

- `KINDE_CLIENT_ID`: Your Kinde **Application ID**
- `KINDE_DOMAIN`: Your Kinde **Domain** (e.g., `https://your-subdomain.kinde.com`)
- `KINDE_SCOPES`: Required scopes for your app (e.g., `openid profile email offline`)

add them to env file

---

## Local Setup

To get started with the project, follow these steps:

1. Install prerequisites:

   Node.js (v18 or later)
   Git
   Expo CLI
   Android Studio (for Android Emulator) or Xcode (for iOS Simulator on macOS)

   ```bash
   npm install -g expo-cli

   ```

2. Clone the repository:

   ```bash
   git clone https://github.com/insighture/smb-boilerplate-mobile.git
   cd smb-boilerplate-mobile

   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the project:

   ```bash
   npx expo start -c
   ```

   make sure to switch to development build

   you can directly build the android or ios development builds using below commands

   ```bash
   npx expo run:android
   npx expo run:ios
   ```

5. Format the code:

   ```bash
   npm run format
   ```

## Branch / Commit Convention

**When creating a feature/fix branch, follow this branching name pattern:**

```bash
feature/featureNumber-name-of-the-feature
```

- **Example:**

```bash
feature/113-iconButton-reusable-component-implementation
```

**When committing your changes, follow this commit message pattern:**

```bash
featureNumber - commit message
```

- **Example:**

```bash
85 - add searchbar component
```
## i18n Implementation
### Adding Translation

Follow the below steps to add new translation file.
1. Copy the `en-US.json` file from `locales` folder.
2. Rename the new file using the language code and region code format: `<language>-<region>.json`. For example, `fr-FR.json` for French spoken in France or `de-DE.json` for German spoken in Germany.
3. Save the file in the `locales` folder and replace the English text with your new translations.

### Adding new language
1. Add the new language's name, its code, and its flag emoji to the `i18n/index.ts` file.
2. Import your new `<language>-<region>.json` translation file into `i18n/index.ts`.
3. Add the imported translations to the resources object within `i18n/index.ts`, using the `<language>-<region>` code as the key.

### Naming Conventions
The naming convention used for language files is based on the [**IETF BCP 47 language tag**](https://www.techonthenet.com/js/language_tags.php), which combines a language code and a region code.

Language Code: A two-letter code (lowercase) that represents the language, such as `en` for English, `de` for German, or `fr` for French.

Region Code: A two-letter code (uppercase) that specifies the region or country, such as `US` for the United States, `DE` for Germany, or `FR` for France.

This standard helps ensure consistency and avoids confusion when a language is spoken in multiple regions with slight variations (e.g., `en-US` vs. `en-GB`).

## Local Testing with Locally Setup Backend Services

#### Setup [user-service](https://github.com/insighture/smb-boilerplate-user-service) locally

To test the mobile app with a local backend API, you'll need to set up the user service locally:

1. Follow the [local development setup](https://github.com/insighture/smb-boilerplate-user-service?tab=readme-ov-file#local-development-setup) instructions
2. Ensure the service is running on `localhost:3000` (default port)
3. Update your `.env` file to point to the local API:
   ```bash
   PUBLIC_API_URL=http://localhost:3000
   ```

##### Android: ADB reverse port forwarding (optional)

For Android development with a local API server running on `localhost:3000`:

```bash
npm run adb-reverse:local
```

This command runs `adb reverse tcp:3000 tcp:3000`, which:

- Maps the emulator's port 3000 to your computer's localhost:3000
- Allows the Android app to access your local API server via `http://localhost:3000`
- Eliminates the need to use emulator host IP (e.g. 10.0.2.2) thus need to have different local API url of iOS.

**Note:** This is only required for Android emulator. iOS Simulator can access localhost directly without port forwarding.

## Build and Release

This project uses EAS Build for building production-ready apps.

1. Install EAS CLI

```bash
npm install -g eas-cli
```

2. Login to Expo

```bash
eas login
```

3. Configure eas.json

```bash
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {
      "developmentClient": false,
      "distribution": "store"
    }
  }
}
```

4. For development build you can run

```bash
eas build --profile development --platform ios
```

or

```bash
eas build --profile development --platform android
```

## Versioning

Versioning is managed manually via the app.config.js file:

```bash
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1.0.0"
    }
  }
}
```

Follow following links to check developemnt build on real devices: https://docs.expo.dev/tutorial/eas/configure-development-build/

## 📦 Building a Release APK for Expo without EAS

---

### 🔐 1. **Why You Need a Keystore**

- Android requires that every APK is signed before it's installed or published.
- A keystore (`.jks` file) contains your **private key** used to sign the APK.

---

### 🔄 2. **Why Convert the Keystore to Base64**

- GitHub **secrets only support text**, not binary files.
- So, you **convert the `.jks` binary to a Base64 string** (which is plain text).
- Then, **store this string in GitHub secrets** securely.

---

### 🧬 3. **Decoding the Keystore in GitHub Actions**

- In your CI workflow, you **decode the Base64 string back to `.jks`** using the `base64` command.
- Now the Android build tools can **access the keystore file** during the APK signing process.

---

### 🛠️ 4. **Inject Signing Config**

- The workflow **modifies the `build.gradle` file** to use the keystore with the correct alias and passwords.
- This allows Gradle to **sign the APK with your keystore** during `assembleRelease`.

---

### ☁️ 5. **Upload the Signed APK to S3 **

- After building, the signed APK is **uploaded to a public or private S3 bucket** using GitHub Actions.

---

### ✅ Summary

You're:

- Generating a keystore.
- Encoding it as Base64 and saving as a GitHub Secret.
- Decoding it inside a CI workflow to sign your app.
- Avoiding direct keystore file uploads or exposure in the repo.

This keeps your **signing keys secure** while allowing **automated builds and deployments**.

---

# SMB App Features

## Core Features

| Feature                   | Description                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **JavaScript/TypeScript** | Supports both JavaScript and TypeScript codebases. TypeScript is preconfigured with linting and type checking. |
| **Navigation**            | Implemented with Expo Router (file-based routing) and React Navigation (bottom tabs, native navigation).       |
| **Environment Variables** | Uses `dotenv` for simple environment variable management across different environments.                        |
| **Storage**               | Secure asynchronous storage via `@react-native-async-storage/async-storage`.                                   |
| **UI Components**         | Includes rich UI capabilities: vector icons, blur effects, haptic feedback, image handling, and symbols.       |
| **Cross-Platform**        | Supports Android, iOS, and web targets using `react-native-web`.                                               |

## Technical Capabilities

| Feature                    | Description                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| **State Management**       | Native React state management enhanced with Reanimated for gesture-controlled state transitions.  |
| **Gesture Handling**       | Advanced gesture recognition via `react-native-gesture-handler`.                                  |
| **Safe Area Handling**     | `react-native-safe-area-context` ensures proper rendering on devices with notches.                |
| **Keyboard Handling**      | `react-native-keyboard-aware-scroll-view` for adaptive UI when keyboard is visible.               |
| **Web Integration**        | `react-native-webview` for embedded browser content and `expo-web-browser` for external browsing. |
| **Development Experience** | Expo Dev Client for rapid development with live reloading and debugging tools.                    |
