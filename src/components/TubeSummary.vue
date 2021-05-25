<template>
  <div>
    <FormComponent
    @minTubeSizeChanged="minTubeSize=$event"
    @toleranceFactorChanged="toleranceFactor=$event"
    @minToleranceChanged="minTolerance=$event"
    @maxToleranceChanged="maxTolerance=$event"
    @isFilteredChanged="isFiltered=$event"
    ></FormComponent>
    <LineChart v-if="!isFiltered" :computed-chart-data="chartData"/>
    <LineChart v-if="isFiltered" :computed-chart-data="filteredChartData"/>
    <div class="spacer"></div>
    <md-chip class="md-primary md-chip--spaced" :key="'MSE'">
      <span>
        <strong>MSE: {{ meanSquaredErrorValue }}</strong>
      </span>
    </md-chip>
    <md-chip class="md-primary md-chip--spaced" :key="'RMSE'">
      <span>
        <strong>RMSE: {{ rootMeanSquaredErrorValue }}</strong>
      </span>
    </md-chip>
    <md-chip class="md-primary md-chip--spaced" :key="'MAE'">
      <span>
        <strong>MAE: {{ meanAbsoluteErrorValue }}</strong>
      </span>
    </md-chip>
    <md-chip class="md-primary md-chip--spaced" :key="'MAPE'">
      <span>
        <strong>MAPE: {{ meanAbsolutePercentageErrorValue }}%</strong>
      </span>
    </md-chip>
    <div class="spacer"></div>
    <Table :tubes="tubes"/>
  </div>
</template>

<script>
import LineChart from './LineChart.vue';
import { Tube } from '@/Tube/Tube';
import {
  round,
  getFilledArray,
  meanSquaredError,
  meanAbsolutePercentageError,
  meanAbsoluteError,
  rootMeanSquaredError, medianFilter
} from '@/utils/helpers';
import Table from '@/components/Table';
import FormComponent from '@/components/FormComponent';

const TUBE_BORDER = {
  UPPER: 'upper',
  BOTTOM: 'bottom'
};

const COLORS = {
  BORDER: 'rgba(1, 116, 188, 0.5)',
  POINT: 'rgba(1, 116, 188, 1)',
  TUBE_FILL: 'rgba(1, 188, 70, 0.1)',
  TUBE_BORDER: 'rgba(1, 188, 70, 0.5)',
  TUBE_POINT: 'rgba(1, 188, 70, 1)',
  TUBE_ANOMALY_BORDER: 'rgba(255, 0, 0, 0.5)',
  TUBE_ANOMALY_POINT: 'rgba(255, 0, 0, 1)',
  TUBE_ANOMALY_FILL: 'rgba(255, 0, 0, 0.3)'
};

const defaultDataset = {
  fill: true,
  lineTension: 0,
  label: 'Data',
  backgroundColor: 'transparent',
  borderColor: COLORS.BORDER,
  pointBackgroundColor: COLORS.POINT
};

const defaultTubeDataset = {
  fill: false,
  lineTension: 0,
  label: 'Tube Data',
  backgroundColor: 'transparent',
  borderColor: COLORS.TUBE_BORDER,
  pointBackgroundColor: COLORS.TUBE_POINT
};

