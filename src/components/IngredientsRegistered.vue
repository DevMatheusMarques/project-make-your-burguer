<template>
  <div class="main-container">
    <div class="container">
      <button type="button" class="btn bg-black text-white mb-5" @click="openInsertModal">Adicionar Ingrediente</button>
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

export default {
  name: "IngredientsRegistered",
  data() {
    return {
      ingredientes: [],
      selectedIngrediente: [],
      dataTable: null,
      ingredienteTipo: [],
      quantidade: [],
      ingredienteCategoria: []
    }
  },
  methods: {
    async getIngredientes() {
      try {
        const response = await axios.get("http://localhost:3000/ingredientes");
        this.ingredientes = [
          ...response.data
          // ...response.data.categorias.paes,
          // ...response.data.categorias.carnes,
          // ...response.data.categorias.opcionais
        ];
        if (this.dataTable) {
          this.dataTable.clear().rows.add(this.ingredientes).draw();
        }

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
        const categoria = this.ingredienteCategoria.toLowerCase(); // Categoria do ingrediente
        console.log('Data to be sent:', data); // Loga os dados a serem enviados

        const response = await axios.post("http://localhost:3000/ingredientes", data, {
          headers: { "Content-Type": "application/json" }
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
        this.ingredienteTipo = "";
        this.quantidade = "";
        this.ingredienteCategoria = "";

        // Recarregar tabela
        await this.getIngredientes();

        // // Fechar modal
        // this.closeInsertModal();
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
        await axios.put(`http://localhost:3000/ingredientes/${id}`, data);
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
            await axios.delete(`http://localhost:3000/ingredientes/${id}`);
            this.$swal({
              position: "center",
              icon: "success",
              title: "Excluído!",
              text: "Ingrediente excluído com sucesso!",
              showConfirmButton: false,
              timer: 2000
            });
          } catch (error) {
            console.error('Error deleting ingrediente:', error);
          }
        }
      });
      await this.getIngredientes();
    },

    openInsertModal() {
      this.selectedIngrediente = null;
      $('#insertModal').modal('show');
    },

    closeInsertModal() {
      $('#insertModal').modal('hide');
    },

    openEditModal(ingrediente) {
      this.selectedIngrediente = { ...ingrediente };
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
        });
      });
    },
  },
  mounted() {
    this.getIngredientes();
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
</style>
