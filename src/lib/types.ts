import { derived, writable } from "svelte/store";
import type { Readable } from "svelte/store";
import * as bigNumber from "bignumber.js";
const { BigNumber } = bigNumber;

export type ImagePaths =
  | "./UimMultiply.svg"
  | "./IcBaselineDivide.svg"
  | "./IcSharpAdd.svg"
  | "./IcBaselineMinus.svg"
  | "./CiDot02S.svg"
  | "./EntypoErase.svg"
  | "./IcBaselineEquals.svg";

export type Operators =
  | "multiply"
  | "divide"
  | "add"
  | "minus"
  | "decimal-point"
  | "backspace"
  | "equals";

export const imgMap: Map<Operators, ImagePaths> = new Map([
  ["multiply", "./UimMultiply.svg"],
  ["divide", "./IcBaselineDivide.svg"],
  ["add", "./IcSharpAdd.svg"],
  ["minus", "./IcBaselineMinus.svg"],
  ["decimal-point", "./CiDot02S.svg"],
  ["backspace", "./EntypoErase.svg"],
  ["equals", "./IcBaselineEquals.svg"],
]);

export interface Num {
  type: "number";
  value: string;
}

export interface Operator {
  type: "operator";
  path: ImagePaths;
  sign: Operators;
}

export type NumOperator = Num | Operator;

export const numbersAndOperators: NumOperator[] = [
  { type: "number", value: "7" },
  { type: "number", value: "8" },
  { type: "number", value: "9" },
  { type: "operator", sign: "divide", path: imgMap.get("divide") },
  { type: "operator", sign: "backspace", path: imgMap.get("backspace") },
  { type: "number", value: "4" },
  { type: "number", value: "5" },
  { type: "number", value: "6" },
  { type: "operator", sign: "multiply", path: imgMap.get("multiply") },
  { type: "number", value: "2" },
  { type: "number", value: "1" },
  { type: "number", value: "3" },
  { type: "operator", sign: "minus", path: imgMap.get("minus") },
  { type: "number", value: "0" },
  {
    type: "operator",
    sign: "decimal-point",
    path: imgMap.get("decimal-point"),
  },
  { type: "operator", sign: "add", path: imgMap.get("add") },
  { type: "operator", sign: "equals", path: imgMap.get("equals") },
];

export interface CalculatorState {
  readonly result: number;
  readonly numOperators: NumOperator[];
}

function replace(numOperators: NumOperator[], n: NumOperator): NumOperator[] {
  numOperators.pop();
  return [...numOperators, n];
}

function process(numOperators: NumOperator[], n: NumOperator): NumOperator[] {
  if (n.type === "operator") {
    if (
      n.sign === "add" ||
      n.sign === "divide" ||
      n.sign === "minus" ||
      n.sign === "multiply"
    ) {
      const last = numOperators[numOperators.length - 1];
      if (last && last.type === "number") {
        return [...numOperators, n];
      }

      // if (numOperators.length === 0) {
      //   return [];
      // }
    }

    const last = numOperators[numOperators.length - 1];
    if (n.sign === "decimal-point") {
      if (
        last &&
        last.type === "number" &&
        last?.value &&
        !last?.value?.includes(".")
      ) {
        return replace(numOperators, { ...last, value: `${last?.value}.` });
      }

      if (last && last.type === "operator") {
        return [...numOperators, { type: "number", value: "." }];
      }

      if (numOperators.length === 0) {
        return [...numOperators, { type: "number", value: "." }];
      }
    }

    if (last && n.sign === "backspace") {
      if (last.type === "number" && last?.value?.length >= 2) {
        const num: Num = {
          ...last,
          value: last?.value?.substring(0, last?.value?.length - 1),
        };
        return replace(numOperators, num);
      } else {
        numOperators.pop();
        return numOperators;
      }
    }
  } else {
    const last = numOperators[numOperators.length - 1];
    if (last && last.type === "number" && last?.value) {
      const num: Num = {
        ...last,
        value: `${last?.value}${n.value}`,
      };
      return replace(numOperators, num);
    } else {
      return [...numOperators, n];
    }
  }
  return numOperators;
}

function createNumOperators(numOperators: NumOperator[]) {
  const { subscribe, update } = writable(numOperators);

  return {
    subscribe,
    numOrOperatorClicked: (n: NumOperator) =>
      update((numOperator) => {
        return process(numOperator, n);
      }),
  };
}

export const numOperators = createNumOperators([]);

export const formatter = new Intl.NumberFormat();

export function formatNumber(n: string): string {
  const hasPoint = n.includes(".");
  const [first, second] = n.split(".");

  if (hasPoint) {
    if (first.length > 0) {
      const formattedFirst = formatter.format(BigInt(first));
      return `${formattedFirst}.${second}`;
    } else {
      return n;
    }
  } else {
    return formatter.format(BigInt(first));
  }
}

