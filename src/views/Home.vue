<template>
  <div class="container">
    <Banner/>
    <h1>Monte o seu lanche:</h1>
    <Form/>
  </div>
</template>

<script>
import Banner from "@/components/Banner.vue";
import Form from "@/components/Form.vue";

export default {
  name: 'Home',
  components: {Form, Banner},
}
</script>

<style>

</style>