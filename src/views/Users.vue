<template>
  <div>
    <Navbar :logo="logo_src" :alt="app_name" />
    <div class="main-container">
      <UsersRegistered/>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import UsersRegistered from "@/components/UsersRegistered.vue";

export default {
  name: 'Users',
  data: function() {
    return {
      logo_src: "/img/logo.png",
      app_name: "Make Your Burger"
    }
  },
  components: {
    UsersRegistered,
    Navbar,
  }
}
</script>