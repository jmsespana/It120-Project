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
      messages: [], // Default value is an empty array to avoid undefined errors
      replies: [], // Default value is an empty array to avoid undefined errors
    };
  },
  created() {
    this.fetchUserData();
    this.fetchUsers();
    this.startMessagePolling(); // Start polling for new replies
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
      this.replies = []; // Clear previous replies when switching users
    },
    async fetchMessages() {
      if (!this.selectedReceiver) return;
      try {
        const receiverId = this.selectedReceiver.id;

        const response = await axios.get('http://127.0.0.1:8000/chat/api/conversation-messages/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            receiver_id: receiverId,
            sender_id: this.user.id,
          },
        });

        this.messages = response.data;
        this.fetchReplies(); // Fetch replies from the selected receiver
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
            sender_id: receiverId, // Get replies from the selected user
            receiver_id: this.user.id,
          },
        });

        this.replies = response.data; // Store the replies
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    },
    startMessagePolling() {
      // Polling to fetch new messages every 5 seconds
      setInterval(() => {
        if (this.selectedReceiver) {
          this.fetchMessages();
          this.fetchReplies();
        }
      }, 2000);
    },
    async sendMessage() {
      if (!this.selectedReceiver || !this.newMessage) return;

      const messageData = {
        sender: this.user.id,
        receiver: this.selectedReceiver.id,
        content: this.newMessage,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await axios.post('http://localhost:8000/chat/api/messages/', messageData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        this.messages.push({
          id: response.data.id,
          sender_name: this.user.name,
          content: this.newMessage,
          timestamp: new Date().toISOString(), // Add timestamp to new messages
        });

        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    // Method to format timestamp into HH:mm AM/PM format
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      return date.toLocaleTimeString([], options);
    }
  }
};
</script>



<template>
  <v-container class="chat-container" style="margin-top: 60px;">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-3 inbox-card timeline-card" elevation="5">
          <v-card-title>
            <div class="headline inbox-title">
              <v-icon class="mr-1" color="#0b2e33">mdi-account-multiple</v-icon> Available Users
            </div>
          </v-card-title>
          
          <!-- User List -->
          <v-list style="background-color: #4f7c82;">
            <v-list-item-group v-if="filteredUsers.length > 0">
              <v-list-item v-for="user in filteredUsers" :key="user.id" @click="selectReceiver(user)" class="inbox-item">
                <v-list-item-avatar>
                  <v-img :src="user.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <!-- Display User Name -->
                  <v-list-item-title> 
                    <v-icon style="color: #b8e8e9;">mdi-account</v-icon> 
                    {{ user.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            
            <!-- If no users are available -->
            <v-list-item v-else>
              <v-list-item-content>
                <v-list-item-title>No conversations available...</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Chat Section -->
      <v-col cols="12" md="8">
        
       <!-- Chat Card for Selected User -->
        <v-card v-if="selectedReceiver" class="chat-card" elevation="3" style="background-color: #4f7c82; border: 5px solid #b8e8e9; height: 500px;">

        <!-- Title Section -->
        <v-card-title class="d-flex align-center" style="color: #0b2e33;">
          <div>
            <div class="chat-title" style="font-weight: 900;">
              <v-icon size="28px">mdi-message-bulleted</v-icon> SnapTalk
            </div>
            <div class="headline chat-title">
              Start a conversation with <strong>{{ selectedReceiver.name }}</strong>
            </div>
          </div>
        </v-card-title>

        <!-- Message Section -->
        <v-card-subtitle style="padding: 0; height: calc(80% - 80px); overflow-y: auto;">
          <v-scroll-y class="message-list" style="max-height: 100%; overflow-y: auto;">
            <v-list>
              <v-list-item-group v-if="messages && messages.length > 0">
                <v-list-item v-for="message in messages" :key="message.id" class="message-item">
                  <v-list-item-content>
                    <!-- Message Content -->
                    <v-list-item-title>
                      <v-card :class="{
                        'sender-message': message.sender === 'me', 
                        'receiver-message': message.sender !== 'me', 
                        'small-card': message.sender !== 'me'
                      }" class="pa-3 mb-3">
                        <div class="message-content">{{ message.content }}</div>
                      </v-card>
                    </v-list-item-title>

                    <!-- Message Metadata (Time and Receiver) -->
                    <div class="message-meta">
                      <span style="margin-right: 10px;">{{ formatTime(message.timestamp) }}</span>
                      <span style="margin-right: 700px;">Sent to: {{ message.receiver }}</span>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!-- If no messages available -->
              <v-list-item v-else>
                <v-list-item-content>
                  <v-list-item-title>No messages yet...</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-scroll-y>
        </v-card-subtitle>

        <!-- Message Input Section -->
        <v-card-actions class="d-flex align-center">
          <v-textarea v-model="newMessage" label="Message" rows="1" outlined dense class="message-input" />
          <v-btn @click="sendMessage" :disabled="!newMessage" class="send-btn">
            <v-icon left class="mr-1">mdi-send</v-icon> Send
          </v-btn>
        </v-card-actions>

        </v-card>


        <!-- No Replies Card -->
        <v-card v-else class="pa-3 mt-3 no-replies-card" elevation="2">
          <v-card-title>
            <div class="headline">No replies yet</div>
          </v-card-title>
        </v-card>

        <!-- No User Selected -->
        <v-card v-else class="pa-3" elevation="5" style="background-color: #4f7c82;">
          <v-card-title>
            <div class="card-content">
              <!-- Image on the left side -->
              <v-img src="/src/images/robot.png" alt="No user selected" class="left-img" style="max-width: 80%;"/>

              <!-- Content on the right side -->
              <div class="right-content">
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

.sender-message {
  background-color: #DCF8C6;
  align-self: flex-end;
}

.receiver-message {
  background-color: #FFFFFF;
  align-self: flex-start;
}

.small-card {
  max-width: 250px;
  min-width: 150px;
  padding: 10px;
  margin-right: 10px;
  border-radius: 8px;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
  display: inline-block;
}

.message-content {
  font-size: 14px;
  color: #333;
  word-wrap: break-word;
  white-space: normal;
}

.message-meta {
  font-size: 13px;
  color: #888;
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
}

.message-list {
  max-height: 400px;
  overflow-y: auto;
}

.chat-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.send-btn {
  margin-left: 10px;
  border: 1px solid #0b2e33;
  background-color: #4f7c82;
  color: #fff;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.2s;
}

.send-btn:hover {
  background-color: #0b2e33;
  transform: scale(1.05);
}

.no-replies-card, .no-user-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-replies-card .headline, .no-user-card .headline {
  font-size: 18px;
  color: #888;
}

.message-input {
  margin-top: 20px;
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
</style>

