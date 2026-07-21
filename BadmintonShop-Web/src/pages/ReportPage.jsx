import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAppContext } from '../context/AppContext';
import { getUserReport } from '../api/reportApi';
import { API_URL } from '../api/config';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

export default function ReportPage() {
  const { currentUser: user } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    fetchReport();

    // Initialize Socket
    const socketUrl = API_URL.replace('/api', '');
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      console.log('User connected to socket');
      socketRef.current.emit('joinRoom', user.id);
    });

    socketRef.current.on('newMessage', (data) => {
      // data: { message, userId }
      setMessages(prev => [...prev, data.message]);
      scrollToBottom();
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchReport = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    const res = await getUserReport(user.id, token);
    if (res.success && res.report) {
      setMessages(res.report.messages);
    }
    setLoading(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    const data = {
      senderId: user.id,
      isAdmin: false,
      content: messageText
    };

    socketRef.current.emit('sendMessage', data);
    setMessageText('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!user) {
    return (
      <div className="page-container flex items-center justify-center">
        <p className="text-[var(--color-text-secondary)]">Please login to access support chat.</p>
      </div>
    );
  }

  return (
    <div className="page-container h-full max-h-screen flex flex-col pt-6 pb-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">Report & Support</h1>
      
      <div className="flex-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col h-[600px] shadow-lg">
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-surface-light)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="text-orange-500 font-bold">A</span>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)]">Admin Support</h3>
            <p className="text-xs text-[var(--color-success)]">Online</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-[var(--color-text-secondary)] mt-10">Loading chat...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-[var(--color-text-muted)] mt-10">
              <p>Welcome to Support!</p>
              <p className="text-sm mt-1">Send a message to start chatting with an admin.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = !msg.isAdmin;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-[var(--color-primary)] text-white rounded-br-none' : 'bg-[var(--color-bg-surface-light)] text-[var(--color-text-primary)] rounded-bl-none'}`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    <span className={`text-[10px] block mt-1 ${isMe ? 'text-white/70 text-right' : 'text-[var(--color-text-secondary)]'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[var(--color-bg-base)] border border-[var(--color-border-light)] rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] shadow-inner"
            />
            <button 
              type="submit"
              disabled={!messageText.trim()}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-primary)] px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
