<template>
  <md-table v-model="tubes" md-card>
    <md-table-toolbar>
      <h1 class="md-title">Plot Information</h1>
    </md-table-toolbar>
    <md-table-row slot="md-table-row" slot-scope="{ item }">
      <md-table-cell md-label="Tube No." md-numeric>{{ item.tubeIndex + 1 }}</md-table-cell>
      <md-table-cell md-label="Data">{{ reduceTableCellData(item.data) }}</md-table-cell>
      <md-table-cell md-label="Slope">{{ isNaN(item.slope) ? '-' : round(item.slope, 3) }}</md-table-cell>
      <md-table-cell md-label="Intercept">{{ isNaN(item.intercept) ? '-' : round(item.intercept, 3) }}</md-table-cell>
      <md-table-cell md-label="Tolerance">{{ round(item.tolerance, 3) }}</md-table-cell>
      <md-table-cell md-label="Anomaly">
        <span :class="[item.isAnomaly ? 'anomaly' : 'non-anomaly']">
          {{ item.isAnomaly ? 'Yes' : 'No' }}
        </span></md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
import { round } from '@/utils/helpers';
export default {
  name: 'Table',

  props: {
    tubes: Array
  },

  methods: {
    round(number, decimalPlaces) {
      return round(number, decimalPlaces);
    },

    reduceTableCellData(data) {
      return data.reduce((acc, el, index) => {
        const dataToAdd = acc.concat(`(${ el.Date }, ${ el.Close })`);
        if (index === data.length - 1) {
          return dataToAdd;
        }
        return dataToAdd.concat(', ');
      }, '');
    }
  }
}
</script>

<style scoped>
  span {
    font-weight: bold;
  }
  .anomaly {
    color: red;
  }
  .non-anomaly {
    color: #06b506;
  }
</style>
