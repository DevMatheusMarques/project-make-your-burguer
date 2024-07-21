<template>
  <div class="container">
    <table id="burger-table" class="table table-striped table-bordered">
      <thead>
      <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>Pão</th>
        <th>Carne</th>
        <th>Opcionais</th>
        <th>Data e Hora</th>
        <th style="text-align: center">Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="burger in burgers" :key="burger.id">
        <td>{{ burger.id }}</td>
        <td>{{ burger.nome }}</td>
        <td>{{ burger.pao }}</td>
        <td>{{ burger.carne }}</td>
        <td>
          <ul>
            <li v-for="(opcional, index) in burger.opcionais" :key="index">{{ opcional }}</li>
          </ul>
        </td>
        <td>{{ burger.dataHora }}</td>
        <td style="text-align: center; ">
          <select name="status" class="status" @change="updateBurger($event, burger.id)">
            <option :value="s.tipo" v-for="s in status" :key="s.id" :selected="burger.status == s.tipo">
              {{ s.tipo }}
            </option>
          </select>
          <button class="delete-btn" @click="deleteBurger(burger.id)">Cancelar</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

export default {
  name: "Dashboard",
  data() {
    return {
      burgers: [],
      status: [],
      dataTable: null,
    }
  },
  methods: {
    async getPedidos() {
      try {
        const response = await axios.get("https://api-burger-rho.vercel.app/burgers");
        this.burgers = response.data.map(burger => ({
          ...burger,
          dataHora: burger.dataHora || 'N/A'
        }));
        await this.getStatus();
        if (this.dataTable) {
          this.dataTable.clear().rows.add(this.burgers).draw();
        }
        await this.$nextTick(() => {
          this.initializeDataTable();
        });
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
        const response = await axios.get("https://api-burger-rho.vercel.app/status");
        this.status = response.data;
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    },

    async updateBurger(event, id) {
      const option = event.target.value;
      const data = { status: option };

      try {
        const response = await axios.put(`https://api-burger-rho.vercel.app/burgers/${id}`, data);
        console.log(response.data);
      } catch (error) {
        console.error('Error updating burger:', error);
      }
    },

    async deleteBurger(id) {
      this.$swal({
        title: 'Você tem certeza que deseja cancelar este pedido?',
        text: 'Você não será capaz de reverter isso!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, cancelar pedido!',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`https://api-burger-rho.vercel.app/burgers/${id}`);
            this.$swal({
              position: "center",
              icon: "success",
              title: "Cancelado!",
              text: "Pedido cancelado com sucesso!",
              showConfirmButton: false,
              timer: 2000
            });
            await this.getPedidos();
          } catch (error) {
            console.error('Error deleting burger:', error);
          }
        }
      });
    },

    initializeDataTable() {
      this.$nextTick(() => {
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        this.dataTable = $('#burger-table').DataTable({
          paging: true,
          searching: true,
          lengthMenu: [10, 20, 30, 40, 50, 100],
          order: [[0, 'desc']],
          language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json'
          },
          scrollY: '50vh', // Altura da rolagem vertical
          scrollCollapse: true,
          processing: true,
          responsive: true,
        });
      });
    },
  },
  mounted() {
    this.getPedidos();
  }
}
</script>

<style scoped>

.container {
  width: 90vw;
}

.table {
  margin: 0 auto;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

select {
  padding: 8.5px 6px;
  margin-right: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.delete-btn {
  background-color: #FF0000;
  color: #fff;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  padding: 7px 12px;
  font-size: 16px;
  margin: 0 auto;
  cursor: pointer;
  transition: .5s;
}

.delete-btn:hover {
  background-color: #dd0101;
  color: #fff;
}

</style>
