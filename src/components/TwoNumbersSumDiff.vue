<template>
  <div class="container">
    <vs-alert :active="hasErrors" color="danger" icon="new_releases" >
      <span v-html="errorMessage"></span>
    </vs-alert>
    <div class="number-inputs">
      <div class="number-inputs__input" 
        v-for="(number, letter) in numbers"
        :key="'number-input__' + letter">
        <span>{{ letter.toUpperCase() }}</span>
        <vs-input-number 
          v-model="number.lower"
          :max="number.mid"
          :min="-1000000"
          :color="colors[letter]"/>
        <vs-input-number 
          v-model="number.mid"
          :min="number.lower"
          :max="number.upper"
          :color="colors[letter]"/>
        <vs-input-number 
          v-model="number.upper"
          :min="number.mid"
          :color="colors[letter]"/>
      </div>
    </div>
    <div class="action-buttons">
      <vs-button 
        color="success" 
        vs-type="gradient" 
        :disabled="hasErrors"
        @click="performOperation('+')">
        A + B
      </vs-button>
      <vs-button 
        color="success" 
        vs-type="gradient" 
        :disabled="hasErrors"
        @click="performOperation('-')">
        A - B
      </vs-button>
    </div>
    <div v-if="'c' in numbers" class="membership-function-values">
      <div>
        <vs-button 
          vs-type="gradient" 
          color="success" 
          @click="calculateFunctionValues">
          Calculate membership functions
        </vs-button>
        <vs-tooltip text="Input point to calculate membership functions">
          <vs-input-number v-model="x" min="-1000000"/>
        </vs-tooltip>
      </div>
      <div class="membership-function-values__chips" v-if="Object.keys(functionValues).length">
        <vs-chip color="primary"
          v-for="(value, letter) in functionValues" 
          :key="'function-value__' + letter">
            &mu;<span class="fuzzy-number__letter">{{ letter }}</span> = {{ value }}
        </vs-chip>
      </div>
    </div>
    <div class="numbers-functions">
      <fuzzy-number 
        v-for="(number, key) in numbers" 
        :key="'number_' + key"
        :number="number" 
        :letter="key.toUpperCase()"
      />
    </div>
    <div class="chart">
      <canvas id="numbers-chart"></canvas>
    </div>
  </div>
</template>

<script>
import FuzzyNumber from "@/components/FuzzyNumber";
import TriangleNumber from "@/classes/TriangleNumber";
import CalculatorHelper from "@/classes/CalculatorHelper";
import Chart from "chart.js";

export default {
  name: "two-numbers-sum-diff",
  components: {
    FuzzyNumber
  },
  data() {
    return {
      numbers: {
        a: new TriangleNumber(-3, -2, 3),
        b: new TriangleNumber(2, 4, 6)
      },
      hasErrors: false,
      errorMessage: "",
      x: 0,
      functionValues: {},
      colors: {
        a: "#5f27cd",
        b: "#ff9f43",
        c: "#10ac84"
      },
      chart: null
    };
  },
  methods: {
    performOperation(operation) {
      let methodToCall = "";

      switch (operation) {
        case "+":
          methodToCall = "sumIntervals";
          break;
        case "-":
          methodToCall = "substractIntervals";
          break;
      }

      if (methodToCall) {
        try {
          const sumInterval = CalculatorHelper[methodToCall](
            this.numbers.a.asInterval(),
            this.numbers.b.asInterval()
          );

          const triangleNumber = CalculatorHelper.convertFromInterval(
            sumInterval
          );

          this.numbers["c"] = triangleNumber;
          this.functionValues = {};

          this.$forceUpdate();

          this.chart.data.datasets = this.buildDatasets();
          this.chart.update();
        } catch (e) {
          this.$vs.notify({
            title: `Failed to perform <strong>'${operation}'<strong> operation`,
            text:
              "Seems like we cant do this operation with following intervals :(",
            color: "warning",
            time: 5000
          });
        }
      }
    },
    calculateFunctionValues() {
      for (let letter in this.numbers) {
        this.functionValues[letter] = this.numbers[letter]
          .calculateMembershipFunction(this.x)
          .toPrecision(2);
      }

      this.$forceUpdate();

      this.chart.data.datasets = this.buildDatasets();
      this.chart.update();
    },
    buildDatasets() {
      let datasets = [];

      for (let letter in this.numbers) {
        datasets.push({
          label: letter.toUpperCase(),
          data: [
            {
              x: this.numbers[letter].lower,
              y: 0
            },
            {
              x: this.numbers[letter].mid,
              y: 1
            },
            {
              x: this.numbers[letter].upper,
              y: 0
            }
          ],
          fill: false,
          lineTension: 0,
          borderColor: this.colors[letter]
        });
      }

      if (Object.keys(this.functionValues).length) {
        datasets.push({
          label: "X",
          data: [
            {
              x: this.x,
              y: 0
            },
            {
              x: this.x,
              y: 1
            }
          ],
          fill: false,
          lineTension: 0,
          borderColor: "#222f3e"
        });
      }

      return datasets;
    }
  },
  watch: {
    numbers: {
      handler(nV, oV) {
        for (let letter in this.numbers) {
          if (!this.numbers[letter].isValid()) {
            this.hasErrors = true;
            this.errorMessage = `
              Triangle number <strong>${letter.toUpperCase()}</strong> is invalid!
            `;
            return;
          }
        }

        this.hasErrors = false;

        this.chart.data.datasets = this.buildDatasets();
        this.chart.update();
      },
      deep: true
    }
  },
  mounted() {
    this.chart = new Chart("numbers-chart", {
      type: "line",
      data: {
        datasets: this.buildDatasets()
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: -0.25,
                max: 1.25
              }
            }
          ],
          xAxes: [
            {
              type: "linear",
              position: "bottom",
              ticks: {
                labelOffset: 10,
                maxRotation: 0
              }
            }
          ]
        }
      }
    });
  }
};
</script>

<style>
.number-inputs {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;

  margin-bottom: 20px;
}

.number-inputs__input {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.number-inputs__input span {
  font-size: 25px;
  padding-right: 10px;
}

.numbers-functions {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
}

.action-buttons {
  display: flex;
  flex-flow: row;
  justify-content: center;
}

.action-buttons .vs-button {
  margin: 0 5px;
}

.action-buttons .vs-button:first-child {
  margin-left: 0;
}

.action-buttons .vs-button:last-child {
  margin-right: 0;
}

.membership-function-values {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0;
}

.membership-function-values > div {
  display: flex;
  flex-flow: row nowrap;
}

.membership-function-values .vs-button {
  margin-right: 10px;
}

.membership-function-values__chips {
  margin-top: 20px;
  font-size: 20px;
}

.membership-function-values__chips .con-vs-chip > span {
  font-size: 16px;
  padding: 0 10px;
}
.membership-function-values__chips .con-vs-chip {
  margin: 0 5px;
}

.chart {
  margin-top: 20px;
  max-width: 1000px;
  max-height: 500px;
  min-height: 350px;
}

@media (max-width: 768px) {
  .numbers-functions {
    flex-flow: column nowrap;
  }

  .number-inputs__input {
    flex-wrap: wrap;
  }

  .number-inputs__input span {
    flex: 1 0 100%;
    text-align: center;
  }
}
</style>
