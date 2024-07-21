<template>
  <div>
    <Navbar :logo="logo_src" :alt="app_name" />
    <div class="main-container">
      <DashboardGraphics/>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import DashboardGraphics from "@/components/DashboardGraphics.vue";

export default {
  name: 'Dashboard',
  data: function() {
    return {
      logo_src: "/img/logo.png",
      app_name: "Make Your Burger"
    }
  },
  components: {
    DashboardGraphics,
    Navbar,
  }
}
</script>

<style>

</style>
