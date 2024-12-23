<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        id: null,
        name: '',
        avatar: '',
      },
      users: [],
      selectedReceiver: null,
      newMessage: '',
      replyMessage: '', // New input for reply message
      messages: [],
      replies: [],
    };
  },
  created() {
    this.fetchUserData();
    this.fetchUsers();
    this.startMessagePolling();
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => user.id !== this.user.id);
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const userResponse = await axios.get('http://localhost:8000/api/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.user = userResponse.data;
        this.fetchMessages();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.data.status === 'success' && Array.isArray(response.data.data.users)) {
          this.users = response.data.data.users;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    selectReceiver(user) {
      this.selectedReceiver = user;
      this.fetchMessages();
      this.replies = [];
    },
    async fetchMessages() {
      if (!this.selectedReceiver) return;
      try {
        const receiverId = this.selectedReceiver.id;

        const response = await axios.get('http://127.0.0.1:8000/chat/api/messages/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            receiver_id: receiverId,
            sender_id: this.user.id,
          },
        });

        this.messages = response.data;
        this.fetchReplies();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async fetchReplies() {
      if (!this.selectedReceiver) return;
      try {
        const receiverId = this.selectedReceiver.id;

        const response = await axios.get('http://127.0.0.1:8000/chat/api/conversation-messages/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            sender_id: receiverId,
            receiver_id: this.user.id,
          },
        });

        this.replies = response.data;
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    },
    async deleteMessage(messageId) {
      try {
        await axios.delete(`http://localhost:8000/chat/api/messages/${messageId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        // Remove the message from the local array
        this.messages = this.messages.filter(message => message.id !== messageId);
        this.replies = this.replies.filter(reply => reply.id !== messageId);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    },
    startMessagePolling() {
      setInterval(() => {
        if (this.selectedReceiver) {
          this.fetchMessages();
          this.fetchReplies();
        }
      }, 2000);
    },
    async sendReply() {
      if (!this.selectedReceiver || !this.replyMessage) return;

      const replyData = {
        sender: this.user.id,
        receiver: this.selectedReceiver.id,
        content: this.replyMessage,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await axios.post('http://localhost:8000/chat/api/messages/', replyData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        this.replies.push({
          id: response.data.id,
          sender_name: this.user.name,
          content: this.replyMessage,
          timestamp: new Date().toISOString(),
        });

        this.replyMessage = '';
      } catch (error) {
        console.error('Error sending reply:', error);
      }
    }
  }
};
</script>

<template>
  <v-container style="margin-top: 60px;">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-3 inbox-card timeline-card" elevation="5">
          <v-card-title>
            <div class="headline inbox-title">
              <v-icon class="mr-1" color="#0b2e33">mdi-account-multiple</v-icon> Available Users
            </div>
          </v-card-title>

          <v-list style="background-color: #4f7c82;">
            <v-list-item-group v-if="filteredUsers.length > 0">
              <v-list-item 
                v-for="user in filteredUsers" 
                :key="user.id" 
                @click="selectReceiver(user)" 
                class="inbox-item"
              >
                <v-list-item-avatar>
                  <v-img :src="user.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon style="color: #b8e8e9;">mdi-account</v-icon>
                    {{ user.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>

            <v-list-item v-else>
              <v-list-item-content>
                <v-list-item-title>No conversations available...</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card 
          v-if="selectedReceiver" 
          class="chat-section" 
          elevation="3" 
          style="background-color: #0b2e33;"
        >
          <v-card-title class="d-flex align-center chat-header">
            <div>
              <div class="chat-title-main">
                <v-icon size="28px">mdi-message-bulleted</v-icon> SnapTalk
              </div>
              <div class="headline chat-title">
                Start a conversation with <strong>{{ selectedReceiver.name }}</strong>
              </div>
            </div>
          </v-card-title>

          <div class="chat-body">
            <div 
              v-for="message in messages" 
              :key="message.id" 
              :class="{
                'message-item': true,
                'sender': message.sender === user.id,
                'receiver': message.sender !== user.id
              }"
            >
              <div class="message-bubble" :class="{'sent': message.sender === user.id}">
                {{ message.content }}
                <div class="timestamp">
                  {{ new Date(message.timestamp).toLocaleString() }}
                </div>
                <v-icon 
                  class="delete-icon" 
                  @click="deleteMessage(message.id)" 
                  color="red" 
                  style="font-size: medium; margin-right: 8px;"
                >
                  mdi-delete-outline
                </v-icon>
              </div>
            </div>
          </div>

          <div class="chat-footer" style="display: flex; align-items: center;">
            <v-textarea 
              v-model="replyMessage" 
              label="Message" 
              rows="1" 
              outlined 
              dense 
              style="width: 70%; max-width: 630px; margin-left: 10px; margin-right: 25px; margin-top: 15px; color: #0b2e33;"
            />
            <v-btn 
              @click="sendReply" 
              :disabled="!replyMessage" 
              class="send-btn"
            >
              <v-icon left>mdi-send</v-icon> Send
            </v-btn>
          </div>
        </v-card>

        <!-- No User Selected: Placeholder Card -->
        <v-card 
          v-else 
          class="pa-3" 
          elevation="5" 
          style="background-color: #4f7c82;"
        >
          <v-card-title>
            <div class="card-content">
              <!-- Placeholder Image -->
              <v-img src="/src/images/robot.png" alt="No user selected" class="left-img" style="max-width: 80%;" />
              <div class="right-content">
                <!-- Welcome Message -->
                <div class="headline" style="font-size: 20px;">Welcome to SnapTalk – Start Seamless Conversations</div>
                <div class="caption">
                  Select a user from inbox to start a secure, private conversation here on SnapTalk.
                </div>
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>




<style scoped>
.receiver .message-bubble {
  background-color: #b8e8e9;
  color: #000;
  border-radius: 18px 18px 18px 0;
  max-width: 60%;
  padding: 10px 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.left-img {
  max-width: 80px;
  margin-right: 20px;
}

.right-content {
  display: flex;
  flex-direction: column;
}

.headline {
  font-size: 20px;
  font-weight: bold;
  color: #0b2e33;
}

.caption {
  font-size: 14px;
  color: #b8e8e9;
}

.timeline-card {
  position: relative;
  border: 3px solid #b8e8e9;
  background-color: #b8e8e9;
}

.timeline-card .inbox-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 10px;
}

.timeline-card .inbox-title {
  color: #0b2e33;
  font-weight: bold;
  margin-left: 55px;
}

.inbox-item .v-list-item-title {
  color: #ffffff;
}

.chat-section {
  display: flex;
  flex-direction: column;
  height: 85vh;
  border-radius: 8px;
  padding: 0;
  border: 2px solid #b8e8e9;
}

.chat-header {
  background-color: #b8e8e9;
  padding: 10px;
  border-radius: 8px 8px 0 0;
}

.chat-title-main {
  font-weight: bold;
  color: #0b2e33;
}

.chat-title {
  font-size: 1.1rem;
  color: #0b2e33;
  font-weight: normal;
}

.chat-body {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
  background-color: #4f7c82;
}

.message-item {
  display: flex;
  margin-bottom: 10px;
}

.sent {
  background-color: #e5e5ea;
  color: black;
  border-radius: 18px 18px 18px 0;
  max-width: 60%;
  padding: 10px 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message-bubble {
  position: relative;
  word-wrap: break-word;
  font-size: 14px;
}

.timestamp {
  font-size: 11px;
  color: #888;
  margin-top: 5px;
  text-align: right;
}

.receiver .timestamp {
  color: rgba(0, 0, 0, 0.5);
}

.chat-footer {
  display: flex;
  align-items: center;
  padding: 0px;
  background-color: #b8e8e9;
}

.message-input {
  flex: 1;
  margin-right: 15px;
  color: #0b2e33;
}

.send-btn {
  background-color: #0b2e33;
  color: white;
}

.send-btn:disabled {
  background-color: #e5e5ea;
  color: #0b2e33;
}

.v-btn {
  border-radius: 30px;
}

.v-textarea {
  background-color: #b8e8e9;
  margin-top: 10px;
  margin-right: -5px;
}

.chat-footer .message-input {
  width: 70% !important;
  max-width: 600px;
}
</style>


