import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/voice_provider.dart';
import '../../providers/navigation_provider.dart';
import '../../widgets/voice_button.dart';
import '../quiz/quiz_screen.dart';
import '../flashcards/flashcards_screen.dart';
import '../news/news_screen.dart';
import '../communities/community_screen.dart';

class HomeScreen
    extends
        StatefulWidget {
  const HomeScreen({
    Key? key,
  }) : super(
         key: key,
       );

  @override
  State<
    HomeScreen
  >
  createState() => _HomeScreenState();
}

class _HomeScreenState
    extends
        State<
          HomeScreen
        > {
  @override
  void
  initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (
        _,
      ) {
        context
            .read<
              VoiceProvider
            >()
            .initialize();
      },
    );
  }

  @override
  Widget
  build(
    BuildContext context,
  ) {
    return Consumer<
      NavigationProvider
    >(
      builder:
          (
            context,
            navProvider,
            _,
          ) {
            return Scaffold(
              appBar: AppBar(
                title: Text(
                  _getTitle(
                    navProvider.currentIndex,
                  ),
                ),
                actions: [
                  IconButton(
                    icon: const Icon(
                      Icons.account_circle,
                    ),
                    onPressed: () => _showProfileMenu(
                      context,
                    ),
                  ),
                ],
              ),
              body: _getBody(
                navProvider.currentIndex,
              ),
              bottomNavigationBar: BottomNavigationBar(
                currentIndex: navProvider.currentIndex,
                onTap: navProvider.navigateToIndex,
                type: BottomNavigationBarType.fixed,
                items: const [
                  BottomNavigationBarItem(
                    icon: Icon(
                      Icons.home,
                    ),
                    label: 'Home',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(
                      Icons.quiz,
                    ),
                    label: 'Quiz',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(
                      Icons.style,
                    ),
                    label: 'Flashcards',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(
                      Icons.newspaper,
                    ),
                    label: 'News',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(
                      Icons.people,
                    ),
                    label: 'Community',
                  ),
                ],
              ),
              floatingActionButton: const VoiceButton(),
            );
          },
    );
  }

  String
  _getTitle(
    int index,
  ) {
    switch (index) {
      case 0:
        return 'Study AI';
      case 1:
        return 'Quiz';
      case 2:
        return 'Flashcards';
      case 3:
        return 'News';
      case 4:
        return 'Community';
      default:
        return 'Study AI';
    }
  }

  Widget
  _getBody(
    int index,
  ) {
    switch (index) {
      case 0:
        return const HomeContent();
      case 1:
        return const QuizScreen();
      case 2:
        return const FlashcardsScreen();
      case 3:
        return const NewsScreen();
      case 4:
        return const CommunityScreen();
      default:
        return const HomeContent();
    }
  }

  void
  _showProfileMenu(
    BuildContext context,
  ) {
    showModalBottomSheet(
      context: context,
      builder:
          (
            context,
          ) =>
              Consumer<
                AuthProvider
              >(
                builder:
                    (
                      context,
                      auth,
                      _,
                    ) {
                      return Padding(
                        padding: const EdgeInsets.all(
                          16.0,
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            ListTile(
                              leading: const Icon(
                                Icons.person,
                              ),
                              title: Text(
                                auth.user?.name ??
                                    'User',
                              ),
                              subtitle: Text(
                                auth.user?.email ??
                                    '',
                              ),
                            ),
                            const Divider(),
                            ListTile(
                              leading: const Icon(
                                Icons.calendar_today,
                              ),
                              title: const Text(
                                'Study Planner',
                              ),
                              onTap: () {
                                Navigator.pop(
                                  context,
                                );
                                // Navigate to study planner
                              },
                            ),
                            ListTile(
                              leading: const Icon(
                                Icons.logout,
                              ),
                              title: const Text(
                                'Logout',
                              ),
                              onTap: () async {
                                await auth.logout();
                                if (context.mounted) {
                                  Navigator.pushReplacementNamed(
                                    context,
                                    '/login',
                                  );
                                }
                              },
                            ),
                          ],
                        ),
                      );
                    },
              ),
    );
  }
}

class HomeContent
    extends
        StatelessWidget {
  const HomeContent({
    Key? key,
  }) : super(
         key: key,
       );

  @override
  Widget
  build(
    BuildContext context,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(
        16.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Consumer<
            AuthProvider
          >(
            builder:
                (
                  context,
                  auth,
                  _,
                ) {
                  return Text(
                    'Welcome, ${auth.user?.name ?? 'Student'}!',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  );
                },
          ),
          const SizedBox(
            height: 8,
          ),
          const Text(
            'Tap the microphone to start talking with your AI study assistant',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          const SizedBox(
            height: 24,
          ),
          _buildFeatureCard(
            context,
            'Take a Quiz',
            'Test your knowledge with previous year questions',
            Icons.quiz,
            Colors.blue,
            () => context
                .read<
                  NavigationProvider
                >()
                .navigateToIndex(
                  1,
                ),
          ),
          _buildFeatureCard(
            context,
            'Review Flashcards',
            'Study with spaced repetition',
            Icons.style,
            Colors.green,
            () => context
                .read<
                  NavigationProvider
                >()
                .navigateToIndex(
                  2,
                ),
          ),
          _buildFeatureCard(
            context,
            'Latest News',
            'Stay updated with educational news',
            Icons.newspaper,
            Colors.orange,
            () => context
                .read<
                  NavigationProvider
                >()
                .navigateToIndex(
                  3,
                ),
          ),
          _buildFeatureCard(
            context,
            'Join Community',
            'Chat with fellow students',
            Icons.people,
            Colors.purple,
            () => context
                .read<
                  NavigationProvider
                >()
                .navigateToIndex(
                  4,
                ),
          ),
        ],
      ),
    );
  }

  Widget
  _buildFeatureCard(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(
        bottom: 16,
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(
            0.2,
          ),
          child: Icon(
            icon,
            color: color,
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(
          subtitle,
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 16,
        ),
        onTap: onTap,
      ),
    );
  }
}
