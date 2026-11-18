/**
 * DhakaiyaLang Interpreter & Environment (Symbol Table)
 * Compiler Design Lab - Phase 3 & 4: Semantic Analysis & Code Execution
 */

class ReturnSignal {
  constructor(value) {
    this.value = value;
  }
}

class BreakSignal {}
class ContinueSignal {}

class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.records = new Map();
  }

  define(name, value) {
    this.records.set(name, value);
    return value;
  }

  assign(name, value) {
    if (this.records.has(name)) {
      this.records.set(name, value);
      return value;
    }
    if (this.parent) {
      return this.parent.assign(name, value);
    }
    throw new Error(`[Runtime Error] Arey mama! '${name}' variable to define koro nai, assign kemne korba?!`);
  }

  lookup(name) {
    if (this.records.has(name)) {
      return this.records.get(name);
    }
    if (this.parent) {
      return this.parent.lookup(name);
    }
    throw new Error(`[Runtime Error] Mama, '${name}' bole to kono variable khuje pelam na! Age 'rakh ${name} = ...;' koro.`);
  }
}

class Interpreter {
  constructor(outputCallback = console.log) {
    this.output = outputCallback;
    this.globalEnv = new Environment();
  }

  evaluate(node, env = this.globalEnv) {
    if (!node) return null;

    switch (node.type) {
      case 'Program':
        return this.evalProgram(node, env);

      case 'VariableDeclaration':
        const val = node.init ? this.evaluate(node.init, env) : null;
        return env.define(node.identifier, val);

      case 'AssignmentStatement':
        const assignVal = this.evaluate(node.value, env);
        return env.assign(node.identifier, assignVal);

      case 'PrintStatement':
        const printVal = this.evaluate(node.expression, env);
        this.output(this.formatOutput(printVal));
        return printVal;

      case 'IfStatement':
        const condition = this.evaluate(node.test, env);
        if (this.isTruthy(condition)) {
          return this.evaluate(node.consequent, new Environment(env));
        } else if (node.alternate) {
          return this.evaluate(node.alternate, new Environment(env));
        }
        return null;

      case 'WhileStatement':
        let result = null;
        let loopLimit = 100000;
        let count = 0;
        while (this.isTruthy(this.evaluate(node.test, env))) {
          if (++count > loopLimit) {
            throw new Error("[Runtime Error] Mama! Infinite loop lagay diso! Chakkor thamo!");
          }
          try {
            result = this.evaluate(node.body, new Environment(env));
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        return result;

      case 'FunctionDeclaration':
        return env.define(node.name, {
          type: 'Function',
          params: node.params,
          body: node.body,
          closure: env
        });

      case 'ReturnStatement': {
        const retVal = node.argument ? this.evaluate(node.argument, env) : null;
        throw new ReturnSignal(retVal);
      }

      case 'BreakStatement':
        throw new BreakSignal();

      case 'ContinueStatement':
        throw new ContinueSignal();

      case 'CallExpression': {
        const fn = this.evaluate(node.callee, env);
        if (!fn || fn.type !== 'Function') {
          throw new Error(`[Runtime Error] Mama! '${node.callee.name || 'This'}' to kono kaam (function) na!`);
        }
        const evaluatedArgs = (node.arguments || []).map(arg => this.evaluate(arg, env));
        const fnEnv = new Environment(fn.closure);
        fn.params.forEach((param, i) => {
          fnEnv.define(param, evaluatedArgs[i] !== undefined ? evaluatedArgs[i] : null);
        });
        try {
          this.evaluate(fn.body, fnEnv);
        } catch (signal) {
          if (signal instanceof ReturnSignal) {
            return signal.value;
          }
          throw signal;
        }
        return null;
      }

      case 'ArrayLiteral':
        return (node.elements || []).map(elem => this.evaluate(elem, env));

      case 'MemberExpression': {
        const target = this.evaluate(node.object, env);
        const index = this.evaluate(node.property, env);
        if (target === null || target === undefined) {
          throw new Error(`[Runtime Error] Mama! Khali jinishe index '${index}' khujteso!`);
        }
        return target[index];
      }

      case 'BlockStatement':
        const blockEnv = new Environment(env);
        let blockResult = null;
        for (const stmt of node.body) {
          blockResult = this.evaluate(stmt, blockEnv);
        }
        return blockResult;

      case 'ExpressionStatement':
        return this.evaluate(node.expression, env);

      case 'BinaryExpression':
        return this.evalBinary(node, env);

      case 'UnaryExpression':
        return this.evalUnary(node, env);

      case 'Literal':
        return node.value;

      case 'Identifier':
        return env.lookup(node.name);

      default:
        throw new Error(`[Interpreter Error] Mama! Unknown AST Node: ${node.type}`);
    }
  }

  evalProgram(programNode, env) {
    let lastResult = null;
    for (const stmt of programNode.body) {
      lastResult = this.evaluate(stmt, env);
    }
    return lastResult;
  }

  evalBinary(node, env) {
    const left = this.evaluate(node.left, env);
    const right = this.evaluate(node.right, env);

    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/':
        if (right === 0) throw new Error("[Math Error] Mama, 0 diya divide kora jay na!");
        return left / right;
      case '%': return left % right;
      case '==': return left === right;
      case '!=': return left !== right;
      case '<': return left < right;
      case '<=': return left <= right;
      case '>': return left > right;
      case '>=': return left >= right;
      case '&&':
      case 'ebong':
        return left && right;
      case '||':
      case 'othoba':
        return left || right;
      default:
        throw new Error(`[Operator Error] Mama! '${node.operator}' operator bujhi nai.`);
    }
  }

  evalUnary(node, env) {
    const val = this.evaluate(node.argument, env);
    switch (node.operator) {
      case '-': return -val;
      case '!':
      case 'nah':
        return !this.isTruthy(val);
      default:
        throw new Error(`[Unary Error] '${node.operator}' ki jinish mama?`);
    }
  }

  isTruthy(val) {
    return val !== false && val !== null && val !== 0 && val !== '';
  }

  formatOutput(val) {
    if (val === true) return 'asli';
    if (val === false) return 'fapor';
    if (val === null) return 'khali';
    if (Array.isArray(val)) {
      return '[' + val.map(v => this.formatOutput(v)).join(', ') + ']';
    }
    if (typeof val === 'object' && val.type === 'Function') {
      return '[kaam (function)]';
    }
    return String(val);
  }
}

if (typeof module !== 'undefined') {
  module.exports = { Interpreter, Environment };
}
