<script>
import { useAuthStore } from "@/stores/auth"; // Import the authStore
import { ref } from "vue";

export default {
  props: {
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const authStore = useAuthStore();
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const handleRegister = async () => {
      if (
        !username.value ||
        !email.value ||
        !password.value ||
        !confirmPassword.value
      ) {
        toast("Please fill out all fields.");
        return false;
      }

      const success = await authStore.register(
        username.value,
        email.value,
        password.value,
        confirmPassword.value
      );

      if (success) {
        alert("Welcome to SnapTalk! Your registration was successful. Let's get started!"); // Success alert
        emit("update:modelValue", false); // Close dialog after successful registration
      } else {
        // Error handling is done in the authStore
      }
    };

    const handleBack = () => {
      emit("update:modelValue", false); // Close the dialog without registering
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      handleRegister,
      handleBack,
    };
  },
};
</script>


<template>
  <v-card class="pa-4 register-card">
    <img src="/src/images/logo.png" alt="SnapTalk Logo" class="logo" />
    <slot name="header">
      <h2 class="register-header">Create Your Account</h2>
    </slot>
    <v-form ref="form" @submit.prevent="handleRegister" class="register-form">
  <v-row class="form-grid" dense>
    <v-col cols="6">
      <v-text-field
        v-model="username"
        label="Username"
        required
        outlined
        prepend-icon="mdi-account"
        class="register-input"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
        outlined
        prepend-icon="mdi-email"
        class="register-input"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
        outlined
        prepend-icon="mdi-lock"
        class="register-input"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        required
        outlined
        prepend-icon="mdi-lock-outline"
        class="register-input"
      ></v-text-field>
    </v-col>
  </v-row>
  <v-row class="register-actions">
    <v-col>
      <v-btn type="submit" class="register-submit-btn" prepend-icon="mdi-account-plus"> Register </v-btn>
    </v-col>
  </v-row>
  <br />
  <slot name="footer"></slot>
</v-form>

  </v-card>
</template>



<style scoped>
.logo {
  display: block;
  width: 170px;
  margin: 0 auto -10px auto;
  margin-top: -10px;
}

.register-card {
  background: #93b1b5;
  border-radius: 10px;
  width: 200%;
  margin-left: -210px;
  padding: 20px;
  color: #333;
}

.register-card:hover {
  transform: translateY(-5px);
}

.register-input {
  margin-bottom: 16px;
  border-radius: 8px;
}

.register-actions {
  display: flex;
  justify-content: center;
  margin-top: -30px;
}

.register-submit-btn {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  padding: 10px;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.register-submit-btn {
  background-color: #0b2e33;
  color: #fff;
  width: 100%; 
}
</style>