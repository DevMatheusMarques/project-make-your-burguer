<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { defineComponent, ref, watch } from 'vue';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default defineComponent({
  name: 'DoughnutChart',
  components: { Doughnut },
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
