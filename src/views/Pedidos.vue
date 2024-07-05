<template>
  <div>
    <div class="main-container">
      <h1>Gerenciar pedidos:</h1>
      <Dashboard />
    </div>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";

export default {
  name: 'Pedidos',
  components: {
    Dashboard,

  }
}
</script>

<style>
.main-container {
  width: 90%;
  margin: 20px auto;
}
</style>
