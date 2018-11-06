<template>
  <div class="container">
  
    <vs-alert :active="hasErrors" color="danger" icon="new_releases" >
      <span v-html="errorMessage"></span>
    </vs-alert>

    <div class="number-inputs">
      <div 
        class="number-inputs__group" 
        v-for="(number, letter) in numbers"
        :key="'number-input__' + letter">

        <div class="number-inputs__info">
          <span>{{ letter.toUpperCase() }}</span>
          <vs-select
            v-model="types[letter]"
            label="Function type"
            :color="colors[letter]">

            <vs-select-item 
              v-for="(item, index) in classes"
              :key="letter + '__' + index"
              :text="index"
              :value="index"
            />
          </vs-select>

        </div>

        <function-input 
          v-model="numbers[letter]"
          :color="colors[letter]"
          class="number-inputs__input"
        />
      </div>
      <div class="step">
        <vs-button 
          vs-type="gradient" 
          color="success"
          @click="calculateDistances">
          Caclulate
        </vs-button>
        <vs-tooltip text="Input steps to calculate distance">
          <vs-input-number 
            v-model="n" 
            :min="-100000"/>
        </vs-tooltip>
      </div>
      <div class="results">
        <vs-chip color="primary">
          <vs-avatar icon="timeline" />{{ step.toFixed(5) }}
        </vs-chip>
        <vs-chip v-if="showResults" color="primary">
          <vs-avatar text="H" />{{ distanceHamming }}
        </vs-chip>
        <vs-chip v-if="showResults" color="primary">
          <vs-avatar text="E" />{{ distanceEuclide }}
        </vs-chip>
      </div>
    </div>
    <div class="chart">
      <canvas id="distance-chart"></canvas>
    </div>
  </div>
</template>

<script>
import FunctionInput from "./FunctionInput";
import {
  GaussFunctionNumber,
  TrapeziumFunctionNumber,
  TwoFunctionsMult,
  TriangleNumber
} from "@/classes";
import Chart from "chart.js";

export default {
  name: "number-distances",
  components: {
    FunctionInput
  },
  data() {
    return {
      numbers: {
        a: new TriangleNumber(2, 4, 5),
        b: new TriangleNumber(1, 3, 6)
      },
      types: {
        a: "triangle",
        b: "triangle"
      },
      n: 500,
      chart: null,
      colors: {
        a: "#5f27cd",
        b: "#ff9f43"
      },
      showResults: false,
      distanceHamming: 0,
      distanceEuclide: 0,
      errorMessage: "",
      hasErrors: false,
      classes: {
        gauss: GaussFunctionNumber,
        trapezium: TrapeziumFunctionNumber,
        mult: TwoFunctionsMult,
        triangle: TriangleNumber
      },
      defaults: {
        trapezium: [-4, 2, 8, 14],
        gauss: [5, 0.5],
        mult: [-8, 14, 2, 9],
        triangle: [2, 4, 5]
      }
    };
  },
  methods: {
    calculateHammingDistance() {
      let distanceHamming = 0;

      for (let i = this.minX; i <= this.maxX; i += Number(this.step)) {
        distanceHamming += Math.abs(
          this.numbers.a.calculateMembershipFunction(i) -
            this.numbers.b.calculateMembershipFunction(i)
        );
      }

      this.distanceHamming = distanceHamming.toFixed(3);
    },
    calculateEuclideDistance() {
      let distanceEuclide = 0;

      for (let i = this.minX; i <= this.maxX; i += Number(this.step)) {
        distanceEuclide += Math.pow(
          this.numbers.a.calculateMembershipFunction(i) -
            this.numbers.b.calculateMembershipFunction(i),
          2
        );
      }

      this.distanceEuclide = Math.sqrt(distanceEuclide).toFixed(3);
    },
    calculateDistances() {
      this.calculateHammingDistance();
      this.calculateEuclideDistance();

      this.chart.data.datasets = this.buildDatasets(true);
      this.chart.update();

      this.showResults = true;
    },
    buildDistancesDatasets() {
      let datasets = [];

      let data = [];

      for (let i = this.minX; i <= this.maxX; i += Number(this.step)) {
        data.push({
          x: i,
          y: Math.abs(
            this.numbers.a.calculateMembershipFunction(i) -
              this.numbers.b.calculateMembershipFunction(i)
          )
        });
      }

      datasets.push({
        label: "Hamming distance",
        data,
        fill: false,
        lineTension: 0.1,
        pointRadius: 0,
        borderColor: "#1e90ff",
        hitRadius: 10
      });

      data = [];

      for (let i = this.minX; i <= this.maxX; i += Number(this.step)) {
        data.push({
          x: i,
          y: Math.pow(
            this.numbers.a.calculateMembershipFunction(i) -
              this.numbers.b.calculateMembershipFunction(i),
            2
          )
        });
      }

      datasets.push({
        label: "Euclide distance",
        data,
        fill: false,
        lineTension: 0.2,
        pointRadius: 0,
        borderColor: "#10ac84",
        hitRadius: 10
      });

      return datasets;
    },
    buildDatasets(withDistance = false) {
      let datasets = [];

      for (let letter in this.numbers) {
        datasets.push(
          Object.assign(
            this.numbers[letter].getChartData(this.step, this.minX, this.maxX),
            {
              borderColor: this.colors[letter]
            }
          )
        );
      }

      if (withDistance) {
        datasets.push(...this.buildDistancesDatasets());
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
              ${
                this.types[letter]
              } number <strong>${letter.toUpperCase()}</strong> is invalid!
            `;
            return;
          }
        }

        this.hasErrors = false;

        this.chart.options.scales.xAxes[0].ticks = {
          min: this.minX - 1,
          max: this.maxX + 1
        };
        this.chart.data.datasets = this.buildDatasets();
        this.chart.update();

        console.log("here");
      },
      deep: true
    },
    types: {
      handler(nV, oV) {
        for (const letter in nV) {
          this.numbers[letter] = new this.classes[nV[letter]](
            ...this.defaults[nV[letter]]
          );
        }
      },
      deep: true
    }
  },
  computed: {
    step() {
      return (this.maxX - this.minX) / this.n;
    },
    minX() {
      return Math.min(this.numbers.a.minX, this.numbers.b.minX);
    },
    maxX() {
      return Math.max(this.numbers.a.maxX, this.numbers.b.maxX);
    }
  },
  mounted() {
    this.chart = new Chart("distance-chart", {
      type: "line",
      data: {
        datasets: this.buildDatasets()
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
                min: this.minX - 1,
                max: this.maxX + 1
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

.number-inputs__group {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  margin: 10px 0;
}

.number-inputs__info {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: flex-end;

  margin-bottom: 10px;
}

.number-inputs__info > span {
  font-size: 30px;
  margin-right: 20px;

  position: relative;
  bottom: -5px;
}

.number-inputs__input {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.number-inputs__input > span {
  font-size: 25px;
  padding-right: 10px;
}

.step {
  margin: 20px 0;
  display: flex;
  flex-flow: row nowrap;
}

.step .vs-button {
  margin-right: 15px;
}

.results {
  display: flex;
  flex-flow: row nowrap;
}

.results .con-vs-chip {
  margin: 0 5px;
}
</style>
