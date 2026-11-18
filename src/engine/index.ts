/**
 * DhakaiyaLang Unified Engine Export
 */

import { Preprocessor } from './preprocessor';
import { Lexer, Token, TokenType, KEYWORDS } from './lexer';
import { Parser, ASTNode } from './parser';
import { Interpreter, Environment } from './interpreter';
import { Transpiler } from './transpiler';
import { PRESETS, Preset } from './presets';

export interface RunResult {
  preprocessedCode?: string;
  tokens: Token[];
  ast: ASTNode | null;
  jsCode: string;
  logs: string[];
  error: {
    phase: string;
    message: string;
  } | null;
  phase: string;
  executionTimeMs: number;
  astNodeCount: number;
  variables: [string, any][];
}

function countNodes(node: any): number {
  if (!node || typeof node !== 'object') return 0;
  let count = 1;
  for (const key of Object.keys(node)) {
    if (key === 'tokens' || key === 'closure') continue;
    if (Array.isArray(node[key])) {
      for (const item of node[key]) count += countNodes(item);
    } else if (node[key] && typeof node[key] === 'object') {
      count += countNodes(node[key]);
    }
  }
  return count;
}

export function runDhakaiya(sourceCode: string): RunResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const result: RunResult = {
    preprocessedCode: '',
    tokens: [],
    ast: null,
    jsCode: '',
    logs: [],
    error: null,
    phase: 'IDLE',
    executionTimeMs: 0,
    astNodeCount: 0,
    variables: []
  };

  const logCapture = (msg: string) => {
    result.logs.push(msg);
  };

  try {
    // Phase 0: Preprocessing
    result.phase = 'PREPROCESSOR';
    const preprocessor = new Preprocessor();
    const prepResult = preprocessor.process(sourceCode);
    result.preprocessedCode = prepResult.code;

    // Phase 1: Lexical Analysis
    result.phase = 'LEXER';
    const lexer = new Lexer(result.preprocessedCode);
    result.tokens = lexer.tokenize();

    // Phase 2: Syntax Analysis (Parser)
    result.phase = 'PARSER';
    const parser = new Parser(result.tokens);
    result.ast = parser.parse();
    result.astNodeCount = countNodes(result.ast);

    // Phase 3: Code Generation / Transpiler to JavaScript
    result.phase = 'TRANSPILER';
    const transpiler = new Transpiler(2);
    result.jsCode = transpiler.transpile(result.ast);

    // Phase 4: Execution / Interpretation
    result.phase = 'INTERPRETER';
    const interpreter = new Interpreter(logCapture);
    interpreter.evaluate(result.ast);
    result.variables = Array.from(interpreter.globalEnv.records.entries());

    result.phase = 'COMPLETED';
  } catch (err: any) {
    result.error = {
      phase: result.phase,
      message: err.message || String(err)
    };
  } finally {
    const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    result.executionTimeMs = Math.round((endTime - startTime) * 100) / 100;
  }

  return result;
}

export {
  Preprocessor,
  Lexer,
  Token,
  TokenType,
  KEYWORDS,
  Parser,
  Interpreter,
  Environment,
  Transpiler,
  PRESETS
};
export type { ASTNode, Preset };
