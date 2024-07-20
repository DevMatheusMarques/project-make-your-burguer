<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username</label>
        <input type="text" v-model="username" id="username" required>
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          username: this.username,
          password: this.password
        });

        const user = {
          token: response.data.token,
          role: response.data.role
        };
        localStorage.setItem('user', JSON.stringify(user));
        this.$router.push('/');
      } catch (error) {
        this.$swal({
          position: "center",
          icon: "error",
          title: "Usuário Incorreto! Por favor tente novamente",
          showConfirmButton: false,
          timer: 2500
        });
        console.error('Failed to login:', error);
      }
    }
  }
};
</script>
