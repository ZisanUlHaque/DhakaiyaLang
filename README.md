# 🍲 DhakaiyaLang (পুরান ঢাকা)
### CSE 3202: Compiler Design Sessional Lab Project

**DhakaiyaLang** হলো পুরান ঢাকার ঐতিহ্যবাহী ও রসাত্মক কথ্য উপভাষা (Puran Dhaka dialect) ভিত্তিক একটি স্বয়ংসম্পূর্ণ প্রোগ্রামিং ল্যাঙ্গুয়েজ ও কম্পাইলার। এটি **Bhailang** ও **BongLang**-এর অনুপ্রেরণায় স্ক্র্যাচ থেকে পিওর জাভাস্ক্রিপ্ট/টাইপস্ক্রিপ্ট আর্কিটেকচারে তৈরি করা হয়েছে।

---

## 🎯 ল্যাব রিকোয়ারমেন্টস ও আর্কিটেকচার ম্যাপিং

আপনার দেওয়া নোট অনুযায়ী কম্পাইলারের প্রতিটি ধাপ সুনির্দিষ্ট মডিউল দ্বারা বাস্তবায়িত হয়েছে:

```
[সোর্স কোড: .dhaka]
       │
       ▼
[Phase 0: Preprocessor (preprocessor.js)] 
   └── কমেন্ট (//, /* */) ফিল্টারিং, লাইন স্যানিটাইজেশন ও ম্যাক্রো হ্যান্ডলিং
       │
       ▼
[Phase 1: Tokenizer / Lexer (lexer.js)] 
   └── কোড ভেঙে টোকেন স্ট্রিমে রূপান্তর (Keywords, Identifiers, Operators, Literals)
       │
       ▼
[Phase 2: Parser (parser.js)] 
   └── Recursive-Descent ও Precedence Climbing নিয়মে Abstract Syntax Tree (AST) তৈরি
       │
       ▼
[Phase 3: AST to JS Keyword Mapping / Transpiler (transpiler.js)] 
   └── AST নোডগুলোকে স্ট্যান্ডার্ড V8 ইঞ্জিন উপযোগী জাভাস্ক্রিপ্ট কোডে রূপান্তর
       │
       ▼
[Phase 4: Runtime / Execution (interpreter.js)] 
   └── Symbol Table (Lexical Scope Environment) মেনে কোড এক্সিকিউশন ও আউটপুট প্রদান
```

---

## 📖 কী-ওয়ার্ড ম্যাপিং ডিকশনারি

| Dhakaiya Keyword | JavaScript সমতুল্য | কাজ ও ব্যবহারিক অর্থ | সিনট্যাক্স উদাহরণ |
| :--- | :--- | :--- | :--- |
| `bismillah` | `(Program Start)` | প্রোগ্রাম শুরুর আবশ্যিক নির্দেশক | `bismillah` |
| `khatam` | `(Program End)` | প্রোগ্রাম সমাপ্তির নির্দেশক | `khatam` |
| `rakh` | `let` / `const` | নতুন ভ্যারিয়েবল ডিক্লেয়ার ও মান রাখা | `rakh dam = 250;` |
| `chilla` | `console.log(...)` | আউটপুট টার্মিনালে প্রিন্ট করা | `chilla "আরে মামা!";` |
| `jodi` | `if` | শর্ত সাপেক্ষে কোড চালানো (কন্ডিশনাল) | `jodi (dam > 200) { ... }` |
| `naile` | `else` | শর্ত পূরণ না হলে বিকল্প কোড চালানো | `naile { ... }` |
| `chakkor` | `while` | চাক্কর বা লুপ পুনরাবৃত্তি চালানো | `chakkor (count > 0) { ... }` |
| `asli` | `true` | বুলিয়ান সত্য | `rakh shotto = asli;` |
| `fapor` | `false` | বুলিয়ান মিথ্যা (ফাপর ধরা) | `rakh bhua = fapor;` |
| `khali` | `null` | খালি বা নাল মান | `rakh packet = khali;` |
| `ebong` | `&&` | লজিক্যাল এন্ড (AND) | `jodi (a ebong b) { ... }` |
| `othoba` | `\|\|` | লজিক্যাল অর (OR) | `jodi (a othoba b) { ... }` |
| `nah` | `!` | লজিক্যাল নট (NOT) | `jodi (nah ready) { ... }` |

