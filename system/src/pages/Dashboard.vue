<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth"; // Import the auth store
import UserTable from "@/views/dashboard/UserTable.vue";
import ChatBox from "@/components/ChatBox.vue"; // Import ChatBox component

const users = ref([]);
const activeTab = ref(localStorage.getItem("activeTab") || "dashboard"); // Retrieve activeTab from local storage

const fetchUsers = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/users/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    users.value = response.data.data.users.map((user) => ({
      username: user.name,
      email: user.email,
      status: "active",
    }));
  } catch (err) {
    console.error("Error fetching users:", err.message);
  }
};

const logout = () => {
  const authStore = useAuthStore();
  authStore.logout(); // Clear the auth token in Pinia store
};

onMounted(fetchUsers);

// Watch for changes in activeTab and save it to local storage
watch(activeTab, (newTab) => {
  localStorage.setItem("activeTab", newTab);
});
</script>

<template>
  <v-app class="app-container">
    <!-- App Bar with Logo and Title -->
    <v-app-bar app class="app-bar" style="background: linear-gradient(45deg, #0b2e33, #4f7c82);">
      <!-- Logo and App Title -->
      <v-row align="center" class="d-flex justify-start">
        <v-img 
          src="/src/images/logo.png" 
          alt="SnapTalk Logo" 
          max-width="80px"
          class="navbar-logo me-2"
        />
        <v-toolbar-title class="app-title" style="margin: 0;">SnapTalk</v-toolbar-title>
      </v-row>

      <v-spacer></v-spacer>

      <!-- Logout Button -->
      <v-col class="d-flex justify-end">
        <v-btn @click="logout" class="logout-btn">
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-col>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="main-section">
      <v-container fluid class="content-container">
        <!-- Navigation Tabs -->
        <v-tabs v-model="activeTab" class="tab-container" style="margin-left: 500px; margin-top: 30px;">
          <v-tab value="dashboard">
            <v-icon left class="tab-icon">mdi-view-dashboard-outline</v-icon> Dashboard
          </v-tab>
          <v-tab value="chats">
            <v-icon left class="tab-icon">mdi-message-text-outline</v-icon> Start a Chat
          </v-tab>
        </v-tabs>

        <!-- Dashboard Content -->
        <v-row v-if="activeTab === 'dashboard'">
          <v-col cols="12">
            <UserTable :userData="users" />
          </v-col>
        </v-row>

        <!-- Chat Content -->
        <v-row v-else-if="activeTab === 'chats'">
          <v-col cols="12">
            <ChatBox />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.logout-btn {
    font-size: 1rem;
    font-weight: bold;
    background-color: #4F7C82;
    border: 1px solid #0B2E33;
    color: #ffffff;
    border-radius: 8px;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.logout-btn:hover {
    background-color: #B8E3E9;
    color: #0B2E33;
    transform: scale(1.05);
    cursor: pointer;
}

.app-bar {
  color: white;
  padding: 5px 15px;
}

.app-title {
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 30px;
}

.nav-tabs {
  background-color: #4f7c82;
  border-radius: 8px;
  padding: 5px 15px;
}

.tab-icon {
  color: #B8E3E9;
}

.v-tab {
  color: #B8E3E9;
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 700;
  transition: transform 0.2s ease-in-out;
}

.v-tab:hover {
  transform: translateY(-3px);
}

.main-section {
  background-color: #0b2e33;
  color: white;
}
</style>

