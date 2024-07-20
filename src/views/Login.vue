<template>
  <div class="container-login">
    <div class="container-form">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="input-container">
          <label for="username">Nome de Usuário</label>
          <input type="text" v-model="username" id="username" name="username" placeholder="Digite seu nome de usuário" required>
        </div>
        <div class="input-container password-container">
          <label for="password">Senha</label>
          <div class="password-wrapper">
            <input :type="passwordFieldType" v-model="password" id="password" name="password" placeholder="Digite sua senha" required>
            <span class="password-toggle" @click="togglePasswordVisibility">
              <img :src="passwordVisible ? '/icons/eye-slash-solid.svg' : '/icons/eye-solid.svg'" alt="Toggle Visibility">
            </span>
          </div>
        </div>
        <ButtonPrincipal text="Entrar"/>
      </form>
    </div>
    <div class="background-image"></div>
  </div>
</template>

<script>
import axios from '@/axios';
import ButtonPrincipal from "@/components/ButtonPrincipal.vue";

export default {
  components: { ButtonPrincipal },
  data() {
    return {
      username: '',
      password: '',
      passwordVisible: false // Adiciona uma propriedade para controlar a visibilidade
    };
  },
  computed: {
    passwordFieldType() {
      return this.passwordVisible ? 'text' : 'password'; // Altera o tipo do campo de senha
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://api-burger-rho.vercel.app/login', {
          username: this.username,
          password: this.password,
        });

        const user = {
          token: response.data.token,
          role: response.data.role
        };
        localStorage.setItem('user', JSON.stringify(user));

        this.user = user;

        this.$swal({
          position: "center",
          icon: "success",
          title: "Olá " + this.username + " seja bem vindo(a)",
          showConfirmButton: false,
          timer: 2500,
        });

        this.$router.push('/pedidos');
      } catch (error) {
        this.$swal({
          position: "center",
          icon: "error",
          title: "Usuário Incorreto! Por favor tente novamente",
          showConfirmButton: false,
          timer: 2500
        });
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible; // Alterna a visibilidade da senha
    }
  }
};
</script>

<style scoped>
.container-login {
  height: 100vh;
  display: flex;
  background-image: url("@/assets/burger.jpg");
  background-position: 0;
  background-size: cover;
  color: #FFF;
  align-items: center;
  justify-content: flex-start;
  opacity: 80%;
}

.container-form {
  width: 50%;
  margin: 8%;
}

h2 {
  margin-bottom: 5%;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 50%;
}

label {
  color: #FFF;
  font-weight: bold;
  margin-bottom: 15px;
  padding: 5px 10px;
  border-left: 4px solid #fcba03;
}

input {
  padding: 5px 10px;
  width: 100%;
  border-radius: 6px;
  border: 2px solid #222;
}

.password-container {
  position: relative;
}

.password-wrapper {
  display: flex;
  align-items: center;
}

.password-toggle {
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.password-toggle img {
  width: 20px;
  height: 20px;
}

.background-image {
  background-image: url("@/assets/burger.jpg");
  background-position: 0 -250px;
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

</style>