export default {
  name: 'TubeSummary',
  components: {
    FormComponent,
    LineChart,
    Table
  },

  props: {
    summaryData: []
  },

  data() {
    return {
      minTubeSize: 6,
      toleranceFactor: 10,
      minTolerance: 1,
      maxTolerance: 90,
      isFiltered: false,
      tube: null,
      tubes: []
    }
  },

  methods: {
    round(number, decimalPlaces) {
      return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
    },

    getLabel(tubeBorder, tubeDataIndex) {
      if (tubeBorder === TUBE_BORDER.UPPER) {
        return `Upper tube border (${ tubeDataIndex + 1 })`;
      }

      return `Bottom tube border (${ tubeDataIndex + 1 })`;
    },

    isAnomaly(pointsToAppend) {
      let isAnomaly = false;
      let anomalyIndex = null;

      pointsToAppend.forEach((point, index) => {
        if (!this.tube.isInTube(point)) {
          isAnomaly = true;
          anomalyIndex = index;
        }
      })

      return { isAnomaly, anomalyIndex };
    },

    handleFirstPoint(upperTubeData, bottomTubeData, data) {
      this.tubes = [];
      const firstPoints = data.slice(0, this.minTubeSize);
      this.tube = new Tube(this.minTolerance, this.maxTolerance, this.toleranceFactor, firstPoints, 0);
      const { isAnomaly } = this.isAnomaly(firstPoints);
      this.tube.isAnomaly = isAnomaly;
      this.tubes.push(this.tube);

      upperTubeData[0] = { data: getFilledArray(data,null), borderType: TUBE_BORDER.UPPER };
      bottomTubeData[0] = { data: getFilledArray(data,null), borderType: TUBE_BORDER.BOTTOM };
    },

    updateTubeData(tubeData, tubeDataIndex, point, index) {
      const tubeBorder = tubeData[tubeDataIndex].borderType;
      tubeData[tubeDataIndex] = {
        ...defaultTubeDataset,
        ...tubeData[tubeDataIndex],
        pointBackgroundColor: this.tube.isAnomaly ? COLORS.TUBE_ANOMALY_POINT : COLORS.TUBE_POINT,
        borderColor: this.tube.isAnomaly ? COLORS.TUBE_ANOMALY_BORDER : COLORS.TUBE_BORDER,
        label: this.getLabel(tubeBorder, tubeDataIndex)
      };

      if (tubeBorder === TUBE_BORDER.UPPER) {
        tubeData[tubeDataIndex].data[index] = this.round(this.tube.getUpperTube(point), 2);
        tubeData[tubeDataIndex] = {
          ...tubeData[tubeDataIndex],
          fill: true,
          backgroundColor: 'transparent'
        };
      } else {
        tubeData[tubeDataIndex].data[index] = this.round(this.tube.getBottomTube(point), 2);
        tubeData[tubeDataIndex] = {
          ...tubeData[tubeDataIndex],
          fill: '-1',
          backgroundColor: this.tube.isAnomaly ? COLORS.TUBE_ANOMALY_FILL : COLORS.TUBE_FILL
        };
      }
    },

    handlePointInsideTube(upperTubeData, bottomTubeData, tubeDataIndex, index, point) {
      this.updateTubeData(upperTubeData, tubeDataIndex, point, index);
      this.updateTubeData(bottomTubeData, tubeDataIndex, point, index);
    },

    handlePointOutsideTube(upperTubeData, bottomTubeData, tubeDataIndex, index, point, data) {
      const pointsToAppend = data.slice(index, index + this.minTubeSize);
      this.tube = new Tube(this.minTolerance, this.maxTolerance, this.toleranceFactor, pointsToAppend, tubeDataIndex);
      const { isAnomaly, anomalyIndex } = this.isAnomaly(pointsToAppend);
      this.tube.isAnomaly = isAnomaly;
      this.tubes.push(this.tube);

      upperTubeData[tubeDataIndex] = { data: getFilledArray(data,null), borderType: TUBE_BORDER.UPPER };
      this.updateTubeData(upperTubeData, tubeDataIndex, point, index);

      bottomTubeData[tubeDataIndex] = { data: getFilledArray(data,null), borderType: TUBE_BORDER.BOTTOM };
      this.updateTubeData(bottomTubeData, tubeDataIndex, point, index);

      return anomalyIndex === 0;
    },

    getFinalTubeData(upperTubeData, bottomTubeData) {
      const finalTubeData = [];
      upperTubeData.forEach((element, index) => {
        finalTubeData.push(element);
        finalTubeData.push(bottomTubeData[index]);
      });

      return finalTubeData;
    },

    computeChartData(data) {
      const upperTubeData = [];
      const bottomTubeData = [];
      let tubeDataIndex = 0;
      let isLastPointAnomaly = false;

      data.forEach((point, index) => {
        if (index === 0) {
          this.handleFirstPoint(upperTubeData, bottomTubeData, data);
        } if (this.tube.isInTube(point) && !isLastPointAnomaly) {
          this.handlePointInsideTube(upperTubeData, bottomTubeData, tubeDataIndex, index, point);
        } else {
          tubeDataIndex += 1;
          isLastPointAnomaly = this.handlePointOutsideTube(upperTubeData, bottomTubeData, tubeDataIndex, index,
              point, data);
        }
      });

      return { upperTubeData, bottomTubeData };
    },

    getChartOptions(data, finalTubeData) {
      return {
        labels: data.map(({ Date }) => Date),
        datasets: [
          {
            ...defaultDataset,
            data: data.map(({ y }) => y)
          },
          ...finalTubeData
        ]
      }
    },

    reduceTubeBorderData(tubeBorderData) {
      return tubeBorderData.reduce((acc, val) => {
        return acc.concat(...val.data.filter(el => el));
      }, []);
    }
  },

  computed: {
    tubeBordersData() {
      if (this.isFiltered) {
        return this.computeChartData(this.filteredData);
      }

      return this.computeChartData(this.summaryData);
    },

    chartData() {
      const { upperTubeData, bottomTubeData } = this.tubeBordersData;
      const finalTubeData = this.getFinalTubeData(upperTubeData, bottomTubeData);

      return this.getChartOptions(this.summaryData, finalTubeData);
    },

    filteredData() {
      let filteredData = medianFilter(this.summaryData, 3);

      return this.summaryData.map((element, index) => {
        return {
          ...element,
          Close: filteredData[index].Close,
          y: filteredData[index].Close
        }
      })
    },

    filteredChartData() {
      const { upperTubeData, bottomTubeData } = this.tubeBordersData;
      const finalTubeData = this.getFinalTubeData(upperTubeData, bottomTubeData);

      return this.getChartOptions(this.filteredData, finalTubeData);
    },

    meanSquaredErrorValue() {
      return round(meanSquaredError(this.summaryData.map(({ y }) => y), this.tubeCenterValues), 2);
    },

    rootMeanSquaredErrorValue() {
      return round(rootMeanSquaredError(this.summaryData.map(({ y }) => y), this.tubeCenterValues), 2);
    },

    meanAbsolutePercentageErrorValue() {
      return round(meanAbsolutePercentageError(this.summaryData.map(({ y }) => y), this.tubeCenterValues), 2);
    },

    meanAbsoluteErrorValue() {
      return round(meanAbsoluteError(this.summaryData.map(({ y }) => y), this.tubeCenterValues), 2);
    },

    tubeCenterValues() {
      const { upperTubeData, bottomTubeData } = this.tubeBordersData;
      const upperTubeValues = this.reduceTubeBorderData(upperTubeData);
      const bottomTubeValues = this.reduceTubeBorderData(bottomTubeData);

      return upperTubeValues.map((upperTubeValue, index) => (upperTubeValue + bottomTubeValues[index]) / 2);
    },
  }
}
</script>

<style scoped>
  .md-chip--spaced {
    margin-right: 10px;
  }
</style>
