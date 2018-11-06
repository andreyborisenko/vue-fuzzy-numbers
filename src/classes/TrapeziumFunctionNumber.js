import FuzzyFunction from "./FuzzyFunction";

export default class TrapeziumFunctionNumber extends FuzzyFunction {
  constructor(...params) {
    if (params.length < 4 || params.filter(x => x == undefined).length)
      throw new Error("Wrong data passed!");

    super();

    const [a, b, c, d] = params.map(Number);

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  isValid() {
    return this.a <= this.b && this.b <= this.c && this.c <= this.d;
  }

  calculateMembershipFunction(x) {
    if (x <= this.a || x >= this.d) {
      return 0;
    } else if (x >= this.b && x <= this.c) {
      return 1;
    } else if (x > this.a && x < this.b) {
      return (x - this.a) / (this.b - this.a);
    } else if (x > this.c && x < this.d) {
      return (this.d - x) / (this.d - this.c);
    }

    return 0;
  }

  getChartData() {
    return {
      label: "Trapezium function",
      data: [
        {
          x: this.a,
          y: 0
        },
        {
          x: this.b,
          y: 1
        },
        {
          x: this.c,
          y: 1
        },
        {
          x: this.d,
          y: 0
        }
      ],
      fill: false,
      lineTension: 0,
      pointRadius: 0,
      hitRadius: 10,
      borderColor: "#10ac84"
    };
  }

  get minX() {
    return this.a;
  }

  get maxX() {
    return this.d;
  }
}
