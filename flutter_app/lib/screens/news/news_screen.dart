import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class NewsScreen extends StatefulWidget {
  const NewsScreen({
    Key? key,
  }) : super(
          key: key,
        );

  @override
  State<NewsScreen> createState() => _NewsScreenState();
}

class _NewsScreenState extends State<NewsScreen> {
  final ApiService _api = ApiService();
  List<dynamic> _news = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNews();
  }

  Future<void> _loadNews() async {
    try {
      final response = await _api.get(
        '/news',
      );
      setState(
        () {
          _news = response['news'];
          _isLoading = false;
        },
      );
    } catch (e) {
      setState(
        () => _isLoading = false,
      );
    }
  }

  @override
  Widget build(
    BuildContext context,
  ) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadNews,
      child: ListView.builder(
        padding: const EdgeInsets.all(
          16,
        ),
        itemCount: _news.length,
        itemBuilder: (
          context,
          index,
        ) {
          final article = _news[index];
          return Card(
            margin: const EdgeInsets.only(
              bottom: 16,
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (article['imageUrl'] != null)
                  Image.network(
                    article['imageUrl'],
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 200,
                        color: Colors.grey.shade200,
                        child: const Icon(
                          Icons.image,
                          size: 64,
                          color: Colors.grey,
                        ),
                      );
                    },
                  ),
                Padding(
                  padding: const EdgeInsets.all(
                    16.0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        article['title'],
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      Text(
                        article['summary'],
                        style: TextStyle(
                          color: Colors.grey.shade700,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      Row(
                        children: [
                          Chip(
                            label: Text(
                              article['category'],
                              style: const TextStyle(fontSize: 12),
                            ),
                            backgroundColor: _getCategoryColor(article['category']),
                          ),
                          const SizedBox(width: 8),
                          if (article['readTime'] != null)
                            Text(
                              article['readTime'],
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          const Spacer(),
                          Text(
                            _formatDate(
                              article['date'],
                            ),
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  String _formatDate(
    String date,
  ) {
    final dt = DateTime.parse(
      date,
    );
    return '${dt.day}/${dt.month}/${dt.year}';
  }
}

Color _getCategoryColor(String category) {
  switch (category) {
    case 'study-tips':
      return Colors.green.shade100;
    case 'technology':
      return Colors.blue.shade100;
    case 'education':
      return Colors.purple.shade100;
    case 'health':
      return Colors.orange.shade100;
    default:
      return Colors.grey.shade100;
  }
}
