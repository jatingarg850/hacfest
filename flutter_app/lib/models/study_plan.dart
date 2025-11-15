class StudyPlan {
  final String id;
  final String userId;
  final List<Topic> topics;
  final DateTime startDate;
  final DateTime endDate;
  final double dailyStudyHours;
  final List<ScheduleDay> schedule;

  StudyPlan({
    required this.id,
    required this.userId,
    required this.topics,
    required this.startDate,
    required this.endDate,
    required this.dailyStudyHours,
    required this.schedule,
  });

  factory StudyPlan.fromJson(Map<String, dynamic> json) {
    return StudyPlan(
      id: json['_id'] ?? '',
      userId: json['userId'] ?? '',
      topics: (json['topics'] as List?)?.map((t) => Topic.fromJson(t)).toList() ?? [],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      dailyStudyHours: (json['dailyStudyHours'] ?? 0).toDouble(),
      schedule: (json['schedule'] as List?)?.map((s) => ScheduleDay.fromJson(s)).toList() ?? [],
    );
  }
}

class Topic {
  final String name;
  bool completed;

  Topic({
    required this.name,
    this.completed = false,
  });

  factory Topic.fromJson(Map<String, dynamic> json) {
    return Topic(
      name: json['name'] ?? '',
      completed: json['completed'] ?? false,
    );
  }
}

class ScheduleDay {
  final DateTime date;
  final List<String> topics;
  final double hours;
  final String? description;
  bool completed;

  ScheduleDay({
    required this.date,
    required this.topics,
    required this.hours,
    this.description,
    this.completed = false,
  });

  factory ScheduleDay.fromJson(Map<String, dynamic> json) {
    return ScheduleDay(
      date: DateTime.parse(json['date']),
      topics: List<String>.from(json['topics'] ?? []),
      hours: (json['hours'] ?? 0).toDouble(),
      description: json['description'],
      completed: json['completed'] ?? false,
    );
  }
}
