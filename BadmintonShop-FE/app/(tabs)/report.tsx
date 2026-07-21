import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { AppColors } from '../../constants/colors';
import { styles } from '../../components/styles/tabs/report.styles';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../controllers/useAppController';
import { getUserReport } from '../../utils/reportApi';
import { getApiUrl } from '../../utils/database';
const API_URL = getApiUrl();
import { io, Socket } from 'socket.io-client';
import { useNavigation } from 'expo-router';

export default function ReportScreen() {
  const { currentUser: user, isLoggedIn } = useAppContext();
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Set screen header title dynamically if needed
    navigation.setOptions({
      headerTitle: 'Report & Support'
    });
  }, [navigation]);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    fetchReport();

    // Initialize Socket
    const socketUrl = API_URL.replace('/api', '');
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      console.log('Mobile user connected to socket');
      socketRef.current?.emit('joinRoom', user.id);
    });

    socketRef.current.on('newMessage', (data) => {
      // data: { message, userId }
      setMessages(prev => [...prev, data.message]);
      scrollToBottom();
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user, isLoggedIn]);

  const fetchReport = async () => {
    if (!user) return;
    const res = await getUserReport(user.id);
    if (res.success && res.report) {
      setMessages(res.report.messages);
    }
    setLoading(false);
    setTimeout(scrollToBottom, 500);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !user) return;

    const data = {
      senderId: user.id,
      isAdmin: false,
      content: messageText
    };

    socketRef.current?.emit('sendMessage', data);
    setMessageText('');
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyText}>Please login to access support chat.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>A</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Admin Support</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
        >
          {loading ? (
            <Text style={styles.emptyText}>Loading chat...</Text>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Welcome to Support!</Text>
              <Text style={styles.emptyText}>Send a message to start chatting with an admin.</Text>
            </View>
          ) : (
            messages.map((msg, idx) => {
              const isMe = !msg.isAdmin;
              return (
                <View key={idx} style={[styles.messageWrapper, isMe ? styles.messageWrapperRight : styles.messageWrapperLeft]}>
                  <View style={[styles.messageBubble, isMe ? styles.messageBubbleRight : styles.messageBubbleLeft]}>
                    <Text style={styles.messageText}>{msg.content}</Text>
                    <Text style={[styles.messageTime, isMe ? styles.messageTimeRight : styles.messageTimeLeft]}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type your message..."
            placeholderTextColor={AppColors.textMutedDark}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Ionicons name="send" size={20} color={AppColors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


