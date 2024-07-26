<template>
  <div class="container">
    <ButtonPrincipal @click="openInsertModal" text="Adicionar Novo Usuário" class="mb-5"/>

    <!-- Indicador de carregamento -->
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="card shadow p-5" v-if="!isLoading">
      <table id="users-table" class="table table-striped table-bordered">
        <thead>
        <tr>
          <th style="text-align: center">ID</th>
          <th style="text-align: center">Nome do Usuário</th>
          <th style="text-align: center">Tipo de Usuário</th>
          <th style="text-align: center">Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td style="text-align: center">{{ user.id }}</td>
          <td style="text-align: center">{{ user.username }}</td>
          <td style="text-align: center">{{ user.role }}</td>
          <td style="text-align: center;">
            <button class="update-btn" @click="openEditModal(user)">Alterar</button>
            <button class="delete-btn" @click="deleteIngrediente(user.id, user.categoria)">Excluir</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para cadastrar user -->
    <div class="modal fade" id="insertModal" tabindex="-1" role="dialog" aria-labelledby="insertModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="insertModalLabel">Cadastrar Usuário</h5>
            <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close" @click="closeInsertModal"></button>
          </div>
          <form @submit.prevent="registerUser">
            <div class="modal-body">
              <div class="form-group">
                <label for="userTipo">Nome do Usuário</label>
                <input type="text" id="userName" name="userName" v-model="username" class="form-control" placeholder="Digite o nome do user" required>
              </div>
              <div class="form-group">
                <label for="userQuantidade">Senha</label>
                <input type="password" id="password" name="password" v-model="password" class="form-control" placeholder="Digite a quantidade de estoque que o user possui" required>
              </div>
              <div class="form-group">
                <label for="userCategoria">Tipo de Usuário</label>
                <select id="role" name="role" v-model="role" class="form-control">
                  <option value="Selecione a categoria" disabled>Selecione a categoria</option>
                  <option value="admin">Administrador</option>
                  <option value="waiter">Garçom</option>
                </select>
              </div>
            </div>
          </form>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeInsertModal">Cancelar</button>
            <button type="submit" class="btn btn-success">Cadastrar Usuário</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para editar user -->
  <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editModalLabel">Editar Ingrediente</h5>
          <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close" @click="closeEditModal"></button>
        </div>
        <div class="modal-body" v-if="selectedIngrediente">
          <div class="form-group">
            <label for="userTipo">Nome do Ingrediente</label>
            <input type="text" class="form-control" id="userTipo" v-model="selectedIngrediente.tipo">
          </div>
          <div class="form-group">
            <label for="userQuantidade">Quantidade</label>
            <input type="text" class="form-control" id="userQuantidade" v-model="selectedIngrediente.quantidade">
          </div>
          <div class="form-group">
            <label for="userCategoria">Categoria</label>
            <select class="form-control" v-model="selectedIngrediente.categoria">
              <option value="Pães">Pães</option>
              <option value="Carnes">Carnes</option>
              <option value="Opcionais">Opcionais</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancelar</button>
          <button type="button" class="btn btn-success" @click="updateIngrediente">Salvar mudanças</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';
import jszip from 'jszip';
import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import ButtonPrincipal from "@/components/ButtonPrincipal.vue";

pdfmake.vfs = pdfFonts.pdfMake.vfs;

