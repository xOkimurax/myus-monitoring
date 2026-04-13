import 'dart:convert';

class UserModel {
  final String id;
  final String email;
  final String deviceId;
  final String accessToken;

  const UserModel({
    required this.id,
    required this.email,
    required this.deviceId,
    required this.accessToken,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      deviceId: json['device_id'] as String,
      accessToken: json['access_token'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'device_id': deviceId,
      'access_token': accessToken,
    };
  }

  String toJsonString() => jsonEncode(toJson());

  factory UserModel.fromJsonString(String jsonString) {
    return UserModel.fromJson(jsonDecode(jsonString) as Map<String, dynamic>);
  }
}