/**
 * DhakaiyaLang JS Transpiler
 * Compiler Design Lab - Phase 4: Code Generation (Target: JavaScript / V8 Engine)
 * Translates DhakaiyaLang AST directly to clean, formatted ES6 JavaScript.
 */

import { ASTNode } from './parser';

export class Transpiler {
  indentSize: number;

  constructor(indentSize = 2) {
    this.indentSize = indentSize;
  }

  getIndent(level: number): string {
    return ' '.repeat(level * this.indentSize);
  }

  transpile(node: ASTNode | null, level = 0): string {
    if (!node) return '';

    if (Array.isArray(node)) {
      return (node as ASTNode[]).map((s: ASTNode) => this.transpile(s, level)).join('\n');
    }

    switch (node.type) {
      case 'Program': {
        const lines = [
          '// ========================================================',
          '// Transpiled from DhakaiyaLang to JavaScript (V8 Engine)',
          '// Compiler Design Lab: Phase 4 Code Generator',
          '// ========================================================',
          '',
          '// Bismillah shuru...'
        ];
        for (const stmt of node.body) {
          lines.push(this.transpile(stmt, level));
        }
        lines.push('');
        lines.push('// Khatam shesh.');
        return lines.join('\n');
      }

      case 'FunctionDeclaration': {
        const indent = this.getIndent(level);
        const params = (node.params || []).join(', ');
        const bodyStmts = Array.isArray(node.body) ? node.body : (node.body?.body || []);
        const stmts = bodyStmts.map((s: ASTNode) => this.transpile(s, level + 1)).join('\n');
        return `${indent}function ${node.name}(${params}) {\n${stmts}\n${indent}}`;
      }

      case 'ReturnStatement': {
        const indent = this.getIndent(level);
        if (node.argument) {
          return `${indent}return ${this.transpile(node.argument, 0)};`;
        }
        return `${indent}return;`;
      }

      case 'BreakStatement': {
        const indent = this.getIndent(level);
        return `${indent}break;`;
      }

      case 'ContinueStatement': {
        const indent = this.getIndent(level);
        return `${indent}continue;`;
      }

      case 'CallExpression': {
        const callee = this.transpile(node.callee, 0);
        const args = (node.arguments || []).map((a: ASTNode) => this.transpile(a, 0)).join(', ');
        return `${callee}(${args})`;
      }

      case 'ArrayLiteral': {
        const elems = (node.elements || []).map((e: ASTNode) => this.transpile(e, 0)).join(', ');
        return `[${elems}]`;
      }

      case 'MemberExpression': {
        const obj = this.transpile(node.object, 0);
        const prop = this.transpile(node.property, 0);
        return `${obj}[${prop}]`;
      }

      case 'MemberAssignmentStatement': {
        const indent = this.getIndent(level);
        const obj = this.transpile(node.object, 0);
        const prop = this.transpile(node.property, 0);
        const val = this.transpile(node.value, 0);
        return `${indent}${obj}[${prop}] = ${val};`;
      }

      case 'VariableDeclaration': {
        const indent = this.getIndent(level);
        if (node.init) {
          return `${indent}let ${node.identifier} = ${this.transpile(node.init, 0)};`;
        }
        return `${indent}let ${node.identifier} = null;`;
      }

      case 'AssignmentStatement': {
        const indent = this.getIndent(level);
        return `${indent}${node.identifier} = ${this.transpile(node.value, 0)};`;
      }

      case 'PrintStatement': {
        const indent = this.getIndent(level);
        const exprCode = this.transpile(node.expression, 0);
        return `${indent}console.log(${exprCode});`;
      }

      case 'IfStatement': {
        const indent = this.getIndent(level);
        const testCode = this.transpile(node.test, 0);
        let code = `${indent}if (${testCode}) `;
        code += this.transpile(node.consequent, level);

        if (node.alternate) {
          if (node.alternate.type === 'IfStatement') {
            code += ` else ${this.transpile(node.alternate, level).trimStart()}`;
          } else {
            code += ` else ${this.transpile(node.alternate, level)}`;
          }
        }
        return code;
      }

      case 'WhileStatement': {
        const indent = this.getIndent(level);
        const testCode = this.transpile(node.test, 0);
        return `${indent}while (${testCode}) ${this.transpile(node.body, level)}`;
      }

      case 'BlockStatement': {
        const indent = this.getIndent(level);
        if (!node.body || node.body.length === 0) {
          return '{\n' + indent + '}';
        }
        const bodyLines = node.body
          .map((stmt: ASTNode) => this.transpile(stmt, level + 1))
          .join('\n');
        return `{\n${bodyLines}\n${indent}}`;
      }

      case 'ExpressionStatement': {
        const indent = this.getIndent(level);
        return `${indent}${this.transpile(node.expression, 0)};`;
      }

      case 'BinaryExpression': {
        let op = node.operator;
        if (op === 'ebong') op = '&&';
        if (op === 'othoba') op = '||';
        const left = this.transpile(node.left, 0);
        const right = this.transpile(node.right, 0);
        return `(${left} ${op} ${right})`;
      }

      case 'LogicalExpression': {
        const left = this.transpile(node.left, 0);
        const right = this.transpile(node.right, 0);
        return `(${left} ${node.operator} ${right})`;
      }

      case 'UnaryExpression': {
        let op = node.operator;
        if (op === 'nah') op = '!';
        const arg = this.transpile(node.argument, 0);
        return `${op}(${arg})`;
      }

      case 'Literal': {
        if (typeof node.value === 'string') {
          return JSON.stringify(node.value);
        }
        if (node.value === null) return 'null';
        return String(node.value);
      }

      case 'Identifier':
        return node.name;

      default:
        return `/* Unknown node: ${node.type} */`;
    }
  }
}
