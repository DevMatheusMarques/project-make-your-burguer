<script>
export default {
  name: "Form",
  data() {
    return {
      breads: null,
      meats: null,
      optionaldata: null,
      name: null,
      bread: null,
      meat: null,
      optional: [],
      status: "Solicitado",
      msg: null
    }
  },
  methods: {
    async getIngredients() {
      const req = await fetch("http://localhost:3000/ingredientes");
      const data = await req.json();

      this.breads = data.paes;
      this.meats = data.carnes;
      this.optionaldata = data.opcionais;

    }
  },
  mounted() {
    this.getIngredients();
  }
}
</script>

<template>
  <div>
    <p>Componente de Mensagem</p>
    <div class="form">
      <div class="form__input">
        <label for="name">Nome do cliente:</label>
        <input type="text" name="name" id="name" v-model="nome" placeholder="Digite o nome do cliente" required>
      </div>
      <div class="form__input">
        <label for="bread">Escolha o tipo de pão:</label>
        <select name="bread" id="bread" v-model="bread" required>
          <option value=""></option>
          <option v-for="bread in breads" :key="bread.id" :value="bread.tipo">
            {{bread.tipo}}
          </option>
        </select>
      </div>
      <div class="form__input">
        <label for="meat">Escolha o tipo de carne:</label>
        <select name="meat" id="bread" v-model="meat" required>
          <option value=""></option>
          <option v-for="meat in meats" :key="meat.id" :value="meat.tipo">{{meat.tipo}}</option>
        </select>
      </div>
      <div class="form__input form__input-optional">
        <label for="optional" class="form__input-title">Selecione os opcionais:</label>
        <div class="form__input-checkbox" v-for="optional in optionaldata" :key="optional.id" aria-required="true">
          <input type="checkbox" name="optionals" v-model="optionals" :value="optional.tipo">
          <span>{{ optional.tipo }}</span>
        </div>
      </div>
      <div class="form__input">
        <input type="submit" value="Finalizar Pedido" class="form__input-submit">
      </div>
    </div>
  </div>
</template>

<style scoped>
  .form {
    max-width: 400px;
    margin: 0 auto;
  }

  .form__input {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  label {
    font-weight: bold;
    margin-bottom: 15px;
    color: #222;
    padding: 5px 10px;
    border-left: 4px solid #FCBA03;
  }

  input, select {
    padding: 5px 10px;
    width: 300px;
    border: 2px solid #222;
    border-radius: 6px;
  }

  .form__input-optional {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .form__input-title {
    width: 100%;
  }

  .form__input-checkbox {
    display: flex;
    align-items: flex-start;
    width: 50%;
    margin-bottom: 20px;
  }

  .form__input-checkbox span, .form__input-checkbox input {
    width: auto;
  }

  .form__input-checkbox span {
    margin-left: 6px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form__input-submit {
    background-color: #FCBA03;
    color: #222;
    font-weight: bold;
    border: 2px solid #222;
    border-radius: 6px;
    padding: 10px;
    font-size: 16px;
    margin: 0 auto;
    cursor: pointer;
    transition: .5s;
  }

  .form__input-submit:hover {
    background-color: #f8cf5e;
    color: #222;
  }
</style>