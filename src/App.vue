<template>
  <Navbar :logo="logo_src" :alt="app_name"/>
  <router-view/>
  <Footer/>
</template>

<style>
  * {
    font-family: Helvetica;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  h1 {
    text-align: center;
    font-size: 42px;
    margin-bottom: 30px;
    color: #222;
  }
</style>

<script>
import {defineComponent} from "vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  components: {Footer, Navbar},
  data() {
    return {
      logo_src: "/img/logo.png",
      app_name: "Logotipo da Empresa"
    }
  }
})

</script>