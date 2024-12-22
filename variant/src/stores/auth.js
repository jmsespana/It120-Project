import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";
import router from "@/router/index";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null, // Store access token
    user: null, // Store user data after registration or login
    error: null, // Store error message for failed actions
  }),

  actions: {
    // Load token from localStorage (on app initialization)
    loadTokenFromStorage() {
      const token = localStorage.getItem("accessToken");
      if (token) {
        this.accessToken = token; // Set token in store if available in localStorage
      }
    },

    async login(email, password) {
      try {
        // First, authenticate the user with the login credentials
        const response = await axios.post("/api/login/", {
          email: email,
          password: password,
        });

        this.accessToken = response.data.access; // Set token in store
        console.log("Access Token:", this.accessToken);

        // Save the token to localStorage for persistence
        localStorage.setItem("accessToken", this.accessToken);

        // Fetch the user details from /api/me/ using the access token
        const userResponse = await axios.get("http://localhost:8000/api/me/", {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        // Assuming the user response contains the user data with an 'id' field
        const userId = userResponse.data.id;
        this.user = userResponse.data; // Save the user data to the store
        localStorage.setItem("userId", userId); // Save the user ID to localStorage

        // Log the user ID for debugging
        console.log("User ID:", userId);

        return true; // Successful login
      } catch (error) {
        console.error("Login failed:", error);
        this.accessToken = null;
        localStorage.removeItem("accessToken"); // Remove invalid token
        localStorage.removeItem("userId"); // Remove user ID from localStorage in case of failure
        return false; // Failed login
      }
    },

    async register(name, email, password, confirmPassword, toast) {
      if (password !== confirmPassword) {
        this.error = "Passwords do not match";
        toast.error(this.error);
        return false;
      }
    
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/signup/", {
          email,
          name,
          password1: password,
          password2: confirmPassword,
        });
    
        if (response.data.message === "success") {
          this.user = response.data.user;
          toast.success("Registration successful!");
          return true;
        } else {
          this.error = response.data.errors || "An unknown error occurred.";
          toast.error(this.error);
          return false;
        }
      } catch (error) {
        let errorMessage = "An unknown error occurred."; // Default message
    
        if (error.response) {
          const responseData = error.response.data;
    
          if (responseData?.errors) {
            // If errors field is present
            errorMessage = Object.values(responseData.errors).join(", ");
          } else if (responseData?.detail) {
            // If detail field is present
            errorMessage = responseData.detail;
          }
        } else if (error.message) {
          // Handle network error
          errorMessage = "Network error: Unable to reach the server. Please try again.";
        }
    
        this.error = errorMessage;
        console.error("Registration error:", errorMessage); // Log the error message
        toast.error(errorMessage);
        return false;
      }
    },
    

    // Logout action: clears both the store and localStorage
    logout() {
      this.accessToken = null;
      this.user = null;
      this.error = null;
      localStorage.removeItem("accessToken");
      /*  localStorage.removeItem("Role");  */
      localStorage.removeItem("hasVisitedDashboard");
      window.location.href = "/";
    },

    clearError() {
      this.error = null;
    },
  },
});
