<script>
import { Line } from 'vue-chartjs';

const xAxisOptions = {
  xAxes: [{
    scaleLabel: {
      display: true,
      labelString: 'Date'
    }
  }]
};

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
          {...this.computedChartData},
          {
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Tube Algorithm Plot'
            },
            scales: {
              ...xAxisOptions,
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

  mounted() {
    this.renderLineChart();
  },
};
</script>


