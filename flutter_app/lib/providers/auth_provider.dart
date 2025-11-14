import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  User? _user;
  bool _isLoading = false;
  bool _isInitializing = true;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isInitializing => _isInitializing;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  // Initialize and check for auto-login
  Future<void> initialize() async {
    _isInitializing = true;
    notifyListeners();

    try {
      debugPrint('🔐 Checking for saved credentials...');
      _user = await _authService.autoLogin();

      if (_user != null) {
        debugPrint('✅ Auto-login successful: ${_user!.name}');
      } else {
        debugPrint('ℹ️  No saved credentials found');
      }
    } catch (e) {
      debugPrint('❌ Auto-login failed: $e');
      _user = null;
    } finally {
      _isInitializing = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password, {bool rememberMe = false}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      debugPrint('🔐 Logging in...');
      _user = await _authService.login(email, password, rememberMe: rememberMe);
      _isLoading = false;
      debugPrint('✅ Login successful: ${_user!.name}');
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('❌ Login failed: $e');
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      debugPrint('📝 Registering...');
      _user = await _authService.register(name, email, password);
      _isLoading = false;
      debugPrint('✅ Registration successful: ${_user!.name}');
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('❌ Registration failed: $e');
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> loadUser() async {
    try {
      _user = await _authService.getCurrentUser();
      notifyListeners();
    } catch (e) {
      debugPrint('❌ Failed to load user: $e');
      _user = null;
    }
  }

  Future<String?> getSavedEmail() async {
    return await _authService.getSavedEmail();
  }

  Future<bool> getRememberMe() async {
    return await _authService.getRememberMe();
  }

  Future<void> logout() async {
    debugPrint('👋 Logging out...');
    await _authService.logout();
    _user = null;
    _error = null;
    debugPrint('✅ Logged out successfully');
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
