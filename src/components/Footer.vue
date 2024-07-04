<template>
  <div id="footer">
    <p>Império dos Hamburgueres &copy; 2024</p>
  </div>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>
  #footer {
    height: 80px;
    background-color: #222;
    border-top: 4px solid #111;
    color: #fcba03;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  @media (max-width: 480px) {
    #footer {
      display: none;
    }
  }

  @media (max-width: 1024px) {
    #footer {
      position: absolute;
      bottom: 0;
    }
  }
</style>