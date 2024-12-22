<script setup>
import { ref } from "vue";
import LoginForm from "@/layouts/LoginForm.vue";
import RegisterForm from "@/layouts/RegisterForm.vue";

// State for toggling between login and register forms
const showRegister = ref(false);

const switchToLogin = () => (showRegister.value = false);
const switchToRegister = () => (showRegister.value = true);

</script>

<template>
  <v-container fluid class="pa-0">
    <v-row class="fill-height" align="center" justify="center">
      <!-- Main Column (Login Form) -->
      <v-col cols="12" sm="8" md="6" lg="4">
        <login-form>
          <template #header>
            <h2
              class="text-center"
              style="
                font-family: 'Roboto', sans-serif;
                color: #333;
                font-weight: 900;
                letter-spacing: 2px;
                background: linear-gradient(45deg, #0b2e33, #4f7c82, #0b2e33);
                -webkit-background-clip: text;
                color: transparent;
                animation: slideIn 1s ease-out;
                font-size: 30px;
                margin-bottom: 20px;
              "
            >
              Log in to SnapTalk
            </h2>
            <p
              class="text-center"
              style="
                font-family: 'Roboto', sans-serif;
                font-weight: bold;
                letter-spacing: 2px;
                background: linear-gradient(45deg, #0b2e33, #4f7c82, #0b2e33);
                -webkit-background-clip: text;
                color: transparent;
                animation: slideIn 1s ease-out;
                font-size: 18px;
                margin-top: -30px;
                margin-bottom: 20px;
              "
            >
              Sign in to unlock seamless communication and stay connected.
            </p>
          </template>

          <template #footer>
            <v-btn
              text
              class="d-block mx-auto footer-btn"
              @click="switchToRegister"
              style="font-weight: 500; color: #fff; background-color: #0b2e33;"
            >
              Don't have an account? Register
            </v-btn>
          </template>
        </login-form>
      </v-col>
    </v-row>

    <!-- Register Dialog -->
    <v-dialog v-model="showRegister" persistent max-width="450px">
      <register-form v-model="showRegister">
        <template #header>
          <h2
            class="text-center"
            style="
              font-family: 'Roboto', sans-serif;
              font-weight: 900;
              letter-spacing: 2px;
              background: linear-gradient(45deg, #0b2e33, #4f7c82, #0b2e33);
              -webkit-background-clip: text;
              color: transparent;
              animation: slideIn 1s ease-out;
              font-size: 40px;
              margin-bottom: 20px;
            "
          >
            Join SnapTalk Today!
          </h2>
          <p
            class="text-center"
            style="
              font-family: 'Roboto', sans-serif;
              font-weight: bold;
              letter-spacing: 2px;
              background: linear-gradient(45deg, #0b2e33, #4f7c82, #0b2e33);
              -webkit-background-clip: text;
              color: transparent;
              animation: slideIn 1s ease-out;
              font-size: 18px;
              margin-top: -30px;
              margin-bottom: 20px;
            "
          >
            Discover a world of seamless communication and connection.
          </p>
        </template>

        <template #footer>
          <v-btn
            text
            class="d-block mx-auto footer-btn"
            @click="switchToLogin"
            style="font-weight: 500; color: #fff; background-color: #0b2e33; font-size: 16px;"
          >
            Log in to your account
          </v-btn>
        </template>
      </register-form>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-container {
  background: linear-gradient(135deg, #0b2e33, #4f7c82, #93b1b5);
  background-size: 300% 300%;
  animation: gradientAnimation 8s ease infinite;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.v-container::before,
.v-container::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  animation: floatShapes 15s linear infinite;
}

.v-container::before {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.2);
  top: -50px;
  left: -50px;
  animation-delay: 0s;
}

.v-container::after {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  bottom: -100px;
  right: -100px;
  animation-delay: 5s;
}

@keyframes floatShapes {
  0% {
    transform: translateY(0) translateX(0) scale(1);
  }
  25% {
    transform: translateY(-50px) translateX(50px) scale(1.2);
  }
  50% {
    transform: translateY(0) translateX(100px) scale(1);
  }
  75% {
    transform: translateY(50px) translateX(50px) scale(0.8);
  }
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }
}

.v-btn {
  font-weight: 500;
  color: #00796b;
  text-transform: none;
  transition: color 0.3s ease;
}

.v-btn:hover {
  color: #004d40;
}

@media (max-width: 600px) {
  .v-card {
    padding: 30px;
  }

  .v-btn {
    font-size: 14px;
  }
}
</style>
