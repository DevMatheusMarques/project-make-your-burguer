<template>
  <div>
    <Navbar :logo="logo_src" :alt="app_name" />
    <div class="main-container">
      <h1>Gerenciar pedidos:</h1>
      <RequestsRegistered/>
    </div>
  </div>
</template>

<script>
import RequestsRegistered from "@/components/RequestsRegistered.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: 'Pedidos',
  data: function() {
    return {
      logo_src: "/img/logo.png",
      app_name: "Make Your Burger"
    }
  },
  components: {
    Navbar,
    RequestsRegistered,

  }
}
</script>

<style>

</style>
