<template>
  <div id="container">
    <div id="nav">
      <img id="logo" :src="logo" :alt="alt">
      <router-link v-if="isAuthenticated && isAdmin" to="/dashboard" class="router-link">
        <img src="/icons/house-solid.svg" alt="Icone de Home" class="icon" style="position:fixed;">
        <span class="link-text" style="margin-left: 40px">Painel de Controle</span>
      </router-link>
      <router-link v-if="isAuthenticated && isAdmin" to="/ingredientes" class="router-link">
        <img src="/icons/ingredientes.svg" alt="Icone Ingredientes" class="icon">
        <span class="link-text">Ingredientes</span>
      </router-link>
      <router-link v-if="isAuthenticated && isAdmin" to="/pedidos" class="router-link">
        <img src="/icons/burger-solid.svg" alt="Icone Burguer" class="icon">
        <span class="link-text">Pedidos</span>
      </router-link>
      <router-link v-if="isAuthenticated && (isAdmin || isWaiter)" to="/cardapio" class="router-link">
        <img src="/icons/clipboard-list-solid.svg" alt="Icone de Pedido" class="icon" style="position:fixed;">
        <span class="link-text" style="margin-left: 40px">Fazer Pedido</span>
      </router-link>
      <button v-if="isAuthenticated && (isAdmin || isWaiter)" @click="logout" class="link-exit">
        <img src="/icons/door-open-solid.svg" alt="Icone Saída" class="icon">
        <span class="link-text">Sair</span>
      </button>
    </div>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";

export default {
  name: "Navbar",
  props: ["logo", "alt"],
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || {},
    };
  },
  methods: {
    extractRoleFromToken() {
      const token = localStorage.getItem('user'); // Supondo que 'user' seja o token
      if (!token) return null;
      try {
        const decodedToken = jwtDecode(token); // Decodifique o token
        return decodedToken.role; // Assumindo que o role está no payload do token
      } catch (e) {
        console.error('Failed to decode token:', e);
        return null;
      }
    },
    logout() {
      localStorage.removeItem('user');
      this.user = {};

      this.$router.push('/login');
    }
  },
  computed: {
    userRole() {
      return this.extractRoleFromToken(); // Atualiza a role a partir do token
    },
    isAdmin() {
      return this.userRole === 'admin';
    },
    isWaiter() {
      return this.userRole === 'waiter';
    },
    isAuthenticated() {
      return !!this.user.token;
    }
  }
};
</script>

<style scoped>
#container {
  display: flex;
}

#nav {
  background-color: #222;
  border-right: 4px solid #111;
  width: 60px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

#nav:hover {
  width: 220px;
}

#logo-url {
  margin-bottom: 20px;
}

#logo {
  width: 40px;
  height: 40px;
  margin-bottom: 3rem;
}

.router-link {
  color: #fcba03;
  text-decoration: none;
  margin: 12px 0;
  padding-left: 19px;
  display: flex;
  align-items: center;
  transition: color 0.3s;
  position: relative;
  height: 40px; /* Altura igual à altura do ícone */
  width: 100%; /* Para garantir que ocupe toda a largura disponível */
  justify-content: flex-start; /* Centraliza o conteúdo horizontalmente */
}

.router-link:hover {
  background-color: #555;
  color: #FFF;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.link-text {
  display: none;
  margin-left: 10px;
}

#nav:hover .link-text {
  display: inline;
  white-space: nowrap;
}

.router-link-active .icon {
  filter: invert(100%) brightness(0%) sepia(100%) hue-rotate(0deg) saturate(100%);
}

.router-link-active {
  background-color: #fad162; /* Cor de fundo para o link ativo */
  border-radius: 5px; /* Opcional: Adiciona bordas arredondadas */
  color: #222;
}

.router-link-active:hover {
  background-color: #fad162; /* Cor de fundo para o link ativo */
  color: #222;
}

.link-exit {
  background-color: #222;
  border: none;
  color: #fcba03;
  text-decoration: none;
  margin: auto 0 12px 0 ;
  padding-left: 14px;
  display: flex;
  align-items: center;
  transition: color 0.3s;
  position: relative;
  height: 40px; /* Altura igual à altura do ícone */
  width: 100%; /* Para garantir que ocupe toda a largura disponível */
  justify-content: center; /* Centraliza o conteúdo horizontalmente */
}

.link-exit:hover {
  background-color: #555;
  color: #FFF;
}

</style>