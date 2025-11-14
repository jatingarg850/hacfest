class Flashcard {
  final String
  id;
  final String
  front;
  final String
  back;
  final String
  subject;
  final int
  difficulty;
  final DateTime
  nextReview;
  final int
  reviewCount;

  Flashcard({
    required this.id,
    required this.front,
    required this.back,
    required this.subject,
    required this.difficulty,
    required this.nextReview,
    required this.reviewCount,
  });

  factory Flashcard.fromJson(
    Map<
      String,
      dynamic
    >
    json,
  ) {
    return Flashcard(
      id: json['_id'],
      front: json['front'],
      back: json['back'],
      subject: json['subject'],
      difficulty:
          json['difficulty'] ??
          0,
      nextReview: DateTime.parse(
        json['nextReview'],
      ),
      reviewCount:
          json['reviewCount'] ??
          0,
    );
  }
}
