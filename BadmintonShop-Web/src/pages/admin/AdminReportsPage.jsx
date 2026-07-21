import React, { useState, useEffect, useRef, useContext } from 'react';
import { getAllReports, getAdminReport } from '../../api/reportApi';
import { AppContext } from '../../context/AppContext';
import { io } from 'socket.io-client';
import { API_URL } from '../../api/config';
import { toast } from 'react-toastify';

export default function AdminReportsPage() {
  const { user } = useContext(AppContext);
  const [reports, setReports] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentReport, setCurrentReport] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket
  useEffect(() => {
    // Extract base URL from API_URL (remove /api part if any)
    const socketUrl = API_URL.replace('/api', '');
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      console.log('Admin connected to socket');
    });

    socketRef.current.on('adminUpdate', (data) => {
      // data: { reportId, userId, message }
      // Update reports list
      setReports(prevReports => {
        let exists = false;
        const newReports = prevReports.map(r => {
          if (r.user._id === data.userId) {
            exists = true;
            return {
              ...r,
              hasUnreadAdmin: r.user._id !== selectedUserId,
              lastUpdatedAt: new Date().toISOString(),
              messages: [...r.messages, data.message]
            };
          }
          return r;
        });
        
        if (!exists) {
          // Refresh list if new user
          fetchReports();
          return prevReports;
        }
        
        return newReports.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
      });

      // Update current report if selected
      if (selectedUserId === data.userId) {
        setCurrentReport(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.message]
          };
        });
        scrollToBottom();
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [selectedUserId]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentReport?.messages]);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const res = await getAllReports(token);
    if (res.success) {
      setReports(res.reports);
    }
    setLoading(false);
  };

  const handleSelectUser = async (userId) => {
    setSelectedUserId(userId);
    const token = localStorage.getItem('token');
    const res = await getAdminReport(userId, token);
    if (res.success) {
      setCurrentReport(res.report);
      
      // Update unread status in list
      setReports(prev => prev.map(r => 
        r.user._id === userId ? { ...r, hasUnreadAdmin: false } : r
      ));
    } else {
      toast.error('Failed to load chat');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;

    const data = {
      senderId: user.id,
      receiverId: selectedUserId,
      isAdmin: true,
      content: messageText
    };

    socketRef.current.emit('sendMessage', data);
    setMessageText('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-6">Reports & Support</h1>
      
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex h-[calc(100vh-140px)]">
        
        {/* Left Pane: Users List */}
        <div className="w-1/3 border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50">
            <h2 className="font-semibold text-slate-200">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-400">Loading...</div>
            ) : reports.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No reports found.</div>
            ) : (
              reports.map(report => (
                <div 
                  key={report._id}
                  onClick={() => handleSelectUser(report.user._id)}
                  className={`p-4 border-b border-slate-800/50 cursor-pointer transition-colors ${selectedUserId === report.user._id ? 'bg-orange-500/10 border-l-4 border-l-orange-500' : 'hover:bg-slate-800/50 border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-slate-200 truncate pr-2">
                      {report.user.fullname || report.user.username}
                    </span>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(report.lastUpdatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400 truncate pr-4">
                      {report.messages && report.messages.length > 0 
                        ? report.messages[report.messages.length - 1].content 
                        : 'No messages'}
                    </span>
                    {report.hasUnreadAdmin && (
                      <span className="w-2.5 h-2.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Chat Window */}
        <div className="w-2/3 flex flex-col bg-slate-950/50">
          {selectedUserId && currentReport ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">
                    {reports.find(r => r.user._id === selectedUserId)?.user.fullname || 'User'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {reports.find(r => r.user._id === selectedUserId)?.user.email}
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentReport.messages.length === 0 ? (
                  <div className="text-center text-slate-500 mt-10">No messages yet.</div>
                ) : (
                  currentReport.messages.map((msg, idx) => {
                    const isMe = msg.isAdmin;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-orange-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <span className={`text-[10px] block mt-1 ${isMe ? 'text-orange-200' : 'text-slate-400'}`}>
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
              <div className="p-4 border-t border-slate-800 bg-slate-900">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                  <button 
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
