<template>
  <div class="fuzzy-number">
    <div class="fuzzy-number__function">
      <div>
        &mu;<span class="fuzzy-number__letter">{{ letter }}</span> (x) = 
      </div>
      <div class="fuzzy-number__function-values">
        <div><span class="fractorial-number">0</span>, x &lt;= {{ number.lower }} or x &gt;= {{ number.upper }}</div>
        <div>
          <fractorial-number 
            :numerator="`x - ${number.lower}`"
            :denominator="number.mid - number.lower"
          />, x &gt;= {{ number.lower }} or x &lt;= {{ number.mid }}
        </div>
        <div>
          <fractorial-number 
            :numerator="`${number.upper} - x`"
            :denominator="number.upper - number.mid"
          />, x &gt;= {{ number.mid }} or x &lt;= {{ number.upper }}
        </div>
      </div>
    </div>
    <div class="fuzzy-number__alpha">
      {{ letter }}<span class="fuzzy-number__letter">&alpha;</span> = [
        {{ alphaValue[0] }}, {{ alphaValue[1] }}
      ]
    </div>
  </div>
</template>

<script>
import TriangleNumber from "@/classes/TriangleNumber";
import FractorialNumber from "@/components/FractorialNumber";

export default {
  name: "fuzzy-number",
  components: {
    FractorialNumber
  },
  props: {
    number: {
      type: TriangleNumber,
      required: true
    },
    letter: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    alphaValue() {
      const alpha = this.number.asInterval();

      return [
        alpha[0].expression
          .replace("alpha", `${alpha[0].alpha} · α`)
          .replace("constant", alpha[0].constant),
        alpha[1].expression
          .replace("alpha", `${alpha[1].alpha} · α`)
          .replace("constant", alpha[1].constant)
      ];
    }
  }
};
</script>

<style>
.fuzzy-number {
  padding: 5px;
  font-size: 14px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.fuzzy-number__function {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

.fuzzy-number__function > div:first-child {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.fuzzy-number__function-values {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  border-left: 1px solid #000;
  margin: 10px 0;
  padding-left: 10px;
  border-radius: 10px;
}

.fuzzy-number__function-values div {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.fuzzy-number__function-values .fractorial-number {
  margin-right: 10px;
}

.fuzzy-number__letter {
  vertical-align: sub;
  font-size: 10px;
  margin-top: 10px;
}

.fuzzy-number__alpha .fuzzy-number__letter {
  font-size: 15px;
  margin-left: 2px;
}
</style>
