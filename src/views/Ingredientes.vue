<template>
  <div>
    <div class="main-container">
      <h1>Ingredientes Cadastrados:</h1>
      <IngredientsRegistered />
    </div>
  </div>
</template>

<script>
import IngredientsRegistered from "@/components/IngredientsRegistered.vue";

export default {
  name: 'Ingredientes',
  components: {
    IngredientsRegistered

  }
}
</script>

<style>
@media (max-width: 480px) {
  h1 {
    margin-top: -20px;
  }
}

@media (max-width: 1024px) {
  h1 {
    margin-top: -20px;
  }
}
</style>