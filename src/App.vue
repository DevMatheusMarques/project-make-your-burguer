<template>
  <div>
    <Navbar :logo="logo_src" :alt="app_name" />
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Navbar from './components/Navbar';

export default {
  name: "App",
  data: function() {
    return {
      logo_src: "/img/logo.png",
      app_name: "Make Your Burger"
    }
  },
  components: {
    Navbar,
  }
}
</script>

<style>
  html, body, #app {
    height: 100%;
    margin: 0;
  }

  * {
    font-family: Helvetica;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .main-container {
    margin-top: 10px;
  }

  h1 {
    text-align: center;
    font-size: 42px;
    margin-bottom: 30px;
    color: #222;
  }

  Navbar {
    width: 100%;
  }

  @media (max-width: 480px) {
    .main-container {
      margin-top: 10%;
    }
  }

  @media (max-width: 1024px) {
    .main-container {
      margin-top: 10%;
    }
  }
</style>
