<script>
export default {
  name: "ButtonPrincipal",
  props: {
    text: "",
  }
}
</script>

<template>
  <div class="input-container">
    <button class="submit-btn" type="submit"> {{ text }}</button>
  </div>
</template>

<style scoped>
.submit-btn {
  background-color: #fcba03;
  color: #222;
  font-weight: bold;
  border: 2px solid #222;
  border-radius: 6px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: .5s;
}

.submit-btn:hover {
  background-color: #fad162;
  color: #222;
}
</style>