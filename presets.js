/**
 * DhakaiyaLang Preset Code Examples
 */

const PRESETS = [
  {
    id: 'hello',
    name: '১. হ্যালো ঢাকা (Hello World)',
    description: 'খাঁটি পুরান ঢাকা স্টাইলে প্রথম প্রোগ্রাম',
    code: `bismillah
  chilla "আরে মামা! পুরান ঢাকায় স্বাগতম!";
  chilla "বিউটি লচ্ছির এক চুমুক, আর ঢাকাইয়া কোডিং!";
khatam`
  },
  {
    id: 'variables',
    name: '২. বিরিয়ানির হিসাব (Variables & Math)',
    description: 'হিসাব-নিকাশ এবং ভ্যারিয়েবল ডিক্লেয়ারেশন',
    code: `bismillah
  // ভ্যারিয়েবল ডিক্লেয়ারেশন
  rakh plate_sonkha = 3;
  rakh plate_dam = 280;
  rakh borhani_dam = 60;

  rakh mot_bill = (plate_sonkha * plate_dam) + borhani_dam;

  chilla "কাচ্চির প্লেট সংখ্যা:";
  chilla plate_sonkha;
  chilla "মোট বিল হইলো (টাকা):";
  chilla mot_bill;
khatam`
  },
  {
    id: 'condition',
    name: '৩. বড়লোক কাস্টমার (If-Else Condition)',
    description: 'শর্ত সাপেক্ষে ডিসকাউন্ট ও বোরহানি অফার',
    code: `bismillah
  rakh pocket_taka = 750;
  rakh biriyani_dam = 500;

  jodi (pocket_taka >= biriyani_dam) {
    chilla "আরে মামা! টেকাটুকা তো ভালোই আছে!";
    chilla "বসমতি কাচ্চি উইথ স্পেশাল বোরহানি লাগাও!";
  } naile {
    chilla "মামা অবস্থা টাইট, বাকিতে খাওয়ার চিন্তা বাদ দাও!";
  }
khatam`
  },
  {
    id: 'loop',
    name: '৪. কাচ্চির চাক্কর (While Loop)',
    description: 'চাক্কর মেরে ১ থেকে ৫ পর্যন্ত কাউন্টডাউন',
    code: `bismillah
  chilla "কাচ্চির ডেকচি খোলা হইতাছে...";
  rakh parcel = 5;

  chakkor (parcel > 0) {
    chilla "পার্সেল রেডি নম্বর:";
    chilla parcel;
    parcel = parcel - 1;
  }

  chilla "সব পার্সেল শেষ! দোকান বন্ধ, মামা বাড়ি যাও!";
khatam`
  },
  {
    id: 'logic',
    name: '৫. জোড় না বিজোড় (Modulo & Logic)',
    description: 'মডুলো (%) ও লজিক্যাল চেকিং',
    code: `bismillah
  rakh sonkha = 14;

  jodi (sonkha % 2 == 0) {
    chilla sonkha;
    chilla "এইটা জোড় (Even) সংখ্যা মামা!";
  } naile {
    chilla sonkha;
    chilla "এইটা বিজোড় (Odd) সংখ্যা!";
  }
khatam`
  },
  {
    id: 'factorial',
    name: '৬. ফ্যাক্টোরিয়াল ক্যালকুলেটর (Loop Algorithm)',
    description: '৫ এর ফ্যাক্টোরিয়াল (5!) হিসাব করার অ্যালগরিদম',
    code: `bismillah
  rakh n = 5;
  rakh result = 1;
  rakh i = 1;

  chakkor (i <= n) {
    result = result * i;
    i = i + 1;
  }

  chilla "৫ এর ফ্যাক্টোরিয়াল হইলো:";
  chilla result;
khatam`
  },
  {
    id: 'function',
    name: '৭. বাবুর্চির স্পেশাল ফাংশন (kaam & ferot)',
    description: 'ফাংশন ডিক্লেয়ার ও রিটার্ন ভ্যালু',
    code: `bismillah
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
    id: 'array',
    name: '৮. পুরান ঢাকার মেহমানদারি মেনু (dekchi / Array)',
    description: 'তালিকা সংরক্ষণ ও ইনডেক্সিং',
    code: `bismillah
  rakh menu = ["কাচ্চি বিরিয়ানি", "মোরগ পোলাও", "স্পেশাল বোরহানি", "জাফরানি বাকরখানি"];

  chilla "আমাদের আজকের মেনুর আইটেম:";
  chilla menu;

  chilla "১ নাম্বার পছন্দের খাবার:";
  chilla menu[0];

  chilla "ডেজার্ট স্পেশাল:";
  chilla menu[3];
khatam`
  }
];

if (typeof module !== 'undefined') {
  module.exports = { PRESETS };
}
