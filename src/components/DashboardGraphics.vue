<template>
  <div class="dashboard">
    <el-container>
      <el-header>
        <h1>Painel de Controle</h1>
      </el-header>
      <el-main>
        <el-row gutter="20">
          <el-col :span="12">
            <el-card>
              <h3>Pedidos Diários</h3>
              <LineChart :chartData="dailyOrdersData" />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <h3>Pedidos Semanais</h3>
              <BarChart :chartData="weeklyOrdersData" />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <h3>Pedidos Mensais</h3>
              <DoughnutChart :chartData="monthlyOrdersData" />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <h3>Faturamento Total</h3>
              <BarChart :chartData="revenueData" />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';
import LineChart from "@/components/Charts/LineChart.vue";
import BarChart from "@/components/Charts/BarChart.vue";
import DoughnutChart from "@/components/Charts/DoughnutChart.vue";

export default {
  components: {
    LineChart,
    BarChart,
    DoughnutChart
  },
  data() {
    return {
      dailyOrdersData: { labels: [], datasets: [{ data: [] }] },
      weeklyOrdersData: { labels: [], datasets: [{ data: [] }] },
      monthlyOrdersData: { labels: [], datasets: [{ data: [] }] },
      revenueData: { labels: [], datasets: [{ data: [] }] }
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('https://api-burger-rho.vercel.app/requests');
        const requests = response.data;

        this.dailyOrdersData = this.formatDataForChart(requests, 'daily');
        this.weeklyOrdersData = this.formatDataForChart(requests, 'weekly');
        this.monthlyOrdersData = this.formatDataForChart(requests, 'monthly');
        this.revenueData = this.calculateRevenue(requests);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    formatDataForChart(requests, period) {
      const labels = [];
      const data = [];

      requests.forEach(request => {
        const date = this.parseBrazilianDate(request.dataHora);
        if (!date) {
          console.error('Invalid date format:', request.dataHora);
          return;
        }

        let key = '';
        switch (period) {
          case 'daily':
            key = this.formatDateToBrazilian(date);
            break;
          case 'weekly':
            key = this.formatWeekRangeToBrazilian(date);
            break;
          case 'monthly':
            key = this.formatMonthToBrazilian(date);
            break;
          default:
            break;
        }

        if (labels.includes(key)) {
          data[labels.indexOf(key)] += 1;
        } else {
          labels.push(key);
          data.push(1);
        }
      });

      return {
        labels,
        datasets: [
          {
            label: 'Pedidos',
            data,
            backgroundColor: '#fcba03'
          }
        ]
      };
    },
    calculateRevenue(requests) {
      const labels = [];
      const data = [];

      requests.forEach(request => {
        const date = this.parseBrazilianDate(request.dataHora);
        if (!date) {
          console.error('Invalid date format:', request.dataHora);
          return;
        }

        const key = this.formatMonthToBrazilian(date);

        if (labels.includes(key)) {
          data[labels.indexOf(key)] += request.preco || 0;
        } else {
          labels.push(key);
          data.push(request.preco || 0);
        }
      });

      return {
        labels,
        datasets: [
          {
            label: 'Faturamento',
            data,
            backgroundColor: '#fcba03'
          }
        ]
      };
    },
    parseBrazilianDate(dateStr) {
      const [date, time] = dateStr.split(' ');
      const [day, month, year] = date.split('/');
      const [hour, minute, second] = time.split(':');
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    },
    formatDateToBrazilian(date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    formatWeekRangeToBrazilian(date) {
      const startOfWeek = this.getStartOfWeek(date);
      const endOfWeek = this.getEndOfWeek(date);
      return `${this.formatDateToBrazilian(startOfWeek)} a ${this.formatDateToBrazilian(endOfWeek)}`;
    },
    formatMonthToBrazilian(date) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${year}`;
    },
    getStartOfWeek(date) {
      const start = new Date(date);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday as first day of the week
      return new Date(start.setDate(diff));
    },
    getEndOfWeek(date) {
      const end = new Date(this.getStartOfWeek(date));
      end.setDate(end.getDate() + 6);
      return end;
    },
    getWeekNumber(date) {
      const start = new Date(date.getFullYear(), 0, 1);
      const diff = date - start + ((start.getDay() + 1) * 24 * 60 * 60 * 1000);
      const oneWeek = 1000 * 60 * 60 * 24 * 7;
      return Math.ceil(diff / oneWeek);
    }
  }
};
</script>

<style scoped>
.dashboard {
  margin: 0 100px;
  padding: 20px 50px;
}

.el-card {
  margin-bottom: 20px;
}

h1 {
  text-align: center;
}
</style>
