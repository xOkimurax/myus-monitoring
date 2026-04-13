part of 'monitoring_bloc.dart';

abstract class MonitoringEvent extends Equatable {
  const MonitoringEvent();

  @override
  List<Object?> get props => [];
}

class MonitoringStartRequested extends MonitoringEvent {
  const MonitoringStartRequested();
}

class MonitoringStopRequested extends MonitoringEvent {
  const MonitoringStopRequested();
}

class MonitoringSyncRequested extends MonitoringEvent {
  const MonitoringSyncRequested();
}

class MonitoringDataReceived extends MonitoringEvent {
  final List<NotificationEntity> notifications;
  final List<ContactEntity> contacts;
  final List<CallLogEntity> callLogs;
  final List<LocationEntity> locations;

  const MonitoringDataReceived({
    required this.notifications,
    required this.contacts,
    required this.callLogs,
    required this.locations,
  });

  @override
  List<Object?> get props =>
      [notifications, contacts, callLogs, locations];
}

class MonitoringLocationUpdated extends MonitoringEvent {
  final LocationEntity location;

  const MonitoringLocationUpdated(this.location);

  @override
  List<Object?> get props => [location];
}

class MonitoringPermissionRequested extends MonitoringEvent {
  final PermissionType type;

  const MonitoringPermissionRequested(this.type);

  @override
  List<Object?> get props => [type];
}