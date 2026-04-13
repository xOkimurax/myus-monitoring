class AppConstants {
  AppConstants._();

  static const String appName = 'Myus';
  static const String appVersion = '1.0.0';

  // Insforge DB Project ID
  static const String insforgeProjectId = '8d93d3ee-ba57-42e5-ace7-29518396a2d4';

  // API URLs
  static const String insforgeApiUrl = 'https://db.supabase.io';
  static const String insforgeRealtimeUrl = 'https://realtime.supabase.io';

  // Sync intervals (in minutes)
  static const int syncIntervalMinutes = 15;
  static const int locationUpdateIntervalSeconds = 30;

  // Storage keys
  static const String deviceIdKey = 'device_id';
  static const String authTokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';
  static const String lastSyncKey = 'last_sync';
}