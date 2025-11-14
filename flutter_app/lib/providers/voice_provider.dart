import 'package:flutter/foundation.dart';
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import '../services/agora_service.dart';
import '../services/api_service.dart';

class VoiceProvider with ChangeNotifier {
  final AgoraService _agoraService = AgoraService();
  final ApiService _api = ApiService();

  bool _isInitialized = false;
  bool _isInSession = false;
  bool _isSpeaking = false;
  String _currentPage = 'home';
  String? _error;

  bool get isInitialized => _isInitialized;
  bool get isInSession => _isInSession;
  bool get isSpeaking => _isSpeaking;
  String get currentPage => _currentPage;
  String? get error => _error;

  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      debugPrint('🎙️ Initializing Agora RTC Engine...');
      await _agoraService.initialize();

      _agoraService.registerEventHandler(
        RtcEngineEventHandler(
          onJoinChannelSuccess: (connection, elapsed) {
            debugPrint('✅ Successfully joined channel: ${connection.channelId}');
          },
          onUserJoined: (connection, remoteUid, elapsed) async {
            debugPrint('✅ AI Agent joined: $remoteUid');
            // CRITICAL: Explicitly unmute and set volume for AI agent (UID 999)
            if (remoteUid == 999) {
              debugPrint('🔊 Unmuting AI agent audio and setting playback volume...');
              await _agoraService.unmuteRemoteAudio(remoteUid);
              await _agoraService.setRemotePlaybackVolume(remoteUid, 100);
              await _agoraService.adjustPlaybackSignalVolume(100);
              debugPrint('✅ AI agent audio fully enabled: unmuted + volume=100');
            }
          },
          onUserOffline: (connection, remoteUid, reason) {
            debugPrint('👋 AI Agent left: $remoteUid (reason: $reason)');
          },
          onAudioVolumeIndication: (connection, speakers, speakerNumber, totalVolume) {
            if (totalVolume > 10) {
              debugPrint('🔊 Audio detected! Volume: $totalVolume');
              _isSpeaking = true;
            } else {
              _isSpeaking = false;
            }
            notifyListeners();
          },
          onError: (err, msg) {
            debugPrint('❌ Agora Error: $err - $msg');
            _error = 'Agora Error: $msg';
            notifyListeners();
          },
          onLocalAudioStateChanged: (connection, state, error) {
            debugPrint('🎤 Local audio state: $state error: $error');
          },
          onAudioDeviceStateChanged: (deviceId, deviceType, deviceState) {
            debugPrint('🎤 Audio device: $deviceType state: $deviceState');
          },
          onRemoteAudioStateChanged: (connection, remoteUid, state, reason, elapsed) async {
            debugPrint('🔊 Remote audio (AI): UID=$remoteUid state=$state reason=$reason');

            // Handle remote mute state - CRITICAL FIX
            if (remoteUid == 999 && state == RemoteAudioState.remoteAudioStateStopped) {
              if (reason == RemoteAudioStateReason.remoteAudioReasonRemoteMuted) {
                debugPrint('⚠️  AI agent reported as muted - forcing unmute!');
                await _agoraService.unmuteRemoteAudio(remoteUid);
                await _agoraService.setRemotePlaybackVolume(remoteUid, 100);
              } else if (reason == RemoteAudioStateReason.remoteAudioReasonNoPacketReceive) {
                debugPrint('⚠️  No audio packets from AI - check TTS/LLM config');
              }
            }

            if (state == RemoteAudioState.remoteAudioStateDecoding) {
              debugPrint('✅ AI is speaking!');
            }
          },
        ),
      );

      _isInitialized = true;
      debugPrint('✅ Agora RTC Engine initialized');
      notifyListeners();
    } catch (e) {
      debugPrint('❌ Failed to initialize Agora: $e');
      _error = 'Failed to initialize: $e';
      notifyListeners();
      rethrow;
    }
  }

  Future<void> startVoiceSession() async {
    if (!_isInitialized) await initialize();

    _error = null;

    try {
      debugPrint('🎙️ Starting voice session...');
      debugPrint('Current page: $_currentPage');

      await _agoraService.startVoiceSession(_currentPage);

      _isInSession = true;
      debugPrint('✅ Voice session started successfully');
      notifyListeners();
    } catch (e) {
      debugPrint('❌ Error starting voice session: $e');
      _error = 'Failed to start voice session: $e';
      _isInSession = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> stopVoiceSession() async {
    try {
      debugPrint('🛑 Stopping voice session...');
      await _agoraService.stopVoiceSession();
      _isInSession = false;
      _isSpeaking = false;
      _error = null;
      debugPrint('✅ Voice session stopped');
      notifyListeners();
    } catch (e) {
      debugPrint('❌ Error stopping voice session: $e');
      _error = 'Failed to stop voice session: $e';
      _isInSession = false;
      _isSpeaking = false;
      notifyListeners();
    }
  }

  void setCurrentPage(String page) {
    _currentPage = page;
    debugPrint('📍 Current page set to: $page');
    notifyListeners();
  }

  Future<Map<String, dynamic>> classifyIntent(String text) async {
    try {
      return await _api.post('/intent/classify', {
        'text': text,
        'currentPage': _currentPage,
      });
    } catch (e) {
      debugPrint('❌ Error classifying intent: $e');
      rethrow;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _agoraService.dispose();
    super.dispose();
  }
}
