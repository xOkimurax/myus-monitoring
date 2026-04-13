import 'package:equatable/equatable.dart';

abstract class User extends Equatable {
  final String id;
  final String email;
  final String deviceId;

  const User({
    required this.id,
    required this.email,
    required this.deviceId,
  });
}

class AuthenticatedUser extends User {
  final String accessToken;

  const AuthenticatedUser({
    required super.id,
    required super.email,
    required super.deviceId,
    required this.accessToken,
  });

  @override
  List<Object?> get props => [id, email, deviceId, accessToken];
}