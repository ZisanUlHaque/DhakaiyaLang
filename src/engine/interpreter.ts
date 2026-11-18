/**
 * DhakaiyaLang Interpreter & Environment (Symbol Table)
 * Compiler Design Lab - Phase 3: Semantic Analysis & Code Execution
 */

import { ASTNode } from './parser';

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
        const loopLimit = 100000; // guard against infinite loops
        let count = 0;
        while (this.isTruthy(this.evaluate(node.test, env))) {
          if (++count > loopLimit) {
            throw new Error("[Runtime Error] আরে মামা! ইনফিনিট লুপ মারছো কেন?! চক্কর থামায়ে কন্ডিশন ঠিক করো!");
          }
          result = this.evaluate(node.body, new Environment(env));
        }
        return result;

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
        throw new Error(`[Interpreter Error] মামা! অচেনা AST Node: ${node.type}`);
    }
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
    return String(val);
  }
}
