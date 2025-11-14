import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/flashcard.dart';

class FlashcardsScreen
    extends
        StatefulWidget {
  const FlashcardsScreen({
    Key? key,
  }) : super(
         key: key,
       );

  @override
  State<
    FlashcardsScreen
  >
  createState() => _FlashcardsScreenState();
}

class _FlashcardsScreenState
    extends
        State<
          FlashcardsScreen
        > {
  final ApiService
  _api = ApiService();
  List<
    Flashcard
  >
  _flashcards = [];
  bool
  _isLoading = true;

  @override
  void
  initState() {
    super.initState();
    _loadFlashcards();
  }

  Future<
    void
  >
  _loadFlashcards() async {
    try {
      final response = await _api.get(
        '/flashcards',
      );
      setState(
        () {
          _flashcards =
              (response['flashcards']
                      as List)
                  .map(
                    (
                      f,
                    ) => Flashcard.fromJson(
                      f,
                    ),
                  )
                  .toList();
          _isLoading = false;
        },
      );
    } catch (
      e
    ) {
      setState(
        () => _isLoading = false,
      );
    }
  }

  @override
  Widget
  build(
    BuildContext context,
  ) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_flashcards.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.style,
              size: 64,
              color: Colors.grey,
            ),
            const SizedBox(
              height: 16,
            ),
            const Text(
              'No flashcards yet',
            ),
            const SizedBox(
              height: 8,
            ),
            ElevatedButton.icon(
              onPressed: _showCreateDialog,
              icon: const Icon(
                Icons.add,
              ),
              label: const Text(
                'Create Flashcard',
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(
            16.0,
          ),
          child: ElevatedButton.icon(
            onPressed: _showCreateDialog,
            icon: const Icon(
              Icons.add,
            ),
            label: const Text(
              'Create Flashcard',
            ),
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(
              16,
            ),
            itemCount: _flashcards.length,
            itemBuilder:
                (
                  context,
                  index,
                ) {
                  final card = _flashcards[index];
                  return FlashcardWidget(
                    flashcard: card,
                    onReview: () => _reviewCard(
                      card,
                    ),
                  );
                },
          ),
        ),
      ],
    );
  }

  void
  _showCreateDialog() {
    final frontController = TextEditingController();
    final backController = TextEditingController();
    final subjectController = TextEditingController();

    showDialog(
      context: context,
      builder:
          (
            context,
          ) => AlertDialog(
            title: const Text(
              'Create Flashcard',
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: frontController,
                  decoration: const InputDecoration(
                    labelText: 'Front',
                  ),
                ),
                TextField(
                  controller: backController,
                  decoration: const InputDecoration(
                    labelText: 'Back',
                  ),
                ),
                TextField(
                  controller: subjectController,
                  decoration: const InputDecoration(
                    labelText: 'Subject',
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(
                  context,
                ),
                child: const Text(
                  'Cancel',
                ),
              ),
              ElevatedButton(
                onPressed: () async {
                  await _api.post(
                    '/flashcards',
                    {
                      'front': frontController.text,
                      'back': backController.text,
                      'subject': subjectController.text,
                    },
                  );
                  if (context.mounted)
                    Navigator.pop(
                      context,
                    );
                  _loadFlashcards();
                },
                child: const Text(
                  'Create',
                ),
              ),
            ],
          ),
    );
  }

  Future<
    void
  >
  _reviewCard(
    Flashcard card,
  ) async {
    // Review logic
  }
}

class FlashcardWidget
    extends
        StatefulWidget {
  final Flashcard
  flashcard;
  final VoidCallback
  onReview;

  const FlashcardWidget({
    Key? key,
    required this.flashcard,
    required this.onReview,
  }) : super(
         key: key,
       );

  @override
  State<
    FlashcardWidget
  >
  createState() => _FlashcardWidgetState();
}

class _FlashcardWidgetState
    extends
        State<
          FlashcardWidget
        > {
  bool
  _showBack = false;

  @override
  Widget
  build(
    BuildContext context,
  ) {
    return Card(
      margin: const EdgeInsets.only(
        bottom: 16,
      ),
      child: InkWell(
        onTap: () => setState(
          () => _showBack = !_showBack,
        ),
        child: Padding(
          padding: const EdgeInsets.all(
            16.0,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Chip(
                    label: Text(
                      widget.flashcard.subject,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    'Reviews: ${widget.flashcard.reviewCount}',
                  ),
                ],
              ),
              const SizedBox(
                height: 16,
              ),
              Text(
                _showBack
                    ? widget.flashcard.back
                    : widget.flashcard.front,
                style: const TextStyle(
                  fontSize: 16,
                ),
              ),
              const SizedBox(
                height: 8,
              ),
              Text(
                _showBack
                    ? 'Tap to see front'
                    : 'Tap to see back',
                style: const TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
