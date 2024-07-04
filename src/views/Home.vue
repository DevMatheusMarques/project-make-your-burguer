<template>
  <div>
    <Banner />
    <div class="main-container">
      <h1>Informe os dados do pedido:</h1>
      <BurgerForm />
    </div>
  </div>
</template>

<script>
import Banner from '../components/Banner'
import BurgerForm from '../components/BurgerForm'

export default {
  name: 'Home',
  components: {
    Banner,
    BurgerForm
  }
}
</script>

<style>
@media (max-width: 480px) {
  h1 {
    margin-top: -20px;
    font-size: 20px;
  }
}

@media (max-width: 1024px) {
  h1 {
    margin-top: -20px;
  }
}
</style>