function getPrecedence({
  fromInputQueue,
  topOfStack,
}: {
  fromInputQueue: Operators;
  topOfStack: Operators;
}): {
  lowerPrecedence?: boolean;
  leftAssociative?: boolean;
  samePrecedence?: boolean;
} {
  if (fromInputQueue === "add") {
    if (topOfStack === "divide" || topOfStack === "multiply") {
      return { lowerPrecedence: true };
    }

    if (topOfStack === "minus" || topOfStack === "add") {
      return { samePrecedence: true, leftAssociative: true };
    }
  }

  if (fromInputQueue === "minus") {
    if (topOfStack === "divide" || topOfStack === "multiply") {
      return { lowerPrecedence: true };
    }

    if (topOfStack === "add" || topOfStack === "minus") {
      return { samePrecedence: true, leftAssociative: true };
    }
  }

  if (fromInputQueue === "divide") {
    if (topOfStack === "multiply" || topOfStack === "divide") {
      return { samePrecedence: true, leftAssociative: true };
    }

    if (topOfStack === "add" || topOfStack === "minus") {
      return { lowerPrecedence: false };
    }
  }

  if (fromInputQueue === "multiply") {
    if (topOfStack === "divide" || topOfStack === "multiply") {
      return { samePrecedence: true, leftAssociative: true };
    }

    if (topOfStack === "add" || topOfStack === "minus") {
      return { lowerPrecedence: false };
    }
  }
}

function shouldAddToOutputQueue(
  fromInputQueue: Operator,
  topOfStack: Operator
): boolean {
  const { lowerPrecedence, leftAssociative, samePrecedence } = getPrecedence({
    fromInputQueue: fromInputQueue.sign,
    topOfStack: topOfStack.sign,
  });

  return (
    lowerPrecedence === true ||
    (samePrecedence === true && leftAssociative === true)
  );
}

function splitByOperator(
  operatorStack: Operator[],
  fromInputQueue: Operator
): { newOperatorStack: Operator[]; onOutputQueue: Operator[] } {
  if (operatorStack.length === 0) {
    const e = {
      onOutputQueue: [],
      newOperatorStack: [fromInputQueue],
    };
    return e;
  }
  let index = 0;
  let length = operatorStack.length;
  let onOutputQueue: Operator[] = [];

  while (
    index < length &&
    shouldAddToOutputQueue(fromInputQueue, operatorStack[index])
  ) {
    onOutputQueue.push(operatorStack[index]);
    index = index + 1;
  }

  const e = {
    onOutputQueue,
    newOperatorStack: [fromInputQueue, ...operatorStack.slice(index)],
  };

  return e;
}

function shuntingYard(numOperators: NumOperator[]): NumOperator[] {
  let outputQueue: NumOperator[] = [];
  let operatorStack: Operator[] = [];
  for (let i = 0; i < numOperators.length; i++) {
    const nos = numOperators[i];

    if (nos.type === "number") {
      outputQueue = [...outputQueue, nos];
    } else {
      const { onOutputQueue, newOperatorStack } = splitByOperator(
        operatorStack,
        nos
      );
      outputQueue = [...outputQueue, ...onOutputQueue];
      operatorStack = newOperatorStack;
    }
  }

  return [...outputQueue, ...operatorStack];
}

function calculate(
  operator: Operator,
  first: bigNumber.BigNumber,
  second: bigNumber.BigNumber
): bigNumber.BigNumber {
  switch (operator.sign) {
    case "add": {
      return first.plus(second);
    }

    case "divide": {
      return first.dividedBy(second);
    }

    case "minus": {
      return first.minus(second);
    }

    case "multiply": {
      return first.multipliedBy(second);
    }
    default:
      throw new Error(
        "Only 'multiply', 'add', 'minus', 'divide' are supported"
      );
  }
}

function evaluate(numOperators: NumOperator[]): string {
  const postFix = shuntingYard(numOperators);
  let stack: bigNumber.BigNumber[] = [];

  for (let i = 0; i < postFix.length; i++) {
    const nos = postFix[i];

    if (nos.type === "operator" && stack.length >= 2) {
      const [first, second] = stack.slice(stack.length - 2);
      const result = calculate(nos, first, second);
      stack.pop();
      stack.pop();
      stack.push(result);
    } else if (nos.type === "number") {
      if (nos.value === ".") {
        stack.push(new BigNumber("0.0"));
      } else {
        stack.push(new BigNumber(nos.value));
      }
    }
  }

  return stack.length > 0 ? stack[0].toFormat() : "";
}

export const result: Readable<string> = derived(numOperators, ($numOperators) =>
  evaluate($numOperators)
);
