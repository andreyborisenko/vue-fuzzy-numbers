export default class GaussFunctionNubmer {
  set b(value) {
    this._b = Number(value);
  }
  get b() {
    return this._b;
  }

  set c(value) {
    this._c = Number(value);
  }
  get c() {
    return this._c;
  }

  constructor(b, c) {
    // if ((b !== 0 && !b) || (c !== 0 && !c) || b >= c)
    //   throw new Error("Wrong data passed!");

    this.b = b;
    this.c = c;
  }

  isValid() {
    return this.b < this.c;
  }

  calculateMembershipFunction(x) {
    return Math.exp((-Math.pow(x - this.b, 2) / 2) * this.c ** 2);
  }

  getChartData(step, min, max) {
    let data = [];

    for (let i = min; i <= max; i += step) {
      data.push({
        x: i,
        y: this.calculateMembershipFunction(i)
      });
    }

    return {
      label: "Gauss function",
      data,
      fill: false,
      lineTension: 0.3,
      pointRadius: 0,
      hitRadius: 10,
      borderColor: "#5f27cd"
    };
  }
}
