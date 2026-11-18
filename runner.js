/**
 * DhakaiyaLang Unified Engine Runner
 * Coordinates all compiler phases: Lexer -> Parser -> AST -> Transpiler & Interpreter
 */

if (typeof require !== 'undefined') {
  var { Preprocessor } = require('./preprocessor');
  var { Lexer, TokenType } = require('./lexer');
  var { Parser } = require('./parser');
  var { Interpreter, Environment } = require('./interpreter');
  var { Transpiler } = require('./transpiler');
  var { PRESETS } = require('./presets');
}

function runDhakaiya(sourceCode) {
  const result = {
    preprocessedCode: '',
    tokens: [],
    ast: null,
    jsCode: '',
    logs: [],
    error: null,
    phase: null
  };

  const logCapture = (msg) => {
    result.logs.push(msg);
  };

  try {
    // Phase 0: Preprocessing
    result.phase = 'PREPROCESSOR';
    const preprocessor = new Preprocessor();
    const prepResult = preprocessor.process(sourceCode);
    result.preprocessedCode = prepResult.code;

    // Phase 1: Lexical Analysis (Tokenizer)
    result.phase = 'LEXER';
    const lexer = new Lexer(result.preprocessedCode);
    result.tokens = lexer.tokenize();

    // Phase 2: Syntax Analysis (Parser)
    result.phase = 'PARSER';
    const parser = new Parser(result.tokens);
    result.ast = parser.parse();

    // Phase 3: Code Generation / Transpiler to JavaScript (V8 Engine)
    result.phase = 'TRANSPILER';
    const transpiler = new Transpiler(2);
    result.jsCode = transpiler.transpile(result.ast);

    // Phase 4: Execution / Interpretation
    result.phase = 'INTERPRETER';
    const interpreter = new Interpreter(logCapture);
    interpreter.evaluate(result.ast);

    result.phase = 'COMPLETED';
  } catch (err) {
    result.error = {
      phase: result.phase,
      message: err.message || String(err)
    };
  }

  return result;
}

if (typeof module !== 'undefined') {
  module.exports = { runDhakaiya, Preprocessor, Lexer, Parser, Interpreter, Transpiler, PRESETS };

  if (require.main === module) {
    const fs = require('fs');
    const filePath = process.argv[2];

    const sample = `
bismillah
  // পুরান ঢাকার কাচ্চি হিসাব
  rakh plate = 3;
  rakh dam = 250;
  rakh borhani = 50;
  rakh mot_khoroch = (plate * dam) + borhani;

  chilla "🍛 পুরান ঢাকার কাচ্চির বিল হিসাব:";
  chilla mot_khoroch;

  jodi (mot_khoroch > 500) {
    chilla "মামা বাজেট বেশি! ডিসকাউন্ট চান!";
  } naile {
    chilla "বাজেটের মধ্যেই আছে মামা, প্যারা নাই!";
  }

  // চাক্কর (লুপ) টেস্ট
  rakh count = 3;
  chakkor (count > 0) {
    chilla "চাক্কর নাম্বার:";
    chilla count;
    count = count - 1;
  }
  chilla "খেলা শেষ মামা!";
khatam
`;

    let codeToRun = sample;
    if (filePath) {
      if (!fs.existsSync(filePath)) {
        console.error(`[Error] File khuje pelam na mama: ${filePath}`);
        process.exit(1);
      }
      codeToRun = fs.readFileSync(filePath, 'utf-8');
      console.log(`=== Running File: ${filePath} ===`);
    } else {
      console.log("=== DhakaiyaLang Compiler Lab Test (Use: node runner.js <file.dhaka>) ===");
    }

    const res = runDhakaiya(codeToRun);
    if (res.error) {
      console.error("[Error in " + res.error.phase + "]:", res.error.message);
    } else {
      console.log("✓ Phase 0 Preprocessor OK");
      console.log("✓ Phase 1 Tokens: " + res.tokens.length + " tokens parsed");
      console.log("✓ Phase 2 AST: " + (res.ast ? res.ast.body.length : 0) + " root statements");
      console.log("✓ Phase 3 Transpiled JS:\n" + res.jsCode);
      console.log("✓ Phase 4 Runtime Output:\n" + res.logs.map(l => "  > " + l).join('\n'));
    }
  }
}
