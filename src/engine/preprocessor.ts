/**
 * DhakaiyaLang Preprocessor
 * Compiler Design Lab - Phase 0: Preprocessing
 * 
 * Responsibilities:
 * 1. Strip single-line comments (// ...)
 * 2. Strip multi-line comments (/* ... *\/)
 * 3. Handle preprocessor definitions / aliases
 * 4. Maintain line numbering for accurate error reporting in Lexer & Parser
 */

export interface PreprocessorResult {
  code: string;
  macros: Map<string, string>;
}

export class Preprocessor {
  private macros: Map<string, string>;

  constructor(options: { macros?: Record<string, string> } = {}) {
    this.macros = new Map(options.macros ? Object.entries(options.macros) : []);
  }

  process(sourceCode: string): PreprocessorResult {
    let result = '';
    let i = 0;
    const len = sourceCode.length;

    while (i < len) {
      // Check for single-line comment: //
      if (sourceCode[i] === '/' && sourceCode[i + 1] === '/') {
        while (i < len && sourceCode[i] !== '\n') {
          i++;
        }
        continue;
      }

      // Check for multi-line comment: /* ... */
      if (sourceCode[i] === '/' && sourceCode[i + 1] === '*') {
        i += 2;
        while (i < len && !(sourceCode[i] === '*' && sourceCode[i + 1] === '/')) {
          if (sourceCode[i] === '\n') {
            result += '\n'; // Preserve line count
          }
          i++;
        }
        if (i < len) {
          i += 2; // Skip closing */
        }
        continue;
      }

      // Check for string literal to avoid touching comment characters inside strings
      if (sourceCode[i] === '"' || sourceCode[i] === "'") {
        const quote = sourceCode[i];
        result += quote;
        i++;
        while (i < len && sourceCode[i] !== quote) {
          if (sourceCode[i] === '\\' && i + 1 < len) {
            result += sourceCode[i] + sourceCode[i + 1];
            i += 2;
          } else {
            result += sourceCode[i];
            i++;
          }
        }
        if (i < len) {
          result += sourceCode[i]; // closing quote
          i++;
        }
        continue;
      }

      result += sourceCode[i];
      i++;
    }

    return {
      code: result,
      macros: this.macros
    };
  }
}
