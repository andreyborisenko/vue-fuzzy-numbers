<template>
    <div class="container">
        <div class="number-inputs">
            <div 
                class="number-inputs__input" 
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
import TriangleNumber from "@/classes/TriangleNumber.js";
import Chart from "chart.js";

export default {
  name: "number-distances",
  data() {
    return {
      numbers: {
        a: new TriangleNumber(2, 4, 5),
        b: new TriangleNumber(1, 3, 6)
      },
      n: 500,
      chart: null,
      colors: {
        a: "#5f27cd",
        b: "#ff9f43"
      },
      showResults: false,
      distanceHamming: 0,
      distanceEuclide: 0
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

      if (withDistance) {
        datasets.push(...this.buildDistancesDatasets());
      }

      return datasets;
    }
  },
  watch: {
    numbers: {
      handler(nV, oV) {
        this.chart.data.datasets = this.buildDatasets();
        this.chart.update();
      },
      deep: true
    }
  },
  computed: {
    step() {
      return (this.maxX - this.minX) / this.n;
    },
    minX() {
      return Math.min(this.numbers.a.lower, this.numbers.b.lower);
    },
    maxX() {
      return Math.max(this.numbers.a.upper, this.numbers.b.upper);
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

.number-inputs__input {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.number-inputs__input span {
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
