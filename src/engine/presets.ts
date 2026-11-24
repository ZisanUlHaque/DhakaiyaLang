/**
 * DhakaiyaLang Preset Code Examples
 */

export interface Preset {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'grand_master',
    name: '🛺 গ্র্যান্ড মাস্টার প্রোগ্রাম (সব ফিচার একসাথে)',
    description: 'ভ্যারিয়েবল, ফাংশন, অ্যারে, লুপ, ব্রেক/কন্টিনিউ ও কন্ডিশনাল লজিক',
    code: `bismillah
  // ==========================================
  // 🛺 পুরান ঢাকার গ্র্যান্ড মাস্টার প্রোগ্রাম
  // DhakaiyaLang All-Features Showcase
  // ==========================================

  // ১. ভ্যারিয়েবল ডিক্লেয়ারেশন (rakh) ও ডেটা টাইপস
  rakh dokan = "হাজী নান্না বিরিয়ানি";
  rakh plate = 3;
  rakh dam = 280;
  rakh discountAche = asli;
  rakh VIP_Guest = fapor;
  rakh tip = khali;
  rakh menu = ["কাচ্চি", "মোরগ পোলাও", "বোরহানি", "জর্দা"];

  chilla "=== ১. ভ্যারিয়েবল ও অ্যারে এক্সেস ===";
  chilla dokan;
  chilla menu[0];

  // অ্যারের ইনডেক্স রি-অ্যাসাইন
  menu[1] = "খাসির তেহারি";
  chilla menu[1];

  // ২. ফাংশন (kaam) ও রিটার্ন (ferot)
  kaam hishabKoro(p, d, discount) {
    rakh mot = p * d;
    jodi (discount == asli) {
      mot = mot - 100;
    }
    ferot mot;
  }

  rakh totalBill = hishabKoro(plate, dam, discountAche);
  chilla "=== ২. ফাংশন কল ও রিটার্ন মান ===";
  chilla totalBill;

  // ৩. গাণিতিক (+, -, *, /, %) ও ইউনারি (-, nah) অপারেটরস
  rakh vat = (totalBill * 5) / 100;
  rakh modValue = totalBill % 50;
  rakh ultaMan = -50;
  rakh openAche = nah VIP_Guest;

  chilla "=== ৩. গাণিতিক ও ইউনারি অপারেটরস ===";
  chilla vat;
  chilla modValue;
  chilla ultaMan;
  chilla openAche;

  // ৪. শর্তাধীন স্টেটমেন্ট (jodi, naile) ও লজিক্যাল (ebong, othoba)
  chilla "=== ৪. শর্তাধীন স্টেটমেন্ট (jodi, naile) ===";
  jodi (totalBill > 1000 ebong plate >= 3) {
    chilla "মামারে স্পেশাল বোরহানি ফ্রি দাও!";
  } naile jodi (totalBill > 500 othoba plate == 3) {
    chilla "মামা এক কাপ স্পেশাল জর্দা ফ্রি পাইবা!";
  } naile {
    chilla "পরের বার বেশি খাইলে অফার পাইবা মামা!";
  }

  // ৫. লুপ (chakkor) এর সাথে ব্রেক (thamo) এবং কন্টিনিউ (chalao)
  chilla "=== ৫. লুপ (chakkor), thamo ও chalao ===";
  rakh gunti = 0;
  chakkor (gunti < 6) {
    gunti = gunti + 1;

    // ৩ নাম্বার চক্বর স্কিপ করবো (chalao)
    jodi (gunti == 3) {
      chilla "৩ নাম্বার চক্বর স্কিপ করা হইলো!";
      chalao;
    }

    // ৫ নাম্বার চক্বরে লুপ থামাবো (thamo)
    jodi (gunti == 5) {
      chilla "৫ নম্বরে আইসা লুপ থামায়ে দিলাম!";
      thamo;
    }

    chilla gunti;
  }

  chilla "=== আলহামদুলিল্লাহ! সব ফিচার সফলভাবে রান হইছে! ===";
khatam`
  },
  {
    id: 'kacchi',
    name: '🍛 হাজী কাচ্চির বিল হিসাব (Variables & Math)',
    description: 'হিসাব-নিকাশ এবং ভ্যারিয়েবল ডিক্লেয়ারেশন',
    code: `bismillah
  // 🍛 নাজিরাবাজারের হাজী কাচ্চির বিল হিসাব
  rakh plate_sonkha = 3;
  rakh plate_dam = 280;
  rakh borhani_dam = 60;
  rakh extra_alubukhara = 30;

  rakh mot_bill = (plate_sonkha * plate_dam) + borhani_dam + extra_alubukhara;

  chilla "হাজী বিরিয়ানির ক্যাশ মেমো:";
  chilla "প্লেট সংখ্যা:";
  chilla plate_sonkha;
  chilla "মোট বিল হইলো (টাকা):";
  chilla mot_bill;

  jodi (mot_bill > 800) {
    chilla "মামা স্পেশাল ডিসকাউন্ট পাইবা!";
  } naile {
    chilla "পরের বার আইসা ডিসকাউন্ট নিও!";
  }
khatam`
  },
  {
    id: 'market',
    name: '🏪 শাঁখারীবাজারের দরদাম (If-Else Condition)',
    description: 'শর্ত সাপেক্ষে দরদাম ও বাজার সওদা',
    code: `bismillah
  // 🏪 শাঁখারীবাজারের সওদা ও দরদাম
  rakh pocket_taka = 750;
  rakh dokandar_dam = 900;
  rakh discount = 180;

  rakh asol_dam = dokandar_dam - discount;

  chilla "দোকানদার দাম চাইছে:";
  chilla dokandar_dam;
  chilla "দরদাম কইরা ফাইনাল দাম:";
  chilla asol_dam;

  jodi (pocket_taka >= asol_dam) {
    chilla "আরে মামা! টেকাটুকা তো ভালোই আছে!";
    chilla "প্যাকেট বাঁধেন, মাল নিয়া যামু!";
  } naile {
    chilla "মামা অবস্থা টাইট, বাকিতে খাওয়ার চিন্তা বাদ দাও!";
  }
khatam`
  },
  {
    id: 'chakkor',
    name: '🔄 চকবাজারের চাক্কর কাউন্টডাউন (Loop & Break)',
    description: 'চকবাজার প্রদক্ষিণ এবং শর্ত দিয়ে লুপ থামানো',
    code: `bismillah
  // 🔄 চকবাজারের চাক্কর কাউন্টডাউন ও থামা (Break)
  rakh gunti = 6;

  chilla "চকবাজারে হাঁটা শুরু করলাম:";
  chakkor (gunti > 0) {
    chilla gunti;
    jodi (gunti == 3) {
      chilla "৩ নাম্বারে আইসা টায়ার পাংচার! মামা থামো!";
      thamo;
    }
    gunti = gunti - 1;
  }
  chilla "চকবাজার প্রদক্ষিণ শেষ মামা!";
khatam`
  },
  {
    id: 'kaam',
    name: '🧑‍🍳 নাজিরাবাজারের স্পেশাল ফাংশন (Function & Return)',
    description: 'ফাংশন ও মান রিটার্ন করার অ্যালগরিদম',
    code: `bismillah
  // 🧑‍🍳 নাজিরাবাজারের স্পেশাল বাবুর্চির ফাংশন (kaam & ferot)
  kaam hishab_khoroch(plate_sonkha, plate_rate) {
    rakh vat = 50;
    ferot (plate_sonkha * plate_rate) + vat;
  }

  chilla "বাবুর্চির হিসাব শুরু:";
  rakh total = hishab_khoroch(3, 280);
  chilla total;
  chilla "বিল ক্লিয়ার মামা!";
khatam`
  },
  {
    id: 'dekchi',
    name: '🍲 পুরান ঢাকার মেহমানদারি মেনু (Arrays / ডেকচি)',
    description: 'অ্যারে তালিকা ও ইনডেক্স থেকে মান পড়া',
    code: `bismillah
  // 🍲 পুরান ঢাকার মেহমানদারি মেনু (অ্যারে / ডেকচি)
  rakh menu = ["কাচ্চি বিরিয়ানি", "মোরগ পোলাও", "স্পেশাল বোরহানি", "জাফরানি বাকরখানি"];

  chilla "আমাদের আজকের মেনুর আইটেম:";
  chilla menu;

  chilla "১ নাম্বার পছন্দের খাবার:";
  chilla menu[0];

  chilla "ডেজার্ট স্পেশাল:";
  chilla menu[3];
khatam`
  },
  {
    id: 'error',
    name: '⚠️ ভুল কোড ও পুরান ঢাকার এরর মেসেজ (Debugging)',
    description: 'কম্পাইলারের ফ্রেন্ডলি এরর হ্যান্ডলিং টেস্ট',
    code: `bismillah
  // ⚠️ ভুল কোডের নমুনা (কম্পাইলার ডিবাগিং টেস্ট)
  rakh dam = 500
  chilla "সেমিকোলন দেই নাই মামা!"
khatam`
  }
];