---

## 📂 প্রোজেক্ট ফাইল স্ট্রাকচার

```
DhakaiyaLang/
├── index.html              # 🚀 জিরো-ইনস্টলেশন স্ট্যান্ডঅ্যালোন ওয়েব প্লেগ্রাউন্ড (ডাবল-ক্লিক করলেই চলবে)
├── preprocessor.js         # Phase 0: কমেন্ট ক্লিনার ও লাইন ট্র্যাকিং
├── lexer.js                # Phase 1: টোকেনাইজার (Lexical Analyzer)
├── parser.js               # Phase 2: রিকার্সিভ ডিসেন্ট পার্সার ও AST জেনারেটর
├── transpiler.js           # Phase 3: AST থেকে V8 JavaScript রূপান্তর
├── interpreter.js          # Phase 4: সিম্বল টেবিল (Environment) ও রানটাইম এক্সিকিউশন
├── runner.js               # ইউনিফাইড ইঞ্জিন ও CLI রানার
├── presets.js              # ডেমো সোর্স কোড কালেকশন
├── package.json            # প্রজেক্ট ডিপেনডেন্সি ও স্ক্রিপ্টস
├── examples/               # নমুনা DhakaiyaLang প্রোগ্রাম ফাইলসমূহ
│   ├── kacchi_bill.dhaka
│   └── chakkor_loop.dhaka
└── src/                    # 🌟 পূর্ণাঙ্গ আধুনিক Next.js 14 App Router ওয়েব অ্যাপ্লিকেশন
    ├── app/
    │   ├── page.tsx        # মেইন ইন্টারঅ্যাক্টিভ হোমপেজ
    │   ├── layout.tsx
    │   └── globals.css
    ├── components/
    │   ├── Navbar.tsx      # ডার্ক থিম ন্যাভবার, প্রিসেট মেনু, সাউন্ড কন্ট্রোল
    │   ├── EditorPane.tsx   # লাইন নাম্বারসহ লাইভ সোর্স কোড এডিটর
    │   ├── CompilerStudio.tsx # টার্মিনাল, টোকেন টেবিল, AST ভিউয়ার, ট্রান্সপাইলার ট্যাব
    │   ├── DocsModal.tsx   # কি-ওয়ার্ড রেফারেন্স ও ভাইভা প্রশ্নোত্তর
    │   └── Footer.tsx
    ├── engine/             # টাইপস্ক্রিপ্ট কম্পাইলার কোর ইঞ্জিন
    └── lib/
        └── sounds.ts       # সিনথেসাইজড ওয়েব অডিও সাউন্ড ইফেক্টস
```

---

## 🚀 কিভাবে চালাবেন?

### পদ্ধতি ১: তাৎক্ষণিক ব্রাউজারে চালানো (জিরো ইন্সটলেশন)
কোনো Node.js বা ডিপেনডেন্সি ইন্সটল করার প্রয়োজন নেই!
- সরাসরি ফোল্ডারে থাকা `index.html` ফাইলে ডাবল-ক্লিক করুন অথবা যেকোনো ব্রাউজারে (Chrome, Edge, Opera) ড্র্যাগ করে ফেলুন।
- আপনি পাবেন লাইভ কোড এডিটর, টোকেন টেবিল, AST JSON এবং তাৎক্ষণিক রানটাইম আউটপুট।

### পদ্ধতি ২: টার্মিনালে Node.js CLI দিয়ে চালানো
```bash
# বিল্ট-ইন টেস্ট কোড চালানো
node runner.js

# নির্দিষ্ট কোনো ফাইল চালানো
node runner.js examples/kacchi_bill.dhaka
node runner.js examples/chakkor_loop.dhaka
```

### পদ্ধতি ৩: পূর্ণাঙ্গ Next.js ওয়েব অ্যাপ চালানো
```bash
# ডিপেনডেন্সি ইন্সটল
npm install

# ডেভেলপমেন্ট সার্ভার চালু
npm run dev
```
ব্রাউজারে `http://localhost:3000` ওপেন করুন।

---

## 🌐 কিভাবে অনলাইনে ফ্রিতে ডেপ্লয় করবেন (Deployment Guide)?

