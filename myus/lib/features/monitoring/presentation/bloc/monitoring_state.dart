part of 'monitoring_bloc.dart';

abstract class MonitoringState extends Equatable {
  const MonitoringState();

  @override
  List<Object?> get props => [];
}

class MonitoringInitial extends MonitoringState {
  const MonitoringInitial();
}

class MonitoringLoading extends MonitoringState {
  const MonitoringLoading();
}

class MonitoringActive extends MonitoringState {
  final bool isTracking;
  final bool hasNotificationsPermission;
  final bool hasContactsPermission;
  final bool hasCallLogsPermission;
  final bool hasLocationPermission;
  final bool hasStoragePermission;
  final DateTime? lastSync;

  const MonitoringActive({
    required this.isTracking,
    this.hasNotificationsPermission = false,
    this.hasContactsPermission = false,
    this.hasCallLogsPermission = false,
    this.hasLocationPermission = false,
    this.hasStoragePermission = false,
    this.lastSync,
  });

  MonitoringActive copyWith({
    bool? isTracking,
    bool? hasNotificationsPermission,
    bool? hasContactsPermission,
    bool? hasCallLogsPermission,
    bool? hasLocationPermission,
    bool? hasStoragePermission,
    DateTime? lastSync,
  }) {
    return MonitoringActive(
      isTracking: isTracking ?? this.isTracking,
      hasNotificationsPermission:
          hasNotificationsPermission ?? this.hasNotificationsPermission,
      hasContactsPermission:
          hasContactsPermission ?? this.hasContactsPermission,
      hasCallLogsPermission:
          hasCallLogsPermission ?? this.hasCallLogsPermission,
      hasLocationPermission:
          hasLocationPermission ?? this.hasLocationPermission,
      hasStoragePermission: hasStoragePermission ?? this.hasStoragePermission,
      lastSync: lastSync ?? this.lastSync,
    );
  }

  @override
  List<Object?> get props => [
        isTracking,
        hasNotificationsPermission,
        hasContactsPermission,
        hasCallLogsPermission,
        hasLocationPermission,
        hasStoragePermission,
        lastSync,
      ];
}

class MonitoringError extends MonitoringState {
  final String message;

  const MonitoringError(this.message);

  @override
  List<Object?> get props => [message];
}