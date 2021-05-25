<script>
import { Line } from 'vue-chartjs';

const yAxisOptions = {
  yAxes: [{
    scaleLabel: {
      display: true,
      labelString: 'BTC/USD'
    }
  }]
};

export default {
  extends: Line,
  props: {
    computedChartData: Object
  },

  methods: {
    renderLineChart() {
      this.renderChart(
          { ...this.computedChartData },
          {
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Tube Algorithm Plot'
            },
            scales: {
              ...this.xAxisOptions,
              ...yAxisOptions
            },
            legend: {
              display: false
            }
          },
      );
    }
  },

  watch: {
    computedChartData() {
      this.$data._chart.destroy();
      this.renderLineChart();
    }
  },

  computed: {
    xAxisOptions() {
      const xTicks = Math.floor(this.computedChartData.labels.length / 2);
      return {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date',
          },
          ticks: {
            maxTicksLimit: xTicks
          }
        }]
      }
    }
  },

  mounted() {
    this.renderLineChart();
  },
};
</script>


