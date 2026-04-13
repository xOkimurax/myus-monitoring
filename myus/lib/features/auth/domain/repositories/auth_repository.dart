import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, AuthenticatedUser>> login({
    required String email,
    required String password,
  });

  Future<Either<Failure, AuthenticatedUser>> register({
    required String email,
    required String password,
  });

  Future<Either<Failure, void>> logout();

  Future<Either<Failure, AuthenticatedUser?>> getCurrentUser();

  Future<Either<Failure, bool>> isLoggedIn();
}