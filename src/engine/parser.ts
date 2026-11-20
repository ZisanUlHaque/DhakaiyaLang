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

  consumeSemicolon(errorMessage: string): void {
    if (this.match(TokenType.SEMICOLON)) {
      return;
    }
    const prev = this.tokens[this.cursor - 1];
    const current = this.peek();
    if (
      current.type === TokenType.PROGRAM_END ||
      current.type === TokenType.RBRACE ||
      current.type === TokenType.EOF ||
      (prev && current && current.line > prev.line)
    ) {
      return;
    }
    throw new Error(`[Syntax Error] ${errorMessage} (পাইলাম '${current.value}' at Line ${current.line}, Col ${current.column})`);
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

  functionDeclaration(): ASTNode {
    const nameToken = this.consume(TokenType.IDENTIFIER, "মামা, 'kaam' এর পরে ফাংশনের একটা সুন্দর নাম দেও!");
    this.consume(TokenType.LPAREN, "মামা, প্যারামিটার লিস্ট '(' ব্র্যাকেট দিয়া শুরু করো!");
    const params: string[] = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        const paramToken = this.consume(TokenType.IDENTIFIER, "মামা, প্যারামিটারের সঠিক নাম দেও!");
        params.push(paramToken.value);
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RPAREN, "মামা, প্যারামিটার লিস্ট ')' ব্র্যাকেট দিয়া বন্ধ করো!");
    const body = this.blockStatement();
    return {
      type: 'FunctionDeclaration',
      name: nameToken.value,
      params: params,
      body: body,
      line: nameToken.line
    };
  }

  returnStatement(): ASTNode {
    let argument: ASTNode | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      argument = this.expression();
    }
    this.consumeSemicolon("মামা, 'ferot' স্টেটমেন্টের শেষে সেমিকোলন (;) কই?!");
    return {
      type: 'ReturnStatement',
      argument: argument
    };
  }

  breakStatement(): ASTNode {
    this.consumeSemicolon("মামা, 'thamo' স্টেটমেন্টের শেষে সেমিকোলন (;) কই?!");
    return { type: 'BreakStatement' };
  }

  continueStatement(): ASTNode {
    this.consumeSemicolon("মামা, 'chalao' স্টেটমেন্টের শেষে সেমিকোলন (;) কই?!");
    return { type: 'ContinueStatement' };
  }

  varDeclaration(): ASTNode {
    const nameToken = this.consume(TokenType.IDENTIFIER, "মামা, 'rakh' এর পরে ভ্যারিয়েবলের একটা সুন্দর নাম দেও!");
    let init: ASTNode | null = null;

    if (this.match(TokenType.ASSIGN)) {
      init = this.expression();
    }

    this.consumeSemicolon("আরে মামা! ভ্যারিয়েবল ডিক্লেয়ারেশনের পরে সেমিকোলন (;) কই ফালাইলা?!");
    return {
      type: 'VariableDeclaration',
      identifier: nameToken.value,
      init: init,
      line: nameToken.line
    };
  }

  printStatement(): ASTNode {
    const expr = this.expression();
    this.consumeSemicolon("মামা, 'chilla' স্টেটমেন্টের পরে সেমিকোলন (;) দিতে ভুইলা গেসো!");
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
    const expr = this.expression();

    if (this.match(TokenType.ASSIGN)) {
      const val = this.expression();
      this.consumeSemicolon("মামা, অ্যাসাইনমেন্টের শেষে সেমিকোলন (;) কই?!");
      if (expr.type === 'Identifier') {
        return {
          type: 'AssignmentStatement',
          identifier: expr.name,
          value: val,
          line: expr.line || 1
        };
      }
      if (expr.type === 'MemberExpression') {
        return {
          type: 'MemberAssignmentStatement',
          object: expr.object,
          property: expr.property,
          value: val
        };
      }
      throw new Error(`[Syntax Error] মামা, অ্যাসাইনমেন্টের টার্গেট সঠিক না!`);
    }

    this.consumeSemicolon("মামা, স্টেটমেন্টের শেষে সেমিকোলন (;) দেওয়া বাধ্যতামূলক!");
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
    let left = this.relational();
    while (this.match(TokenType.EQ, TokenType.NEQ)) {
      const op = this.tokens[this.cursor - 1].value;
      const right = this.relational();
      left = { type: 'BinaryExpression', operator: op, left, right };
    }
    return left;
  }

  relational(): ASTNode {
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
    if (this.match(TokenType.LBRACKET)) {
      const elements: ASTNode[] = [];
      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RBRACKET, "মামা, array ']' bracket diya bondho koro!");
      return { type: 'ArrayLiteral', elements };
    }
    if (this.match(TokenType.IDENTIFIER)) {
      let expr: ASTNode = { type: 'Identifier', name: this.tokens[this.cursor - 1].value, line: this.tokens[this.cursor - 1].line };
      while (true) {
        if (this.match(TokenType.LPAREN)) {
          const args: ASTNode[] = [];
          if (!this.check(TokenType.RPAREN)) {
            do {
              args.push(this.expression());
            } while (this.match(TokenType.COMMA));
          }
          this.consume(TokenType.RPAREN, "মামা, function call এর পরে ')' bracket বন্ধ করো!");
          expr = { type: 'CallExpression', callee: expr, arguments: args };
        } else if (this.match(TokenType.LBRACKET)) {
          const index = this.expression();
          this.consume(TokenType.RBRACKET, "মামা, array index এর পরে ']' bracket বন্ধ করো!");
          expr = { type: 'MemberExpression', object: expr, property: index };
        } else {
          break;
        }
      }
      return expr;
    }
    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "মামা, '(' bracket দিলে ')' দিয়া বন্ধ করতে হবে!");
      return expr;
    }

    const t = this.peek();
    throw new Error(`[Syntax Error] আরে মামা! Unexpected token '${t.value}' at Line ${t.line}, Col ${t.column}`);
  }
}
