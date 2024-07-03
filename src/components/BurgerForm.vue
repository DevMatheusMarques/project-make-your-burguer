<template>
  <div>
    <form id="burger-form" method="POST" @submit="createBurger">
      <div class="input-container">
        <label for="nome">Nome do cliente:</label>
        <input type="text" id="nome" name="nome" v-model="nome" placeholder="Digite o seu nome">
      </div>
      <div class="input-container">
        <label for="pao">Escolha o pão:</label>
        <select name="pao" id="pao" v-model="pao">
          <option value=""></option>
          <option v-for="pao in paes" :key="pao.id" :value="pao.tipo">{{ pao.tipo }}</option>
        </select>
      </div>
      <div class="input-container">
        <label for="carne">Escolha a carne do seu Burger:</label>
        <select name="carne" id="carne" v-model="carne">
          <option value=""></option>
          <option v-for="carne in carnes" :key="carne.id" :value="carne.tipo">{{ carne.tipo }}</option>
        </select>
      </div>
      <div id="opcionais-container" class="input-container">
        <label id="opcionais-title" for="opcionais">Selecione os opcionais:</label>
        <div class="checkbox-container" v-for="opcional in opcionaisdata" :key="opcional.id">
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

export default {
  name: "Dashboard",
  data() {
    return {
      burgers: null,
      status: []
    }
  },
  methods: {
    async getPedidos() {
      try {
        const response = await axios.get("https://your-api-domain.com/burgers");
        this.burgers = response.data;
        this.getStatus();
      } catch (error) {
        console.error('Error fetching burgers:', error);
        this.$swal({
          position: "center",
          icon: "error",
          title: "Falha ao acessar dados!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
    async getStatus() {
      try {
        const response = await axios.get("https://your-api-domain.com/status");
        this.status = response.data;
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    },
    async deleteBurger(id) {
      try {
        await axios.delete(`https://your-api-domain.com/burgers/${id}`);
        this.$swal(
            'Cancelado!',
            'Pedido cancelado com sucesso!',
            'success'
        );
        this.getPedidos();
      } catch (error) {
        console.error('Error deleting burger:', error);
        this.$swal({
          position: "center",
          icon: "error",
          title: "Erro ao cancelar pedido!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
    async updateBurger(event, id) {
      const option = event.target.value;
      try {
        await axios.patch(`https://your-api-domain.com/burgers/${id}`, { status: option });
        console.log('Pedido atualizado com sucesso!');
      } catch (error) {
        console.error('Error updating burger:', error);
        this.$swal({
          position: "center",
          icon: "error",
          title: "Erro ao atualizar pedido!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
  },
  mounted() {
    this.getPedidos();
  }
}

</script>

<style scoped>
#burger-form {
  max-width: 400px;
  margin: 0 auto;
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
  margin: 0 auto;
  cursor: pointer;
  transition: .5s;
}

.submit-btn:hover {
  background-color: #fad162;
  color: #222;
}
</style>
