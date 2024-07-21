<template>
  <div class="chart-container">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, LineElement, PointElement, Title, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { defineComponent, ref, watch } from 'vue';

ChartJS.register(LineElement, PointElement, Title, Tooltip, Legend, CategoryScale, LinearScale);

export default defineComponent({
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const options = ref({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {beginAtZero: true},
        y: {beginAtZero: true}
      },
      plugins: {
        legend: {position: 'top'},
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            }
          }
        }
      }
    });

    const data = ref(props.chartData);

    watch(
        () => props.chartData,
        (newData) => {
          data.value = newData;
        },
        {deep: true}
    );

    return {data, options};
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
