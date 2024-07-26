<template>
  <div class="container">

    <!-- Indicador de carregamento -->
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="card shadow p-5" v-if="!isLoading">
      <table id="request-table" class="table table-striped table-bordered">
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
        <tr v-for="request in requests" :key="request.id">
          <td>{{ request.id }}</td>
          <td>{{ request.nome }}</td>
          <td>{{ request.pao }}</td>
          <td>{{ request.carne }}</td>
          <td>
            <ul>
              <li v-for="(opcional, index) in request.opcionais" :key="index">{{ opcional }}</li>
            </ul>
          </td>
          <td>{{ request.dataHora }}</td>
          <td style="text-align: center; ">
            <select name="status" class="status" @change="updateBurger($event, request.id)">
              <option :value="s.tipo" v-for="s in status" :key="s.id" :selected="request.status == s.tipo">
                {{ s.tipo }}
              </option>
            </select>
            <button class="delete-btn" @click="deleteBurger(request.id)">Cancelar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';
import jszip from 'jszip';
import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';

export default {
  name: "Dashboard",
  data() {
    return {
      isLoading: false,
      requests: [],
      status: [],
      dataTable: null,
    }
  },
  methods: {
    async getPedidos() {
      this.isLoading = true;
      try {
        const response = await axios.get("https://api-burger-rho.vercel.app/requests");
        this.requests = response.data.map(request => ({
          ...request,
          dataHora: request.dataHora || 'N/A'
        }));
        await this.getStatus();
        if (this.dataTable) {
          this.dataTable.clear().rows.add(this.requests).draw();
        }
        this.$nextTick(() => {
          this.initializeDataTable();
        });
      } catch (error) {
        console.error('Error fetching requests:', error);
        this.$swal({
          position: "center",
          icon: "error",
          title: "Falha ao acessar dados!",
          showConfirmButton: false,
          timer: 1500
        });
      } finally {
        this.isLoading = false;
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
        const response = await axios.put(`https://api-burger-rho.vercel.app/requests/${id}`, data);
        console.log(response.data);
      } catch (error) {
        console.error('Error updating request:', error);
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
            await axios.delete(`https://api-burger-rho.vercel.app/requests/${id}`);
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
            console.error('Error deleting request:', error);
          }
        }
      });
    },
    initializeDataTable() {
      this.$nextTick(() => {
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        this.dataTable = $('#request-table').DataTable({
          paging: true,
          searching: true,
          lengthMenu: [10, 20, 30, 40, 50, 100],
          order: [[6, 'desc']],
          language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json'
          },
          scrollY: '50vh',
          scrollCollapse: true,
          processing: true,
          responsive: true,
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'pageLength',
              text: 'Resultados por Página',
              className: 'data-btn'
            },
            {
              extend: 'copy',
              text: 'Copiar Dados',
              title: 'Pedidos Cadastrados',
              className: 'data-btn',
              exportOptions: {
                columns: ':visible:not(:last-child)'
              }
            },
            {
              extend: 'excel',
              text: 'Exportar Excel',
              title: 'Pedidos Cadastrados',
              filename: 'Pedidos Cadastrados',
              className: 'data-btn',
              exportOptions: {
                columns: ':visible:not(:last-child)'
              }
            },
            {
              extend: 'pdf',
              text: 'Exportar PDF',
              title: 'Pedidos Cadastrados',
              filename: 'Pedidos Cadastrados',
              className: 'data-btn',
              exportOptions: {
                columns: ':visible:not(:last-child)'
              }
            },
            {
              extend: 'print',
              text: 'Imprimir Dados',
              title: 'Pedidos Cadastrados',
              className: 'data-btn',
              exportOptions: {
                columns: ':visible:not(:last-child)'
              }
            },
            {
              extend: 'colvis',
              text: 'Visibilidade das Colunas',
              className: 'data-btn'
            },
          ]
        });
      });
    }
  },
  mounted() {
    this.getPedidos();
  }
}
</script>

<style scoped>

.container {
  width: 90vw;
  padding: 1rem 3rem 3rem 3rem;
  z-index: 0;
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

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
</style>
