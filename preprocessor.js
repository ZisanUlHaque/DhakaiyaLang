/**
 * DhakaiyaLang Preprocessor
 * Compiler Design Lab - Phase 0: Preprocessing
 * 
 * Responsibilities:
 * 1. Strip single-line comments (// ...)
 * 2. Strip multi-line comments (/* ... *\/)
 * 3. Handle preprocessor definitions / aliases (e.g. #define or custom macros)
 * 4. Maintain exact line numbering for accurate error reporting in Lexer & Parser
 */

class Preprocessor {
  constructor(options = {}) {
    this.macros = new Map(options.macros ? Object.entries(options.macros) : []);
  }

  process(sourceCode) {
    let result = '';
    let i = 0;
    const len = sourceCode.length;

    while (i < len) {
      // Check for single-line comment: //
      if (sourceCode[i] === '/' && sourceCode[i + 1] === '/') {
        // Skip until newline, preserve the newline itself
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

      // Check for string literal to avoid stripping comment syntax inside strings
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

if (typeof module !== 'undefined') {
  module.exports = { Preprocessor };
}
