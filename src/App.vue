<template>
  <Navbar/>
  <router-view/>
  <Footer/>
</template>

<style>

</style>
<script>
import Navbar from "@/components/Navbar.vue";
import {defineComponent} from "vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  components: {Footer, Navbar}
})

</script>