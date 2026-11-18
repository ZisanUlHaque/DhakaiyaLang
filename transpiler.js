/**
 * DhakaiyaLang JS Transpiler
 * Compiler Design Lab - Phase 4: Code Generation (Target: JavaScript / V8 Engine)
 * Converts DhakaiyaLang AST into clean, formatted, executable JavaScript.
 */

class Transpiler {
  constructor(indentSize = 2) {
    this.indentSize = indentSize;
  }

  getIndent(level) {
    return ' '.repeat(level * this.indentSize);
  }

  transpile(node, level = 0) {
    if (!node) return '';

    switch (node.type) {
      case 'Program': {
        const lines = [
          '// Transpiled from DhakaiyaLang to JavaScript (V8 Engine)',
          '// Bismillah shuru...',
          ''
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
        const params = node.params.join(', ');
        return `${indent}function ${node.name}(${params}) ${this.transpile(node.body, level)}`;
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
        const args = (node.arguments || []).map(a => this.transpile(a, 0)).join(', ');
        return `${callee}(${args})`;
      }

      case 'ArrayLiteral': {
        const elems = (node.elements || []).map(e => this.transpile(e, 0)).join(', ');
        return `[${elems}]`;
      }

      case 'MemberExpression': {
        const obj = this.transpile(node.object, 0);
        const prop = this.transpile(node.property, 0);
        return `${obj}[${prop}]`;
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
          .map(stmt => this.transpile(stmt, level + 1))
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

      case 'UnaryExpression': {
        let op = node.operator;
        if (op === 'nah') op = '!';
        const arg = this.transpile(node.argument, 0);
        return `${op}${arg}`;
      }

      case 'Literal': {
        if (typeof node.value === 'string') {
          return JSON.stringify(node.value);
        }
        if (node.value === null) {
          return 'null';
        }
        return String(node.value);
      }

      case 'Identifier': {
        return node.name;
      }

      default:
        return `/* Unknown AST Node: ${node.type} */`;
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = { Transpiler };
}
