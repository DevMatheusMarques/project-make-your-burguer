<script>
export default {
  name: "Banner"
}
</script>

<template>
  <div class="container__banner">
    <h1>Make Your Burguer</h1>
  </div>
</template>

<style scoped>
  .container__banner {
    background-image: url("/public/img/burger.jpg");
    background-position: 0 -300px;
    background-size: cover;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

  }

  .container__banner h1 {
    color: #FFF;
    text-align: center;
    font-size: 60px;
    background-color: #222;
    padding: 20px 40px;
  }
</style>