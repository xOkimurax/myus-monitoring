import 'package:flutter/services.dart';

class CallLogService {
  static const _channel = MethodChannel('com.myus/monitoring/calllogs');

  Future<List<Map<String, dynamic>>> getCallLogs() async {
    try {
      final result = await _channel.invokeMethod<List<dynamic>>('getCallLogs');
      return result?.map((e) => Map<String, dynamic>.from(e)).toList() ?? [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> hasPermission() async {
    try {
      final result = await _channel.invokeMethod<bool>('hasCallLogPermission');
      return result ?? false;
    } catch (e) {
      return false;
    }
  }
}