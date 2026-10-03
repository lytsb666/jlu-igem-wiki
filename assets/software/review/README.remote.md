# JLU-SPH 2026: Fluorescence Detection Android Apps

## Description

We provide two generations of the Android client for the JLU-SPH fluorescence detection platform. The apps connect to a device server over TCP, request images, display server-provided tube results and temperature, plot received data, and send hardware control commands. Image analysis runs on the connected system; these Android projects do not include the device server, firmware, or an inference model.

| Source directory | Version | Main differences |
| --- | --- | --- |
| [first-generation-app-source-code](first-generation-app-source-code) | First-generation app | Two-tube result display; temperature commands through `set_tem`. |
| [second-generation-app-source-code](second-generation-app-source-code) | Second-generation app | Five-tube color labels; servo controls; separate 43 and 90 degree control switches through `set_tem43` and `set_tem90`. |

Both projects retain their supplied source files, resources, Gradle wrapper, and example tests. The directory names identify the development generations; both Gradle configurations currently declare version `1.0`.

## Installation

### Download the Android app

[Download the first-generation APK](downloads/first-generation-fluorescent-detection.apk?inline=false) or [download the second-generation APK](downloads/fluorescent-detection.apk?inline=false). Both declare version 1.0 and require Android 7.0 / API 24 or later. Install the APK on your Android device, allowing installation from the download app when prompted, then enter the actual AI Box IP address and TCP port. Live acquisition and hardware control require the corresponding device server.

The first-generation APK has application ID `com.chuangxin.socket_test`; the second-generation APK has application ID `com.chuangxin.socket`. These generation labels follow the matching source-project application IDs. Both APKs are distributed as supplied, with `debuggable` enabled in their manifests; they were not rebuilt from this repository during publication. See [download metadata and SHA-256](downloads/README.md) for file verification.

### Requirements

- Android Studio with JDK 17 selected as the Gradle JDK.
- Android SDK Platform 34 and the corresponding Android build tools.
- An Android device or emulator running Android 7.0 (API 24) or later.
- Network access to Google Maven, Maven Central, JitPack, and the Gradle distribution service for dependency downloads.
- A reachable device server implementing the selected generation's protocol for live measurements and hardware controls.

The projects use Android Gradle Plugin 8.2.0 and Gradle 8.2. Java source compatibility is set to Java 8. Dependencies are declared in each project's `app/build.gradle`; they include AndroidX, Material Components, MPAndroidChart, and JSON-java.

### Build and install

1. Clone this repository:

   ```sh
   git clone https://gitlab.igem.org/2026/software/jlu-sph/sph-software.git
   ```

2. In Android Studio, open either generation directory as a separate project. Select JDK 17 for Gradle, install SDK 34, and let Gradle sync. Android Studio creates the machine-specific `local.properties` file.
3. Connect an Android device with USB debugging enabled, or start an emulator. Select the `app` configuration and click Run.

From PowerShell inside the chosen generation directory, with the JDK and Android SDK configured:

```powershell
.\gradlew.bat assembleDebug
.\gradlew.bat installDebug
```

On macOS or Linux, use `sh ./gradlew assembleDebug` and `sh ./gradlew installDebug`. The debug APK is generated at `app/build/outputs/apk/debug/app-debug.apk`.

The application IDs are `com.chuangxin.socket_test` (first generation) and `com.chuangxin.socket` (second generation).

## Usage

1. Start the compatible device server and connect the phone to a network that can reach it.
2. Launch the app, enter the server's IP address and TCP port, and connect. The address and port must match the actual device configuration.
3. Request an image to display the returned image and tube results. Automatic acquisition sends image requests every 30 seconds. Temperature updates are requested separately.
4. Open the data view to inspect the plotted values. Use the temperature controls supported by the connected device. The second generation also exposes servo controls.

The first generation maps tube codes `0` through `3` to `No risk`, `Low risk`, `Moderate risk`, and `High risk`. The second maps them to `tube_green`, `tube_red`, `tube_blue`, and `tube_null`. These are client-side display mappings of server outputs; their biological interpretation depends on the assay and server implementation.

See [the protocol notes](docs/PROTOCOL.md) for message framing, command differences, and an illustrative response.

## Data and large files

This repository contains source code, the small resources required by the apps, and the supplied installable APK in `downloads/`. Other APKs, build outputs, Gradle caches, IDE metadata, and local SDK paths are excluded. No experimental dataset, model weights, or Zenodo record is included in this source submission. Archive future datasets, model weights, and large media through the [iGEM Zenodo workflow](https://teams.igem.org/go/deliverables/software/zenodo) and link their DOI here when available.

## Contributing

Use this repository's Issues to report a problem or propose a change. Include the app generation, Android version, reproduction steps, expected behavior, and relevant logs. Remove credentials and personal data from reports.

Create a branch, open the relevant generation in Android Studio, and submit a merge request describing the change and checks performed. For hardware or protocol changes, include the server configuration and document any message-format changes in `docs/PROTOCOL.md`.

Available checks from each generation directory are:

```powershell
.\gradlew.bat testDebugUnitTest
.\gradlew.bat lintDebug
.\gradlew.bat connectedDebugAndroidTest
```

The last command requires a connected device or emulator. The supplied tests are Android template checks, not coverage of acquisition or hardware behavior. The second-generation instrumentation test still expects `com.chuangxin.socket_test`, while its application ID is `com.chuangxin.socket`; this assertion needs updating before that test can pass.

### Verification status

The source import was checked for file integrity and documentation consistency. Compilation and device tests have not been completed in the import environment, which has Java 14 and no Android SDK at the standard location. Hardware behavior requires testing with the corresponding device server. The application source has been preserved as supplied.

## Authors and acknowledgment

Project team: JLU-SPH, iGEM 2026. The two Android projects are provided here as the team's first- and second-generation app source. Original source comments and attribution notices are retained. The apps use the third-party libraries declared in their Gradle files, including AndroidX, Material Components, MPAndroidChart, JSON-java, JUnit, and Espresso.

## AI use disclosure

We used OpenAI Codex to assist with file and documentation organization during this repository preparation and publication. This included standardizing the English directory names for the two app generations, organizing the repository structure, and excluding build caches, compiled artifacts, and local environment configuration files.

Before upload, Codex helped verify that the source files matched the originals. With the team's authorization, it also performed the Git commit and push and checked the remote repository's commit status. This process preserved the existing source code, resource files, and build configuration; AI was not used to add or modify application logic during this repository preparation. The team is responsible for the accuracy, attribution, and final adoption of the published content.

See the repository's [responsible AI use guidelines](.claude/RESPONSIBLE_AI_USE.md).

## License

The repository retains its existing [Apache License 2.0](LICENSE). Third-party dependencies retain their respective licenses and attribution requirements.
