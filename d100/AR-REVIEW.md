# Arabic waiting for your review

Everything below is Arabic I wrote or changed. Nothing else in the Arabic copy was touched.

## 1. Tanween moved in front of the alef (G03): spelling only, 44 places, 28 words

Every `اً` (alef, then fathatan) is now `ًا` (fathatan on the letter before, then alef). The words read the same. WebKit drew the old order off the baseline with IBM Plex Sans Arabic; the new order draws correctly in WebKit and Chromium.

| was | now |
|---|---|
| شهرياً | شهريًا |
| مزوّداً | مزوّدًا |
| مؤسساً | مؤسسًا |
| يوماً | يومًا |
| أولاً | أولًا |
| مجاناً | مجانًا |
| مسبقاً | مسبقًا |
| رسمياً | رسميًا |

The same change applies to: اسمًا، افتراضيًا، غدًا، واحدًا، انطلاقًا، بنكًا، اعتبارًا، إلزاميًا، شهرًا، أيامًا، مبكرًا، طلبًا، موظفًا، درهمًا، مشروعًا، بريدًا، إلكترونيًا، مرشدًا، منتجًا، مستندًا.

One word is different: `أولاً` is now `أولا`, with no mark (in "اختر مزوّدًا أولا" on a provider step and "أنجز هذه أولا" on a locked step). With the mark between the lam and the alef (`أولًا`), WebKit lifted the word off the baseline again, and that string is the main button on every provider step. If you would rather keep the mark, check `أولًا` on a real iPhone first: I could only test on the Linux build of WebKit.
