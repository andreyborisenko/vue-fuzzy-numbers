<template>
  <div class="wrapper">
    <vs-divider color="warning">Chart Properties</vs-divider>
    <div class="chart-properties">
      <vs-input 
        v-model="steps" 
        type="number"
        color="warning"
        vs-label-placeholder="Steps"
      />
      
      <vs-input 
        v-model="minX" 
        type="number"
        color="warning"
        :min="-100000"
        :max="maxX"
        vs-label-placeholder="Minimum X"
      />
      
      <vs-input 
        v-model="maxX" 
        type="number"
        color="warning"
        :min="minX"
        vs-label-placeholder="Maximum X"
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
        <div class="function__inputs">
          <vs-input-number
            v-model="numbers.trapezium.a"
            :max="numbers.trapezium.b"
            :min="-100000"
            color="warning">
          </vs-input-number>

          <vs-input-number
            v-model="numbers.trapezium.b"
            :min="numbers.trapezium.a"
            :max="numbers.trapezium.c"
            color="warning">
          </vs-input-number>
          
          <vs-input-number
            v-model="numbers.trapezium.c"
            :min="numbers.trapezium.b"
            :max="numbers.trapezium.d"
            color="warning">
          </vs-input-number>
          
          <vs-input-number
            v-model="numbers.trapezium.d"
            :min="numbers.trapezium.b + 1"
            color="warning">
          </vs-input-number>
        </div>
      </vs-tab>
      <vs-tab vs-label="Gauss (#3)">
        <div class="function__inputs">
          <vs-input 
            v-model="numbers.gauss.b"
            type="number"
            :max="numbers.gauss.c - 1"
            :min="-100000"
            color="warning"
            vs-label-placeholder="Gauss B"
            vs-size="large"
          />
          
          <vs-input 
            type="number"
            v-model="numbers.gauss.c"
            :min="numbers.gauss.b + 1"
            color="warning"
            vs-label-placeholder="Gauss C"
            vs-size="large"
          />
        </div>
      </vs-tab>
      <vs-tab vs-label="Multiply (#7)">
        <div class="function__inputs">
          <vs-chip color="warning" vs-size="large">A1</vs-chip>
          <vs-chip color="warning" vs-size="large">C1</vs-chip>
          <vs-chip color="warning" vs-size="large">A2</vs-chip>
          <vs-chip color="warning" vs-size="large">C2</vs-chip>
        </div>
        <div class="function__inputs">
          <vs-input-number
            v-model="numbers.mult.a1"
            :max="numbers.mult.c1"
            :min="-100000"
            color="warning">
          </vs-input-number>

          <vs-input-number
            v-model="numbers.mult.c1"
            :min="numbers.mult.a1"
            color="warning">
          </vs-input-number>
          
          <vs-input-number
            v-model="numbers.mult.a2"
            :min="-100000"
            :max="numbers.mult.c2"
            color="warning">
          </vs-input-number>
          
          <vs-input-number
            v-model="numbers.mult.c2"
            :min="numbers.mult.a2"
            color="warning">
          </vs-input-number>
        </div>
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
import GaussFunctionNumber from "@/classes/GaussFunctionNumber";
import TrapeziumFunctionNumber from "@/classes/TrapeziumFunctionNumber";
import TwoFunctionsMult from "@/classes/TwoFunctionsMult";
import Chart from "chart.js";

export default {
  name: "different-functions",
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

      this.minX = Number(this.minX);
      this.maxX = Number(this.maxX);
      this.chart.options.scales.xAxes[0].ticks.max = Number(this.minX) - 2;
      this.chart.options.scales.xAxes[0].ticks.min = Number(this.maxX) + 2;

      if (numberKey in this.numbers) {
        this.chart.data.datasets = [
          this.numbers[numberKey].getChartData(this.step, this.minX, this.maxX)
        ];
      } else {
        this.chart.data.datasets = Object.values(this.numbers).map(x =>
          x.getChartData(this.step, this.minX, this.maxX)
        );
      }

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
