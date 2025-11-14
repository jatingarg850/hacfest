import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class NewsScreen
    extends
        StatefulWidget {
  const NewsScreen({
    Key? key,
  }) : super(
         key: key,
       );

  @override
  State<
    NewsScreen
  >
  createState() => _NewsScreenState();
}

class _NewsScreenState
    extends
        State<
          NewsScreen
        > {
  final ApiService
  _api = ApiService();
  List<
    dynamic
  >
  _news = [];
  bool
  _isLoading = true;

  @override
  void
  initState() {
    super.initState();
    _loadNews();
  }

  Future<
    void
  >
  _loadNews() async {
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

    return RefreshIndicator(
      onRefresh: _loadNews,
      child: ListView.builder(
        padding: const EdgeInsets.all(
          16,
        ),
        itemCount: _news.length,
        itemBuilder:
            (
              context,
              index,
            ) {
              final article = _news[index];
              return Card(
                margin: const EdgeInsets.only(
                  bottom: 16,
                ),
                child: Padding(
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
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      Row(
                        children: [
                          Chip(
                            label: Text(
                              article['category'],
                            ),
                            backgroundColor: Colors.blue.shade50,
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
              );
            },
      ),
    );
  }

  String
  _formatDate(
    String date,
  ) {
    final dt = DateTime.parse(
      date,
    );
    return '${dt.day}/${dt.month}/${dt.year}';
  }
}
