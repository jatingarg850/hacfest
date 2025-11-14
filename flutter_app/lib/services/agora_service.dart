import 'package:flutter/foundation.dart';
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import '../config/constants.dart';
import 'api_service.dart';

class AgoraService {
  RtcEngine? _engine;
  final ApiService _api = ApiService();

  String? _channelName;
  String? _sessionId;
  int? _uid;
  bool _isJoined = false;

  Future<void> initialize() async {
    try {
      debugPrint('🎙️ Creating Agora RTC Engine...');
      _engine = createAgoraRtcEngine();

      await _engine!.initialize(const RtcEngineContext(
        appId: AppConstants.agoraAppId,
        channelProfile: ChannelProfileType.channelProfileCommunication,
      ));

      debugPrint('🔊 Enabling audio...');
      await _engine!.enableAudio();

      debugPrint('👤 Setting client role to broadcaster...');
      await _engine!.setClientRole(role: ClientRoleType.clientRoleBroadcaster);

      // Enable audio volume indication
      await _engine!.enableAudioVolumeIndication(
        interval: 200,
        smooth: 3,
        reportVad: true,
      );

      debugPrint('✅ Agora RTC Engine initialized successfully');
    } catch (e) {
      debugPrint('❌ Failed to initialize Agora RTC Engine: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> startVoiceSession(String currentPage) async {
    try {
      debugPrint('📡 Requesting voice session from backend...');
      debugPrint('Current page: $currentPage');

      final response = await _api.post('/voice/start', {
        'currentPage': currentPage,
      });

      debugPrint('✅ Backend response received');
      debugPrint('Channel: ${response['channelName']}');
      debugPrint('Session ID: ${response['sessionId']}');
      debugPrint('Agent ID: ${response['agentId']}');

      _channelName = response['channelName'];
      _sessionId = response['sessionId'];
      final token = response['userToken'];
      _uid = 0; // Let Agora assign UID

      debugPrint('🔗 Joining Agora channel...');
      debugPrint('Channel: $_channelName');
      debugPrint('UID: $_uid');

      // CRITICAL: Enable local audio BEFORE joining
      debugPrint('🎤 Enabling local audio...');
      await _engine!.enableLocalAudio(true);
      await _engine!.muteLocalAudioStream(false);

      // Enable remote audio subscription
      await _engine!.muteAllRemoteAudioStreams(false);
      debugPrint('✅ Local audio enabled and remote audio subscription enabled');

      await _engine!.joinChannel(
        token: token,
        channelId: _channelName!,
        uid: _uid!,
        options: const ChannelMediaOptions(
          channelProfile: ChannelProfileType.channelProfileCommunication,
          clientRoleType: ClientRoleType.clientRoleBroadcaster,
          autoSubscribeAudio: true,
          publishMicrophoneTrack: true,
          publishCameraTrack: false,
          autoSubscribeVideo: false,
        ),
      );

      _isJoined = true;
      debugPrint('✅ Successfully joined channel');

      return response;
    } catch (e) {
      debugPrint('❌ Failed to start voice session: $e');
      rethrow;
    }
  }

  Future<void> stopVoiceSession() async {
    try {
      debugPrint('🛑 Stopping voice session...');

      if (_sessionId != null) {
        debugPrint('📡 Notifying backend to stop agent...');
        try {
          await _api.post('/voice/stop', {
            'sessionId': _sessionId
          });
          debugPrint('✅ Backend notified');
        } catch (e) {
          debugPrint('⚠️  Failed to notify backend: $e');
        }
      }

      if (_isJoined && _engine != null) {
        debugPrint('👋 Leaving Agora channel...');
        await _engine!.leaveChannel();
        _isJoined = false;
        debugPrint('✅ Left channel');
      }

      _channelName = null;
      _sessionId = null;
      _uid = null;

      debugPrint('✅ Voice session stopped successfully');
    } catch (e) {
      debugPrint('❌ Error stopping voice session: $e');
      rethrow;
    }
  }

  void registerEventHandler(RtcEngineEventHandler handler) {
    if (_engine != null) {
      _engine!.registerEventHandler(handler);
      debugPrint('✅ Event handler registered');
    }
  }

  Future<void> dispose() async {
    try {
      debugPrint('🧹 Disposing Agora service...');
      await stopVoiceSession();
      if (_engine != null) {
        await _engine!.release();
        debugPrint('✅ Agora RTC Engine released');
      }
    } catch (e) {
      debugPrint('❌ Error disposing Agora service: $e');
    }
  }

  Future<void> unmuteRemoteAudio(int uid) async {
    if (_engine != null) {
      await _engine!.muteRemoteAudioStream(uid: uid, mute: false);
      debugPrint('✅ Unmuted remote audio for UID: $uid');
    }
  }

  bool get isJoined => _isJoined;
  String? get channelName => _channelName;
  String? get sessionId => _sessionId;
}
