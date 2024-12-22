<script setup>
import { defineProps } from "vue";

const props = defineProps({
  userData: {
    type: Array,
    required: true,
  },
});

const headers = [
  {
    title: "Username",
    key: "username",
    sortable: false, // Disable sorting
  },
  // {
  //   title: "Email",
  //   key: "email",
  //   sortable: false, 
  // },
  {
    title: "Status",
    key: "status",
    sortable: false, // Disable sorting
  },
];

const resolveUserStatusVariant = (stat) => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === "pending") return "warning";
  if (statLowerCase === "active") return "success";
  if (statLowerCase === "inactive") return "secondary";

  return "primary";
};
</script>


<template>
  <!-- User List Card -->
  <v-card class="user-list-card">
    
    <!-- Data Table to display user data -->
    <v-data-table
      :headers="headers"
      :items="userData"
      item-value="id"
      class="user-list-table"
    >
      
      <!-- Username Column -->
      <template #item.username="{ item }">
        <div class="d-flex align-center user-details" style="gap: 3px;">
          
          <!-- Icon for Username -->
          <v-icon class="user-icon" style="color: #b8e8e9;">mdi-account</v-icon>

          <!-- User Details (Name and Email) -->
          <div class="d-flex flex-column">
            <h6 class="user-list-name">{{ item.username }}</h6>
            <p class="user-email">{{ item.email }}</p>
          </div>
        </div>
      </template>

      <!-- Status Column -->
      <template #item.status="{ item }">
        <v-chip
          :color="resolveUserStatusVariant(item.status)"
          size="small"
          class="text-capitalize user-status-chip"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template #bottom />
    </v-data-table>
  </v-card>
</template>




<style scoped>
.user-list-card {
  background-color: #b8e8e9;
  border-radius: 16px;
  padding: 15px;
  margin-top: 60px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
}

.user-list-card:hover {
  transform: translateY(-5px);
}

.user-list-table {
  background-color: #4f7c82;
  border-radius: 12px;
  padding: 10px;
  color: #0b2e33;
  font-size: 1.1rem;
}

.user-list-name {
  font-weight: 600;
  color: #0b2e33;
  font-size: 18px;
}

.user-email {
  font-size: 15px;
  color: #0b2e33;
}
</style>