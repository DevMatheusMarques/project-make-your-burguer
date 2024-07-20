<template>
  <div class="container">
    <form id="burger-form" @submit="createBurger">
      <div class="input-container">
        <label for="nome">Nome do cliente:</label>
        <input type="text" id="nome" name="nome" v-model="nome" placeholder="Digite o seu nome" required>
      </div>
      <div class="input-container">
        <label for="pao">Escolha o pão:</label>
        <select name="pao" id="pao" v-model="pao" required>
          <option value=""></option>
          <option v-for="pao in paes" :key="pao.id" :value="pao.tipo">{{ pao.tipo }}</option>
        </select>
      </div>
      <div class="input-container">
        <label for="carne">Escolha a carne:</label>
        <select name="carne" id="carne" v-model="carne" required>
          <option value=""></option>
          <option v-for="carne in carnes" :key="carne.id" :value="carne.tipo">{{ carne.tipo }}</option>
        </select>
      </div>
      <div id="opcionais-container" class="input-container">
        <label id="opcionais-title" for="opcionais">Escolha os opcionais:</label>
        <div class="checkbox-container" v-for="opcional in opcionaisData" :key="opcional.id">
          <input type="checkbox" name="opcionais" v-model="opcionais" :value="opcional.tipo" id="checkbox">
          <span>{{ opcional.tipo }}</span>
        </div>
      </div>
      <div class="input-container">
        <input class="submit-btn" type="submit" value="Finalizar Pedido">
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { format } from 'date-fns';

export default {
  name: "BurgerForm",
  data() {
    return {
      paes: null,
      carnes: null,
      opcionaisData: null,
      nome: null,
      pao: null,
      carne: null,
      opcionais: [],
      status: "Solicitado",
    }
  },
  methods: {
    async getIngredientes() {
      try {
        const response = await axios.get("https://api-burger-rho.vercel.app/ingredientes");
        const ingredientes = response.data;

        this.paes = ingredientes.filter(item => item.categoria.toLowerCase() === 'pães');
        this.carnes = ingredientes.filter(item => item.categoria.toLowerCase() === 'carnes');
        this.opcionaisData = ingredientes.filter(item => item.categoria.toLowerCase() === 'opcionais');

        console.log(this.paes, this.carnes, this.opcionais);
      } catch (error) {
        console.error('Error fetching ingredientes:', error);
      }
    },

    async createBurger(e) {
      e.preventDefault();

      const data = {
        nome: this.nome,
        pao: this.pao,
        carne: this.carne,
        opcionais: Array.from(this.opcionais),
        status: "Solicitado",
        dataHora: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
      };

      try {
        const response = await axios.post("https://api-burger-rho.vercel.app/burgers", data, {
          headers: {"Content-Type": "application/json"}
        });

        console.log(response.data);

        this.$swal({
          position: "center",
          icon: "success",
          title: "Pedido realizado com sucesso!",
          showConfirmButton: false,
          timer: 2000
        });

        // limpar campos
        this.nome = "";
        this.carne = "";
        this.pao = "";
        this.opcionais = [];
      } catch (error) {
        console.error('Error creating burger:', error);
        this.$swal({
          position: "center",
          icon: "error",
          title: "Erro ao realizar o pedido!",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  },
  mounted() {
    this.getIngredientes();
  }
}
</script>

<style scoped>
  #burger-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  label {
    font-weight: bold;
    margin-bottom: 15px;
    color: #222;
    padding: 5px 10px;
    border-left: 4px solid #fcba03;
  }

  input, select {
    padding: 5px 10px;
    width: 300px;
    border-radius: 6px;
    border: 2px solid #222;
  }

  #opcionais-container {
    flex-direction: row;
    flex-wrap: wrap;
  }

  #opcionais-title {
    width: 100%;
  }

  .checkbox-container {
    display: flex;
    align-items: flex-start;
    width: 50%;
    margin-bottom: 20px;
  }

  .checkbox-container span,
  .checkbox-container input {
    width: auto;
  }

  .checkbox-container span {
    margin-left: 6px;
    font-weight: bold;
  }

  /* Estilizar o checkbox */
  input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #222;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  input[type="checkbox"]:checked {
    background-color: #fcba03;
  }

  input[type="checkbox"]:checked::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 6px;
    width: 4px;
    height: 10px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

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

  @media (max-width: 480px) {
    #burger-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 400px;
      margin: 0 auto;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
    }

    #opcionais-container {
      flex-direction: column;
    }
  }

  @media (max-width: 1024px) {
    #burger-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 380px;
      margin: 0 auto;
      font-size: 25px;
    }

    label {
      font-weight: bold;
      margin-bottom: 30px;
      color: #222;
      padding: 5px 10px;
      border-left: 4px solid #fcba03;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
    }

    #opcionais-container {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
</style>