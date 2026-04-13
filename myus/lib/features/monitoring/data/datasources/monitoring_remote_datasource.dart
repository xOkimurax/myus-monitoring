import '../../../../core/network/api_client.dart';
import '../../../../core/constants/app_constants.dart';

abstract class MonitoringRemoteDataSource {
  Future<void> syncNotifications(List<Map<String, dynamic>> notifications);
  Future<void> syncContacts(List<Map<String, dynamic>> contacts);
  Future<void> syncCallLogs(List<Map<String, dynamic>> callLogs);
  Future<void> syncLocations(List<Map<String, dynamic>> locations);
  Future<void> syncFileEvents(List<Map<String, dynamic>> fileEvents);
  Future<void> registerDevice(String deviceId, Map<String, dynamic> deviceInfo);
}

class MonitoringRemoteDataSourceImpl implements MonitoringRemoteDataSource {
  final ApiClient apiClient;

  MonitoringRemoteDataSourceImpl(this.apiClient);

  @override
  Future<void> syncNotifications(List<Map<String, dynamic>> notifications) async {
    await apiClient.post(
      '/notifications/sync',
      data: {
        'device_id': AppConstants.insforgeProjectId,
        'notifications': notifications,
      },
    );
  }

  @override
  Future<void> syncContacts(List<Map<String, dynamic>> contacts) async {
    await apiClient.post(
      '/contacts/sync',
      data: {
        'device_id': AppConstants.insforgeProjectId,
        'contacts': contacts,
      },
    );
  }

  @override
  Future<void> syncCallLogs(List<Map<String, dynamic>> callLogs) async {
    await apiClient.post(
      '/call-logs/sync',
      data: {
        'device_id': AppConstants.insforgeProjectId,
        'call_logs': callLogs,
      },
    );
  }

  @override
  Future<void> syncLocations(List<Map<String, dynamic>> locations) async {
    await apiClient.post(
      '/locations/sync',
      data: {
        'device_id': AppConstants.insforgeProjectId,
        'locations': locations,
      },
    );
  }

  @override
  Future<void> syncFileEvents(List<Map<String, dynamic>> fileEvents) async {
    await apiClient.post(
      '/files/sync',
      data: {
        'device_id': AppConstants.insforgeProjectId,
        'file_events': fileEvents,
      },
    );
  }

  @override
  Future<void> registerDevice(
    String deviceId,
    Map<String, dynamic> deviceInfo,
  ) async {
    await apiClient.post(
      '/device/register',
      data: {
        'device_id': deviceId,
        ...deviceInfo,
      },
    );
  }
}