export default class TwoFunctionsMult {
  constructor(a1, c1, a2, c2) {
    // if (a1 > c1 || a2 >= c2) throw new Error("Wrong data passed!");

    this.a1 = Number(a1);
    this.a2 = Number(a2);
    this.c1 = Number(c1);
    this.c2 = Number(c2);
  }

  isValid() {}

  calculateMembershipFunction(x) {
    return (
      (1 / (1 + Math.exp(-this.a1 * (x - this.c1)))) *
      (1 / (1 + Math.exp(-this.a2 * (x - this.c2))))
    );
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
      label: "Mult of functions",
      data,
      fill: false,
      lineTension: 0.3,
      pointRadius: 0,
      hitRadius: 10,
      borderColor: "#ff6b6b"
    };
  }
}
