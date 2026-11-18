/**
 * DhakaiyaLang Parser
 * Compiler Design Lab - Phase 2: Syntax Analysis (Recursive Descent Parser)
 * Generates an Abstract Syntax Tree (AST) matching ESTree specs
 */

import { Token, TokenType } from './lexer';

export interface ASTNode {
  type: string;
  [key: string]: any;
}

export class Parser {
  tokens: Token[];
  cursor: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.cursor = 0;
  }

  peek(offset = 0): Token {
    const pos = this.cursor + offset;
    return pos < this.tokens.length ? this.tokens[pos] : this.tokens[this.tokens.length - 1];
  }

  isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance(): Token {
    if (!this.isAtEnd()) this.cursor++;
    return this.tokens[this.cursor - 1];
  }

  consume(type: TokenType, errorMessage: string): Token {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new Error(`[Syntax Error] ${errorMessage} (পাইলাম '${token.value}' at Line ${token.line}, Col ${token.column})`);
  }

  parse(): ASTNode {
    this.consume(TokenType.PROGRAM_START, "আরে মামা! প্রোগ্রাম তো 'bismillah' দিয়া শুরু করবা!");

    const body: ASTNode[] = [];
    while (!this.check(TokenType.PROGRAM_END) && !this.isAtEnd()) {
      body.push(this.statement());
    }

    this.consume(TokenType.PROGRAM_END, "মামা, প্রোগ্রাম শেষে 'khatam' দিতে ভুইলা গেলা কেন?!");

    return {
      type: 'Program',
      body: body
    };
  }

  statement(): ASTNode {
    if (this.match(TokenType.VAR)) {
      return this.varDeclaration();
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

  varDeclaration(): ASTNode {
    const nameToken = this.consume(TokenType.IDENTIFIER, "মামা, 'rakh' এর পরে ভ্যারিয়েবলের একটা সুন্দর নাম দেও!");
    let init: ASTNode | null = null;

    if (this.match(TokenType.ASSIGN)) {
      init = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "আরে মামা! ভ্যারিয়েবল ডিক্লেয়ারেশনের পরে সেমিকোলন (;) কই ফালাইলা?!");
    return {
      type: 'VariableDeclaration',
      identifier: nameToken.value,
      init: init,
      line: nameToken.line
    };
  }

  printStatement(): ASTNode {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "মামা, 'chilla' স্টেটমেন্টের পরে সেমিকোলন (;) দিতে ভুইলা গেসো!");
    return {
      type: 'PrintStatement',
      expression: expr
    };
  }

  ifStatement(): ASTNode {
    this.consume(TokenType.LPAREN, "মামা, 'jodi' এর শর্ত প্রথম বন্ধনী '(' এর ভিতর দেও!");
    const condition = this.expression();
    this.consume(TokenType.RPAREN, "মামা, শর্তের পরে প্রথম বন্ধনী ')' বন্ধ করো!");

    const consequent = this.blockStatement();
    let alternate: ASTNode | null = null;

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

  whileStatement(): ASTNode {
    this.consume(TokenType.LPAREN, "মামা, 'chakkor' লুপের শর্ত ব্র্যাকেট '(' এর ভিতর দেও!");
    const condition = this.expression();
    this.consume(TokenType.RPAREN, "মামা, 'chakkor' লুপের ব্র্যাকেট ')' বন্ধ করো!");

    const body = this.blockStatement();

    return {
      type: 'WhileStatement',
      test: condition,
      body: body
    };
  }

  blockStatement(): ASTNode {
    this.consume(TokenType.LBRACE, "মামা, ব্লকের শুরুতে কার্লি ব্র্যাকেট '{' দিতে হবে!");
    const statements: ASTNode[] = [];

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      statements.push(this.statement());
    }

    this.consume(TokenType.RBRACE, "মামা, ব্লক শেষে কার্লি ব্র্যাকেট '}' দিয়া বন্ধ করো!");
    return {
      type: 'BlockStatement',
      body: statements
    };
  }

  expressionOrAssignmentStatement(): ASTNode {
    // Check if assignment: variable = expression;
    if (this.check(TokenType.IDENTIFIER) && this.peek(1).type === TokenType.ASSIGN) {
      const idToken = this.advance();
      this.advance(); // consume '='
      const value = this.expression();
      this.consume(TokenType.SEMICOLON, "মামা, অ্যাসাইনমেন্টের শেষে সেমিকোলন (;) কই?!");
      return {
        type: 'AssignmentStatement',
        identifier: idToken.value,
        value: value,
        line: idToken.line
      };
    }

    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "মামা, স্টেটমেন্টের শেষে সেমিকোলন (;) দেওয়া বাধ্যতামূলক!");
    return {
      type: 'ExpressionStatement',
      expression: expr
    };
  }

  // Precedence climbing
  expression(): ASTNode {
    return this.logicalOr();
  }

  logicalOr(): ASTNode {
    let left = this.logicalAnd();
    while (this.match(TokenType.OR)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.logicalAnd();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  logicalAnd(): ASTNode {
    let left = this.equality();
    while (this.match(TokenType.AND)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.equality();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  equality(): ASTNode {
    let left = this.comparison();
    while (this.match(TokenType.EQ, TokenType.NEQ)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.comparison();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  comparison(): ASTNode {
    let left = this.additive();
    while (this.match(TokenType.LT, TokenType.LTE, TokenType.GT, TokenType.GTE)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.additive();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  additive(): ASTNode {
    let left = this.multiplicative();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.multiplicative();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  multiplicative(): ASTNode {
    let left = this.unary();
    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.unary();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  unary(): ASTNode {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const op = this.tokens[this.cursor - 1].value;
      const argument = this.unary();
      return { type: 'UnaryExpression', operator: op, argument };
    }
    return this.primary();
  }

  primary(): ASTNode {
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
    if (this.match(TokenType.IDENTIFIER)) {
      return { type: 'Identifier', name: this.tokens[this.cursor - 1].value };
    }
    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "মামা, ব্র্যাকেট '(' খুললে ')' দিয়া বন্ধ করতে হইবো!");
      return expr;
    }

    const t = this.peek();
    throw new Error(`[Syntax Error] আরে মামা! '${t.value}' টোকেনটা এখানে কি করতাছে?! (Line ${t.line}, Col ${t.column})`);
  }
}
