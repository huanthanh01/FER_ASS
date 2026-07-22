import React, { useState, useEffect, useRef } from 'react';
import { getUserReport } from '../../api/reportApi';
import { API_URL } from '../../api/config';
import { io } from 'socket.io-client';
import { HiOutlineChatAlt2, HiOutlinePaperAirplane } from 'react-icons/hi';

export default function ReportChat({ user }) {
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

  return (
    <div className="page-container h-full max-h-screen flex flex-col pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Report & Support Chat</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Trò chuyện trực tiếp với Chăm sóc khách hàng BadmintonShop</p>
        </div>
      </div>
      
      <div className="flex-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col h-[600px] shadow-lg">
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-surface-light)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow">
              <span>A</span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">Admin Support Team</h3>
              <p className="text-xs text-[var(--color-success)] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] inline-block animate-pulse"></span> Online 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-[var(--color-text-secondary)] mt-10">Đang tải lịch sử tin nhắn...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-[var(--color-text-muted)] mt-10">
              <HiOutlineChatAlt2 className="w-12 h-12 mx-auto mb-2 text-[var(--color-primary)] opacity-80" />
              <p className="font-semibold text-[var(--color-text-primary)]">Xin chào {user.fullname}!</p>
              <p className="text-sm mt-1">Hãy gửi tin nhắn bên dưới để bắt đầu trò chuyện với hỗ trợ viên.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = !msg.isAdmin;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${isMe ? 'bg-[var(--color-primary)] text-white rounded-br-none' : 'bg-[var(--color-bg-surface-light)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-bl-none'}`}>
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
              placeholder="Nhập tin nhắn hỗ trợ..."
              className="flex-1 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] shadow-inner"
            />
            <button 
              type="submit"
              disabled={!messageText.trim()}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow"
            >
              <HiOutlinePaperAirplane className="rotate-90" />
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
