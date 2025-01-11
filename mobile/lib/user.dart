class UserResponse {
  UserResponse({required this.id, required this.email, required this.name});
  final String id;
  final String email;
  final String name;

  factory UserResponse.fromJson(Map<String, dynamic> data) {
    return UserResponse(
      id: data['id'],
      email: data['email'],
      name: data['name'],
    );
  }
}

class ExtendedUserResponse {
  ExtendedUserResponse({
    required this.base,
    this.picture = "",
    required this.isActive,
    required this.createdAt,
    required this.type,
  });
  final UserResponse base;
  final String picture;
  final bool isActive;
  final String createdAt;
  final String type;

  factory ExtendedUserResponse.fromJson(Map<String, dynamic> data) {
    return ExtendedUserResponse(
      base: UserResponse.fromJson(data),
      picture: data['picture'],
      isActive: data['isActive'],
      createdAt: data['createdAt'],
      type: data['type'],
    );
  }
}

class LoginResponse {
  LoginResponse({required this.token, required this.user});
  final String token;
  final UserResponse user;

  factory LoginResponse.fromJson(Map<String, dynamic> data) {
    return LoginResponse(
      token: data['token'],
      user: UserResponse.fromJson(data['user']),
    );
  }
}

class JsonLoginResponse {
  JsonLoginResponse(
      {required this.success, required this.message, required this.data});
  final bool success;
  final String message;
  final LoginResponse data;

  factory JsonLoginResponse.fromJson(Map<String, dynamic> data) {
    return JsonLoginResponse(
        success: data['success'],
        message: data['message'],
        data: LoginResponse.fromJson(data['data']));
  }
}
