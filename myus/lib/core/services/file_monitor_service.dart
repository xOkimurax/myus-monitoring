import 'dart:io';
import 'package:flutter/services.dart';

class FileMonitorService {
  static const _channel = MethodChannel('com.myus/monitoring/files');

  Future<List<Map<String, dynamic>>> getRecentFiles({
    String? directory,
    int limit = 100,
  }) async {
    try {
      final result = await _channel.invokeMethod<List<dynamic>>(
        'getRecentFiles',
        {'directory': directory, 'limit': limit},
      );
      return result?.map((e) => Map<String, dynamic>.from(e)).toList() ?? [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> hasPermission() async {
    // On Android 13+, we don't need storage permission for app-specific directories
    if (Platform.isAndroid) {
      return true;
    }
    return false;
  }
}