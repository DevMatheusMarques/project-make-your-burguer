<template>
  <div>
    <Navbar :logo="logo_src" :alt="app_name" />
    <div class="main-container">
      <RequestsRegistered/>
    </div>
  </div>
</template>

<script>
import RequestsRegistered from "@/components/RequestsRegistered.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: 'InPersonOrders',
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
