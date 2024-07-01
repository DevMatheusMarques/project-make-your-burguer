<script>
export default {
  name: "Navbar"
}
</script>

<template>
  <nav id="nav">
    <router-link to="/">
      <img src="/img/logo.png" alt="Logotipo da Empresa" id="logo">
    </router-link>
    <router-link to="/">
      Home
    </router-link>
    <router-link to="/pedidos">
      Pedidos
    </router-link>
  </nav>
</template>

<style scoped>

</style>