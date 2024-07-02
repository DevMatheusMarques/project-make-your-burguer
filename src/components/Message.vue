<script>
export default {
  name: "Message",
  props: {msg: String}
}
</script>

<template>
  <div class="container__message">
    <p>{{ msg }}</p>
  </div>
</template>

<style scoped>
.container__message {
  color: #004085;
  background-color: #CCE5FF;
  border: 2px solid #B8DAFF;
  border-radius: 6px;
  padding: 10px;
  max-width: 400px;
  margin: 30px auto;
}
</style>