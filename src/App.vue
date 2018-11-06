<template>
  <div class="container">
    <vs-tabs vs-position="top">
      <vs-tab vs-label="Distance">
        <number-distances />
      </vs-tab>
      <vs-tab vs-label="Different functions">
        <different-functions />
      </vs-tab>
      <vs-tab vs-label="Add / substract">
        <two-numbers-sum-diff />
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import TwoNumbersSumDiff from "@/components/TwoNumbersSumDiff";
import NumberDistances from "@/components/NumberDistances";
import DifferentFunctions from "@/components/DifferentFunctions";

export default {
  name: "app",
  components: {
    TwoNumbersSumDiff,
    NumberDistances,
    DifferentFunctions
  },
  data() {
    return {};
  }
};
</script>

<style>
body {
  font-family: "Roboto", sans-serif;
}

.container {
  padding: 20px;
}

.chart {
  max-width: 900px;
  margin: 0 auto;
  max-height: 500px;
  min-height: 350px;
}

.chart canvas {
  max-width: 100% !important;
}
</style>
