class StudyPlan {
  final String
  id;
  final List<
    Topic
  >
  topics;
  final DateTime
  startDate;
  final DateTime
  endDate;
  final int
  dailyStudyHours;
  final List<
    DaySchedule
  >
  schedule;

  StudyPlan({
    required this.id,
    required this.topics,
    required this.startDate,
    required this.endDate,
    required this.dailyStudyHours,
    required this.schedule,
  });

  factory StudyPlan.fromJson(
    Map<
      String,
      dynamic
    >
    json,
  ) {
    return StudyPlan(
      id: json['_id'],
      topics:
          (json['topics']
                  as List)
              .map(
                (
                  t,
                ) => Topic.fromJson(
                  t,
                ),
              )
              .toList(),
      startDate: DateTime.parse(
        json['startDate'],
      ),
      endDate: DateTime.parse(
        json['endDate'],
      ),
      dailyStudyHours: json['dailyStudyHours'],
      schedule:
          (json['schedule']
                  as List)
              .map(
                (
                  s,
                ) => DaySchedule.fromJson(
                  s,
                ),
              )
              .toList(),
    );
  }
}

class Topic {
  final String
  name;
  final bool
  completed;

  Topic({
    required this.name,
    required this.completed,
  });

  factory Topic.fromJson(
    Map<
      String,
      dynamic
    >
    json,
  ) {
    return Topic(
      name: json['name'],
      completed:
          json['completed'] ??
          false,
    );
  }
}

class DaySchedule {
  final DateTime
  date;
  final List<
    String
  >
  topics;
  final int
  hours;
  final bool
  completed;

  DaySchedule({
    required this.date,
    required this.topics,
    required this.hours,
    required this.completed,
  });

  factory DaySchedule.fromJson(
    Map<
      String,
      dynamic
    >
    json,
  ) {
    return DaySchedule(
      date: DateTime.parse(
        json['date'],
      ),
      topics:
          List<
            String
          >.from(
            json['topics'],
          ),
      hours: json['hours'],
      completed:
          json['completed'] ??
          false,
    );
  }
}
