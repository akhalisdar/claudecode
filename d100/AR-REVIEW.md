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

One thing to look at on your iPhone: `أولًا` (in "اختر مزوّدًا أولًا" on a provider step, and "أنجز هذه أولًا" on a locked step). On the Linux build of WebKit the mark sits on the lam-alef instead of above it. Chromium draws it correctly and I expect iOS to as well, but I could not check on a real phone. If it looks wrong there, the fix is to write it without the mark: `أولا`.
