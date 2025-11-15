import 'package:flutter/material.dart';

class VoiceNavigationService {
  void handleNavigationCommand(BuildContext context, String action) {
    debugPrint('🎯 Handling navigation: $action');

    switch (action) {
      case 'open_quiz':
        _navigateToIndex(context, 1);
        break;
      case 'open_flashcards':
        _navigateToIndex(context, 2);
        break;
      case 'open_news':
        _navigateToIndex(context, 3);
        break;
      case 'open_community':
        _navigateToIndex(context, 4);
        break;
      case 'go_home':
        _navigateToIndex(context, 0);
        break;
      case 'go_back':
        Navigator.of(context).maybePop();
        break;
      case 'open_study_planner':
        Navigator.of(context).pushNamed('/study-planner');
        break;
      default:
        debugPrint('⚠️  Unknown navigation action: $action');
    }
  }

  void _navigateToIndex(BuildContext context, int index) {
    // This will be handled by NavigationProvider
    debugPrint('📍 Navigating to index: $index');
    // The actual navigation will be triggered by the provider
  }

  String? detectNavigationIntent(String text) {
    final lower = text.toLowerCase();

    if (lower.contains('quiz') || lower.contains('test')) {
      return 'open_quiz';
    }
    if (lower.contains('flashcard') || lower.contains('flash card')) {
      return 'open_flashcards';
    }
    if (lower.contains('news')) {
      return 'open_news';
    }
    if (lower.contains('community') || lower.contains('chat')) {
      return 'open_community';
    }
    if (lower.contains('home') || lower.contains('main')) {
      return 'go_home';
    }
    if (lower.contains('back') || lower.contains('previous')) {
      return 'go_back';
    }
    if (lower.contains('plan') || lower.contains('schedule')) {
      return 'open_study_planner';
    }

    return null;
  }
}
