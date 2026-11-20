/**
 * DhakaiyaLang Interpreter & Environment (Symbol Table)
 * Compiler Design Lab - Phase 3: Semantic Analysis & Code Execution
 */

import { ASTNode } from './parser';

export class ReturnSignal {
  value: any;
  constructor(value: any) {
    this.value = value;
  }
}

export class BreakSignal {}
export class ContinueSignal {}

export class Environment {
  parent: Environment | null;
  records: Map<string, any>;

  constructor(parent: Environment | null = null) {
    this.parent = parent;
    this.records = new Map();
  }

  define(name: string, value: any): any {
    this.records.set(name, value);
    return value;
  }

  assign(name: string, value: any): any {
    if (this.records.has(name)) {
      this.records.set(name, value);
      return value;
    }
    if (this.parent) {
      return this.parent.assign(name, value);
    }
    throw new Error(`[Runtime Error] আরে মামা! '${name}' ভ্যারিয়েবল তো আগে ডিক্লেয়ার করো নাই, মান বসাইবা কেমনে?! আগে 'rakh ${name} = ...;' করো।`);
  }

  lookup(name: string): any {
    if (this.records.has(name)) {
      return this.records.get(name);
    }
    if (this.parent) {
      return this.parent.lookup(name);
    }
    throw new Error(`[Runtime Error] মামা, '${name}' নামের কোনো ভ্যারিয়েবল খুইজা পাইলাম না! আগে 'rakh ${name} = ...;' কইরা নাও।`);
  }
}

export class Interpreter {
  output: (msg: string) => void;
  globalEnv: Environment;

  constructor(outputCallback: (msg: string) => void = console.log) {
    this.output = outputCallback;
    this.globalEnv = new Environment();
  }

  evaluate(node: ASTNode | null, env: Environment = this.globalEnv): any {
    if (!node) return null;

    switch (node.type) {
      case 'Program':
        return this.evalProgram(node, env);

      case 'VariableDeclaration': {
        const val = node.init ? this.evaluate(node.init, env) : null;
        return env.define(node.identifier, val);
      }

      case 'AssignmentStatement': {
        const assignVal = this.evaluate(node.value, env);
        return env.assign(node.identifier, assignVal);
      }

      case 'MemberAssignmentStatement': {
        const obj = this.evaluate(node.object, env);
        const prop = this.evaluate(node.property, env);
        const val = this.evaluate(node.value, env);
        if (Array.isArray(obj)) {
          obj[prop] = val;
          return val;
        }
        throw new Error(`[Runtime Error] মামা, অ্যারে ছাড়া ইনডেক্সে ভ্যালু অ্যাসাইন করা যাইবো না!`);
      }

      case 'PrintStatement': {
        const printVal = this.evaluate(node.expression, env);
        this.output(this.formatOutput(printVal));
        return printVal;
      }

      case 'IfStatement': {
        const condition = this.evaluate(node.test, env);
        if (this.isTruthy(condition)) {
          return this.evalBlockOrStatement(node.consequent, new Environment(env));
        } else if (node.alternate) {
          return this.evalBlockOrStatement(node.alternate, new Environment(env));
        }
        return null;
      }

      case 'WhileStatement': {
        let result = null;
        const loopLimit = 100000; // guard against infinite loops
        let count = 0;
        while (this.isTruthy(this.evaluate(node.test, env))) {
          if (++count > loopLimit) {
            throw new Error("[Runtime Error] আরে মামা! ইনফিনিট লুপ মারছো কেন?! চক্কর থামায়ে কন্ডিশন ঠিক করো!");
          }
          try {
            result = this.evalBlockOrStatement(node.body, new Environment(env));
          } catch (sig) {
            if (sig instanceof BreakSignal) {
              break;
            }
            if (sig instanceof ContinueSignal) {
              continue;
            }
            throw sig;
          }
        }
        return result;
      }

      case 'BlockStatement':
        return this.evalBlock(node.body, new Environment(env));

      case 'FunctionDeclaration': {
        const fn = (...args: any[]) => {
          const fnEnv = new Environment(env);
          (node.params || []).forEach((param: string, i: number) => {
            fnEnv.define(param, args[i] !== undefined ? args[i] : null);
          });
          try {
            this.evalBlock(node.body.body || node.body, fnEnv);
          } catch (sig) {
            if (sig instanceof ReturnSignal) {
              return sig.value;
            }
            throw sig;
          }
          return null;
        };
        return env.define(node.name, fn);
      }

      case 'ReturnStatement': {
        const val = node.argument ? this.evaluate(node.argument, env) : null;
        throw new ReturnSignal(val);
      }

      case 'BreakStatement':
        throw new BreakSignal();

      case 'ContinueStatement':
        throw new ContinueSignal();

      case 'CallExpression': {
        const callee = this.evaluate(node.callee, env);
        if (typeof callee !== 'function') {
          throw new Error(`[Runtime Error] মামা, '${node.callee.name || 'expression'}' তো কোনো ফাংশন না! কল করলা কেমনে?!`);
        }
        const args = (node.arguments || []).map((a: ASTNode) => this.evaluate(a, env));
        return callee(...args);
      }

      case 'ArrayLiteral': {
        return (node.elements || []).map((elem: ASTNode) => this.evaluate(elem, env));
      }

      case 'MemberExpression': {
        const obj = this.evaluate(node.object, env);
        const prop = this.evaluate(node.property, env);
        if (obj === null || obj === undefined) {
          throw new Error(`[Runtime Error] মামা, নাল বা আনডিফাইন্ড থেকে ইনডেক্স পড়া যাইবো না!`);
        }
        return obj[prop];
      }

      case 'ExpressionStatement':
        return this.evaluate(node.expression, env);

      case 'BinaryExpression':
      case 'LogicalExpression':
        return this.evalBinary(node, env);

      case 'UnaryExpression':
        return this.evalUnary(node, env);

      case 'Literal':
        return node.value;

      case 'Identifier':
        return env.lookup(node.name);

      default:
        throw new Error(`[Interpreter Error] মামা! অচেনা AST Node: ${node.type}`);
    }
  }

