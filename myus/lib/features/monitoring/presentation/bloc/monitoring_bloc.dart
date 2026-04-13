import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../../core/errors/failures.dart';
import '../../../monitoring/domain/entities/monitoring_entities.dart';
import '../../../monitoring/domain/repositories/monitoring_repository.dart';
import '../../../monitoring/domain/repositories/permission_type.dart';

part 'monitoring_event.dart';
part 'monitoring_state.dart';

class MonitoringBloc extends Bloc<MonitoringEvent, MonitoringState> {
  final MonitoringRepository repository;

  MonitoringBloc(this.repository) : super(const MonitoringInitial()) {
    on<MonitoringStartRequested>(_onStartRequested);
    on<MonitoringStopRequested>(_onStopRequested);
    on<MonitoringSyncRequested>(_onSyncRequested);
    on<MonitoringLocationUpdated>(_onLocationUpdated);
    on<MonitoringPermissionRequested>(_onPermissionRequested);
  }

  Future<void> _onStartRequested(
    MonitoringStartRequested event,
    Emitter<MonitoringState> emit,
  ) async {
    emit(const MonitoringLoading());
    try {
      await repository.startMonitoring();
      emit(const MonitoringActive(isTracking: true));
    } catch (e) {
      emit(MonitoringError(e.toString()));
    }
  }

  Future<void> _onStopRequested(
    MonitoringStopRequested event,
    Emitter<MonitoringState> emit,
  ) async {
    emit(const MonitoringLoading());
    try {
      await repository.stopMonitoring();
      emit(const MonitoringActive(isTracking: false));
    } catch (e) {
      emit(MonitoringError(e.toString()));
    }
  }

  Future<void> _onSyncRequested(
    MonitoringSyncRequested event,
    Emitter<MonitoringState> emit,
  ) async {
    if (state is MonitoringActive) {
      try {
        await repository.syncData();
        emit((state as MonitoringActive).copyWith(lastSync: DateTime.now()));
      } catch (e) {
        emit(MonitoringError(e.toString()));
      }
    }
  }

  void _onLocationUpdated(
    MonitoringLocationUpdated event,
    Emitter<MonitoringState> emit,
  ) {
    // Handle location updates
  }

  Future<void> _onPermissionRequested(
    MonitoringPermissionRequested event,
    Emitter<MonitoringState> emit,
  ) async {
    if (state is MonitoringActive) {
      try {
        final result = await repository.requestPermission(event.type);
        result.fold(
          (failure) => emit(MonitoringError(failure.message)),
          (granted) {
            final currentState = state as MonitoringActive;
            switch (event.type) {
              case PermissionType.notifications:
                emit(currentState.copyWith(hasNotificationsPermission: granted));
                break;
              case PermissionType.contacts:
                emit(currentState.copyWith(hasContactsPermission: granted));
                break;
              case PermissionType.callLogs:
                emit(currentState.copyWith(hasCallLogsPermission: granted));
                break;
              case PermissionType.location:
                emit(currentState.copyWith(hasLocationPermission: granted));
                break;
              case PermissionType.storage:
                emit(currentState.copyWith(hasStoragePermission: granted));
                break;
            }
          },
        );
      } catch (e) {
        emit(MonitoringError(e.toString()));
      }
    }
  }
}