import 'package:equatable/equatable.dart';

class NotificationEntity extends Equatable {
  final String id;
  final String appName;
  final String appPackage;
  final String title;
  final String content;
  final DateTime timestamp;
  final bool isRead;

  const NotificationEntity({
    required this.id,
    required this.appName,
    required this.appPackage,
    required this.title,
    required this.content,
    required this.timestamp,
    required this.isRead,
  });

  @override
  List<Object?> get props =>
      [id, appName, appPackage, title, content, timestamp, isRead];
}

class ContactEntity extends Equatable {
  final String id;
  final String name;
  final List<String> phoneNumbers;
  final List<String> emails;
  final String? photoUri;

  const ContactEntity({
    required this.id,
    required this.name,
    required this.phoneNumbers,
    required this.emails,
    this.photoUri,
  });

  @override
  List<Object?> get props => [id, name, phoneNumbers, emails, photoUri];
}

class CallLogEntity extends Equatable {
  final String id;
  final String contactName;
  final String phoneNumber;
  final CallType type;
  final int duration;
  final DateTime timestamp;

  const CallLogEntity({
    required this.id,
    required this.contactName,
    required this.phoneNumber,
    required this.type,
    required this.duration,
    required this.timestamp,
  });

  @override
  List<Object?> get props =>
      [id, contactName, phoneNumber, type, duration, timestamp];
}

enum CallType { incoming, outgoing, missed }

class FileEventEntity extends Equatable {
  final String id;
  final String filePath;
  final String fileName;
  final FileOperation operation;
  final int? fileSize;
  final String? mimeType;
  final DateTime timestamp;

  const FileEventEntity({
    required this.id,
    required this.filePath,
    required this.fileName,
    required this.operation,
    this.fileSize,
    this.mimeType,
    required this.timestamp,
  });

  @override
  List<Object?> get props =>
      [id, filePath, fileName, operation, fileSize, mimeType, timestamp];
}

enum FileOperation { create, delete, modify }

class LocationEntity extends Equatable {
  final String id;
  final double latitude;
  final double longitude;
  final double? altitude;
  final double? accuracy;
  final double? speed;
  final DateTime timestamp;

  const LocationEntity({
    required this.id,
    required this.latitude,
    required this.longitude,
    this.altitude,
    this.accuracy,
    this.speed,
    required this.timestamp,
  });

  @override
  List<Object?> get props =>
      [id, latitude, longitude, altitude, accuracy, speed, timestamp];
}