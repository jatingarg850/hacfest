import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/voice_provider.dart';
import '../../providers/navigation_provider.dart';
import '../../widgets/voice_button.dart';
import '../../services/api_service.dart';
import '../../models/flashcard.dart';
import '../quiz/quiz_screen.dart';
import '../flashcards/flashcards_screen.dart';
import '../news/news_screen.dart';
import '../communities/community_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({
    Key? key,
  }) : super(
          key: key,
        );

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (
        _,
      ) {
        context.read<VoiceProvider>().initialize();
      },
    );
  }

  @override
  Widget build(
    BuildContext context,
  ) {
    return Consumer<NavigationProvider>(
      builder: (
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
          floatingActionButton: navProvider.currentIndex == 4 ? null : const VoiceButton(),
        );
      },
    );
  }

  String _getTitle(
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

  Widget _getBody(
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

  void _showProfileMenu(
    BuildContext context,
  ) {
    showModalBottomSheet(
      context: context,
      builder: (
        context,
      ) =>
          Consumer<AuthProvider>(
        builder: (
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
                    auth.user?.name ?? 'User',
                  ),
                  subtitle: Text(
                    auth.user?.email ?? '',
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
                    Navigator.pop(context);
                    Navigator.pushNamed(context, '/study-planner');
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

class HomeContent extends StatefulWidget {
  const HomeContent({
    Key? key,
  }) : super(
          key: key,
        );

  @override
  State<HomeContent> createState() => _HomeContentState();
}

class _HomeContentState extends State<HomeContent> {
  final ApiService _api = ApiService();
  List<Flashcard> _flashcards = [];
  bool _isLoadingFlashcards = true;

  @override
  void initState() {
    super.initState();
    _loadFlashcards();
  }

  Future<void> _loadFlashcards() async {
    try {
      final response = await _api.get('/flashcards');
      if (mounted) {
        setState(() {
          _flashcards = (response['flashcards'] as List).map((f) => Flashcard.fromJson(f)).toList();
          _isLoadingFlashcards = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingFlashcards = false);
      }
    }
  }

  @override
  Widget build(
    BuildContext context,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(
        16.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Consumer<AuthProvider>(
            builder: (
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
          if (_flashcards.isNotEmpty) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Your Flashcards',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () => context.read<NavigationProvider>().navigateToIndex(2),
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildFlashcardCarousel(),
            const SizedBox(height: 24),
          ],
          _buildFeatureCard(
            context,
            'Take a Quiz',
            'Test your knowledge with previous year questions',
            Icons.quiz,
            Colors.blue,
            () => context.read<NavigationProvider>().navigateToIndex(
                  1,
                ),
          ),
          _buildFeatureCard(
            context,
            'Review Flashcards',
            'Study with spaced repetition',
            Icons.style,
            Colors.green,
            () => context.read<NavigationProvider>().navigateToIndex(
                  2,
                ),
          ),
          _buildFeatureCard(
            context,
            'Latest News',
            'Stay updated with educational news',
            Icons.newspaper,
            Colors.orange,
            () => context.read<NavigationProvider>().navigateToIndex(
                  3,
                ),
          ),
          _buildFeatureCard(
            context,
            'Join Community',
            'Chat with fellow students',
            Icons.people,
            Colors.purple,
            () => context.read<NavigationProvider>().navigateToIndex(
                  4,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildFlashcardCarousel() {
    final displayCards = _flashcards.length > 5 ? _flashcards.sublist(0, 5) : _flashcards;

    return SizedBox(
      height: 200,
      child: PageView.builder(
        controller: PageController(viewportFraction: 0.85),
        itemCount: displayCards.length,
        itemBuilder: (context, index) {
          final flashcard = displayCards[index];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: _buildFlashcardCard(flashcard),
          );
        },
      ),
    );
  }

  Widget _buildFlashcardCard(Flashcard flashcard) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.blue.shade400,
              Colors.purple.shade400,
            ],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Chip(
                  label: Text(
                    flashcard.subject,
                    style: const TextStyle(fontSize: 12),
                  ),
                  backgroundColor: Colors.white,
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${flashcard.reviewCount} reviews',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: Center(
                child: Text(
                  flashcard.front,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Center(
              child: Text(
                'Tap to review',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureCard(
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
