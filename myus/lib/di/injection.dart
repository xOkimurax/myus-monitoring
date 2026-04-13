import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../core/network/api_client.dart';
import '../features/auth/data/datasources/auth_local_datasource.dart';
import '../features/auth/data/repositories/auth_repository_impl.dart';
import '../features/auth/domain/repositories/auth_repository.dart';
import '../features/auth/domain/usecases/auth_usecases.dart';
import '../features/auth/presentation/bloc/auth_bloc.dart';
import '../features/monitoring/data/datasources/monitoring_remote_datasource.dart';
import '../features/monitoring/data/repositories/monitoring_repository_impl.dart';
import '../features/monitoring/domain/repositories/monitoring_repository.dart';
import '../features/monitoring/presentation/bloc/monitoring_bloc.dart';
import '../core/services/notification_service.dart';
import '../core/services/contacts_service.dart';
import '../core/services/call_log_service.dart';
import '../core/services/location_service.dart';
import '../core/services/file_monitor_service.dart';

final sl = GetIt.instance;

Future<void> initDependencies() async {
  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => const FlutterSecureStorage());

  // Network
  sl.registerLazySingleton(() => ApiClient());

  // Services
  sl.registerLazySingleton(() => NotificationService());
  sl.registerLazySingleton(() => ContactsService());
  sl.registerLazySingleton(() => CallLogService());
  sl.registerLazySingleton(() => LocationService());
  sl.registerLazySingleton(() => FileMonitorService());

  // Data Sources
  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(
      secureStorage: sl(),
      sharedPreferences: sl(),
    ),
  );
  sl.registerLazySingleton<MonitoringRemoteDataSource>(
    () => MonitoringRemoteDataSourceImpl(sl()),
  );

  // Repositories
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      localDataSource: sl(),
      apiClient: sl(),
    ),
  );
  sl.registerLazySingleton<MonitoringRepository>(
    () => MonitoringRepositoryImpl(
      remoteDataSource: sl(),
      notificationService: sl(),
      contactsService: sl(),
      callLogService: sl(),
      locationService: sl(),
      fileMonitorService: sl(),
    ),
  );

  // Use Cases
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => RegisterUseCase(sl()));
  sl.registerLazySingleton(() => LogoutUseCase(sl()));
  sl.registerLazySingleton(() => GetCurrentUserUseCase(sl()));
  sl.registerLazySingleton(() => CheckAuthStatusUseCase(sl()));

  // BLoCs
  sl.registerFactory(() => AuthBloc(
        loginUseCase: sl(),
        registerUseCase: sl(),
        logoutUseCase: sl(),
        checkAuthStatusUseCase: sl(),
        getCurrentUserUseCase: sl(),
      ));
  sl.registerFactory(() => MonitoringBloc(sl()));
}