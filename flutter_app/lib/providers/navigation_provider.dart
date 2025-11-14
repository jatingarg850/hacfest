import 'package:flutter/material.dart';

class NavigationProvider
    with
        ChangeNotifier {
  int
  _currentIndex = 0;
  String
  _currentRoute = 'home';

  int
  get currentIndex => _currentIndex;
  String
  get currentRoute => _currentRoute;

  void
  navigateToIndex(
    int index,
  ) {
    _currentIndex = index;

    // Map index to route
    switch (index) {
      case 0:
        _currentRoute = 'home';
        break;
      case 1:
        _currentRoute = 'quiz';
        break;
      case 2:
        _currentRoute = 'flashcard';
        break;
      case 3:
        _currentRoute = 'news';
        break;
      case 4:
        _currentRoute = 'community';
        break;
    }

    notifyListeners();
  }

  void
  navigateToRoute(
    String route,
  ) {
    _currentRoute = route;

    // Map route to index
    switch (route) {
      case 'home':
        _currentIndex = 0;
        break;
      case 'quiz':
        _currentIndex = 1;
        break;
      case 'flashcard':
        _currentIndex = 2;
        break;
      case 'news':
        _currentIndex = 3;
        break;
      case 'community':
        _currentIndex = 4;
        break;
    }

    notifyListeners();
  }
}
