import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/quiz.dart';

class QuizScreen
    extends
        StatefulWidget {
  const QuizScreen({
    Key? key,
  }) : super(
         key: key,
       );

  @override
  State<
    QuizScreen
  >
  createState() => _QuizScreenState();
}

class _QuizScreenState
    extends
        State<
          QuizScreen
        > {
  final ApiService
  _api = ApiService();
  List<
    Quiz
  >
  _quizzes = [];
  bool
  _isLoading = true;

  @override
  void
  initState() {
    super.initState();
    _loadQuizzes();
  }

  Future<
    void
  >
  _loadQuizzes() async {
    try {
      final response = await _api.get(
        '/quizzes',
      );
      setState(
        () {
          _quizzes =
              (response['quizzes']
                      as List)
                  .map(
                    (
                      q,
                    ) => Quiz.fromJson(
                      q,
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
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(
          SnackBar(
            content: Text(
              'Error loading quizzes: $e',
            ),
          ),
        );
      }
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

    if (_quizzes.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.quiz,
              size: 64,
              color: Colors.grey,
            ),
            const SizedBox(
              height: 16,
            ),
            const Text(
              'No quizzes available yet',
            ),
            const SizedBox(
              height: 8,
            ),
            const Text(
              'Ask your AI assistant to create one!',
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(
        16,
      ),
      itemCount: _quizzes.length,
      itemBuilder:
          (
            context,
            index,
          ) {
            final quiz = _quizzes[index];
            return Card(
              margin: const EdgeInsets.only(
                bottom: 16,
              ),
              child: ListTile(
                leading: CircleAvatar(
                  child: Text(
                    '${quiz.year}',
                  ),
                ),
                title: Text(
                  quiz.title,
                ),
                subtitle: Text(
                  '${quiz.subject} • ${quiz.questions.length} questions',
                ),
                trailing: Chip(
                  label: Text(
                    quiz.difficulty,
                  ),
                  backgroundColor: _getDifficultyColor(
                    quiz.difficulty,
                  ),
                ),
                onTap: () => _startQuiz(
                  quiz,
                ),
              ),
            );
          },
    );
  }

  Color
  _getDifficultyColor(
    String difficulty,
  ) {
    switch (difficulty) {
      case 'easy':
        return Colors.green.shade100;
      case 'medium':
        return Colors.orange.shade100;
      case 'hard':
        return Colors.red.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  void
  _startQuiz(
    Quiz quiz,
  ) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (
              context,
            ) => QuizTakingScreen(
              quiz: quiz,
            ),
      ),
    );
  }
}

class QuizTakingScreen
    extends
        StatefulWidget {
  final Quiz
  quiz;

  const QuizTakingScreen({
    Key? key,
    required this.quiz,
  }) : super(
         key: key,
       );

  @override
  State<
    QuizTakingScreen
  >
  createState() => _QuizTakingScreenState();
}

class _QuizTakingScreenState
    extends
        State<
          QuizTakingScreen
        > {
  int
  _currentQuestion = 0;
  final List<
    int?
  >
  _answers = [];

  @override
  void
  initState() {
    super.initState();
    _answers.addAll(
      List.filled(
        widget.quiz.questions.length,
        null,
      ),
    );
  }

  @override
  Widget
  build(
    BuildContext context,
  ) {
    final question = widget.quiz.questions[_currentQuestion];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Question ${_currentQuestion + 1}/${widget.quiz.questions.length}',
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(
          16.0,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            LinearProgressIndicator(
              value:
                  (_currentQuestion +
                      1) /
                  widget.quiz.questions.length,
            ),
            const SizedBox(
              height: 24,
            ),
            Text(
              question.question,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(
              height: 24,
            ),
            ...List.generate(
              question.options.length,
              (
                index,
              ) {
                return Padding(
                  padding: const EdgeInsets.only(
                    bottom: 12,
                  ),
                  child: OutlinedButton(
                    onPressed: () {
                      setState(
                        () {
                          _answers[_currentQuestion] = index;
                        },
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.all(
                        16,
                      ),
                      backgroundColor:
                          _answers[_currentQuestion] ==
                              index
                          ? Colors.blue.shade50
                          : null,
                    ),
                    child: Text(
                      question.options[index],
                    ),
                  ),
                );
              },
            ),
            const Spacer(),
            Row(
              children: [
                if (_currentQuestion >
                    0)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setState(
                          () => _currentQuestion--,
                        );
                      },
                      child: const Text(
                        'Previous',
                      ),
                    ),
                  ),
                if (_currentQuestion >
                    0)
                  const SizedBox(
                    width: 16,
                  ),
                Expanded(
                  child: ElevatedButton(
                    onPressed:
                        _answers[_currentQuestion] !=
                            null
                        ? () {
                            if (_currentQuestion <
                                widget.quiz.questions.length -
                                    1) {
                              setState(
                                () => _currentQuestion++,
                              );
                            } else {
                              _submitQuiz();
                            }
                          }
                        : null,
                    child: Text(
                      _currentQuestion <
                              widget.quiz.questions.length -
                                  1
                          ? 'Next'
                          : 'Submit',
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<
    void
  >
  _submitQuiz() async {
    // Submit quiz logic
    Navigator.pop(
      context,
    );
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(
      const SnackBar(
        content: Text(
          'Quiz submitted!',
        ),
      ),
    );
  }
}
