<template>
  <div class="container">
    <ButtonPrincipal @click="openInsertModal" text="Adicionar Novo Ingrediente" class="mb-5"/>

    <!-- Indicador de carregamento -->
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="card shadow p-5" v-if="!isLoading">
      <table id="ingredientes-table" class="table table-striped table-bordered">
        <thead>
        <tr>
          <th style="text-align: center">Nome do Ingrediente</th>
          <th style="text-align: center">Quantidade</th>
          <th style="text-align: center">Categoria</th>
          <th style="text-align: center">Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ingrediente in ingredientes" :key="ingrediente.id">
          <td style="text-align: center">{{ ingrediente.tipo }}</td>
          <td style="text-align: center">{{ ingrediente.quantidade }}</td>
          <td style="text-align: center">{{ ingrediente.categoria }}</td>
          <td style="text-align: center;">
            <button class="update-btn" @click="openEditModal(ingrediente)">Alterar</button>
            <button class="delete-btn" @click="deleteIngrediente(ingrediente.id, ingrediente.categoria)">Excluir</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para cadastrar ingrediente -->
    <div class="modal fade" id="insertModal" tabindex="-1" role="dialog" aria-labelledby="insertModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="insertModalLabel">Cadastrar Ingrediente</h5>
            <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close" @click="closeInsertModal"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="ingredienteTipo">Nome do Ingrediente</label>
              <input type="text" id="ingredienteTipo" name="tipo" v-model="ingredienteTipo" class="form-control" placeholder="Digite o nome do ingrediente" required>
            </div>
            <div class="form-group">
              <label for="ingredienteQuantidade">Quantidade</label>
              <input type="text" id="ingredienteQuantidade" name="quantidade" v-model="quantidade" class="form-control" placeholder="Digite a quantidade de estoque que o ingrediente possui" required>
            </div>
            <div class="form-group">
              <label for="ingredienteCategoria">Categoria</label>
              <select id="ingredienteCategoria" name="ingredienteCategoria" v-model="ingredienteCategoria" class="form-control">
                <option value="Selecione a categoria" disabled>Selecione a categoria</option>
                <option value="Pães">Pães</option>
                <option value="Carnes">Carnes</option>
                <option value="Opcionais">Opcionais</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeInsertModal">Cancelar</button>
            <button type="button" class="btn btn-success" @click="insertIngrediente">Cadastrar Ingrediente</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para editar ingrediente -->
  <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editModalLabel">Editar Ingrediente</h5>
          <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close" @click="closeEditModal"></button>
        </div>
        <div class="modal-body" v-if="selectedIngrediente">
          <div class="form-group">
            <label for="ingredienteTipo">Nome do Ingrediente</label>
            <input type="text" class="form-control" id="ingredienteTipo" v-model="selectedIngrediente.tipo">
          </div>
          <div class="form-group">
            <label for="ingredienteQuantidade">Quantidade</label>
            <input type="text" class="form-control" id="ingredienteQuantidade" v-model="selectedIngrediente.quantidade">
          </div>
          <div class="form-group">
            <label for="ingredienteCategoria">Categoria</label>
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
      ingredientes: [],
      selectedIngrediente: [],
      dataTable: null,
      ingredienteTipo: "",
      quantidade: "",
      ingredienteCategoria: ""
    }
  },
  methods: {
    async getIngredientes() {
      this.isLoading = true;
      try {
        const response = await axios.get("https://api-burger-rho.vercel.app/ingredients");
        this.ingredientes = [
          ...response.data
        ];

        this.$nextTick(() => {
          this.initializeDataTable();
        });
      } catch (error) {
        console.error('Error fetching ingredientes:', error);
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

    async insertIngrediente(e) {
      e.preventDefault();

      const data = {
        tipo: this.ingredienteTipo,
        quantidade: this.quantidade,
        categoria: this.ingredienteCategoria
      };

      try {
        console.log('Data to be sent:', data); // Loga os dados a serem enviados

        const response = await axios.post("https://api-burger-rho.vercel.app/ingredients", data, {
          headers: {"Content-Type": "application/json"}
        });

        console.log('Response data:', response); // Loga a resposta recebida

        this.$swal({
          position: "center",
          icon: "success",
          title: "Ingrediente cadastrado com sucesso!",
          showConfirmButton: false,
          timer: 2000
        });

        // Limpar campos
        this.clearInputs();

        if (response.status === 201) {
          setTimeout(() => {
            this.$swal({
              title: 'Deseja cadastrar um novo ingrediente?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#198754',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sim, cadastrar novo ingrediente!',
              cancelButtonText: 'Não, apenas este!'
            }).then(async (result) => {
              if (result.isConfirmed) {
                  this.clearInputs();
              } else {
                this.closeInsertModal();
              }
            });
          }, 2500);
        }

        // Recarregar tabela
        // await this.getIngredientes();

      } catch (error) {
        console.error('Error creating ingrediente:', error.response ? error.response.data : error); // Loga erro
        this.$swal({
          position: "center",
          icon: "error",
          title: "Erro ao cadastrar ingrediente!",
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
        await axios.put(`https://api-burger-rho.vercel.app/ingredients/${id}`, data);
        $('#editModal').modal('hide');
        this.$swal('Atualizado!', 'Ingrediente atualizado com sucesso!', 'success');
        await this.getIngredientes();
      } catch (error) {
        console.error('Error updating ingrediente:', error);
      }
    },

    async deleteIngrediente(id) {
      this.$swal({
        title: 'Você tem certeza que deseja excluir este ingrediente?',
        text: 'Você não será capaz de reverter isso!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir ingrediente!',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`https://api-burger-rho.vercel.app/ingredients/${id}`);
            this.$swal({
              position: "center",
              icon: "success",
              title: "Excluído!",
              text: "Ingrediente excluído com sucesso!",
              showConfirmButton: false,
              timer: 2000
            });

            await this.getIngredientes();
          } catch (error) {
            console.error('Error deleting ingrediente:', error);
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

    openEditModal(ingrediente) {
      this.selectedIngrediente = {...ingrediente};
      $('#editModal').modal('show');
    },

    closeEditModal() {
      $('#editModal').modal('hide');
    },

    clearInputs() {
      this.ingredienteTipo = "";
      this.quantidade = "";
      this.ingredienteCategoria = "";
    },

    initializeDataTable() {
      this.$nextTick(() => {
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        this.dataTable = $('#ingredientes-table').DataTable({
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
