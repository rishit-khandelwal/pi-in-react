import { useState } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

function Output(props) {
  return (
    <div className="text-white text-5xl text-center">{props.variable}</div>
  );
}

class PolynomialUnit {
  constructor(coefficient, exponent) {
    this.coefficient = coefficient;
    this.exponent = exponent;
  }
}

class Polynomial {
  constructor(terms) {
    this.terms = terms;
  }

  eval(at) {
    let value = 0;

    for (const term of this.terms) {
      value += term.coefficient * at ** term.exponent;
    }

    return value;
  }

  integrate(from, to) {
    let terms = this.terms.map((term) => {
      return new PolynomialUnit(
        term.coefficient / (term.exponent + 1),
        term.exponent + 1
      );
    });

    let temp = this.terms;

    this.terms = terms;

    let result = this.eval(to) - this.eval(from);

    this.terms = temp;

    return result;
  }
}

function factorial(c) {
  if (c === 1 || c === 0) {
    return 1;
  }
  return c * factorial(c - 1);
}

function fallingFactorial(base, count) {
  let result = 1;
  for (let k = 0; k < count; k++) {
    result *= base - k;
  }

  return result / factorial(count);
}

function binomialExpansionOfSqrt1minusxsquared(num) {
  const base = 1 / 2;

  let terms = [];
  for (let k = 0; k < num; k++) {
    terms.push(
      new PolynomialUnit(
        (k % 2 === 0 ? 1 : -1) * fallingFactorial(base, k),
        2 * k
      )
    );
  }

  console.log(num, terms);

  terms.push(new PolynomialUnit(-Math.sqrt(3), 1));

  return new Polynomial(terms);
}

function App() {
  const [count, setCount] = useState(1);

  let terms = binomialExpansionOfSqrt1minusxsquared(count);
  let pi = terms.integrate(0, 0.5);

  let str = terms.terms
    .slice(0, terms.length + terms.length === 1 ? 0 : -1)
    .reduce((total, term, index) => {
      return (
        total +
        `${term.coefficient}${
          term.exponent !== 0 ? `x^{${term.exponent}}` : ""
        } ${
          terms[index + 1] ? (terms[index + 1].coefficient < 1 ? "-" : "+") : ""
        }`
      );
    }, "");

  str = str.slice(0, str.length - 1);

  str = `$\\pi\\approx12\\int_{0}^{0.5} (${str}-\\sqrt{3}x) dx$`;

  const [data, setData] = useState(12 * pi);

  return (
    <div id="main" className="grid">
      <Output variable={data}></Output>
      <button
        className="text-white font-bold border-2 p-2"
        onClick={() => {
          setCount(count + 1);
          setData(12 * pi);
        }}
      >
        add one more term
      </button>

      <span className="text-white overflow-x-scroll text-4xl mt-8">
        <Latex>{"$$\\pi=12\\int_0^{0.5} \\sqrt{1-x^2} dx $$"}</Latex>
        <Latex>{str}</Latex>
      </span>
    </div>
  );
}

export default App;
