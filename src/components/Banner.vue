<template>
  <div id="main-banner">
    <h1>Império dos Hamburgueres</h1>
  </div>
</template>

<script>
  export default {
    name: "Banner"
  }
</script>

<style scoped>
  @media (max-width: 480px) {
    #main-banner {
      display: none;
    }
  }

  @media (max-width: 1279px) {
    #main-banner {
      display: none;
    }
  }

  @media (min-width: 1280px) {
    #main-banner {
      background-image: url('/public/img/burger.jpg');
      background-position: 0 -250px;
      background-size: cover;
      margin-left: 60px;
      height: 500px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    #main-banner h1 {
      color: #FFF;
      text-align: center;
      font-size: 60px;
      background-color: #222;
      padding: 20px 40px;
    }
  }
</style>