আপনি `bonglang.vercel.app`-এর মতো আপনার নিজস্ব লাইভ লিংক তৈরি করতে পারবেন খুব সহজে:

### বিকল্প ১: Vercel-এ ডেপ্লয় করা (রেকমেন্ডেড — bonglang এর মতো)
1. আপনার প্রজেক্টটি একটি **GitHub Repository**-তে আপলোড (Push) করুন।
2. [vercel.com](https://vercel.com)-এ গিয়ে আপনার GitHub অ্যাকাউন্ট দিয়ে লগইন করুন।
3. **"Add New Project"** -> **"Import"** এ ক্লিক করে আপনার `DhakaiyaLang` রিপোজিটরিটি সিলেক্ট করুন।
4. **Deploy** বাটনে ক্লিক করুন! 
5. মাত্র ১ মিনিটে আপনার সাইট `dhakaiyalang.vercel.app` বা অনুরূপ একটি ফ্রি লাইভ লিংকে চালু হয়ে যাবে!

### বিকল্প ২: Netlify Drop (সবচেয়ে সহজ — কোড না খুলেই ৩০ সেকেন্ডে লাইভ!)
1. ব্রাউজারে যান: [app.netlify.com/drop](https://app.netlify.com/drop)
2. আপনার কম্পিউটারের এই সম্পূর্ণ `DhakaiyaLang` ফোল্ডারটি মাউস দিয়ে টেনে এনে Netlify এর বক্সে **ড্রপ (Drag & Drop)** করুন।
3. ৩০ সেকেন্ডের মধ্যে তারা আপনাকে একটি ফ্রি লাইভ ডোমেইন লিংক দিয়ে দিবে (যেমন: `dhakaiya-lang.netlify.app`), যা যে কাউকে শেয়ার করতে পারবেন!

### বিকল্প ৩: GitHub Pages (সম্পূর্ণ ফ্রি ও সহজ)
1. আপনার GitHub রিপোজিটরির **Settings** ট্যাবে যান।
2. বামপাশের মেনু থেকে **Pages** সিলেক্ট করুন।
3. **Branch** অংশে `main` ব্রাঞ্চ এবং `/root` সিলেক্ট করে **Save** দিন।
4. ২ মিনিট পর আপনার সাইট `https://<your-username>.github.io/DhakaiyaLang` লিংকে সবার জন্য লাইভ হয়ে যাবে!

---

## 🎓 ল্যাব ভাইভা প্রস্তুতি (Viva Defense Q&A)

### ১. এই ল্যাঙ্গুয়েজটির পার্সিং মেকানিজম কী?
> **উত্তর:** এটি একটি **Recursive Descent Parser (LL(1) Top-Down Parsing)**। ব্যাকট্র্যাকিং এড়াতে টোকেন লুক-অ্যাহেড (`peek`) ব্যবহার করা হয়েছে এবং এক্সপ্রেশনের অপারেটর প্রায়োরিটি ঠিক রাখার জন্য **Precedence Climbing (Hierarchy: Logical OR -> AND -> Equality -> Comparison -> Additive -> Multiplicative -> Unary -> Primary)** অ্যালগরিদম ব্যবহৃত হয়েছে।

### ২. AST (Abstract Syntax Tree) কেন প্রয়োজন?
> **উত্তর:** সোর্স কোডের ব্যাকরণগত গঠন ও অপারেটরের অগ্রাধিকারকে একটি হায়ারার্কিকাল ট্রিতে উপস্থাপন করাই AST-এর কাজ। AST তৈরি হওয়ার পর কোড অপটিমাইজেশন, ইন্টারপ্রিটেশন বা অন্য কোনো টার্গেট ল্যাঙ্গুয়েজে (যেমন JS/C) ট্রান্সপাইল করা সহজ হয়।

### ৩. সিম্বল টেবিল (Symbol Table) কীভাবে বাস্তবায়িত হয়েছে?
> **উত্তর:** `Environment` ক্লাসে জাভাস্ক্রিপ্ট `Map` দিয়ে প্রতিটি স্কোপের ভ্যারিয়েবল রেকর্ড রাখা হয়। নেস্টেড ব্লকের জন্য এটি প্যারেন্ট স্কোপ পয়েন্টার (`this.parent`) সংরক্ষণ করে, যা **Lexical Scoping** এবং **Variable Shadowing** নিশ্চিত করে।
