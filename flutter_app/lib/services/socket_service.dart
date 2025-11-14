import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../config/constants.dart';

class SocketService {
  static final SocketService
  _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket?
  _socket;
  bool
  _isConnected = false;

  void
  connect() {
    _socket = IO.io(
      AppConstants.socketUrl,
      <
        String,
        dynamic
      >{
        'transports': [
          'websocket',
        ],
        'autoConnect': true,
      },
    );

    _socket!.onConnect(
      (
        _,
      ) {
        print(
          'Socket connected',
        );
        _isConnected = true;
      },
    );

    _socket!.onDisconnect(
      (
        _,
      ) {
        print(
          'Socket disconnected',
        );
        _isConnected = false;
      },
    );
  }

  void
  joinRoom(
    String roomId,
    String userId,
    String userName,
  ) {
    _socket!.emit(
      'join-room',
      {
        'roomId': roomId,
        'userId': userId,
        'userName': userName,
      },
    );
  }

  void
  sendMessage(
    String roomId,
    String content, {
    String type = 'text',
  }) {
    _socket!.emit(
      'send-message',
      {
        'roomId': roomId,
        'content': content,
        'type': type,
      },
    );
  }

  void
  onNewMessage(
    Function(
      dynamic,
    )
    callback,
  ) {
    _socket!.on(
      'new-message',
      callback,
    );
  }

  void
  onPreviousMessages(
    Function(
      dynamic,
    )
    callback,
  ) {
    _socket!.on(
      'previous-messages',
      callback,
    );
  }

  void
  disconnect() {
    _socket?.disconnect();
    _isConnected = false;
  }

  bool
  get isConnected => _isConnected;
}
