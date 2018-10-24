import {
  TriangleNumber,
  INTERVAL_EXPR_LB,
  INTERVAL_EXPR_UB
} from "./TriangleNumber.js";

export default class CalculatorHelper {
  static sumIntervals(a, b) {
    if (a.length !== 2 || b.length !== 2) throw new Error("Wrong data passed!");

    return [
      {
        alpha: a[0].alpha + b[0].alpha,
        constant: a[0].constant + b[0].constant,
        expression: INTERVAL_EXPR_LB
      },
      {
        alpha: a[1].alpha + b[1].alpha,
        constant: a[1].constant + b[1].constant,
        expression: INTERVAL_EXPR_UB
      }
    ];
  }

  static substractIntervals(a, b) {
    if (a.length !== 2 || b.length !== 2) throw new Error("Wrong data passed!");

    return [
      {
        alpha: a[0].alpha - b[1].alpha,
        constant: a[0].constant - b[1].constant,
        expression: INTERVAL_EXPR_LB
      },
      {
        alpha: a[1].alpha - b[0].alpha,
        constant: a[1].constant - b[0].constant,
        expression: INTERVAL_EXPR_UB
      }
    ];
  }

  static convertFromInterval(interval) {
    const low = interval[0].constant;
    const up = interval[1].constant;
    const mid = interval[1].constant - interval[1].alpha;

    return new TriangleNumber(low, mid, up);
  }
}
