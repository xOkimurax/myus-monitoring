#!/bin/bash
# Build Myus Android APK
# Usage: ./build-android.sh

cd myus

# Get dependencies
flutter pub get

# Build debug APK
flutter build apk --debug

echo "APK generated at: myus/build/app/outputs/flutter-apk/app-debug.apk"
