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
      // If already initialized, release first
      if (_engine != null) {
        debugPrint('⚠️  Engine already exists, releasing...');
        try {
          await _engine!.release();
        } catch (e) {
          debugPrint('⚠️  Error releasing engine: $e');
        }
        _engine = null;
        await Future.delayed(const Duration(milliseconds: 500));
      }

      debugPrint('🎙️ Creating Agora RTC Engine...');
      _engine = createAgoraRtcEngine();

      await _engine!.initialize(const RtcEngineContext(
        appId: AppConstants.agoraAppId,
        channelProfile: ChannelProfileType.channelProfileCommunication,
      ));

      // Enable verbose logging for debugging
      debugPrint('📝 Setting log level to INFO for debugging...');
      await _engine!.setLogLevel(LogLevel.logLevelInfo);

      debugPrint('🔊 Enabling audio...');
      await _engine!.enableAudio();

      debugPrint('👤 Setting client role to broadcaster...');
      await _engine!.setClientRole(role: ClientRoleType.clientRoleBroadcaster);

      // CRITICAL: Set audio profile for high quality voice
      debugPrint('🎵 Setting audio profile to MUSIC_STANDARD for better quality...');
      await _engine!.setAudioProfile(
        profile: AudioProfileType.audioProfileMusicStandard,
        scenario: AudioScenarioType.audioScenarioGameStreaming,
      );

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
      // CRITICAL: Leave any existing channel first
      if (_isJoined && _engine != null) {
        debugPrint('⚠️  Already in a channel, leaving first...');
        await _engine!.leaveChannel();
        _isJoined = false;
        await Future.delayed(const Duration(milliseconds: 500));
      }

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

      // CRITICAL: Set audio route to speaker BEFORE joining
      try {
        debugPrint('🔊 Setting audio route to speakerphone...');
        await _engine!.setDefaultAudioRouteToSpeakerphone(true);
        debugPrint('✅ Audio route set to speakerphone');

        // Also set audio session category for iOS
        try {
          await _engine!.setAudioSessionOperationRestriction(
            AudioSessionOperationRestriction.audioSessionOperationRestrictionNone,
          );
          debugPrint('✅ Audio session restrictions cleared');
        } catch (e) {
          debugPrint('⚠️  Could not clear audio session restrictions: $e');
        }
      } catch (e) {
        debugPrint('❌ CRITICAL: Could not set speaker route: $e');
        debugPrint('   Audio will go to earpiece - this is the problem!');
      }

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

      // Force speaker mode again after joining
      try {
        await _engine!.setEnableSpeakerphone(true);
        debugPrint('✅ Forced speaker mode ON after joining');
      } catch (e) {
        debugPrint('⚠️  Could not force speaker mode: $e');
      }

      debugPrint('');
      debugPrint('🎯 WAITING FOR AGENT UID 999 TO JOIN...');
      debugPrint('   If you don\'t see "USER JOINED EVENT: UID=999" within 5 seconds,');
      debugPrint('   the agent failed to join the channel.');
      debugPrint('');

      // CRITICAL: Aggressively unmute and boost volume for agent UID 999
      // Do this multiple times with delays to catch the agent whenever it joins
      for (int i = 0; i < 10; i++) {
        Future.delayed(Duration(milliseconds: 500 * (i + 1)), () async {
          if (_engine != null && _isJoined) {
            try {
              await _engine!.muteRemoteAudioStream(uid: 999, mute: false);
              await _engine!.adjustUserPlaybackSignalVolume(uid: 999, volume: 100);
              await _engine!.adjustPlaybackSignalVolume(400); // Boost overall volume
              if (i == 0) {
                debugPrint('🔊 Unmute attempt ${i + 1} for UID 999');
              }
            } catch (e) {
              // Ignore errors, agent may not be in channel yet
            }
          }
        });
      }

      // Add a timeout warning
      Future.delayed(const Duration(seconds: 10), () {
        if (_isJoined) {
          debugPrint('');
          debugPrint('⚠️  WARNING: 10 seconds passed, agent may not have joined');
          debugPrint('   Check backend logs to verify agent started successfully');
          debugPrint('   Agent ID should be visible in backend console');
          debugPrint('');
        }
      });

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

  Future<void> setRemotePlaybackVolume(int uid, int volume) async {
    if (_engine != null) {
      await _engine!.adjustUserPlaybackSignalVolume(uid: uid, volume: volume);
      debugPrint('✅ Set remote playback volume for UID $uid to $volume');
    }
  }

  Future<void> adjustPlaybackSignalVolume(int volume) async {
    if (_engine != null) {
      await _engine!.adjustPlaybackSignalVolume(volume);
      debugPrint('✅ Set overall playback volume to $volume');
    }
  }

  Future<void> forceSpeakerMode() async {
    if (_engine != null) {
      try {
        await _engine!.setEnableSpeakerphone(true);
        await _engine!.setDefaultAudioRouteToSpeakerphone(true);
        debugPrint('✅ Speaker mode forced ON');
      } catch (e) {
        debugPrint('❌ Failed to force speaker mode: $e');
      }
    }
  }

  bool get isJoined => _isJoined;
  String? get channelName => _channelName;
  String? get sessionId => _sessionId;
}
