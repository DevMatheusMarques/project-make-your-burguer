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
        const response = await axios.get("https://api-burger-rho.vercel.app/burgers");
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
        const response = await axios.get("https://api-burger-rho.vercel.app/status");
        this.status = response.data;
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    },
    async deleteBurger(id) {
      try {
        await axios.delete(`https://api-burger-rho.vercel.app/burgers/${id}`);
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
        await axios.patch(`https://api-burger-rho.vercel.app/burgers/${id}`, { status: option });
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
