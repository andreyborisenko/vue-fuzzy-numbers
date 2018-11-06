<template>
  <div class="wrapper">
    <vs-divider color="warning">Chart Properties</vs-divider>
    <div class="chart-properties">
      <vs-input 
        v-model="steps" 
        type="number"
        color="warning"
        label-placeholder="Steps"
      />
      
      <vs-input 
        v-model="minX" 
        type="number"
        color="warning"
        :min="-100000"
        :max="maxX"
        disabled
        label-placeholder="Minimum X"
      />
      
      <vs-input 
        v-model="maxX" 
        type="number"
        color="warning"
        :min="minX"
        disabled
        label-placeholder="Maximum X"
      />
    </div>
    <vs-divider color="warning">Functions</vs-divider>
    <vs-tabs vs-position="left" v-model="activeNumber" color="warning" class="functions">
      <vs-tab vs-label="Trapezium (#2)">
        <div class="function__inputs">
          <vs-chip color="warning" vs-size="large">A</vs-chip>
          <vs-chip color="warning" vs-size="large">B</vs-chip>
          <vs-chip color="warning" vs-size="large">C</vs-chip>
          <vs-chip color="warning" vs-size="large">D</vs-chip>
        </div>
        <function-input 
          v-model="numbers.trapezium"
          color="warning"
          class="function__inputs"
        />
      </vs-tab>
      <vs-tab vs-label="Gauss (#3)">
        <function-input 
          v-model="numbers.gauss"
          color="warning"
          class="function__inputs"
        />
      </vs-tab>
      <vs-tab vs-label="Multiply (#7)">
        <div class="function__inputs">
          <vs-chip color="warning" vs-size="large">A1</vs-chip>
          <vs-chip color="warning" vs-size="large">C1</vs-chip>
          <vs-chip color="warning" vs-size="large">A2</vs-chip>
          <vs-chip color="warning" vs-size="large">C2</vs-chip>
        </div>
        <function-input 
          v-model="numbers.mult"
          color="warning"
          class="function__inputs"
        />
      </vs-tab>
      <vs-tab vs-label="Show both">
      </vs-tab>
    </vs-tabs>

    <div class="chart">
      <canvas id="functions-chart"></canvas>
    </div>
  </div>
</template>

<script>
import {
  GaussFunctionNumber,
  TrapeziumFunctionNumber,
  TwoFunctionsMult
} from "@/classes";
import FunctionInput from "./FunctionInput";
import Chart from "chart.js";

export default {
  name: "different-functions",
  components: {
    FunctionInput
  },
  data() {
    return {
      steps: 100,
      activeNumber: 0,
      numbers: {
        trapezium: new TrapeziumFunctionNumber(-4, 2, 8, 14),
        gauss: new GaussFunctionNumber(5, 0.5),
        mult: new TwoFunctionsMult(-8, 14, 2, 9)
      },
      minX: -20,
      maxX: 20,
      chart: null
    };
  },
  methods: {
    changeChartData() {
      const numberKey = Object.keys(this.numbers)[this.activeNumber];

      if (numberKey in this.numbers) {
        this.minX = Number(this.numbers[numberKey].minX);
        this.maxX = Number(this.numbers[numberKey].maxX);
        this.chart.data.datasets = [
          this.numbers[numberKey].getChartData(
            (this.numbers[numberKey].maxX - this.numbers[numberKey].minX) /
              this.steps,
            this.numbers[numberKey].minX,
            this.numbers[numberKey].maxX
          )
        ];
      } else {
        this.chart.data.datasets = Object.values(this.numbers).map(x =>
          x.getChartData((x.maxX - x.minX) / this.steps, x.minX, x.maxX)
        );

        this.minX = Number(
          Math.min(...Object.values(this.numbers).map(x => x.minX))
        );
        this.maxX = Number(
          Math.max(...Object.values(this.numbers).map(x => x.maxX))
        );
      }

      this.chart.options.scales.xAxes[0].ticks.max = Number(this.minX) - 2;
      this.chart.options.scales.xAxes[0].ticks.min = Number(this.maxX) + 2;

      this.chart.update();
    }
  },
  computed: {
    step() {
      return (this.maxX - this.minX) / this.steps;
    }
  },
  watch: {
    activeNumber(nV, oV) {
      this.changeChartData();
    },
    numbers: {
      handler(nV, oV) {
        this.changeChartData();
      },
      deep: true
    },
    minX(nV) {
      this.changeChartData();
    },
    maxX(nV) {
      this.changeChartData();
    }
  },
  mounted() {
    this.chart = new Chart("functions-chart", {
      type: "line",
      data: {
        datasets: []
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: -0.2,
                max: 1.2
              }
            }
          ],
          xAxes: [
            {
              type: "linear",
              position: "bottom",
              ticks: {
                min: this.minX - 2,
                max: this.maxX + 2
              }
            }
          ]
        }
      }
    });

    this.changeChartData(this.activeNumber);
  }
};
</script>

<style>
.wrapper {
  margin: 0 -10px;
}

.functions .con-tab {
  padding: 0 10px;
}

.chart-properties {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.function__inputs {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.function__inputs .vs-con-input {
  margin: 0 10px;
}
</style>