export default {
  name: "IngredientsRegistered",
  components: {ButtonPrincipal},
  data() {
    return {
      isLoading: false,
      users: [],
      selectedIngrediente: [],
      dataTable: null,
      username: "",
      password: "",
      role: "",

    }
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post('https://api-burger-rho.vercel.app/register', {
          username: this.username,
          password: this.password,
          role: this.role
        });
        // Handle successful registration (e.g., redirect to login page)
        console.log('User registered:', response.data);
        this.$router.push('/login'); // Redireciona para a página de login após registro
      } catch (error) {
        console.error('Error registering user:', error);
        this.errorMessage = error.response.data.error || 'Erro ao registrar usuário';
      }
    },
    async getIngredientes() {
      this.isLoading = true;
      try {
        const response = await axios.get("https://api-burger-rho.vercel.app/users");
        this.users = [
          ...response.data
        ];
        if (this.dataTable) {
          this.dataTable.clear().rows.add(this.users).draw();
        }

        this.$nextTick(() => {
          this.initializeDataTable();
        });
      } catch (error) {
        console.error('Error fetching users:', error);
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

    async updateTable() {
      try {
        const response = await axios.get("https://api-burger-rho.vercel.app/users");
        this.users = [
          ...response.data
        ];
      } catch (error) {
        console.error('Error fetching users:', error);
        this.$swal({
          position: "center",
          icon: "error",
          title: "Falha ao acessar dados!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    },

    async insertIngrediente(e) {
      e.preventDefault();

      const data = {
        tipo: this.userTipo,
        quantidade: this.quantidade,
        categoria: this.userCategoria
      };

      try {
        console.log('Data to be sent:', data); // Loga os dados a serem enviados

        const response = await axios.post("https://api-burger-rho.vercel.app/users", data, {
          headers: {"Content-Type": "application/json"}
        });

        console.log('Response data:', response.data); // Loga a resposta recebida

        this.$swal({
          position: "center",
          icon: "success",
          title: "Ingrediente cadastrado com sucesso!",
          showConfirmButton: false,
          timer: 2000
        });

        // Limpar campos
        this.userTipo = "";
        this.quantidade = "";
        this.userCategoria = "";

        // Recarregar tabela
        await this.updateTable();

        // // Fechar modal
        // this.closeInsertModal();
      } catch (error) {
        console.error('Error creating user:', error.response ? error.response.data : error); // Loga erro
        this.$swal({
          position: "center",
          icon: "error",
          title: "Erro ao cadastrar user!",
          showConfirmButton: false,
          timer: 2000
        });
      }
    },

    async updateIngrediente() {
      try {
        const id = this.selectedIngrediente.id;
        const data = {
          id: id,
          tipo: this.selectedIngrediente.tipo,
          quantidade: this.selectedIngrediente.quantidade,
          categoria: this.selectedIngrediente.categoria
        };
        console.log([id, data]);
        await axios.put(`https://api-burger-rho.vercel.app/users/${id}`, data);
        $('#editModal').modal('hide');
        this.$swal('Atualizado!', 'Ingrediente atualizado com sucesso!', 'success');
        await this.updateTable();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },

    async deleteIngrediente(id) {
      this.$swal({
        title: 'Você tem certeza que deseja excluir este user?',
        text: 'Você não será capaz de reverter isso!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir user!',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`https://api-burger-rho.vercel.app/users/${id}`);
            this.$swal({
              position: "center",
              icon: "success",
              title: "Excluído!",
              text: "Ingrediente excluído com sucesso!",
              showConfirmButton: false,
              timer: 2000
            });

            await this.updateTable();
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        }
      });

    },

    openInsertModal() {
      this.selectedIngrediente = null;
      $('#insertModal').modal('show');
    },

    closeInsertModal() {
      $('#insertModal').modal('hide');
    },

    openEditModal(user) {
      this.selectedIngrediente = {...user};
      $('#editModal').modal('show');
    },

    closeEditModal() {
      $('#editModal').modal('hide');
    },

    initializeDataTable() {
      this.$nextTick(() => {
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        this.dataTable = $('#users-table').DataTable({
          paging: true,
          searching: true,
          lengthMenu: [10, 20, 30, 40, 50, 100],
          order: [[0, 'asc']],
          language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json'
          },
          scrollY: '50vh', // Altura da rolagem vertical
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
              title: 'Ingredientes Cadastrados',
              className: 'data-btn',
              exportOptions: {
                columns: ':visible:not(:last-child)'
              }
            },
            {
              extend: 'excel',
              text: 'Exportar Excel',
              title: 'Ingredientes Cadastrados',
              filename: 'Ingredientes Cadastrados',
              className: 'data-btn',
              exportOptions: {
                columns: ':visible:not(:last-child)'
              }
            },
            {
              extend: 'pdf',
              text: 'Exportar PDF',
              title: 'Ingredientes Cadastrados',
              filename: 'Ingredientes Cadastrados',
              className: 'data-btn',
              exportOptions: {
                columns: ':visible:not(:last-child)'
              }
            },
            {
              extend: 'print',
              text: 'Imprimir Dados',
              title: 'Ingredientes Cadastrados',
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
    },
  },
  mounted() {
    this.getIngredientes();
  },
}
</script>

<style>
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

.update-btn {
  background-color: #FFF;
  color: #111;
  font-weight: bold;
  border-radius: 6px;
  border: 1px solid #111;
  padding: 6px 12px;
  font-size: 16px;
  margin-right: 12px;
  cursor: pointer;
  transition: .5s;
}

.update-btn:hover {
  background-color: #555;
  color: #fff;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

</style>
