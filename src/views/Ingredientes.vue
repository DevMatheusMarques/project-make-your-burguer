<template>
  <div>
    <Navbar :logo="logo_src" :alt="app_name" />
    <div class="main-container">
      <IngredientsRegistered />
    </div>
  </div>
</template>

<script>
import IngredientsRegistered from "@/components/IngredientsRegistered.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: 'Ingredientes',
  data: function() {
    return {
      logo_src: "/img/logo.png",
      app_name: "Make Your Burger"
    }
  },
  components: {
    Navbar,
    IngredientsRegistered

  }
}
</script>

<style>
.dt-buttons {
  display: flex;
  align-items: center;
}

.data-btn {
  background-color: #222;
  border: none;
  padding: 10px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 0px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 8px;
}

.dt-search {
  margin: 20px 20px;
}

.active>.page-link {
  background-color: #fcba03;
  color: #222;
  border: 2px solid #222;
}

.page-link {
  background-color: #FFF;
  color: #111;

}

.page-link:hover {
  background-color: #fad162;
  color: #222;
}

.pagination {
  padding-top: 1rem;
}

.first {
  display: none;
}

.last {
  display: none;
}
</style>