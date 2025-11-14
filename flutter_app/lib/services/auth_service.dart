import '../models/user.dart';
import 'api_service.dart';
import 'secure_storage_service.dart';

class AuthService {
  final ApiService _api = ApiService();
  final SecureStorageService _secureStorage = SecureStorageService();

  Future<User> register(String name, String email, String password) async {
    final response = await _api.post('/auth/register', {
      'name': name,
      'email': email,
      'password': password,
    });

    await _api.saveToken(response['token']);
    await _secureStorage.saveUser(response['user']);

    return User.fromJson(response['user']);
  }

  Future<User> login(String email, String password, {bool rememberMe = false}) async {
    final response = await _api.post('/auth/login', {
      'email': email,
      'password': password,
    });

    await _api.saveToken(response['token']);
    await _secureStorage.saveUser(response['user']);

    // Save email if remember me is checked
    if (rememberMe) {
      await _secureStorage.saveEmail(email);
      await _secureStorage.setRememberMe(true);
    }

    return User.fromJson(response['user']);
  }

  Future<User?> getCurrentUser() async {
    try {
      await _api.loadToken();
      final response = await _api.get('/auth/me');

      // Update stored user data
      await _secureStorage.saveUser(response['user']);

      return User.fromJson(response['user']);
    } catch (e) {
      return null;
    }
  }

  Future<User?> autoLogin() async {
    try {
      // Check if user is logged in
      final isLoggedIn = await _secureStorage.isLoggedIn();
      if (!isLoggedIn) return null;

      // Try to get current user
      return await getCurrentUser();
    } catch (e) {
      // If token is invalid, clear it
      await logout();
      return null;
    }
  }

  Future<String?> getSavedEmail() async {
    return await _secureStorage.getSavedEmail();
  }

  Future<bool> getRememberMe() async {
    return await _secureStorage.getRememberMe();
  }

  Future<void> logout() async {
    await _api.clearToken();
  }

  Future<void> clearAllData() async {
    await _secureStorage.clearEverything();
  }
}
