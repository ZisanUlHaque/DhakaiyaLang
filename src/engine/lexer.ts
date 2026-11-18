/**
 * DhakaiyaLang Lexer (Tokenizer)
 * Compiler Design Lab - Phase 1: Lexical Analysis
 */

export const TokenType = {
  // Delimiters of Program
  PROGRAM_START: 'PROGRAM_START', // bismillah
  PROGRAM_END: 'PROGRAM_END',     // khatam

  // Keywords
  VAR: 'VAR',                     // rakh
  PRINT: 'PRINT',                 // chilla
  IF: 'IF',                       // jodi
  ELSE: 'ELSE',                   // naile
  WHILE: 'WHILE',                 // chakkor
  TRUE: 'TRUE',                   // asli
  FALSE: 'FALSE',                 // fapor
  NULL: 'NULL',                   // khali

  // Logical operators keywords
  AND: 'AND',                     // ebong
  OR: 'OR',                       // othoba
  NOT: 'NOT',                     // nah

  // Literals & Identifiers
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',

  // Operators
  ASSIGN: '=',
  PLUS: '+',
  MINUS: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
  MODULO: '%',

  // Comparison
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>=',

  // Delimiters
  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',
  SEMICOLON: ';',
  COMMA: ',',

  EOF: 'EOF'
} as const;

export type TokenType = typeof TokenType[keyof typeof TokenType];

export const KEYWORDS: Record<string, TokenType> = {
  'bismillah': TokenType.PROGRAM_START,
  'khatam': TokenType.PROGRAM_END,
  'rakh': TokenType.VAR,
  'chilla': TokenType.PRINT,
  'jodi': TokenType.IF,
  'naile': TokenType.ELSE,
  'chakkor': TokenType.WHILE,
  'asli': TokenType.TRUE,
  'fapor': TokenType.FALSE,
  'khali': TokenType.NULL,
  'ebong': TokenType.AND,
  'othoba': TokenType.OR,
  'nah': TokenType.NOT
};

export class Token {
  type: TokenType;
  value: any;
  line: number;
  column: number;

  constructor(type: TokenType, value: any, line: number, column: number) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

export class Lexer {
  input: string;
  cursor: number;
  line: number;
  column: number;

  constructor(input: string) {
    this.input = input;
    this.cursor = 0;
    this.line = 1;
    this.column = 1;
  }

  peek(offset = 0): string | null {
    return this.cursor + offset < this.input.length
      ? this.input[this.cursor + offset]
      : null;
  }

