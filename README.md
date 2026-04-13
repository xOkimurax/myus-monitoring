# Myus - Mobile Monitoring System

AirDroid clone for Android device monitoring.

## Project Structure

```
appmonitoreo/
├── myus/                    # Flutter Android App
│   ├── lib/
│   │   ├── main.dart
│   │   ├── di/injection.dart
│   │   ├── core/
│   │   │   ├── constants/
│   │   │   ├── errors/
│   │   │   ├── network/
│   │   │   └── services/
│   │   └── features/
│   │       ├── auth/
│   │       └── monitoring/
│   └── android/
│
├── myus_web/               # React Web Dashboard + Backend
│   ├── src/                # React frontend
│   ├── dist/               # Production build
│   └── backend/
│       └── edge-functions/ # Insforge Edge Functions
│           ├── auth-login.ts
│           ├── auth-register.ts
│           ├── notifications-sync.ts
│           ├── contacts-sync.ts
│           ├── call-logs-sync.ts
│           ├── locations-sync.ts
│           └── files-sync.ts
│
└── build-android.sh        # Android APK build script
```

## Deployment Status

| Componente | Estado | URL |
|------------|--------|-----|
| Web Panel | Desplegado | https://jp84sgki.insforge.site |
| Edge Functions | Desplegadas | https://jp84sgki.functions.insforge.app |
| Flutter App | Lista para construir | `myus/` |

## Edge Functions API

| Endpoint | Description |
|----------|-------------|
| POST /auth-login | User login |
| POST /auth-register | User registration |
| POST /notifications-sync | Sync notifications |
| POST /contacts-sync | Sync contacts |
| POST /call-logs-sync | Sync call logs |
| POST /locations-sync | Sync GPS locations |
| POST /files-sync | Sync file events |

## Quick Start

### Build Android APK

```bash
cd myus
flutter pub get
flutter build apk --debug
```

APK generado en: `myus/build/app/outputs/flutter-apk/app-debug.apk`

### Run Web Panel (Development)

```bash
cd myus_web
pnpm install
pnpm dev
```

## Tech Stack

- **Mobile**: Flutter + BLoC + Clean Architecture
- **Web**: React + Vite + TypeScript + TailwindCSS + Zustand
- **Backend**: Insforge Edge Functions (Deno)
- **Database**: Insforge PostgreSQL