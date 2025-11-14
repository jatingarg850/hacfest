import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/voice_provider.dart';

class VoiceButton extends StatelessWidget {
  const VoiceButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<VoiceProvider>(
      builder: (context, voiceProvider, _) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (voiceProvider.error != null)
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.red.shade100,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red, size: 16),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        voiceProvider.error!,
                        style: const TextStyle(color: Colors.red, fontSize: 12),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 16),
                      onPressed: voiceProvider.clearError,
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
              ),
            FloatingActionButton.large(
              onPressed: () async {
                try {
                  if (voiceProvider.isInSession) {
                    await voiceProvider.stopVoiceSession();
                  } else {
                    await voiceProvider.startVoiceSession();
                  }
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Error: $e'),
                        backgroundColor: Colors.red,
                        action: SnackBarAction(
                          label: 'Dismiss',
                          textColor: Colors.white,
                          onPressed: () {},
                        ),
                      ),
                    );
                  }
                }
              },
              backgroundColor: voiceProvider.isInSession ? Colors.red : Colors.blue,
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: voiceProvider.isInSession
                    ? voiceProvider.isSpeaking
                        ? const Icon(Icons.graphic_eq, size: 32, key: ValueKey('speaking'))
                        : const Icon(Icons.mic, size: 32, key: ValueKey('listening'))
                    : const Icon(Icons.mic_none, size: 32, key: ValueKey('idle')),
              ),
            ),
          ],
        );
      },
    );
  }
}
