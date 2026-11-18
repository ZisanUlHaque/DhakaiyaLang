/**
 * DhakaiyaLang Parser
 * Compiler Design Lab - Phase 2: Syntax Analysis (Recursive Descent Parser)
 * Generates an Abstract Syntax Tree (AST)
 */

if (typeof require !== 'undefined') {
  var { TokenType } = require('./lexer');
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.cursor = 0;
  }

  peek(offset = 0) {
    const pos = this.cursor + offset;
    return pos < this.tokens.length ? this.tokens[pos] : this.tokens[this.tokens.length - 1];
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.cursor++;
    return this.tokens[this.cursor - 1];
  }

  consume(type, errorMessage) {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new Error(`[Syntax Error] ${errorMessage} (Paisi '${token.value}' at Line ${token.line}, Col ${token.column})`);
  }

  parse() {
    this.consume(TokenType.PROGRAM_START, "Mama, program to 'bismillah' diya shuru korte hobe!");

    const body = [];
    while (!this.check(TokenType.PROGRAM_END) && !this.isAtEnd()) {
      body.push(this.statement());
    }

    this.consume(TokenType.PROGRAM_END, "Mama, program sheshe 'khatam' dite bhule geso!");

    return {
      type: 'Program',
      body: body
    };
  }

  statement() {
    if (this.match(TokenType.VAR)) {
      return this.varDeclaration();
    }
    if (this.match(TokenType.FUNCTION)) {
      return this.functionDeclaration();
    }
    if (this.match(TokenType.RETURN)) {
      return this.returnStatement();
    }
    if (this.match(TokenType.BREAK)) {
      return this.breakStatement();
    }
    if (this.match(TokenType.CONTINUE)) {
      return this.continueStatement();
    }
    if (this.match(TokenType.PRINT)) {
      return this.printStatement();
    }
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
    }
    if (this.match(TokenType.WHILE)) {
      return this.whileStatement();
    }
    if (this.check(TokenType.LBRACE)) {
      return this.blockStatement();
    }
    return this.expressionOrAssignmentStatement();
  }

  functionDeclaration() {
    const nameToken = this.consume(TokenType.IDENTIFIER, "Mama, 'kaam' er pore function er ekta naam dao!");
    this.consume(TokenType.LPAREN, "Mama, parameter list '(' bracket diya shuru koro!");
    const params = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        const paramToken = this.consume(TokenType.IDENTIFIER, "Mama, parameter er naam dao!");
        params.push(paramToken.value);
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RPAREN, "Mama, parameter list ')' bracket diya bondho koro!");
    const body = this.blockStatement();
    return {
      type: 'FunctionDeclaration',
      name: nameToken.value,
      params: params,
      body: body
    };
  }

  returnStatement() {
    let argument = null;
    if (!this.check(TokenType.SEMICOLON)) {
      argument = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Mama, 'ferot' statement er sheshe semicolon (;) কই?");
    return {
      type: 'ReturnStatement',
      argument: argument
    };
  }

  breakStatement() {
    this.consume(TokenType.SEMICOLON, "Mama, 'thamo' statement er sheshe semicolon (;) কই?");
    return { type: 'BreakStatement' };
  }

  continueStatement() {
    this.consume(TokenType.SEMICOLON, "Mama, 'chalao' statement er sheshe semicolon (;) কই?");
    return { type: 'ContinueStatement' };
  }

  varDeclaration() {
    const nameToken = this.consume(TokenType.IDENTIFIER, "Mama, 'rakh' er pore variable er ekta naam dao!");
    let init = null;

    if (this.match(TokenType.ASSIGN)) {
      init = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Mama, line sheshe semicolon (;) কই?");
    return {
      type: 'VariableDeclaration',
      identifier: nameToken.value,
      init: init,
      line: nameToken.line
    };
  }

  printStatement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Mama, 'chilla' statement er pore semicolon (;) koi?");
    return {
      type: 'PrintStatement',
      expression: expr
    };
  }

  ifStatement() {
    this.consume(TokenType.LPAREN, "Mama, 'jodi' er condition bracket '(' er bhetor rakha lagbe!");
    const condition = this.expression();
    this.consume(TokenType.RPAREN, "Mama, condition er sheshe bracket ')' close koro!");

    const consequent = this.blockStatement();
    let alternate = null;

    if (this.match(TokenType.ELSE)) {
      if (this.match(TokenType.IF)) {
        alternate = this.ifStatement();
      } else {
        alternate = this.blockStatement();
      }
    }

    return {
      type: 'IfStatement',
      test: condition,
      consequent: consequent,
      alternate: alternate
    };
  }

  whileStatement() {
    this.consume(TokenType.LPAREN, "Mama, 'chakkor' er condition bracket '(' er bhetor rakha lagbe!");
    const condition = this.expression();
    this.consume(TokenType.RPAREN, "Mama, 'chakkor' condition bracket ')' close koro!");

    const body = this.blockStatement();

    return {
      type: 'WhileStatement',
      test: condition,
      body: body
    };
  }

  blockStatement() {
    this.consume(TokenType.LBRACE, "Mama, block shuru korte '{' dao!");
    const statements = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      statements.push(this.statement());
    }

    this.consume(TokenType.RBRACE, "Mama, block shesh korte '}' dite bhule geso!");
    return {
      type: 'BlockStatement',
      body: statements
    };
  }

  expressionOrAssignmentStatement() {
    // Check if it's an assignment: variable = expression;
    if (this.check(TokenType.IDENTIFIER) && this.peek(1).type === TokenType.ASSIGN) {
      const idToken = this.advance();
      this.advance(); // consume '='
      const value = this.expression();
      this.consume(TokenType.SEMICOLON, "Mama, assignment er pore semicolon (;) koi?");
      return {
        type: 'AssignmentStatement',
        identifier: idToken.value,
        value: value,
        line: idToken.line
      };
    }

    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Mama, statement er pore semicolon (;) dite hobe!");
    return {
      type: 'ExpressionStatement',
      expression: expr
    };
  }

  // Precedence climbing
  expression() {
    return this.logicalOr();
  }

  logicalOr() {
    let left = this.logicalAnd();
    while (this.match(TokenType.OR)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.logicalAnd();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  logicalAnd() {
    let left = this.equality();
    while (this.match(TokenType.AND)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.equality();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  equality() {
    let left = this.comparison();
    while (this.match(TokenType.EQ, TokenType.NEQ)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.comparison();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  comparison() {
    let left = this.additive();
    while (this.match(TokenType.LT, TokenType.LTE, TokenType.GT, TokenType.GTE)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.additive();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  additive() {
    let left = this.multiplicative();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.multiplicative();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  multiplicative() {
    let left = this.unary();
    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.unary();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  unary() {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const op = this.tokens[this.cursor - 1].value;
      const argument = this.unary();
      return { type: 'UnaryExpression', operator: op, argument };
    }
    return this.primary();
  }

  primary() {
    if (this.match(TokenType.NUMBER)) {
      return { type: 'Literal', value: this.tokens[this.cursor - 1].value, raw: 'number' };
    }
    if (this.match(TokenType.STRING)) {
      return { type: 'Literal', value: this.tokens[this.cursor - 1].value, raw: 'string' };
    }
    if (this.match(TokenType.TRUE)) {
      return { type: 'Literal', value: true, raw: 'boolean' };
    }
    if (this.match(TokenType.FALSE)) {
      return { type: 'Literal', value: false, raw: 'boolean' };
    }
    if (this.match(TokenType.NULL)) {
      return { type: 'Literal', value: null, raw: 'null' };
    }
    if (this.match(TokenType.LBRACKET)) {
      const elements = [];
      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RBRACKET, "Mama, array ']' bracket diya bondho koro!");
      return { type: 'ArrayLiteral', elements };
    }
    if (this.match(TokenType.IDENTIFIER)) {
      let expr = { type: 'Identifier', name: this.tokens[this.cursor - 1].value };
      while (true) {
        if (this.match(TokenType.LPAREN)) {
          const args = [];
          if (!this.check(TokenType.RPAREN)) {
            do {
              args.push(this.expression());
            } while (this.match(TokenType.COMMA));
          }
          this.consume(TokenType.RPAREN, "Mama, function call er pore ')' bracket bondho koro!");
          expr = { type: 'CallExpression', callee: expr, arguments: args };
        } else if (this.match(TokenType.LBRACKET)) {
          const index = this.expression();
          this.consume(TokenType.RBRACKET, "Mama, array index er pore ']' bracket bondho koro!");
          expr = { type: 'MemberExpression', object: expr, property: index };
        } else {
          break;
        }
      }
      return expr;
    }
    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "Mama, '(' bracket dile ')' diya bondho korte hobe!");
      return expr;
    }

    const t = this.peek();
    throw new Error(`[Syntax Error] Arey mama! Unexpected token '${t.value}' at Line ${t.line}, Col ${t.column}`);
  }
}

if (typeof module !== 'undefined') {
  module.exports = { Parser };
}
