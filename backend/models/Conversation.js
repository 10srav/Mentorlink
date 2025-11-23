const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: Date,
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {},
  },
  isArchived: {
    type: Map,
    of: Boolean,
    default: {},
  },
}, {
  timestamps: true,
});

// Compound index for finding conversations by participants
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

// Static method to find or create conversation between two users
conversationSchema.statics.findOrCreateConversation = async function(userId1, userId2) {
  // Sort IDs to ensure consistent conversation lookup
  const participants = [userId1.toString(), userId2.toString()].sort();

  let conversation = await this.findOne({
    participants: { $all: participants, $size: 2 }
  });

  if (!conversation) {
    conversation = await this.create({
      participants,
      unreadCount: {
        [userId1.toString()]: 0,
        [userId2.toString()]: 0,
      },
      isArchived: {
        [userId1.toString()]: false,
        [userId2.toString()]: false,
      },
    });
  }

  return conversation;
};

// Static method to generate conversation ID from two user IDs
conversationSchema.statics.generateConversationId = function(userId1, userId2) {
  return [userId1.toString(), userId2.toString()].sort().join('_');
};

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
