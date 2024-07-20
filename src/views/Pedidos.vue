<template>
  <div>
    <Navbar :logo="logo_src" :alt="app_name" />
    <div class="main-container">
      <h1>Gerenciar pedidos:</h1>
      <Dashboard />
    </div>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: 'Pedidos',
  components: {
    Navbar,
    Dashboard,

  }
}
</script>

<style>

</style>
