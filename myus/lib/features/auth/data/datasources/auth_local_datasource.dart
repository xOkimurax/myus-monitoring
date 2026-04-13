import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

import '../../../../core/constants/app_constants.dart';
import '../models/user_model.dart';

abstract class AuthLocalDataSource {
  Future<void> saveUser(UserModel user);
  Future<UserModel?> getUser();
  Future<void> deleteUser();
  Future<String> getOrCreateDeviceId();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final FlutterSecureStorage secureStorage;
  final SharedPreferences sharedPreferences;

  static const String _userKey = 'auth_user';

  AuthLocalDataSourceImpl({
    required this.secureStorage,
    required this.sharedPreferences,
  });

  @override
  Future<void> saveUser(UserModel user) async {
    await secureStorage.write(key: _userKey, value: user.toJsonString());
    await sharedPreferences.setString(AppConstants.deviceIdKey, user.deviceId);
  }

  @override
  Future<UserModel?> getUser() async {
    final userJson = await secureStorage.read(key: _userKey);
    if (userJson == null) return null;
    return UserModel.fromJsonString(userJson);
  }

  @override
  Future<void> deleteUser() async {
    await secureStorage.delete(key: _userKey);
    await sharedPreferences.remove(AppConstants.deviceIdKey);
  }

  @override
  Future<String> getOrCreateDeviceId() async {
    final existingId = sharedPreferences.getString(AppConstants.deviceIdKey);
    if (existingId != null) return existingId;

    final newId = const Uuid().v4();
    await sharedPreferences.setString(AppConstants.deviceIdKey, newId);
    return newId;
  }
}