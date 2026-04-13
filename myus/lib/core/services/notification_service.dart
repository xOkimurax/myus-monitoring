import 'package:flutter/services.dart';

class NotificationService {
  static const _channel = MethodChannel('com.myus/monitoring/notifications');

  Future<bool> hasPermission() async {
    try {
      final result = await _channel.invokeMethod<bool>('hasNotificationPermission');
      return result ?? false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> requestPermission() async {
    try {
      final result = await _channel.invokeMethod<bool>('requestNotificationPermission');
      return result ?? false;
    } catch (e) {
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> getNotifications() async {
    try {
      final result = await _channel.invokeMethod<List<dynamic>>('getNotifications');
      return result?.map((e) => Map<String, dynamic>.from(e)).toList() ?? [];
    } catch (e) {
      return [];
    }
  }
}