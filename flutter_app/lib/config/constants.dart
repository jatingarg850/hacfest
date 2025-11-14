class AppConstants {
  // API Configuration
  // For Android Emulator use: http://192.168.0.116:3000
  // For Physical Device use: http://YOUR_COMPUTER_IP:3000
  static const String baseUrl = 'http://192.168.0.116:3000/api';
  static const String socketUrl = 'http://192.168.0.116:3000';

  // Agora Configuration
  static const String agoraAppId = 'dcec8fd34e6e4144825fe891dab5e89f';

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';

  // Routes
  static const String loginRoute = '/login';
  static const String registerRoute = '/register';
  static const String homeRoute = '/home';
  static const String voiceChatRoute = '/voice-chat';
  static const String quizRoute = '/quiz';
  static const String newsRoute = '/news';
  static const String flashcardsRoute = '/flashcards';
  static const String communityRoute = '/community';
  static const String studyPlannerRoute = '/study-planner';
}
