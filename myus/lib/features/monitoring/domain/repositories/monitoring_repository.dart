import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/monitoring_entities.dart';
import 'permission_type.dart';

abstract class MonitoringRepository {
  Future<Either<Failure, void>> startMonitoring();
  Future<Either<Failure, void>> stopMonitoring();
  Future<Either<Failure, void>> syncData();

  Future<Either<Failure, List<NotificationEntity>>> getNotifications();
  Future<Either<Failure, List<ContactEntity>>> getContacts();
  Future<Either<Failure, List<CallLogEntity>>> getCallLogs();
  Future<Either<Failure, List<LocationEntity>>> getLocations();
  Future<Either<Failure, List<FileEventEntity>>> getFileEvents();

  Future<Either<Failure, bool>> requestPermission(PermissionType type);
}