import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/common/HomeNavbar';
import Sidebar from '../components/home/Sidebar';
import ConversationList from '../components/chat/ConversationList';
import ChatModal from '../components/common/ChatModal';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import './Messages.css';

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeConversation, setActiveConversation, conversations } = useChat();
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // If userId is in URL params, open chat modal
  useEffect(() => {
    if (userId) {
      setActiveConversation(userId);
      setShowChatModal(true);

      // Find participant info from conversations
      const conversation = conversations.find(
        conv => conv.participant._id === userId
      );
      if (conversation) {
        setSelectedParticipant(conversation.participant);
      }
    }
  }, [userId, setActiveConversation, conversations]);

  const handleSelectConversation = (participantId, participant) => {
    setActiveConversation(participantId);
    setSelectedParticipant(participant);
    setShowChatModal(true);
    navigate(`/messages/${participantId}`);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setActiveConversation(null);
    setSelectedParticipant(null);
    navigate('/messages');
  };

  return (
    <div className="messages-page">
      <HomeNavbar />
      <div className="app-container">
        <Sidebar />
        <div className="messages-main-content">
          <div className="messages-container">
            <div className="messages-header">
              <h1>Messages</h1>
              <p className="messages-subtitle">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>

            <ConversationList
              onSelectConversation={handleSelectConversation}
            />

            {conversations.length === 0 && (
              <div className="empty-messages-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <h3>No messages yet</h3>
                <p>Start connecting with mentors to begin messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal - WhatsApp Style Popup */}
      {showChatModal && activeConversation && (
        <ChatModal
          isOpen={showChatModal}
          onClose={handleCloseChat}
          participant={selectedParticipant}
          recipientId={activeConversation}
        />
      )}
    </div>
  );
};

export default Messages;
