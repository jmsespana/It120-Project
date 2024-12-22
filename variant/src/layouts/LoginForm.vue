<script>
import { useAuthStore } from "@/stores/auth"; // Importing the merged auth store
import { ref } from "vue";
import { useRouter } from "vue-router";


export default {
  setup() {
    const authStore = useAuthStore(); // Access the auth store
    const router = useRouter();
    const email = ref(""); // Bind email input
    const password = ref(""); // Bind password input
   

    const handleLogin = async () => {
      const success = await authStore.login(email.value, password.value); // Use the store's login action
      if (!success) {
       alert("Login failed"); 
      } else {
       alert("Login successful"); 
        // Redirect to the previously requested page, or to /dashboard if none is specified
        const redirect =
          router.currentRoute.value.query.redirect || "/dashboard";
        router.push(redirect);
      }
    };

    return { email, password, handleLogin };
  },
};
</script>



<template>
  <v-card class="pa-4 login-card" style="background-color: #93b1b5;">
    <img src="/src/images/logo.png" alt="SnapTalk Logo" class="logo" />
    <slot name="header">
    </slot>
    <v-form ref="form" @submit.prevent="handleLogin">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
        outlined
        prepend-icon="mdi-email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
        outlined
        prepend-icon="mdi-lock"
      ></v-text-field>
      <v-btn type="submit" class="mt-4" block prepend-icon="mdi-login">Login</v-btn>
    </v-form>
    <br />
    <slot name="footer"></slot>
  </v-card>
  </template>
  
  
  
  <style scoped>
  .v-btn {
    background-color: #0b2e33;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 8px;
    padding: 12px 20px;
  }
  
  .logo {
    display: block;
    width: 170px;
    margin: 0 auto -10px auto;
  }
  
  .login-card {
    padding: 60px;
    width: 150%;
    margin-left: -120px;
    border: 2px solid #93b1b5;
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    .login-card {
      padding: 40px;
      width: 90%;
    }
  
    .login-card h2 {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    .login-card {
      padding: 30px;
      width: 90%;
    }
  
    .login-card h2 {
      font-size: 1.8rem;
    }
  }
  </style>
  