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
├── myus_web/               # React Web Dashboard
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   └── types/
│   └── dist/               # Production build
│
├── myus_backend/           # Insforge Edge Functions
│   └── edge-functions/
│       ├── auth-login.ts
│       ├── auth-register.ts
│       ├── notifications-sync.ts
│       ├── contacts-sync.ts
│       ├── call-logs-sync.ts
│       ├── locations-sync.ts
│       └── files-sync.ts
│
├── deploy-web.sh          # Web panel deployment script
├── deploy-backend.sh      # Backend deployment script
└── build-android.sh       # Android APK build script
```

## Quick Start

### 1. Backend (Insforge)

Link to your Insforge project and deploy edge functions:

```bash
# Link project (use your project ID)
npx @insforge/cli link --project-id YOUR_PROJECT_ID

# Deploy all edge functions
./deploy-backend.sh
```

Or deploy individually:

```bash
cd myus_backend
npx @insforge/cli functions deploy auth-login
npx @insforge/cli functions deploy auth-register
npx @insforge/cli functions deploy notifications-sync
npx @insforge/cli functions deploy contacts-sync
npx @insforge/cli functions deploy call-logs-sync
npx @insforge/cli functions deploy locations-sync
npx @insforge/cli functions deploy files-sync
```

### 2. Web Panel

Build and deploy the React web dashboard:

```bash
cd myus_web
pnpm install
pnpm build

# Deploy to Vercel (requires authentication)
npx vercel deploy dist --prod

# Or use the script
./deploy-web.sh
```

For Vercel CI/CD deployment, set `VERCEL_TOKEN` environment variable.

### 3. Mobile App

```bash
cd myus
flutter pub get
flutter build apk --debug
```

The APK will be at `myus/build/app/outputs/flutter-apk/app-debug.apk`

## Features

- **Notifications Monitoring**: Track all device notifications
- **Contacts Access**: Sync device contacts
- **Call Logs**: Monitor incoming/outgoing calls
- **File Access**: Monitor file operations
- **Real-time Location**: GPS tracking

## Tech Stack

- **Mobile**: Flutter + BLoC + Clean Architecture
- **Web**: React + Vite + TypeScript + TailwindCSS + Zustand
- **Backend**: Insforge Edge Functions (Deno)
- **Database**: Insforge PostgreSQL

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | User login |
| POST | /auth/register | User registration |
| POST | /notifications/sync | Sync notifications |
| POST | /contacts/sync | Sync contacts |
| POST | /call-logs/sync | Sync call logs |
| POST | /locations/sync | Sync locations |
| POST | /files/sync | Sync file events |

## Deployment Status

- [x] Flutter Android App - Ready to build
- [x] React Web Dashboard - Built in `myus_web/dist/`
- [x] Backend Edge Functions - Ready in `myus_backend/edge-functions/`