  evalBlockOrStatement(node: ASTNode, env: Environment): any {
    if (node.type === 'BlockStatement') {
      return this.evalBlock(node.body, env);
    }
    return this.evaluate(node, env);
  }

  evalBlock(statements: ASTNode[], env: Environment): any {
    let result = null;
    for (const stmt of statements) {
      result = this.evaluate(stmt, env);
    }
    return result;
  }

  evalProgram(programNode: ASTNode, env: Environment): any {
    let lastResult = null;
    for (const stmt of programNode.body) {
      lastResult = this.evaluate(stmt, env);
    }
    return lastResult;
  }

  evalBinary(node: ASTNode, env: Environment): any {
    const left = this.evaluate(node.left, env);
    const right = this.evaluate(node.right, env);

    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/':
        if (right === 0) throw new Error("[Math Error] মামা, ০ (শূন্য) দিয়া তো ভাগ করা যায় না! ম্যাথ এরর!");
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
        throw new Error(`[Operator Error] মামা! '${node.operator}' অপারেটর তো বুঝি নাই।`);
    }
  }

  evalUnary(node: ASTNode, env: Environment): any {
    const val = this.evaluate(node.argument, env);
    switch (node.operator) {
      case '-': return -val;
      case '!':
      case 'nah':
        return !this.isTruthy(val);
      default:
        throw new Error(`[Unary Error] '${node.operator}' এইটা কি করবা মামা?`);
    }
  }

  isTruthy(val: any): boolean {
    return val !== false && val !== null && val !== 0 && val !== '';
  }

  formatOutput(val: any): string {
    if (val === true) return 'asli (true)';
    if (val === false) return 'fapor (false)';
    if (val === null) return 'khali (null)';
    if (Array.isArray(val)) {
      return '[' + val.map(item => typeof item === 'string' ? `"${item}"` : this.formatOutput(item)).join(', ') + ']';
    }
    return String(val);
  }
}
