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
└── README.md
```

## Setup Instructions

### 1. Backend (Insforge)

The edge functions are in `myus_backend/edge-functions/`. To deploy:

```bash
cd myus_backend
npx @insforge/cli functions deploy auth-login --project-id 8d93d3ee-ba57-42e5-ace7-29518396a2d4
```

### 2. Mobile App

```bash
cd myus
flutter pub get
flutter build apk --debug
```

### 3. Web Panel

```bash
cd myus_web
pnpm install
pnpm build
# Serve dist/ folder with any static hosting
```

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