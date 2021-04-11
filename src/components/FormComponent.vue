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
          <md-input v-model.number="toleranceFactor" :min="0.0001" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
        <md-field>
          <label>Minimal tolerance</label>
          <md-input v-model.number="minTolerance" :min="0.0001" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100 md-large-size-20 md-xlarge-size-20">
        <md-field>
          <label>Maximal tolerance</label>
          <md-input v-model.number="maxTolerance" :min="0.0001" type="number"></md-input>
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
  name: "Form",
  data() {
    return {
      minTubeSize: 6,
      toleranceFactor: 10,
      minTolerance: 1,
      maxTolerance: 90,
      isFiltered: false
    }
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

    isFiltered() {
      this.$emit('isFilteredChanged', this.isFiltered)
    },
  }
}
</script>

<style scoped>

</style>
