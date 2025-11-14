class Quiz {
  final String
  id;
  final String
  title;
  final String
  subject;
  final int
  year;
  final List<
    Question
  >
  questions;
  final String
  difficulty;

  Quiz({
    required this.id,
    required this.title,
    required this.subject,
    required this.year,
    required this.questions,
    required this.difficulty,
  });

  factory Quiz.fromJson(
    Map<
      String,
      dynamic
    >
    json,
  ) {
    return Quiz(
      id: json['_id'],
      title: json['title'],
      subject: json['subject'],
      year: json['year'],
      questions:
          (json['questions']
                  as List)
              .map(
                (
                  q,
                ) => Question.fromJson(
                  q,
                ),
              )
              .toList(),
      difficulty: json['difficulty'],
    );
  }
}

class Question {
  final String
  question;
  final List<
    String
  >
  options;
  final int?
  correctAnswer;
  final String?
  explanation;

  Question({
    required this.question,
    required this.options,
    this.correctAnswer,
    this.explanation,
  });

  factory Question.fromJson(
    Map<
      String,
      dynamic
    >
    json,
  ) {
    return Question(
      question: json['question'],
      options:
          List<
            String
          >.from(
            json['options'],
          ),
      correctAnswer: json['correctAnswer'],
      explanation: json['explanation'],
    );
  }
}
