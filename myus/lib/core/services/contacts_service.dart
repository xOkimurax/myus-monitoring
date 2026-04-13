import 'package:flutter/services.dart';

class ContactsService {
  static const _channel = MethodChannel('com.myus/monitoring/contacts');

  Future<List<Map<String, dynamic>>> getContacts() async {
    try {
      final result = await _channel.invokeMethod<List<dynamic>>('getContacts');
      return result?.map((e) => Map<String, dynamic>.from(e)).toList() ?? [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> hasPermission() async {
    try {
      final result = await _channel.invokeMethod<bool>('hasContactsPermission');
      return result ?? false;
    } catch (e) {
      return false;
    }
  }
}