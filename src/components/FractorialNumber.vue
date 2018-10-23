<template>
  <span class="fractorial-number">
    <div class="fractorial-number__numerator">{{ numerator || '1' }}</div>
    <div class="fractorial-number__divider"></div>
    <div class="fractorial-number__denominator">{{ denominator || '1' }}</div>
  </span>

</template>

<script>
export default {
  name: "fractorial-number",
  props: {
    numerator: [String, Number],
    denominator: [String, Number]
  },
  methods: {
    getValue(x) {
      console.log();
      let num = this.numerator.replace("x", x),
        denom = this.denominator.replace("x", x);

      console.log(eval(`(${num}) / (${denom})`));

      return eval(`(${num}) / (${denom})`);
    }
  }
};
</script>

<style>
.fractorial-number {
  display: inline-flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: stretch;
  text-align: center;
  padding: 5px;
}

.fractorial-number div {
  display: flex;
  justify-content: center;
}

.fractorial-number__divider {
  height: 2px;
  background: #000;
  margin: 3px 0;
}
</style>
