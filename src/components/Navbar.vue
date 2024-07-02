<script>
export default {
  name: "Navbar",
  props: ["logo", "alt"]
}
</script>

<template>
  <nav id="nav" class="nav">
    <router-link to="/" class="nav__link-logo-url">
      <img :src="logo" :alt="alt" class="nav__link-logo">
    </router-link>
    <router-link to="/" class="nav__link">
      Home
    </router-link>
    <router-link to="/pedidos" class="nav__link">
      Pedidos
    </router-link>
  </nav>
</template>

<style scoped>
  .nav {
    background-color: #222;
    border-bottom: 4px solid #111;
    padding: 15px 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .nav__link-logo-url {
    margin: auto;
    margin-left: 0;
  }

  .nav__link-logo{
    width: 40px;
    height: 40px;
  }

  .nav__link {
    color: #FCBA03;
    text-decoration: none;
    margin: 12px;
    transition: .5s;
  }

  .nav__link:hover {
    color: #FFF;
  }
</style>