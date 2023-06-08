const { Visitor } = require('@swc/core/Visitor');
// import Visitor from '@swc/core/Visitor';

let transpile;

class TransformEval extends Visitor {
  visitCallExpression(exp) {
    if (exp.callee.type !== "Identifier" || exp.callee.value !== "eval") return exp;

    const [ arg ] = exp.arguments;
    if (arg.expression.type !== "StringLiteral") return exp;

    arg.expression.value = transpile(arg.expression.value, [], false);

    // arg.expression.raw = JSON.stringify(arg.expression.value);
    // arg.expression.span = { start: 0, end: 0, ctxt: 0 };

    return exp;
  }
}

module.exports = p => {
  if (!transpile) transpile = require('../transpile.js');
  return new TransformEval().visitProgram(p);
};