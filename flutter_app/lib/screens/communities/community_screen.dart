import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/socket_service.dart';
import '../../providers/auth_provider.dart';

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({
    Key? key,
  }) : super(
          key: key,
        );

  @override
  State<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends State<CommunityScreen> {
  final SocketService _socket = SocketService();
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<dynamic> _messages = [];
  final String _roomId = 'general';

  @override
  void initState() {
    super.initState();
    _initializeChat();
  }

  void _initializeChat() {
    print('🔌 Connecting to socket...');
    _socket.connect();

    final user = context.read<AuthProvider>().user;
    if (user != null) {
      print('👤 Joining room as: ${user.name} (${user.id})');
      _socket.joinRoom(
        _roomId,
        user.id,
        user.name,
      );
    }

    _socket.onPreviousMessages(
      (
        messages,
      ) {
        print('📜 Received ${messages.length} previous messages');
        if (mounted) {
          setState(
            () {
              _messages.clear();
              _messages.addAll(
                messages,
              );
            },
          );
          _scrollToBottom();
        }
      },
    );

    _socket.onNewMessage(
      (
        message,
      ) {
        print('📨 New message received: $message');
        if (mounted) {
          setState(
            () {
              _messages.add(
                message,
              );
            },
          );
          _scrollToBottom();
        }
      },
    );
  }

  @override
  void dispose() {
    print('🔌 Disconnecting socket...');
    _socket.disconnect();
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(
    BuildContext context,
  ) {
    return Column(
      children: [
        Expanded(
          child: _messages.isEmpty
              ? const Center(
                  child: Text(
                    'No messages yet. Start chatting!',
                  ),
                )
              : ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(
                    16,
                  ),
                  itemCount: _messages.length,
                  itemBuilder: (
                    context,
                    index,
                  ) {
                    final message = _messages[index];
                    final isMe = message['userId'] == context.read<AuthProvider>().user?.id;

                    return Align(
                      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.only(
                          bottom: 8,
                        ),
                        padding: const EdgeInsets.all(
                          12,
                        ),
                        decoration: BoxDecoration(
                          color: isMe ? Colors.blue : Colors.grey.shade200,
                          borderRadius: BorderRadius.circular(
                            12,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (!isMe)
                              Text(
                                message['userName'],
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            Text(
                              message['content'],
                              style: TextStyle(
                                color: isMe ? Colors.white : Colors.black,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
        Container(
          padding: const EdgeInsets.all(
            16,
          ),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.grey.shade300,
                blurRadius: 4,
                offset: const Offset(
                  0,
                  -2,
                ),
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _messageController,
                  decoration: const InputDecoration(
                    hintText: 'Type a message...',
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              const SizedBox(
                width: 8,
              ),
              IconButton(
                onPressed: _sendMessage,
                icon: const Icon(
                  Icons.send,
                ),
                color: Colors.blue,
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    final message = _messageController.text.trim();
    print('📤 Sending message: $message to room: $_roomId');

    _socket.sendMessage(
      _roomId,
      message,
    );
    _messageController.clear();
  }
}
