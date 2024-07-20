<template>
  <div class="register">
    <h2>Registro de Usuário</h2>
    <form @submit.prevent="registerUser">
      <div>
        <label for="username">Nome de Usuário:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div>
        <label for="password">Senha:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div>
        <label for="role">Função:</label>
        <select v-model="role" id="role">
          <option value="admin">Admin</option>
          <option value="waiter">Garçom</option>
        </select>
      </div>
      <button type="submit">Registrar</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      role: 'waiter', // Default role
      errorMessage: ''
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post('https://api-burger-rho.vercel.app/register', {
          username: this.username,
          password: this.password,
          role: this.role
        });
        // Handle successful registration (e.g., redirect to login page)
        console.log('User registered:', response.data);
        this.$router.push('/login'); // Redireciona para a página de login após registro
      } catch (error) {
        console.error('Error registering user:', error);
        this.errorMessage = error.response.data.error || 'Erro ao registrar usuário';
      }
    }
  }
};
</script>

<style scoped>
/* Adicione estilos aqui se necessário */
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.register h2 {
  margin-bottom: 20px;
}

.register div {
  margin-bottom: 10px;
}

.register label {
  display: block;
  margin-bottom: 5px;
}

.register input,
.register select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.register button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
