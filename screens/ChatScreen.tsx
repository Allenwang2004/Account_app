import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

interface ChatScreenProps {
  messages: { role: 'user' | 'system'; content: string }[];
  onSendMessage: (message: string) => void;
}

export default function ChatScreen({ messages, onSendMessage }: ChatScreenProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) return;

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      const response = await fetch('https://your-render-api-url.com/transcribe', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (data.transcript) {
        onSendMessage(data.transcript);
      }

      setRecording(null);
    } catch (err) {
      console.error('Failed to stop or upload recording', err);
    }
  };

  const toggleVoice = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.role === 'user' ? styles.userMessage : styles.systemMessage,
              ]}
            >
              <Text style={item.role === 'user' ? styles.userMessageText : styles.systemMessageText}>
                {item.content}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your expense (e.g., Lunch $12.50 in Food)"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
            onPress={toggleVoice}
          >
            {isRecording ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="mic" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0284c7',
  },
  systemMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
  },
  userMessageText: {
    color: 'white',
  },
  systemMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#ef4444',
  },
});