  advance(): string {
    const ch = this.peek() || '';
    this.cursor++;
    if (ch === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return ch;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.cursor < this.input.length) {
      const ch = this.peek();
      if (!ch) break;

      // Skip whitespace
      if (/\s/.test(ch)) {
        this.advance();
        continue;
      }

      // Single-line comment: // ...
      if (ch === '/' && this.peek(1) === '/') {
        while (this.peek() && this.peek() !== '\n') {
          this.advance();
        }
        continue;
      }

      // Numbers (integers or decimals)
      if (/[0-9]/.test(ch)) {
        tokens.push(this.readNumber());
        continue;
      }

      // Strings ("..." or '...')
      if (ch === '"' || ch === "'") {
        tokens.push(this.readString(ch));
        continue;
      }

      // Identifiers & Keywords
      if (/[a-zA-Z_]/.test(ch)) {
        tokens.push(this.readIdentifier());
        continue;
      }

      // Operators and Symbols
      const startLine = this.line;
      const startCol = this.column;

      // Two-character operators
      if (ch === '=' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.EQ, '==', startLine, startCol));
        continue;
      }
      if (ch === '!' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.NEQ, '!=', startLine, startCol));
        continue;
      }
      if (ch === '<' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.LTE, '<=', startLine, startCol));
        continue;
      }
      if (ch === '>' && this.peek(1) === '=') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.GTE, '>=', startLine, startCol));
        continue;
      }
      if (ch === '&' && this.peek(1) === '&') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.AND, '&&', startLine, startCol));
        continue;
      }
      if (ch === '|' && this.peek(1) === '|') {
        this.advance(); this.advance();
        tokens.push(new Token(TokenType.OR, '||', startLine, startCol));
        continue;
      }

      // Single character tokens
      switch (ch) {
        case '=':
          this.advance();
          tokens.push(new Token(TokenType.ASSIGN, '=', startLine, startCol));
          break;
        case '+':
          this.advance();
          tokens.push(new Token(TokenType.PLUS, '+', startLine, startCol));
          break;
        case '-':
          this.advance();
          tokens.push(new Token(TokenType.MINUS, '-', startLine, startCol));
          break;
        case '*':
          this.advance();
          tokens.push(new Token(TokenType.MULTIPLY, '*', startLine, startCol));
          break;
        case '/':
          this.advance();
          tokens.push(new Token(TokenType.DIVIDE, '/', startLine, startCol));
          break;
        case '%':
          this.advance();
          tokens.push(new Token(TokenType.MODULO, '%', startLine, startCol));
          break;
        case '<':
          this.advance();
          tokens.push(new Token(TokenType.LT, '<', startLine, startCol));
          break;
        case '>':
          this.advance();
          tokens.push(new Token(TokenType.GT, '>', startLine, startCol));
          break;
        case '!':
          this.advance();
          tokens.push(new Token(TokenType.NOT, '!', startLine, startCol));
          break;
        case '(':
          this.advance();
          tokens.push(new Token(TokenType.LPAREN, '(', startLine, startCol));
          break;
        case ')':
          this.advance();
          tokens.push(new Token(TokenType.RPAREN, ')', startLine, startCol));
          break;
        case '{':
          this.advance();
          tokens.push(new Token(TokenType.LBRACE, '{', startLine, startCol));
          break;
        case '}':
          this.advance();
          tokens.push(new Token(TokenType.RBRACE, '}', startLine, startCol));
          break;
        case ';':
          this.advance();
          tokens.push(new Token(TokenType.SEMICOLON, ';', startLine, startCol));
          break;
        case ',':
          this.advance();
          tokens.push(new Token(TokenType.COMMA, ',', startLine, startCol));
          break;
        default:
          throw new Error(`[Lexer Error] আরে মামা! '${ch}' এইটা কি চিহ্ন লাইনে ফালাইয়া গেলা?! (Line ${this.line}, Column ${this.column})`);
      }
    }

    tokens.push(new Token(TokenType.EOF, 'EOF', this.line, this.column));
    return tokens;
  }

  readNumber(): Token {
    const startLine = this.line;
    const startCol = this.column;
    let numStr = '';

    while (this.peek() && /[0-9]/.test(this.peek()!)) {
      numStr += this.advance();
    }

    if (this.peek() === '.' && /[0-9]/.test(this.peek(1) || '')) {
      numStr += this.advance(); // '.'
      while (this.peek() && /[0-9]/.test(this.peek()!)) {
        numStr += this.advance();
      }
    }

    return new Token(TokenType.NUMBER, parseFloat(numStr), startLine, startCol);
  }

  readString(quoteType: string): Token {
    const startLine = this.line;
    const startCol = this.column;
    this.advance(); // skip opening quote
    let str = '';

    while (this.peek() && this.peek() !== quoteType) {
      if (this.peek() === '\\') {
        this.advance();
        const esc = this.advance();
        if (esc === 'n') str += '\n';
        else if (esc === 't') str += '\t';
        else str += esc;
      } else {
        str += this.advance();
      }
    }

    if (this.peek() !== quoteType) {
      throw new Error(`[Lexer Error] মামা, কোটেশন মার্ক (${quoteType}) দিয়া স্ট্রিং শেষ করো নাই! (Line ${startLine}, Column ${startCol})`);
    }
    this.advance(); // skip closing quote

    return new Token(TokenType.STRING, str, startLine, startCol);
  }

  readIdentifier(): Token {
    const startLine = this.line;
    const startCol = this.column;
    let text = '';

    while (this.peek() && /[a-zA-Z0-9_]/.test(this.peek()!)) {
      text += this.advance();
    }

    const type = KEYWORDS[text] || TokenType.IDENTIFIER;
    return new Token(type, text, startLine, startCol);
  }
}
