<template>
  <form>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
        <md-field>
          <label>Minimal tube size</label>
          <md-input v-model.number="minTubeSize" :min="2" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
        <md-field>
          <label>Tolerance factor</label>
          <md-input v-model.number="toleranceFactor" :min="0" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
        <md-field>
          <label>Minimal tolerance</label>
          <md-input v-model.number="minTolerance" :min="0" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
        <md-field>
          <label>Maximal tolerance</label>
          <md-input v-model.number="maxTolerance" :min="0" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
        <md-field>
          <label>Filter Window Size</label>
          <md-select v-model.number="filteringWindowSize" name="filteringWindowSize" md-dense>
            <md-option value=3>3</md-option>
            <md-option value=5>5</md-option>
            <md-option value=7>7</md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
        <md-checkbox v-model="isFiltered" class="md-primary">Use median filter</md-checkbox>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: "FormComponent",
  props: {
    minTubeSize: Number,
    toleranceFactor: Number,
    minTolerance: Number,
    maxTolerance: Number,
    filteringWindowSize: Number,
    isFiltered: Boolean,
  },

  watch: {
    minTubeSize() {
      this.$emit('minTubeSizeChanged', this.minTubeSize)
    },

    toleranceFactor() {
      this.$emit('toleranceFactorChanged', this.toleranceFactor)
    },

    minTolerance() {
      this.$emit('minToleranceChanged', this.minTolerance)
    },

    maxTolerance() {
      this.$emit('maxToleranceChanged', this.maxTolerance)
    },

    filteringWindowSize() {
      this.$emit('filterWindowSizeChanged', this.filteringWindowSize)
    },

    isFiltered() {
      this.$emit('isFilteredChanged', this.isFiltered)
    },
  }
}
</script>

<style scoped>

</style>
