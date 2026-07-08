import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Tts from 'react-native-tts';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface Props {
  message: Message;
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Setup TTS language once when first bubble renders
    Tts.setDefaultLanguage('tr-TR');
    Tts.setDefaultRate(0.5);

    const onStart = (event: any) => {
      // We can't easily map event to specific bubble without custom IDs,
      // but we can just rely on the button press state for now.
    };
    
    const onFinish = () => {
      setIsPlaying(false);
    };

    const onCancel = () => {
      setIsPlaying(false);
    };

    Tts.addEventListener('tts-finish', onFinish);
    Tts.addEventListener('tts-cancel', onCancel);

    return () => {
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  const handleSpeech = () => {
    if (isPlaying) {
      Tts.stop();
      setIsPlaying(false);
    } else {
      Tts.stop(); // Stop any other playing audio
      // Clean text before reading (remove emojis or specific tags if needed)
      const cleanText = message.text.replace(/🔍.*?(\n|$)/g, '').trim();
      if (cleanText.length > 0) {
        Tts.speak(cleanText);
        setIsPlaying(true);
      }
    }
  };

  return (
    <View style={[styles.container, message.isUser ? styles.userContainer : styles.botContainer]}>
      <View style={[styles.bubble, message.isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.text, message.isUser ? styles.userText : styles.botText]}>
          {message.text}
        </Text>
        
        {!message.isUser && message.text.length > 0 && !message.text.includes('Düşünüyor...') && !message.text.includes('İnternette aranıyor') && (
          <TouchableOpacity onPress={handleSpeech} style={styles.ttsButton}>
            <Text style={styles.ttsText}>{isPlaying ? '⏹️ Durdur' : '🔊 Sesli Oku'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 12,
    width: '100%',
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#007AFF', // iMessage Blue
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#1C1C1E',
  },
  ttsButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  ttsText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
});
