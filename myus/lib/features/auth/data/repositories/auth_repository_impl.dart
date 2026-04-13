import 'package:dartz/dartz.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/network/api_client.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthLocalDataSource localDataSource;
  final ApiClient apiClient;

  AuthRepositoryImpl({
    required this.localDataSource,
    required this.apiClient,
  });

  @override
  Future<Either<Failure, AuthenticatedUser>> login({
    required String email,
    required String password,
  }) async {
    try {
      final deviceId = await localDataSource.getOrCreateDeviceId();

      final response = await apiClient.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
          'device_id': deviceId,
        },
      );

      final user = UserModel(
        id: response.data['user']['id'],
        email: response.data['user']['email'],
        deviceId: deviceId,
        accessToken: response.data['access_token'],
      );

      await localDataSource.saveUser(user);

      return Right(AuthenticatedUser(
        id: user.id,
        email: user.email,
        deviceId: user.deviceId,
        accessToken: user.accessToken,
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthenticatedUser>> register({
    required String email,
    required String password,
  }) async {
    try {
      final deviceId = await localDataSource.getOrCreateDeviceId();

      final response = await apiClient.post(
        '/auth/register',
        data: {
          'email': email,
          'password': password,
          'device_id': deviceId,
        },
      );

      final user = UserModel(
        id: response.data['user']['id'],
        email: response.data['user']['email'],
        deviceId: deviceId,
        accessToken: response.data['access_token'],
      );

      await localDataSource.saveUser(user);

      return Right(AuthenticatedUser(
        id: user.id,
        email: user.email,
        deviceId: user.deviceId,
        accessToken: user.accessToken,
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await localDataSource.deleteUser();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthenticatedUser?>> getCurrentUser() async {
    try {
      final user = await localDataSource.getUser();
      if (user == null) return const Right(null);
      return Right(AuthenticatedUser(
        id: user.id,
        email: user.email,
        deviceId: user.deviceId,
        accessToken: user.accessToken,
      ));
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> isLoggedIn() async {
    try {
      final user = await localDataSource.getUser();
      return Right(user != null);
    } catch (e) {
      return const Right(false);
    }
  }
}