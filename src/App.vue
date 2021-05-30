<template>
  <div id="app">
    <span class="md-display-3">Tube Algorithm</span>
    <div class="spacer"></div>
    <form>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
          <md-field>
            <label>Chosen dataset</label>
            <md-select v-model="chosenDataset" name="chosenDataset" md-dense>
              <md-option value='crash'>Crash on 12th of March, 2020</md-option>
              <md-option value='boom'>Boom on 8th of February, 2021</md-option>
            </md-select>
          </md-field>
        </div>
      </div>
    </form>
    <div v-for="(dataSlice, index) of data" :key="index">
      <span class="md-display-1">Data From {{dataSlice[0].Date}} to {{dataSlice[dataSlice.length - 1].Date}}</span>
      <div class="spacer"></div>
      <TubeSummary
          :summaryData="dataSlice"
          :chosenDataset="chosenDataset"/>
      <div v-if="index !== data.length - 1">
        <div class="spacer"></div>
        <div class="spacer"></div>
        <div class="spacer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import TubeSummary from '@/components/TubeSummary';
import { getSummaryData } from '@/utils/helpers';

export default {
  name: 'App',
  components: {
    TubeSummary
  },

  data() {
    return {
      data: getSummaryData('crash'),
      chosenDataset: 'crash'
    };
  },

  watch: {
    chosenDataset(value) {
      this.data = getSummaryData(value);
    }
  }
};
</script>

<style>
#app {
  background-color: #fff;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px 20px 0 20px;
  padding: 15px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),
  0 1px 5px 0 rgba(0,0,0,0.12),
  0 3px 1px -2px rgba(0,0,0,0.2);
}

.spacer {
  height: 25px;
}

</style>
