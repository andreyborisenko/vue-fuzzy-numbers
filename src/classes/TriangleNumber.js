import FuzzyFunction from "./FuzzyFunction";

const INTERVAL_EXPR_LB = "alpha + constant";
const INTERVAL_EXPR_UB = "constant - alpha";

export default class TriangleNumber extends FuzzyFunction {
  set lower(value) {
    this._lower = Number(value);
  }

  get lower() {
    return this._lower;
  }

  set upper(value) {
    this._upper = Number(value);
  }

  get upper() {
    return this._upper;
  }

  set mid(value) {
    this._mid = Number(value);
  }

  get mid() {
    return this._mid;
  }

  constructor(a, b, c) {
    if (
      [a, b, c].filter(x => typeof x !== "undefined").length < 3 ||
      a > b ||
      b > c
    )
      throw new Error("Wrong data passed");

    super();

    this.lower = a;
    this.mid = b;
    this.upper = c;
  }

  isValid() {
    return this.lower <= this.mid && this.mid <= this.upper;
  }

  calculateMembershipFunction(x) {
    if (x >= this.lower && x <= this.mid) {
      return (x - this.lower) / (this.mid - this.lower);
    } else if (x >= this.mid && x <= this.upper) {
      return (this.upper - x) / (this.upper - this.mid);
    }

    if (x <= this.lower || x >= this.upper) return 0;
  }

  asInterval(x) {
    return [
      {
        alpha: this.mid - this.lower,
        constant: this.lower,
        expression: INTERVAL_EXPR_LB
      },
      {
        alpha: this.upper - this.mid,
        constant: this.upper,
        expression: INTERVAL_EXPR_UB
      }
    ];
  }

  getChartData(step, min, max) {
    return {
      label: "Triangle Number",
      data: [
        {
          x: this.lower,
          y: 0
        },
        {
          x: this.mid,
          y: 1
        },
        {
          x: this.upper,
          y: 0
        }
      ],
      fill: false,
      lineTension: 0
    };
  }

  get minX() {
    return this.lower;
  }

  get maxX() {
    return this.upper;
  }
}

export { INTERVAL_EXPR_LB, INTERVAL_EXPR_UB, TriangleNumber };
