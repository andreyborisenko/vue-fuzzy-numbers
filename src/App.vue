<template>
  <div class="container">
    <vs-tabs vs-position="top">
      <vs-tab vs-label="Lab 7">
        <number-distances />
      </vs-tab>
      <vs-tab vs-label="Lab 5">
        <different-functions />
      </vs-tab>
      <vs-tab vs-label="Lab 3-4">
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
</style>
