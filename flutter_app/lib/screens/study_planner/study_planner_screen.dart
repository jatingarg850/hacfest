import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/api_service.dart';
import '../../models/study_plan.dart';

class StudyPlannerScreen extends StatefulWidget {
  const StudyPlannerScreen({super.key});

  @override
  State<StudyPlannerScreen> createState() => _StudyPlannerScreenState();
}

class _StudyPlannerScreenState extends State<StudyPlannerScreen> {
  final ApiService _api = ApiService();
  final _formKey = GlobalKey<FormState>();

  final List<String> _topics = [];
  final TextEditingController _topicController = TextEditingController();

  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now().add(const Duration(days: 30));
  double _dailyHours = 3.0;
  int _breakCount = 2;

  bool _isLoading = false;
  bool _isGenerating = false;
  StudyPlan? _generatedPlan;

  @override
  void initState() {
    super.initState();
    _loadExistingPlan();
  }

  Future<void> _loadExistingPlan() async {
    setState(() => _isLoading = true);
    try {
      final response = await _api.get('/study-plan');
      if (response['studyPlan'] != null) {
        setState(() {
          _generatedPlan = StudyPlan.fromJson(response['studyPlan']);
        });
      }
    } catch (e) {
      // No existing plan
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _generatePlan() async {
    if (!_formKey.currentState!.validate() || _topics.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one topic')),
      );
      return;
    }

    setState(() => _isGenerating = true);

    try {
      final response = await _api.post('/study-plan', {
        'topics': _topics,
        'startDate': _startDate.toIso8601String(),
        'endDate': _endDate.toIso8601String(),
        'dailyStudyHours': _dailyHours,
        'breakCount': _breakCount,
      });

      setState(() {
        _generatedPlan = StudyPlan.fromJson(response['studyPlan']);
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Study plan generated successfully!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      setState(() => _isGenerating = false);
    }
  }

  void _addTopic() {
    if (_topicController.text.isNotEmpty) {
      setState(() {
        _topics.add(_topicController.text);
        _topicController.clear();
      });
    }
  }

  void _removeTopic(int index) {
    setState(() {
      _topics.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Study Planner'),
        actions: [
          if (_generatedPlan != null)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () {
                setState(() {
                  _generatedPlan = null;
                });
              },
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _generatedPlan != null
              ? _buildPlanView()
              : _buildPlanForm(),
    );
  }

  Widget _buildPlanForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Create Your Study Plan',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'AI-powered personalized study schedule',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 24),

            // Topics Section
            const Text(
              'Topics to Study',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _topicController,
                    decoration: const InputDecoration(
                      hintText: 'Enter a topic (e.g., Mathematics)',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _addTopic(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.add_circle, size: 32),
                  color: Colors.blue,
                  onPressed: _addTopic,
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Topics List
            if (_topics.isNotEmpty)
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _topics.asMap().entries.map((entry) {
                  return Chip(
                    label: Text(entry.value),
                    deleteIcon: const Icon(Icons.close, size: 18),
                    onDeleted: () => _removeTopic(entry.key),
                  );
                }).toList(),
              ),
            const SizedBox(height: 24),

            // Date Range
            const Text(
              'Study Period',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildDateCard(
                    'Start Date',
                    _startDate,
                    () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: _startDate,
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (date != null) {
                        setState(() => _startDate = date);
                      }
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildDateCard(
                    'End Date',
                    _endDate,
                    () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: _endDate,
                        firstDate: _startDate,
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (date != null) {
                        setState(() => _endDate = date);
                      }
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Daily Hours
            const Text(
              'Daily Study Hours',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Hours per day:'),
                        Text(
                          '${_dailyHours.toStringAsFixed(1)} hours',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                      ],
                    ),
                    Slider(
                      value: _dailyHours,
                      min: 1,
                      max: 12,
                      divisions: 22,
                      label: '${_dailyHours.toStringAsFixed(1)} hours',
                      onChanged: (value) {
                        setState(() => _dailyHours = value);
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Break Count
            const Text(
              'Study Breaks',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Breaks per session:'),
                        Text(
                          '$_breakCount breaks',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                      ],
                    ),
                    Slider(
                      value: _breakCount.toDouble(),
                      min: 0,
                      max: 5,
                      divisions: 5,
                      label: '$_breakCount breaks',
                      onChanged: (value) {
                        setState(() => _breakCount = value.toInt());
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Generate Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: _isGenerating ? null : _generatePlan,
                icon: _isGenerating
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.auto_awesome),
                label: Text(
                  _isGenerating ? 'Generating...' : 'Generate Study Plan',
                  style: const TextStyle(fontSize: 16),
                ),
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateCard(String label, DateTime date, VoidCallback onTap) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                DateFormat('MMM dd, yyyy').format(date),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPlanView() {
    final plan = _generatedPlan!;
    final totalDays = plan.schedule.length;
    final completedDays = plan.schedule.where((s) => s.completed).length;
    final progress = totalDays > 0 ? completedDays / totalDays : 0.0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Progress Card
          Card(
            color: Colors.blue.shade50,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Your Progress',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  LinearProgressIndicator(
                    value: progress,
                    minHeight: 8,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('$completedDays / $totalDays days completed'),
                      Text(
                        '${(progress * 100).toStringAsFixed(0)}%',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Schedule
          const Text(
            'Daily Schedule',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),

          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: plan.schedule.length,
            itemBuilder: (context, index) {
              final day = plan.schedule[index];
              return _buildDayCard(day, index + 1);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDayCard(ScheduleDay day, int dayNumber) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final dayDate = DateTime(day.date.year, day.date.month, day.date.day);

    final isToday = dayDate.isAtSameMomentAs(today);
    final isPast = dayDate.isBefore(today);
    final isFuture = dayDate.isAfter(today);
    final canComplete = !day.completed && (isToday || isPast);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: day.completed
          ? Colors.green.shade50
          : isToday
              ? Colors.blue.shade50
              : isFuture
                  ? Colors.grey.shade50
                  : null,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: day.completed
              ? Colors.green
              : isToday
                  ? Colors.blue
                  : isFuture
                      ? Colors.grey.shade300
                      : Colors.orange.shade300,
          child: day.completed
              ? const Icon(Icons.check, color: Colors.white)
              : isFuture
                  ? Icon(Icons.lock, color: Colors.grey.shade600, size: 20)
                  : Text(
                      '$dayNumber',
                      style: TextStyle(
                        color: isToday ? Colors.white : Colors.black87,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                DateFormat('EEEE, MMM dd').format(day.date),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            if (isToday)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'TODAY',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            if (isFuture)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.grey.shade400,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'UPCOMING',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text('Topics: ${day.topics.join(", ")}'),
            Text('Duration: ${day.hours} hours'),
            if (day.description != null) Text(day.description!),
            if (isFuture && !day.completed)
              const Padding(
                padding: EdgeInsets.only(top: 4),
                child: Text(
                  '🔒 Available on this date',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
          ],
        ),
        trailing: canComplete
            ? IconButton(
                icon: const Icon(Icons.check_circle_outline),
                color: isToday ? Colors.blue : Colors.orange,
                onPressed: () => _markDayComplete(day),
                tooltip: 'Mark as complete',
              )
            : day.completed
                ? const Icon(Icons.check_circle, color: Colors.green)
                : null,
        isThreeLine: true,
      ),
    );
  }

  Future<void> _markDayComplete(ScheduleDay day) async {
    // Double check that the day can be completed
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final dayDate = DateTime(day.date.year, day.date.month, day.date.day);

    if (dayDate.isAfter(today)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cannot mark future days as complete!'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    try {
      await _api.patch(
        '/study-plan/${_generatedPlan!.id}/complete-day',
        {
          'date': DateFormat('yyyy-MM-dd').format(day.date)
        },
      );

      setState(() {
        day.completed = true;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.celebration, color: Colors.white),
                const SizedBox(width: 8),
                Text('Day ${DateFormat('MMM dd').format(day.date)} completed! 🎉'),
              ],
            ),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  void dispose() {
    _topicController.dispose();
    super.dispose();
  }
}
