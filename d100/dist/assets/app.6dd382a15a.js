(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ---------- copy ---------- */
const TX={
en:{
 proto:'Hackathon prototype. Sample data.',
 concept:'A concept for the CBD and Dubai SME hackathon',
 h1:'Your first 100 days, in order.',
 lede:'D100 turns your trade licence into a day-by-day plan: what to file, who to hire, what it costs and what is due next.',
 loop1:'Every payment builds your record.',loop2:'Your record earns stars.',loop3:'Stars unlock credit and customers.',
 start:'Start my 100 days',demo:"See Layla's day 37",
 proof1:'<b>71,830 companies</b> joined Dubai Chamber of Commerce in 2025.',
 proof2:'<b>AED 10,000</b> is the penalty for missing corporate tax registration, due within 3 months of incorporation.',
 proof3:'Built to sit on top of <b>SME in a Box</b> and <b>UP by CBD</b>. Proposed integrations, not live.',
 partners:'Proposed partners: Commercial Bank of Dubai, Dubai SME, Dubai Department of Economy and Tourism.',
 all:'All 12 screens',other:'عربي',
 key1:'Day 14: kitchen layout approval',key2:'Day 45: food permit inspection',key3:'Day 90: corporate tax registration',keyNow:"Day 37: where Layla's café is today",
 tRoad:'Plan',tCash:'Cash',tStars:'Stars',tMarket:'Providers',tMore:'More',
 obT:'Tell us about your licence',obS:'Four answers. D100 builds the plan from them.',
 q1:'Where is your licence from?',q1a:'Dubai mainland',q1as:'Department of Economy and Tourism',q1b:'Dubai free zone',q1bs:'Template comes next',
 q2:'What will the business do?',q2a:'Café or restaurant',q2b:'Online shop',q2c:'Tours and travel',q2cs:'Template comes next',
 q3:'Who owns it?',q3a:'UAE national',q3b:'Resident',
 q4:'Starting capital, AED',q5:'Business name (optional)',
 obNote:'Use a made-up name. Nothing you type leaves this page.',build:'Build my plan',
 b1:'Reading your licence activity',b2:'Matching permits and approvals',b3:'Putting deadlines in order',b4:'Your plan is ready',
 day:'Day',of100:'of 100',stepsDone:'{n} of {m} steps done',nextDue:'Next deadline',
 done:'Done',today:'Today',inDays:({n})=>n===1?'Tomorrow':`In ${n} days`,dueDay:'Day {d}',late:({n})=>n===1?'1 day late':`${n} days late`,tracking:'Tracking',fine:'{x} if missed',
 days:'Days {a} to {b}',
 p1:'Set up',p2:'Build',p3:'Open',p4:'Comply and grow',
 why:'Why this, why now',what:'What to do',auth:'Handled by',due:'Due',missed:'If missed',status:'Status',
 vetted:'Vetted providers',rank:'Ranked by founder ratings and completed jobs, not by what providers pay.',
 chosen:'Chosen',grad:'D100 graduate',founders:'{n} founders',markDone:'Mark step done',pickFirst:'Choose a provider first',
 doneOn:'Done on day {d}',toastDone:'Step done. Record +6.',sample:'Sample providers. The names are invented.',
 sampleStep:'Sample step. Check the rule with the authority before acting.',
 bankT:'Open your business account',propPartner:'Proposed partner',
 bk1:'Opens from your Dubai Unified Licence',bk2:'Zero-balance account on a subscription plan',bk3:'Business credit card once you are licensed',
 bkSrc:'As announced by Commercial Bank of Dubai, July 2026.',bkGo:'Continue with UP by CBD',
 anyT:'Use another bank',anyP:'Connect it through open finance so your cash view and record still work. You approve what is shared.',anyGo:'Connect another bank',
 bkDone:'Connected on day {d}',bkToast:'In the pilot this opens the bank’s own sign-up.',
 bal:'Balance',costs:'Monthly costs',runway:'Cash lasts',months:'months',
 lgA:'Actual',lgP:'If sales start on day 60',lgN:'With no sales',opens:'Opens',
 seeT:'What D100 sees',seeP:'AED {a} goes out between day {f} and day {l}. If opening slips and no sales come in, cash runs out around day {z}. Each week of delay costs about AED {w}.',
 seeOk:'With the plan as it stands, cash covers the first 100 days. D100 will warn you if that changes.',
 coming:'Coming up',dep:'Deposits and Ejari fees',fitdep:'Fit-out deposit',eqdep:'Equipment deposit',eqbal:'Equipment balance',fitbal:'Fit-out final payment',
 where:'Where the monthly costs go',rent:'Rent',team:'Team',supplies:'Supplies and utilities',other2:'Software, licences, other',added:'Added today',
 src:'Source: bank feed and payments through D100. Sample data.',
 record:'record score',toNext:({p})=>p===1?'1 point to the next star':`${p} points to the next star`,top:'Top rating reached',
 earnT:'What earns points',e1:'Each step done on time',e2:'Every 5 days of verified payments',e3:'Two months of cash in hand',
 noBuy:'Stars come from verified activity. No plan can buy one.',
 unlockT:'What stars unlock',credit:'Micro-credit',upTo:'Eligible to apply for up to AED {x}',notYet:'Reach 2 stars to become eligible',
 illus:'Illustrative limits. The bank decides every application.',
 u1:'Record started',u2:'Micro-credit up to AED 10,000',u3:'Up to AED 25,000, priority in programme matching',u4:'Up to AED 50,000, can list as a provider',u5:'Up to AED 100,000, door plaque, top ranking',
 earned:'Star {n} earned',earnedP:'Done on time: {t}. Your record is now {s}.',seeCash:'See the cash view',
 mkT:'Providers for the steps ahead',mkBan:'Banking, payments, telecoms and logistics offers come from DET’s SME in a Box (proposed link).',
 mkHow:'How a provider gets listed',mkHowP:'Licence checked. Rated by founders after every job. Removed below 4.0.',
 c_fitout:'Fit-out',c_equip:'Equipment',c_payroll:'Payroll',c_accounting:'Accounting',c_delivery:'Delivery',
 prT:'Programmes that fit your licence',prS:'Matched from your licence, owner and record.',
 prWhy:'Why it matches',prGo:'Prepare my application',exMatch:'Example match',
 shT:'Filled from your licence',shBiz:'Business',shLic:'Licence',shAct:'Activity',shOwn:'Owner',shDay:'Day in D100',shRec:'Record',
 shNote:'You review and submit on the programme’s own site. This is an example match; eligibility is checked there.',close:'Close',
 ngT:'D100 writes first',ngS:'On WhatsApp and email. Executive members also get a hotline.',
 n1:'Your equipment order is confirmed. The balance of AED 9,800 is due on day 41.',
 n2:'Your kitchen layout was approved 21 days ago. Book the food permit inspection now to stay on course for day 60.',
 n3:'Payroll is not set up and your first hire starts on day 40. Three vetted providers are ready.',n3a:'Open the step',
 n4:'Corporate tax registration is due in 14 days. Missing it costs AED 10,000.',sched:'Scheduled for day 76',
 chan:'Where you hear from us',wa:'WhatsApp',em:'Email',hot:'Hotline',hotS:'Executive plan',
 tiT:'Plans',tiS:'The plan, the deadlines and the cash view are free for everyone.',
 free:'Free',pro:'Pro',exec:'Executive',emT:'For UAE nationals',perMo:'a month',
 f1:'Full 100-day plan and deadlines',f2:'Vetted providers at each step',f3:'Cash view',f4:'Stars and record',
 pp1:'Applications filled from your licence',pp2:'Programme matching',pp3:'Alerts before each deadline and cash dip',pp4:'Accounting and payroll connections',
 x1:'A mentor, one session a month',x2:'Hotline',x3:'Priority credit review',x4:'Weekly members’ meeting',
 em1:'Pro is free for your first 100 days',em2:'Supplier-programme readiness by day 100',
 tiNote:'Illustrative prices.',
 dT:'Day 100',dS:'What graduating looks like for {b}.',gradOf:'D100 graduate',gradWhen:'Dubai, {m}',
 after:'After day 100',a1:'Credit limit review with the bank',a2:'List your business as a provider for the next founders',a3:'The plan carries on: renewals, the VAT threshold, e-invoicing by 1 July 2027',
 become:'List my business as a provider',becomeT:'In the pilot this opens a provider profile.',
 mT:'More',mProg:'Programmes',mNudge:'Messages from D100',mPlans:'Plans',mDay:'Day 100',mBank:'Bank step',mShots:'All screens',
 mDemo:'Demo controls',mReset:'Reset to Layla, day 37',mFresh:'Start over at day 1',mJump:'Jump to day 37',
 shotsT:'All screens',backApp:'Back to the app',
 n_landing:'Landing',n_start:'Your licence',n_roadmap:'Plan',n_step:'Step',n_bank:'Bank step',n_cash:'Cash view',n_stars:'Stars and credit',n_market:'Providers',n_programmes:'Programmes',n_nudges:'Messages',n_tiers:'Plans',n_day100:'Day 100',
 aed:n=>'AED '+n,mo:n=>'AED '+n+' a month'
},
ar:{
 proto:'نموذج تجريبي لهاكاثون. البيانات افتراضية.',
 concept:'تصوّر مقدَّم لهاكاثون بنك دبي التجاري ومؤسسة محمد بن راشد لتنمية المشاريع',
 h1:'أول 100 يوم لمشروعك، بالترتيب.',
 lede:'يحوّل D100 رخصتك التجارية إلى خطة يومية: ما الذي تقدّمه، مع من تتعاقد، كم يكلّف، وما المستحق بعده.',
 loop1:'كل دفعة تبني سجلّك.',loop2:'سجلّك يكسبك النجوم.',loop3:'النجوم تفتح لك التمويل والعملاء.',
 start:'ابدأ أيامي المئة',demo:'شاهد اليوم 37 مع ليلى',
 proof1:'انضمت <b>71,830 شركة</b> إلى غرفة تجارة دبي في 2025.',
 proof2:'<b>10,000 درهم</b> غرامة التأخر عن التسجيل لضريبة الشركات، وموعده خلال 3 أشهر من التأسيس.',
 proof3:'مصمَّم ليعمل فوق <b>SME in a Box</b> و<b>UP by CBD</b>. تكاملات مقترحة وغير مفعّلة.',
 partners:'شركاء مقترحون: بنك دبي التجاري، مؤسسة محمد بن راشد لتنمية المشاريع الصغيرة والمتوسطة، دائرة الاقتصاد والسياحة بدبي.',
 all:'الشاشات الاثنتا عشرة',other:'English',
 key1:'اليوم 14: اعتماد مخطط المطبخ',key2:'اليوم 45: تفتيش تصريح الأغذية',key3:'اليوم 90: التسجيل لضريبة الشركات',keyNow:'اليوم 37: موقع مقهى ليلى اليوم',
 tRoad:'الخطة',tCash:'السيولة',tStars:'النجوم',tMarket:'المزوّدون',tMore:'المزيد',
 obT:'أخبرنا عن رخصتك',obS:'أربع إجابات يبني منها D100 خطتك.',
 q1:'من أين صدرت رخصتك؟',q1a:'دبي، البر الرئيسي',q1as:'دائرة الاقتصاد والسياحة',q1b:'منطقة حرة في دبي',q1bs:'القالب في المرحلة التالية',
 q2:'ما نشاط المشروع؟',q2a:'مقهى أو مطعم',q2b:'متجر إلكتروني',q2c:'رحلات وسياحة',q2cs:'القالب في المرحلة التالية',
 q3:'من المالك؟',q3a:'مواطن إماراتي',q3b:'مقيم',
 q4:'رأس المال عند البدء، بالدرهم',q5:'اسم المشروع (اختياري)',
 obNote:'استخدم اسمًا افتراضيًا. ما تكتبه لا يغادر هذه الصفحة.',build:'أنشئ خطتي',
 b1:'قراءة نشاط الرخصة',b2:'مطابقة التصاريح والموافقات',b3:'ترتيب المواعيد النهائية',b4:'خطتك جاهزة',
 day:'اليوم',of100:'من 100',stepsDone:'أُنجزت {n} من {m} خطوة',nextDue:'الموعد القادم',
 done:'تم',today:'اليوم',inDays:({n})=>n===1?'غدًا':n===2?'بعد يومين':n<=10?`بعد ${n} أيام`:`بعد ${n} يومًا`,dueDay:'اليوم {d}',late:({n})=>n===1?'متأخرة يومًا واحدًا':n===2?'متأخرة يومين':n<=10?`متأخرة ${n} أيام`:`متأخرة ${n} يومًا`,tracking:'قيد المتابعة',fine:'{x} عند التأخير',
 days:'الأيام {a} إلى {b}',
 p1:'التأسيس',p2:'التجهيز',p3:'الافتتاح',p4:'الالتزام والنمو',
 why:'لماذا هذه الخطوة الآن',what:'المطلوب',auth:'الجهة',due:'الموعد',missed:'عند التأخير',status:'الحالة',
 vetted:'مزوّدون معتمدون',rank:'الترتيب حسب تقييم المؤسسين والأعمال المنجزة، لا حسب ما يدفعه المزوّد.',
 chosen:'تم الاختيار',grad:'خرّيج D100',founders:'{n} مؤسسًا',markDone:'تأكيد إنجاز الخطوة',pickFirst:'اختر مزوّدًا أولا',
 doneOn:'أُنجزت في اليوم {d}',toastDone:'أُنجزت الخطوة. +6 في سجلّك.',sample:'مزوّدون افتراضيون بأسماء غير حقيقية.',
 sampleStep:'خطوة توضيحية. راجع الجهة المختصة قبل التنفيذ.',
 bankT:'افتح حساب مشروعك',propPartner:'شريك مقترح',
 bk1:'يُفتح الحساب انطلاقًا من الرخصة الموحدة في دبي',bk2:'حساب بلا حد أدنى للرصيد ضمن باقة اشتراك',bk3:'بطاقة ائتمان للأعمال بعد صدور الرخصة',
 bkSrc:'بحسب إعلان بنك دبي التجاري في يوليو 2026.',bkGo:'المتابعة مع UP by CBD',
 anyT:'استخدم بنكًا آخر',anyP:'اربطه عبر التمويل المفتوح ليبقى عرض السيولة وسجلّك فعّالين. أنت من يوافق على ما يُشارَك.',anyGo:'ربط بنك آخر',
 bkDone:'تم الربط في اليوم {d}',bkToast:'في المرحلة التجريبية تفتح هذه الخطوة صفحة التسجيل لدى البنك.',
 bal:'الرصيد',costs:'التكاليف الشهرية',runway:'يكفي الرصيد',months:'شهر',
 lgA:'الفعلي',lgP:'إذا بدأت المبيعات في اليوم 60',lgN:'بلا مبيعات',opens:'الافتتاح',
 seeT:'ما يراه D100',seeP:'يخرج {a} درهم بين اليوم {f} واليوم {l}. إذا تأخر الافتتاح ولم تبدأ المبيعات، ينفد الرصيد قرابة اليوم {z}. كل أسبوع تأخير يكلّف نحو {w} درهم.',
 seeOk:'بحسب الخطة الحالية يغطي الرصيد الأيام المئة الأولى. سينبّهك D100 إن تغيّر ذلك.',
 coming:'مدفوعات قادمة',dep:'التأمينات ورسوم إيجاري',fitdep:'الدفعة الأولى للتجهيز',eqdep:'الدفعة الأولى للمعدات',eqbal:'باقي ثمن المعدات',fitbal:'الدفعة الأخيرة للتجهيز',
 where:'توزيع التكاليف الشهرية',rent:'الإيجار',team:'الفريق',supplies:'المستلزمات والمرافق',other2:'برمجيات وتراخيص وغيرها',added:'أُضيف اليوم',
 src:'المصدر: كشف الحساب والمدفوعات عبر D100. بيانات افتراضية.',
 record:'درجة السجل',toNext:({p})=>p===1?'نقطة واحدة للنجمة التالية':p===2?'نقطتان للنجمة التالية':p<=10?`${p} نقاط للنجمة التالية`:`${p} نقطة للنجمة التالية`,top:'بلغت أعلى تصنيف',
 earnT:'كيف تُكسب النقاط',e1:'كل خطوة تُنجز في موعدها',e2:'كل 5 أيام من المدفوعات الموثّقة',e3:'رصيد يغطي شهرين',
 noBuy:'تُكسب النجوم من نشاط موثّق، ولا تُشترى بأي باقة.',
 unlockT:'ما تفتحه النجوم',credit:'تمويل صغير',upTo:'مؤهل للتقدّم بطلب حتى {x} درهم',notYet:'تبدأ الأهلية عند النجمة الثانية',
 illus:'حدود توضيحية. القرار للبنك في كل طلب.',
 u1:'بدء السجل',u2:'تمويل صغير حتى 10,000 درهم',u3:'حتى 25,000 درهم، وأولوية في مطابقة البرامج',u4:'حتى 50,000 درهم، وإمكانية الإدراج مزوّدًا',u5:'حتى 100,000 درهم، ولوحة للمحل، وصدارة الترتيب',
 earned:'كسبت النجمة {n}',earnedP:'أُنجزت في موعدها: {t}. درجة سجلّك الآن {s}.',seeCash:'عرض السيولة',
 mkT:'مزوّدون للخطوات القادمة',mkBan:'عروض البنوك والمدفوعات والاتصالات والخدمات اللوجستية مصدرها منصة SME in a Box التابعة لدائرة الاقتصاد والسياحة (ربط مقترح).',
 mkHow:'كيف يُدرَج المزوّد',mkHowP:'نتحقق من الرخصة، ثم يقيّمه المؤسسون بعد كل عمل، ويُحذف إذا انخفض تقييمه عن 4.0.',
 c_fitout:'التجهيز الداخلي',c_equip:'المعدات',c_payroll:'الرواتب',c_accounting:'المحاسبة',c_delivery:'التوصيل',
 prT:'برامج تناسب رخصتك',prS:'مطابقة بحسب الرخصة والمالك ودرجة السجل.',
 prWhy:'سبب المطابقة',prGo:'جهّز طلبي',exMatch:'مطابقة توضيحية',
 shT:'مُعبّأ من بيانات رخصتك',shBiz:'المشروع',shLic:'الرخصة',shAct:'النشاط',shOwn:'المالك',shDay:'اليوم في D100',shRec:'السجل',
 shNote:'تراجع الطلب وتقدّمه عبر موقع البرنامج نفسه. المطابقة توضيحية، وشروط الأهلية تُراجَع هناك.',close:'إغلاق',
 ngT:'D100 يبادر بالتنبيه',ngS:'عبر واتساب والبريد الإلكتروني، وخط مباشر لأعضاء الباقة التنفيذية.',
 n1:'تأكّد طلب المعدات. يُستحق الباقي وقدره 9,800 درهم في اليوم 41.',
 n2:'اعتُمد مخطط المطبخ قبل 21 يومًا. احجز تفتيش تصريح الأغذية الآن لتبقى على موعد اليوم 60.',
 n3:'لم يُجهَّز نظام الرواتب بعد، وأول موظف يبدأ في اليوم 40. ثلاثة مزوّدين معتمدين جاهزون.',n3a:'افتح الخطوة',
 n4:'يُستحق التسجيل لضريبة الشركات بعد 14 يومًا. غرامة التأخير 10,000 درهم.',sched:'مجدولة لليوم 76',
 chan:'قنوات التواصل',wa:'واتساب',em:'البريد الإلكتروني',hot:'الخط المباشر',hotS:'الباقة التنفيذية',
 tiT:'الباقات',tiS:'الخطة والمواعيد وعرض السيولة مجانًا للجميع.',
 free:'المجانية',pro:'برو',exec:'التنفيذية',emT:'لمواطني الدولة',perMo:'شهريًا',
 f1:'خطة المئة يوم كاملة مع المواعيد',f2:'مزوّدون معتمدون عند كل خطوة',f3:'عرض السيولة',f4:'النجوم والسجل',
 pp1:'تعبئة الطلبات من بيانات الرخصة',pp2:'مطابقة البرامج',pp3:'تنبيه قبل كل موعد وكل هبوط في السيولة',pp4:'ربط أنظمة المحاسبة والرواتب',
 x1:'مرشد وجلسة كل شهر',x2:'خط مباشر',x3:'أولوية في مراجعة التمويل',x4:'لقاء أسبوعي للأعضاء',
 em1:'باقة برو مجانًا في أيامك المئة الأولى',em2:'جاهزية لبرنامج المورّدين عند اليوم 100',
 tiNote:'أسعار توضيحية.',
 dT:'اليوم 100',dS:'هكذا يبدو تخرّج {b}.',gradOf:'خرّيج D100',gradWhen:'دبي، {m}',
 after:'بعد اليوم 100',a1:'مراجعة الحد الائتماني مع البنك',a2:'إدراج مشروعك مزوّدًا للمؤسسين الجدد',a3:'تستمر الخطة: التجديدات، وحد ضريبة القيمة المضافة، والفوترة الإلكترونية قبل 1 يوليو 2027',
 become:'أدرِج مشروعي مزوّدًا',becomeT:'في المرحلة التجريبية تفتح هذه الخطوة ملف المزوّد.',
 mT:'المزيد',mProg:'البرامج',mNudge:'رسائل D100',mPlans:'الباقات',mDay:'اليوم 100',mBank:'خطوة البنك',mShots:'كل الشاشات',
 mDemo:'أدوات العرض',mReset:'العودة إلى ليلى، اليوم 37',mFresh:'البدء من اليوم 1',mJump:'الانتقال إلى اليوم 37',
 shotsT:'كل الشاشات',backApp:'العودة إلى التطبيق',
 n_landing:'الصفحة الأولى',n_start:'رخصتك',n_roadmap:'الخطة',n_step:'الخطوة',n_bank:'خطوة البنك',n_cash:'السيولة',n_stars:'النجوم والتمويل',n_market:'المزوّدون',n_programmes:'البرامج',n_nudges:'الرسائل',n_tiers:'الباقات',n_day100:'اليوم 100',
 aed:n=>n+' درهم',mo:n=>n+' درهم شهريًا'
}};

/* ---------- data ---------- */
const A={det:{en:'Department of Economy and Tourism',ar:'دائرة الاقتصاد والسياحة'},dm:{en:'Dubai Municipality',ar:'بلدية دبي'},
 dld:{en:'Dubai Land Department',ar:'دائرة الأراضي والأملاك'},fta:{en:'Federal Tax Authority',ar:'الهيئة الاتحادية للضرائب'},
 mof:{en:'Ministry of Finance',ar:'وزارة المالية'},prov:{en:'Vetted providers',ar:'مزوّدون معتمدون'},plan:{en:'Your milestone',ar:'محطة في خطتك'},box:{en:'SME in a Box offers',ar:'عروض SME in a Box'},bank:{en:'Your bank',ar:'البنك'}};
const CAFE=[
 {id:'s1',ph:1,due:1,a:'det',t:{en:'Trade licence issued',ar:'صدور الرخصة التجارية'},
  w:{en:'The licence is the source for everything that follows. D100 read your activity and legal form from it.',ar:'الرخصة مصدر كل ما يليها. قرأ D100 منها النشاط والشكل القانوني.'},
  d:[{en:'Licence number and activity confirmed',ar:'تأكيد رقم الرخصة والنشاط'}]},
 {id:'s2',ph:1,due:7,a:'bank',bank:1,t:{en:'Open a business bank account',ar:'فتح حساب بنكي للمشروع'},
  w:{en:'Payments from this account are what build your record.',ar:'المدفوعات من هذا الحساب هي التي تبني سجلّك.'},d:[]},
 {id:'s3',ph:1,due:10,a:'dld',t:{en:'Register the tenancy contract (Ejari)',ar:'تسجيل عقد الإيجار (إيجاري)'},
  w:{en:'Dubai Municipality asks for the Ejari contract together with your kitchen layout.',ar:'تطلب بلدية دبي عقد إيجاري مع مخطط المطبخ.'},
  d:[{en:'Signed tenancy contract',ar:'عقد إيجار موقّع'},{en:'Ejari certificate uploaded',ar:'رفع شهادة إيجاري'}]},
 {id:'s4',ph:1,due:14,a:'dm',hard:1,t:{en:'Get the kitchen layout approved',ar:'اعتماد مخطط المطبخ'},
  w:{en:'Approval comes before fit-out. Until it is given, the licence cannot be used for food.',ar:'الاعتماد يسبق أعمال التجهيز، ولا تُزاوَل أنشطة الأغذية بالرخصة قبله.'},
  d:[{en:'Layout drawing',ar:'مخطط الموقع'},{en:'Copy of the licence',ar:'نسخة من الرخصة'},{en:'Ejari contract',ar:'عقد إيجاري'}]},
 {id:'s5',ph:2,due:21,a:'prov',cat:'fitout',t:{en:'Appoint a fit-out contractor',ar:'التعاقد مع مقاول التجهيز'},
  w:{en:'Build to the approved layout so the site passes inspection the first time.',ar:'نفّذ وفق المخطط المعتمد ليجتاز الموقع التفتيش من المرة الأولى.'},
  d:[{en:'Quote against the approved layout',ar:'عرض سعر وفق المخطط المعتمد'},{en:'Handover date agreed',ar:'الاتفاق على موعد التسليم'}]},
 {id:'s6',ph:2,due:30,a:'prov',cat:'equip',t:{en:'Order equipment and point of sale',ar:'طلب المعدات ونظام نقاط البيع'},
  w:{en:'Lead times decide your opening date. Order as soon as the layout is fixed.',ar:'مدة التوريد تحدد موعد الافتتاح. اطلب فور اعتماد المخطط.'},
  d:[{en:'Equipment list matched to the layout',ar:'قائمة معدات مطابقة للمخطط'},{en:'Delivery before the inspection',ar:'التسليم قبل موعد التفتيش'}]},
 {id:'s7',ph:2,due:40,a:'prov',cat:'payroll',soft:1,t:{en:'Set up payroll before your first hire',ar:'إعداد الرواتب قبل أول تعيين'},
  w:{en:'Your first employee starts on day 40. Salaries paid through a payroll system count towards your record from the first month.',ar:'يبدأ أول موظف في اليوم 40. الرواتب المصروفة عبر نظام رواتب تُحتسب في سجلّك من الشهر الأول.'},
  d:[{en:'Employment contracts ready',ar:'عقود العمل جاهزة'},{en:'Payroll provider chosen',ar:'اختيار مزوّد الرواتب'},{en:'First salary date set',ar:'تحديد موعد أول راتب'}]},
 {id:'s8',ph:2,due:45,a:'dm',hard:1,t:{en:'Pass the food permit inspection',ar:'اجتياز تفتيش تصريح الأغذية'},
  w:{en:'Inspectors grade the finished site. You need a pass to receive the food permit and open.',ar:'يقيّم المفتشون الموقع بعد اكتماله، والنجاح شرط للحصول على التصريح والافتتاح.'},
  d:[{en:'Fit-out complete',ar:'اكتمال التجهيز'},{en:'Inspection booked',ar:'حجز موعد التفتيش'},{en:'Staff health cards',ar:'البطاقات الصحية للموظفين'}]},
 {id:'s9',ph:3,due:50,a:'prov',cat:'accounting',t:{en:'Set up bookkeeping',ar:'إعداد مسك الدفاتر'},
  w:{en:'Clean books from the first sale make tax filing and credit reviews quicker.',ar:'دفاتر منتظمة منذ أول عملية بيع تسهّل الإقرارات الضريبية ومراجعات التمويل.'},
  d:[{en:'Bookkeeper chosen',ar:'اختيار المحاسب'},{en:'Bank feed connected',ar:'ربط كشف الحساب'}]},
 {id:'s10',ph:3,due:55,a:'prov',cat:'delivery',t:{en:'Choose a delivery partner',ar:'اختيار شريك التوصيل'},
  w:{en:'Line up delivery before opening so orders can start on the first day.',ar:'جهّز التوصيل قبل الافتتاح لتبدأ الطلبات من اليوم الأول.'},
  d:[{en:'Menu and prices shared',ar:'مشاركة القائمة والأسعار'},{en:'Go-live date set',ar:'تحديد موعد التشغيل'}]},
 {id:'s11',ph:3,due:60,a:'plan',t:{en:'Soft opening',ar:'الافتتاح التجريبي'},
  w:{en:'Your plan counts on sales from day 60. The cash view tracks the gap if the date moves.',ar:'خطتك تعتمد على بدء المبيعات في اليوم 60، وعرض السيولة يتابع الفارق إن تغيّر الموعد.'},
  d:[{en:'Food permit in hand',ar:'الحصول على تصريح الأغذية'},{en:'Team trained',ar:'تدريب الفريق'}]},
 {id:'s12',ph:4,due:90,a:'fta',hard:1,fine:10000,t:{en:'Register for corporate tax',ar:'التسجيل لضريبة الشركات'},
  w:{en:'Every new company must register within three months of incorporation, even before it trades. Your legal deadline is {ct}.',ar:'على كل شركة جديدة التسجيل خلال ثلاثة أشهر من التأسيس ولو لم تبدأ نشاطها. موعدك القانوني {ct}.'},
  d:[{en:'EmaraTax account',ar:'حساب على منصة «إمارات تاكس»'},{en:'Licence and owner documents',ar:'الرخصة ومستندات المالك'},{en:'Application submitted',ar:'تقديم الطلب'}]},
 {id:'s13',ph:4,due:95,a:'mof',fineTxt:{en:'AED 5,000 a month',ar:'5,000 درهم شهريًا'},t:{en:'Choose an e-invoicing provider',ar:'اختيار مزوّد الفوترة الإلكترونية'},
  w:{en:'Businesses under AED 50m revenue must appoint an accredited provider by 31 March 2027 and send e-invoices to business customers from 1 July 2027.',ar:'على المنشآت التي تقل إيراداتها عن 50 مليون درهم تعيين مزوّد معتمد قبل 31 مارس 2027، وإصدار الفواتير الإلكترونية لعملائها من الشركات اعتبارًا من 1 يوليو 2027.'},
  d:[{en:'Pick from the Ministry’s accredited list',ar:'الاختيار من قائمة الوزارة المعتمدة'},{en:'Connect it to your accounting software',ar:'ربطه ببرنامج المحاسبة'}]},
 {id:'s14',ph:4,due:100,a:'fta',auto:1,t:{en:'VAT threshold watch',ar:'متابعة حد ضريبة القيمة المضافة'},
  w:{en:'Registration becomes mandatory when taxable sales pass AED 375,000 in 12 months. D100 tracks your sales against that line.',ar:'يصبح التسجيل إلزاميًا عند تجاوز المبيعات الخاضعة للضريبة 375,000 درهم خلال 12 شهرًا، ويتابع D100 مبيعاتك مقابل هذا الحد.'},
  d:[{en:'Sales tracked from the first invoice',ar:'متابعة المبيعات منذ أول فاتورة'}]},
 {id:'s15',ph:4,due:100,a:'plan',t:{en:'Day 100 review',ar:'مراجعة اليوم 100'},
  w:{en:'Your record, stars and credit eligibility are reviewed, and you can list your business as a provider.',ar:'تُراجَع درجة سجلّك ونجومك وأهليتك للتمويل، ويمكنك إدراج مشروعك مزوّدًا.'},
  d:[{en:'Record reviewed',ar:'مراجعة السجل'},{en:'Plaque issued',ar:'إصدار اللوحة'}]}
];
const SHOP={
 s4:{a:'plan',hard:0,t:{en:'Build your online store',ar:'بناء المتجر الإلكتروني'},
  w:{en:'A payment gateway will want to see a live storefront, catalogue and policies before it approves you.',ar:'تشترط بوابات الدفع وجود متجر فعّال بمنتجاته وسياساته قبل الموافقة.'},
  d:[{en:'Storefront and catalogue live',ar:'تشغيل المتجر وعرض المنتجات'},{en:'Returns and privacy policies published',ar:'نشر سياستي الاسترجاع والخصوصية'}]},
 s5:{a:'box',cat:null,t:{en:'Connect a payment gateway',ar:'ربط بوابة الدفع'},
  w:{en:'Gateways check your licence and your site. Approval can take days, so start early. Offers come from SME in a Box (proposed link).',ar:'تراجع بوابات الدفع رخصتك وموقعك، وقد تستغرق الموافقة أيامًا، فابدأ مبكرًا. العروض مصدرها SME in a Box (ربط مقترح).'},
  d:[{en:'Gateway application sent',ar:'تقديم طلب بوابة الدفع'},{en:'Test payment received',ar:'استلام دفعة تجريبية'}]},
 s6:{a:'plan',cat:null,t:{en:'Arrange stock and storage',ar:'تجهيز المخزون والتخزين'},
  w:{en:'Know where stock sits and how fast it can ship before you take the first order.',ar:'حدّد مكان المخزون وسرعة شحنه قبل استقبال أول طلب.'},
  d:[{en:'Opening stock ordered',ar:'طلب المخزون الأولي'},{en:'Storage arranged',ar:'تجهيز مكان التخزين'}]},
 s8:{a:'plan',hard:0,t:{en:'Place test orders end to end',ar:'تنفيذ طلبات تجريبية كاملة'},
  w:{en:'Run an order from checkout to delivery and refund, so the first customer is not the test.',ar:'نفّذ طلبًا من الدفع إلى التسليم والاسترجاع، حتى لا يكون أول عميل هو التجربة.'},
  d:[{en:'Order placed and delivered',ar:'طلب نُفّذ وسُلّم'},{en:'Refund processed',ar:'تنفيذ استرجاع'}]},
 s11:{t:{en:'Launch the store',ar:'إطلاق المتجر'},d:[{en:'Gateway live',ar:'تشغيل بوابة الدفع'},{en:'Delivery partner live',ar:'تشغيل شريك التوصيل'}]}
};
const PH=[null,{k:'p1',a:1,b:14},{k:'p2',a:15,b:45},{k:'p3',a:46,b:70},{k:'p4',a:71,b:100}];
const P={
 fitout:[{id:'liwan',n:'Liwan Fit-out',b:{en:'Cafés and small kitchens. Builds to municipality-approved layouts.',ar:'مقاهٍ ومطابخ صغيرة. ينفّذ وفق المخططات المعتمدة من البلدية.'},pt:{en:'from AED 25,000',ar:'من 25,000 درهم'},r:4.8,j:52,g:4},
  {id:'dhow',n:'Dhow Works Interiors',b:{en:'Joinery-led fit-outs with a fixed handover date.',ar:'تجهيزات تعتمد على النجارة مع موعد تسليم ثابت.'},pt:{en:'from AED 31,000',ar:'من 31,000 درهم'},r:4.6,j:34,g:0},
  {id:'areesh',n:'Areesh Build',b:{en:'Lower-cost shell and services work.',ar:'أعمال الهيكل والخدمات بتكلفة أقل.'},pt:{en:'from AED 19,500',ar:'من 19,500 درهم'},r:4.3,j:21,g:0}],
 equip:[{id:'marsa',n:'Marsa Kitchen Supply',b:{en:'Espresso, refrigeration and prep equipment, installed.',ar:'معدات القهوة والتبريد والتحضير مع التركيب.'},pt:{en:'from AED 18,000',ar:'من 18,000 درهم'},r:4.7,j:63,g:5},
  {id:'fils',n:'Fils POS',b:{en:'Point of sale with a card reader and daily sales export.',ar:'نظام نقاط بيع مع قارئ بطاقات وتصدير يومي للمبيعات.'},mo:99,r:4.5,j:88,g:0},
  {id:'qahwa',n:'Qahwa Machines Co.',b:{en:'Refurbished espresso machines with a service plan.',ar:'آلات قهوة مجدَّدة مع خطة صيانة.'},pt:{en:'from AED 9,000',ar:'من 9,000 درهم'},r:4.4,j:27,g:3}],
 payroll:[{id:'rateb',n:'Rateb Payroll',b:{en:'Runs salaries, payslips and leave for teams under 20.',ar:'يدير الرواتب وقسائمها والإجازات للفرق الأقل من 20 موظفًا.'},mo:150,r:4.8,j:41,g:4},
  {id:'daftar',n:'Daftar HR',b:{en:'Payroll with contracts, onboarding and document reminders.',ar:'رواتب مع العقود والتعيين وتنبيهات المستندات.'},mo:220,r:4.6,j:29,g:0},
  {id:'kashf',n:'Kashf Payroll',b:{en:'Salaries only. You keep HR records yourself.',ar:'رواتب فقط، وتبقى سجلات الموظفين لديك.'},mo:95,r:4.4,j:17,g:0}],
 accounting:[{id:'mizan',n:'Mizan Ledger',b:{en:'Monthly books, VAT watch and a corporate tax file.',ar:'دفاتر شهرية ومتابعة ضريبة القيمة المضافة وملف ضريبة الشركات.'},mo:750,r:4.7,j:58,g:5},
  {id:'hisab',n:'Hisab & Co.',b:{en:'Books plus a quarterly call with an accountant.',ar:'دفاتر مع مكالمة فصلية مع محاسب.'},mo:1100,r:4.8,j:33,g:0},
  {id:'dallah',n:'Dallah Accounts',b:{en:'Basic bookkeeping for low transaction volumes.',ar:'مسك دفاتر أساسي لعدد محدود من العمليات.'},mo:600,r:4.3,j:19,g:3}],
 delivery:[{id:'hudhud',n:'Hud Hud Couriers',b:{en:'Own riders within 5 km. Flat fee per drop.',ar:'سائقون خاصون ضمن 5 كم برسم ثابت لكل توصيلة.'},pt:{en:'AED 9 a drop',ar:'9 دراهم للتوصيلة'},r:4.6,j:74,g:4},
  {id:'sikka',n:'Sikka Riders',b:{en:'City-wide coverage with live tracking.',ar:'تغطية على مستوى المدينة مع تتبع مباشر.'},pt:{en:'AED 12 a drop',ar:'12 درهمًا للتوصيلة'},r:4.5,j:112,g:0},
  {id:'falcon',n:'Falcon Lane Delivery',b:{en:'Commission model with no fixed fee.',ar:'نموذج عمولة بلا رسم ثابت.'},pt:{en:'15% of the order',ar:'15% من قيمة الطلب'},r:4.2,j:46,g:0}]
};
const PROG=[
 {id:'esp',em:1,n:{en:'Emirati Supplier Programme',ar:'برنامج المورّد الإماراتي'},by:{en:'Dubai SME',ar:'مؤسسة محمد بن راشد لتنمية المشاريع الصغيرة والمتوسطة'},
  p:{en:'Opens public and private buyers to Emirati-owned SMEs. AED 1.78bn in contracts was awarded through it in 2025.',ar:'يفتح مشتريات الجهات الحكومية والخاصة أمام المشاريع المملوكة لمواطنين. أُرسيت عبره عقود بقيمة 1.78 مليار درهم في 2025.'},
  y:{en:'Emirati-owned, mainland licence',ar:'ملكية إماراتية ورخصة في البر الرئيسي'}},
 {id:'mbrf',em:1,n:{en:'Mohammed Bin Rashid Fund for SME',ar:'صندوق محمد بن راشد لدعم المشاريع الصغيرة والمتوسطة'},by:{en:'Dubai SME',ar:'مؤسسة محمد بن راشد لتنمية المشاريع الصغيرة والمتوسطة'},
  p:{en:'Financing for Emirati entrepreneurs. It funded 44 projects worth AED 35.17m in 2024.',ar:'تمويل لرواد الأعمال المواطنين. موّل 44 مشروعًا بقيمة 35.17 مليون درهم في 2024.'},
  y:{en:'Emirati-owned, record of 2 stars or more',ar:'ملكية إماراتية وسجل بنجمتين أو أكثر'}},
 {id:'fhq',n:{en:'Dubai Founders HQ programmes',ar:'برامج Dubai Founders HQ'},by:{en:'DET and Dubai Chamber of Digital Economy',ar:'دائرة الاقتصاد والسياحة وغرفة دبي للاقتصاد الرقمي'},
  p:{en:'Accelerators, mentoring and introductions to corporate buyers.',ar:'مسرّعات أعمال وإرشاد وتعريف بالمشترين من الشركات.'},
  y:{en:'New Dubai licence',ar:'رخصة جديدة في دبي'}},
 {id:'box',n:{en:'SME in a Box offers',ar:'عروض SME in a Box'},by:{en:'Department of Economy and Tourism',ar:'دائرة الاقتصاد والسياحة'},
  p:{en:'Partner offers that DET values at more than AED 80,000 per business.',ar:'عروض شركاء تقدّر الدائرة قيمتها بأكثر من 80,000 درهم لكل مشروع.'},
  y:{en:'Banking and payment steps still ahead',ar:'خطوات البنوك والمدفوعات ما زالت أمامك'}}
];
const ONEOFF=[{d:4,a:4450,k:'dep'},{d:17,a:12500,k:'fitdep'},{d:28,a:10000,k:'eqdep'},{d:41,a:9800,k:'eqbal'},{d:44,a:12500,k:'fitbal'}];
const BASE=31500, SALES=1200, OPEN=60;
const THR=[10,30,50,70,90], CREDIT=[0,0,10000,25000,50000,100000];

/* ---------- state ---------- */
let lang='en', toast=null, toastT=0, cat='payroll', wide=false;
let S=demo();
function demo(keep){return Object.assign({biz:'Sidr Specialty Coffee',licence:'mainland',activity:'cafe',emirati:true,capital:150000,day:37,
  done:{s1:1,s2:3,s3:8,s4:13,s5:19,s6:27},picks:{s5:'liwan',s6:'marsa'},extra:[],unlock:0,sheet:null},keep||{})}
function fresh(o){return Object.assign({biz:'Sidr Specialty Coffee',licence:'mainland',activity:'cafe',emirati:true,capital:150000,day:1,done:{s1:1},picks:{},extra:[],unlock:0,sheet:null},o||{})}
const t=(k,v)=>{let s=(TX[lang][k]??TX.en[k]??k);if(typeof s==='function')return s(v);if(v)for(const x in v)s=s.replace('{'+x+'}',v[x]);return s};
const L=o=>o?(o[lang]??o.en):'';
const fmt=n=>Math.round(n).toLocaleString('en-US');
const aed=n=>t('aed',fmt(n));
function steps(){return CAFE.map(s=>S.activity==='shop'&&SHOP[s.id]?Object.assign({},s,SHOP[s.id]):s)}
const stepById=id=>steps().find(s=>s.id===id);
const nextStep=()=>steps().find(s=>!S.done[s.id]&&!s.auto);
function monthly(){return BASE+S.extra.reduce((a,x)=>a+x.mo,0)}
function bal(d,sales){
  const past=Math.min(d,S.day); let b=S.capital-past*BASE/30;
  if(d>S.day){b-=(d-S.day)*monthly()/30; if(sales&&d>OPEN)b+=(d-Math.max(OPEN,S.day))*SALES}
  for(const o of ONEOFF)if(o.d<=d)b-=o.a; return b}
const zeroDay=()=>{for(let d=S.day;d<=160;d++)if(bal(d,false)<0)return d;return 0};
function score(){const n=Object.keys(S.done).length;return Math.min(100,n*6+Math.floor(S.day/5)+(bal(S.day)/monthly()>=2?5:0))}
const starsOf=sc=>THR.filter(x=>sc>=x).length;
function dateAt(day,months,opt){const d=new Date();d.setDate(d.getDate()-(S.day-1)+(day-1));if(months)d.setMonth(d.getMonth()+months);
  return d.toLocaleDateString(lang==='ar'?'ar-AE-u-nu-latn':'en-GB',opt||{day:'numeric',month:'long',year:'numeric'})}


/* ---------- copy for the redesign ---------- */
Object.assign(TX.en,{
 skip:'Skip for now',skQ:'Skip this step?',skHolds:'Later steps rely on it',skKeep:'No stamp and no points until you do it. It stays on your plan.',skAny:'Skip anyway',goBack:'Go back',skipped:'Skipped',skT:'Skipped',skOn:'Skipped on day {d}. Do it to earn the stamp.',skLeft:'Skipped steps left: {n}',toastSkip:'Skipped. It stays on your plan.',
 upSkip:'Short on time? Pro fills the forms from your licence.',upCash:'Pro warns you before a cash dip and links your accounting.',upMsg:'Free sends email. Pro adds WhatsApp reminders.',proRate:'Pro: 10% off',upStar:'Executive adds a monthly mentor and priority credit review.',upDay:'Keep your mentor and priority credit review after day 100.',
 pp5:'WhatsApp reminders and member rates with listed providers',ngS:'Email on Free. WhatsApp on Pro. Hotline on Executive.',notPartners:'Other banks are options, not partners.',byCbd:'Proposed partner. Not an official CBD product.',
 stepOf:'Step {i} of {m}',openSite:'Open {n}',goesTo:'Opens {h} in a new tab. Come back to stamp it.',iDid:'Done. Stamp it',already:'I have already done this',confirmPick:'Confirm and stamp',ownP:'Use my own provider',ownPh:'Provider name',learn:'Learn more (1 min)',need:'What you need',lockT:'Finish this first',lockS:'Locked',cont:'Next: {t}',
 h1a:'You got the licence.',h1b:'Now what?',sep:', ',ngToday:'Day 37, today',
 lede:'D100 turns a new trade licence into a 100-day plan: what to file, who to hire, what it costs and what is due next.',
 start:'Turn this licence into a plan',own:'Use my own details',
 datesT:'Three dates this café cannot miss',dayK:'Day',
 dt1:'Kitchen layout approval',dc1:'No approval, no fit-out.',
 dt2:'Food permit inspection',dc2:'No pass, no opening.',
 dt3:'Corporate tax registration',dc3:'AED 10,000 if missed.',
 loopT:'What following the plan earns',
 tStars:'Record',doNext:'Do this next',openStep:'Open this step',todoT:'Still to do',doneT:'Done so far',allDone:'Every step is done.',
 why:'Why now',choose:'Choose a provider',markDone:'Mark as done',
 pilotNote:'In the pilot, D100 confirms this from the authority or your bank feed. Here you confirm it yourself.',
 stDone:'Done, day {d}',rating:'★ {r} from {n} founders',
 recT:'Your record',plaqueSo:'Your door plaque so far.',
 nextStar:({p,n})=>(p===1?'1 point':p+' points')+' to star '+n,nextHow:'Next: {t}',
 creditNow:'Eligible to apply for up to',creditNext:'Star {n} raises this to AED {x}.',creditNone:'Micro-credit opens at 2 stars.',
 cashRun:'At this pace cash runs out on <span class="r">day {z}</span> unless sales start.',cashOk:'Cash covers your first 100 days.',cashPlan:'Your plan has sales starting on day 60.',
 recommended:'Recommended',bkWhat:'What you get',
 mT:'More',stampBot:'DONE IN D100',sealBot:'THE 100-DAY PLAN',
 n_stars:'Record and credit',b4:'Your plan is ready'
});
Object.assign(TX.ar,{
 skip:'تخطَّ الآن',skQ:'تخطي هذه الخطوة؟',skHolds:'خطوات لاحقة تعتمد عليها',skKeep:'لا ختم ولا نقاط حتى تنجزها. تبقى في خطتك.',skAny:'تخطَّ على أي حال',goBack:'رجوع',skipped:'متخطّاة',skT:'خطوات متخطّاة',skOn:'تم تخطيها في اليوم {d}. أنجزها لتحصل على الختم.',skLeft:'خطوات متخطّاة باقية: {n}',toastSkip:'تم التخطي. تبقى في خطتك.',
 upSkip:'وقتك ضيق؟ باقة برو تعبّئ النماذج من بيانات رخصتك.',upCash:'برو تنبّهك قبل هبوط السيولة وتربط نظام المحاسبة.',upMsg:'المجانية ترسل بريدًا إلكترونيًا. برو تضيف تذكيرات واتساب.',proRate:'برو: خصم 10%',upStar:'التنفيذية تضيف مرشدًا شهريًا وأولوية في مراجعة الائتمان.',upDay:'احتفظ بمرشدك وبأولوية مراجعة الائتمان بعد اليوم 100.',
 pp5:'تذكيرات واتساب وأسعار خاصة للأعضاء لدى المزوّدين',ngS:'البريد الإلكتروني في المجانية. واتساب في برو. الخط المباشر في التنفيذية.',notPartners:'البنوك الأخرى خيارات متاحة وليست شركاء.',byCbd:'شريك مقترح. ليس منتجًا رسميًا لبنك دبي التجاري.',
 stepOf:'الخطوة {i} من {m}',openSite:'افتح {n}',goesTo:'يفتح {h} في نافذة جديدة. عُد بعدها لختم الخطوة.',iDid:'تم. اختمها',already:'أنجزتها مسبقًا',confirmPick:'تأكيد وختم',ownP:'مزوّد من اختياري',ownPh:'اسم المزوّد',learn:'للاستزادة (دقيقة واحدة)',need:'المطلوب',lockT:'أنجز هذه أولا',lockS:'مقفلة',cont:'التالي: {t}',
 h1a:'حصلت على الرخصة.',h1b:'وماذا بعد؟',sep:'، ',ngToday:'اليوم 37، هذا اليوم',
 lede:'يحوّل D100 الرخصة التجارية الجديدة إلى خطة من 100 يوم: ما الذي تقدّمه، مع من تتعاقد، كم يكلّف، وما المستحق بعده.',
 start:'حوّل هذه الرخصة إلى خطة',own:'استخدم بياناتي',
 datesT:'ثلاثة مواعيد لا يحتمل هذا المقهى تفويتها',dayK:'اليوم',
 dt1:'اعتماد مخطط المطبخ',dc1:'لا تجهيز بلا اعتماد.',
 dt2:'تفتيش تصريح الأغذية',dc2:'لا افتتاح بلا اجتياز.',
 dt3:'التسجيل لضريبة الشركات',dc3:'غرامة 10,000 درهم عند التأخير.',
 loopT:'ما تكسبه من الالتزام بالخطة',
 tStars:'السجل',doNext:'الخطوة التالية',openStep:'افتح الخطوة',todoT:'خطوات قادمة',doneT:'ما أُنجز',allDone:'أُنجزت كل الخطوات.',
 why:'لماذا الآن',choose:'اختر مزوّدًا',markDone:'تأكيد الإنجاز',
 pilotNote:'في المرحلة التجريبية يتحقق D100 من الإنجاز عبر الجهة المختصة أو كشف حسابك. هنا تؤكّده بنفسك.',
 stDone:'أُنجزت، اليوم {d}',rating:'★ {r} من {n} مؤسسًا',
 recT:'سجلّك',plaqueSo:'لوحة محلّك حتى الآن.',
 nextStar:({p,n})=>(p===1?'نقطة واحدة':p===2?'نقطتان':p<=10?p+' نقاط':p+' نقطة')+' للنجمة '+n,nextHow:'التالي: {t}',
 creditNow:'مؤهل للتقدّم بطلب حتى',creditNext:'النجمة {n} ترفع الحد إلى {x} درهم.',creditNone:'يبدأ التمويل الصغير عند النجمة الثانية.',
 cashRun:'بهذا المعدل ينفد الرصيد في <span class="r">اليوم {z}</span> ما لم تبدأ المبيعات.',cashOk:'الرصيد يغطي أيامك المئة الأولى.',cashPlan:'خطتك تفترض بدء المبيعات في اليوم 60.',
 recommended:'موصى به',bkWhat:'ما تحصل عليه',
 mT:'المزيد',stampBot:'DONE IN D100',sealBot:'THE 100-DAY PLAN',
 n_stars:'السجل والتمويل',b4:'خطتك جاهزة'
});

const rtl=()=>lang==='ar';
/* desktop stage (pitch + phone frame) needs width and height; anything else gets the phone layout. Keep in step with the media queries in head.html. */
const WIDE='(min-width:900px) and (min-height:640px)';
/* first sentence splitter. No regex lookbehind: Safari before iOS 16.4 cannot parse one. */
const sents=s=>{const o=[];let a=0;for(let i=0;i<s.length-1;i++)if('.!؟'.indexOf(s[i])>-1&&/\s/.test(s[i+1])){o.push(s.slice(a,i+1));a=i+2}o.push(s.slice(a));return o};
const plus=n=>'<bdi dir="ltr">+'+n+'</bdi>';
/* names that may be Latin inside an Arabic sentence (banks, sample providers, a typed business name, a web address) are isolated so they cannot reorder the text around them */
const bd=x=>'<bdi>'+x+'</bdi>',bdl=x=>'<bdi dir="ltr">'+x+'</bdi>';
const DEF_BIZ='Sidr Specialty Coffee', DEF_BIZ_AR='سدر للقهوة المختصة';
let CK={},VIS={},OWN={};
const CAP=[10000,1000000];
const digits=v=>String(v).replace(/[\u0660-\u0669]/g,c=>c.charCodeAt(0)-0x660).replace(/[\u06F0-\u06F9]/g,c=>c.charCodeAt(0)-0x6F0).replace(/\D/g,'');
const TRAIL=[],SCR={};let goingBack=false,applied=null,opener='';
/* ---------- saved state: survives a refresh and iOS reloading the tab. Versioned key; "Reset" in More wipes it. ---------- */
const KEY='d100:v1';
function save(){try{const c=Object.assign({},S);delete c.slam;delete c.warn;delete c.sheet;localStorage.setItem(KEY,JSON.stringify({S:c,lang,VIS,OWN,cat}))}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');
  if(!d||!d.S||typeof d.S.done!=='object'||typeof d.S.picks!=='object'||!(d.S.day>=1))return false;
  S=Object.assign(demo(),d.S,{slam:null,warn:null,sheet:null,unlock:0});if(!Array.isArray(S.extra))S.extra=[];
  lang=d.lang==='ar'?'ar':'en';VIS=d.VIS||{};OWN=d.OWN||{};if(P[d.cat])cat=d.cat;return true}catch(e){return false}}
function wipe(){try{localStorage.removeItem(KEY)}catch(e){}}
/* Official logo files go here once you have the right to use them, e.g. up:'logos/up.svg'. Empty = name tile. */
const LOGOS={"adcb": "assets/logo-adcb.5f3d68ef30.webp", "adib": "assets/logo-adib.7183fbce32.webp", "cbd": "assets/logo-cbd.f20f79ca17.webp", "dib": "assets/logo-dib.1489f7f61f.webp", "enbd": "assets/logo-enbd.784edc17e9.webp", "fab": "assets/logo-fab.9152f1fca4.webp", "mashreq": "assets/logo-mashreq.8a1cf60656.webp", "rak": "assets/logo-rak.dce3d725b2.webp", "up": "assets/logo-up.55532e76c6.webp", "wio": "assets/logo-wio.53a184a2cc.webp"};
/* w,h: the size each logo is shown at, in CSS px. Chosen so the nine marks carry about the same optical weight (same area, corrected for how much ink the mark has),
   and so every file has at least 3 device pixels per CSS pixel. The files themselves are untouched. */
const BANKS=[{id:'up',n:'UP by CBD',m:'UP',u:'https://www.cbd.ae',rec:1,w:68,h:31},{id:'enbd',n:'Emirates NBD',m:'ENBD',u:'https://www.emiratesnbd.com',w:92,h:25},{id:'adib',n:'ADIB',m:'ADIB',u:'https://www.adib.ae',w:92,h:16},
 {id:'mashreq',n:'Mashreq',m:'M',u:{en:'https://www.mashreq.com/en/uae/business/',ar:'https://www.mashreq.com/ar/uae/business/'},w:92,h:24},{id:'rak',n:'RAKBANK',m:'RAK',u:'https://www.rakbank.ae',w:92,h:14},{id:'wio',n:'Wio Bank',m:'Wio',u:'https://www.wio.io',w:68,h:26},
 {id:'dib',n:'Dubai Islamic Bank',m:'DIB',u:'https://www.dib.ae',w:92,h:22},{id:'adcb',n:'ADCB',m:'ADCB',u:'https://www.adcb.com',w:80,h:24},{id:'fab',n:'First Abu Dhabi Bank',m:'FAB',u:'https://www.bankfab.com',w:54,h:32}];
/* Official sites only. A deeper page is used where it was confirmed to return 200 (node tests/links.js); otherwise the home page.
   {en,ar} = the same service page in each language. */
const LINK={det:'https://www.investindubai.gov.ae',dm:'https://www.dm.gov.ae',
 dld:{en:'https://dubailand.gov.ae/en/eservices/register-renew-ejari-contract',ar:'https://dubailand.gov.ae/ar/eservices/register-renew-ejari-contract'},
 fta:{en:'https://tax.gov.ae/en/services/corporate.tax.registration.aspx',ar:'https://tax.gov.ae/ar/services/corporate.tax.registration.aspx'},
 mof:{en:'https://mof.gov.ae/en/about-us/initiatives/einvoicing/',ar:'https://mof.gov.ae/ar/about-us/initiatives/einvoicing/'},box:'https://sme.ae'};
const U=x=>!x||typeof x==='string'?x:(x[lang]||x.en);
const hostOf=u=>u.replace(/^https?:\/\/(www\.)?/,'').split('/')[0];
const PLINK={esp:'https://sme.ae',mbrf:'https://sme.ae',box:'https://sme.ae'};
const PRE={cafe:{s4:['s3'],s5:['s4'],s6:['s4'],s8:['s5','s6'],s9:['s2'],s11:['s8'],s13:['s9'],s15:['s11']},shop:{s5:['s4'],s8:['s5'],s9:['s2'],s11:['s8'],s13:['s9'],s15:['s11']}};
const SK=()=>S.skip||(S.skip={});
const blockers=s=>((PRE[S.activity]||PRE.cafe)[s.id]||[]).map(stepById).filter(q=>q&&!S.done[q.id]&&!SK()[q.id]);
const nextOpen=()=>steps().find(s=>!S.done[s.id]&&!SK()[s.id]&&!s.auto&&!blockers(s).length);
const holds=s=>{const m=PRE[S.activity]||PRE.cafe;return steps().filter(q=>(m[q.id]||[]).includes(s.id)&&!S.done[q.id])};
const sell=(tier,k)=>`<a class="up" href="#/tiers"><i>${t(tier)}</i><span>${t(k)}</span>${I.chev}</a>`;
const skipBtn=s=>SK()[s.id]?'':`<button class="skip" data-act="warn:${s.id}">${t('skip')}</button>`;
function skipSheet(s){if(S.warn!==s.id)return '';const hd=holds(s),fine=s.fine?aed(s.fine):(s.fineTxt?L(s.fineTxt):'');
  return `<div class="sheet-bg" data-act="closesheet"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t" tabindex="-1" data-stop="1"><h3 id="sheet-t">${t('skQ')}</h3><p class="body mt6">${L(s.t)}${t('sep')}${t('dueDay',{d:s.due}).toLowerCase()}</p>
  ${fine?`<p class="risk">${t('missed')}: ${fine}</p>`:''}${hd.length?`<p class="note">${t('skHolds')}: ${hd.map(q=>L(q.t)).join(t('sep'))}</p>`:''}<p class="note">${t('skKeep')}</p>${sell('pro','upSkip')}
  <button class="btn mt14" data-act="closesheet">${t('goBack')}</button><button class="btn sec mt8" data-act="skip:${s.id}">${t('skAny')}</button></div></div>`}
const hrefOf=s=>'#/'+(s.bank?'bank':'step/'+s.id);
const bizName=()=>rtl()&&S.biz===DEF_BIZ?DEF_BIZ_AR:S.biz;
const ic=(d,c='')=>`<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I={
  plan:ic('<path d="M5 6.5h14M5 12h14M5 17.5h8"/><circle cx="18" cy="17.5" r="1.4"/>'),
  cash:ic('<path d="M4 18V9M9.3 18V6M14.6 18v-6M20 18V4"/>'),
  rec:ic('<rect x="4" y="6" width="16" height="12" rx="1.5"/><path d="M12 9.3l.9 1.9 2 .2-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.2z" fill="currentColor" stroke="none"/>'),
  prov:ic('<path d="M4 9.5l1.4-4.5h13.2L20 9.5M5 9.5V19h14V9.5M4 9.5h16M10 19v-5h4v5"/>'),
  more:ic('<circle cx="5.5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="12" r="1.2" fill="currentColor"/>'),
  tick:ic('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  chev:ic('<path d="M9 6l6 6-6 6"/>','flip'),
  back:ic('<path d="M15 6l-6 6 6 6"/>','flip'),
  ext:ic('<path d="M14 5h5v5M19 5l-8 8M11 6H6v12h12v-5"/>','ext flip')
};
const STAR='M12 2.6l2.9 6.2 6.8.8-5 4.7 1.3 6.7-6-3.4-6 3.4 1.3-6.7-5-4.7 6.8-.8z';

/* ---------- drawn objects: stamp, ruler, plaque, licence ---------- */
let sid=0;
function stamp(o){const id='s'+(++sid),c=o.c||'#2845A6';
  return `<svg class="ltr" viewBox="0 0 120 120" role="img" aria-label="${o.label||''}"><defs><path id="${id}a" d="M19,60 A41,41 0 0 1 101,60"/><path id="${id}b" d="M13.5,60 A46.5,46.5 0 0 0 106.5,60"/></defs>
  <g fill="none" stroke="${c}"><circle cx="60" cy="60" r="57" stroke-width="2.6"/><circle cx="60" cy="60" r="52.6" stroke-width=".9"/><circle cx="60" cy="60" r="31.5" stroke-width=".9"/></g>
  <g fill="${c}" font-family="IBM Plex Sans,sans-serif" font-weight="600">
   <text font-size="8.6" letter-spacing="1.5"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">${o.top}</textPath></text>
   <text font-size="8.6" letter-spacing="1.5"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${o.bot}</textPath></text>
   <path transform="translate(8.6,54) scale(.5)" d="${STAR}"/><path transform="translate(99.4,54) scale(.5)" d="${STAR}"/>
   <text x="60" y="${o.sub?63:(o.ar?70:68.5)}" text-anchor="middle" font-size="${o.size||27}" font-family="${o.ar?'IBM Plex Sans Arabic,sans-serif':'IBM Plex Serif,serif'}" font-weight="${o.ar?700:600}" ${o.ar?'direction="rtl"':''}>${o.mid}</text>
   ${o.sub?`<text x="60" y="77" text-anchor="middle" font-size="8.6" font-family="IBM Plex Sans Arabic,sans-serif" direction="rtl">${o.sub}</text>`:''}
  </g></svg>`}
const doneStamp=d=>stamp({top:'DONE IN D100',bot:'DAY '+d+' OF 100',mid:'تمّ',ar:1,size:31,label:t('stDone',{d})});
const seal=()=>stamp({top:'THE 100-DAY PLAN',bot:'DUBAI',mid:'D100',size:19,sub:'مئة يوم',label:'D100'});

function ruler(){const W=354,H=46,x=d=>{const v=3+(d-1)/99*(W-6);return rtl()?W-v:v},st=steps();let s='',lab='';
  const flags={};st.filter(q=>q.hard).forEach(q=>flags[q.due]=S.done[q.id]?'#2845A6':'#C2311D');
  for(let d=1;d<=100;d++){const f=flags[d],h=f?17:d%10===0?11:d%5===0?7:4;
    s+=`<line x1="${x(d).toFixed(1)}" x2="${x(d).toFixed(1)}" y1="16" y2="${16+h}" stroke="${f||(d<=S.day?'#111318':'#B4B6BE')}" stroke-width="${f?2.6:1.2}"/>`;
    if(f)lab+=`<text x="${x(d).toFixed(1)}" y="45" font-size="10.5" font-weight="600" fill="${f}" text-anchor="middle">${d}</text>`}
  for(const d of [1,100])if(!flags[d])lab+=`<text x="${x(d).toFixed(1)}" y="45" font-size="10.5" fill="#555A66" text-anchor="${(d===1)!==rtl()?'start':'end'}">${d}</text>`;
  const tx=x(S.day);
  return `<svg class="ruler ltr" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('day')} ${S.day} ${t('of100')}" font-family="IBM Plex Sans,sans-serif">
  <line x1="${x(1)}" x2="${x(S.day)}" y1="16" y2="16" stroke="#111318" stroke-width="2.4"/><line x1="${x(S.day)}" x2="${x(100)}" y1="16" y2="16" stroke="#B4B6BE" stroke-width="1.2"/>
  ${s}<path d="M${tx-6} 2h12l-6 10z" fill="#111318"/>${lab}</svg>`}

function plaque(n,top,cap,fresh){const name=bizName(),arN=/[؀-ۿ]/.test(name),f=arN?'IBM Plex Sans Arabic,sans-serif':'IBM Plex Serif,serif',
  fz=Math.max(13,Math.min(27,Math.floor(262/(Math.max(6,name.length)*(arN?.56:.54)))));
  const st=[0,1,2,3,4].map(i=>{const k=rtl()?4-i:i,on=k<n;return `<path class="${fresh&&k===n-1?'pop':''}" transform="translate(${91+i*30},104) scale(1.05)" d="${STAR}" fill="${on?'#2B1E05':'none'}" stroke="#2B1E05" stroke-width="1.1" opacity="${on?.88:.38}"/>`}).join('');
  return `<svg class="plaque ltr" viewBox="0 0 330 196" role="img" aria-label="${n} / 5"><defs><linearGradient id="br" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6C878"/><stop offset=".5" stop-color="#C29A42"/><stop offset="1" stop-color="#A47C28"/></linearGradient></defs>
  <rect x="2" y="2" width="326" height="192" rx="9" fill="url(#br)"/><rect x="11" y="11" width="308" height="174" rx="5" fill="none" stroke="#2B1E05" stroke-opacity=".32"/>
  ${[[24,24],[306,24],[24,172],[306,172]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="4.2" fill="#8A6416"/><path d="M${c[0]-2.4} ${c[1]-1.2}l4.8 2.4" stroke="#2B1E05" stroke-opacity=".5"/>`).join('')}
  <text x="165" y="48" text-anchor="middle" font-family="IBM Plex Sans,IBM Plex Sans Arabic,sans-serif" font-weight="600" font-size="11.5" fill="#2B1E05" ${rtl()?'direction="rtl"':'letter-spacing="2"'}>${top}</text>
  <text x="165" y="86" text-anchor="middle" font-family="${f}" font-weight="${arN?700:600}" font-size="${fz}" fill="#231803" ${arN?'direction="rtl"':''}>${esc(name)}</text>
  ${st}<text x="165" y="160" text-anchor="middle" font-family="IBM Plex Sans,IBM Plex Sans Arabic,sans-serif" font-size="11.5" fill="#2B1E05" ${rtl()?'direction="rtl"':''}>${cap}</text></svg>`}

function qr(){let s='';const on=(x,y)=>((x*7+y*13+x*y)%3===0);
  for(let y=0;y<11;y++)for(let x=0;x<11;x++){const c=(x<3&&y<3)||(x>7&&y<3)||(x<3&&y>7);if(c||on(x,y))s+=`<rect x="${x*4}" y="${y*4}" width="4" height="4"/>`}
  return `<svg viewBox="0 0 44 44" aria-hidden="true" fill="#111318">${s}<rect x="4" y="4" width="4" height="4" fill="#fff"/><rect x="36" y="4" width="4" height="4" fill="#fff"/><rect x="4" y="36" width="4" height="4" fill="#fff"/></svg>`}
function licence(){const custom=S.biz!==DEF_BIZ,act=S.activity==='shop'?['Online shop','متجر إلكتروني']:['Café','مقهى'];
  const d=new Date();d.setDate(d.getDate()-(S.day-1));const iss=d.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'});
  const rows=[['Licence no.','رقم الرخصة','1284731'],
   ['Trade name','الاسم التجاري',custom?esc(S.biz):'Sidr Specialty Coffee L.L.C<br><span lang="ar" dir="rtl">سدر للقهوة المختصة ذ.م.م</span>'],
   ['Activity','النشاط',act[0]+'<br><span lang="ar" dir="rtl">'+act[1]+'</span>'],['Issue date','تاريخ الإصدار',iss]];
  return `<div class="lic" dir="ltr"><div class="lic-h"><span>Sample trade licence</span><span lang="ar" dir="rtl">نموذج رخصة تجارية</span></div>
  ${rows.map(r=>`<div class="lic-r"><span class="le">${r[0]}</span><span class="lv">${r[2]}</span><span class="la" lang="ar" dir="rtl">${r[1]}</span></div>`).join('')}
  <div class="lic-f">${qr()}<span>Sample only. Not an official document.<br><span lang="ar" dir="rtl">نموذج للتوضيح وليس مستندًا رسميًا.</span></span></div>
  <div class="lic-s">${seal()}</div></div>`}

/* ---------- pieces ---------- */
const langBtn=()=>`<button class="lang" data-act="lang" lang="${rtl()?'en':'ar'}">${t('other')}</button>`;
const bar=()=>`<header class="bar"><a class="wm" href="#/">D100</a><span class="who">${bd(esc(bizName()))}</span>${langBtn()}</header>`;
const sub=(label,back)=>`<header class="bar"><a class="back" href="#/${back||'more'}">${I.back}<span>${label}</span></a>${langBtn()}</header>`;
function tabs(on){const T=[['roadmap','tRoad',I.plan],['cash','tCash',I.cash],['stars','tStars',I.rec],['market','tMarket',I.prov],['more','tMore',I.more]];
  return `<nav class="tabs">${T.map(x=>`<a href="#/${x[0]}" class="${on===x[0]?'on':''}" ${on===x[0]?'aria-current="page"':''}>${x[2]}<span>${t(x[1])}</span></a>`).join('')}</nav>`}
/* foot = the action bar. It sits outside the scroller, between the view and the tab bar, so the main button and Skip are always fully on screen. */
const shell=(head,body,tab,foot)=>`<div class="proto">${t('proto')}</div>${head}<main class="view">${body}</main>${toast?`<div class="toast" role="status">${toast}</div>`:''}${foot?`<div class="actions" id="confirm">${foot}</div>`:''}${tabs(tab)}`;
const when=n=>n<0?t('late',{n:-n}):n===0?t('today'):t('inDays',{n});
function stText(s){
  if(S.done[s.id])return `<span class="st ok">${t('stDone',{d:S.done[s.id]})}</span>`;
  if(SK()[s.id])return `<span class="st due">${t('skipped')}</span>`;
  if(s.auto)return `<span class="st soft">${t('tracking')}</span>`;
  const n=s.due-S.day;
  if(blockers(s).length&&!s.fine)return `<span class="st soft">${t('lockS')}</span>`;
  if(s.fine)return `<span class="st due">${t('fine',{x:aed(s.fine)})}</span>`;
  if(n<0)return `<span class="st due">${when(n)}</span>`;
  if(n<=7)return `<span class="st">${when(n)}</span>`;
  return ''}
const stepRow=s=>`<a class="step${S.done[s.id]?' done':''}" href="#/${s.bank?'bank':'step/'+s.id}"><span class="dn num">${S.done[s.id]||s.due}</span><span><span class="tt">${L(s.t)}</span><span class="au">${L(A[s.a])}</span></span>${stText(s)||'<span></span>'}${I.chev}</a>`;
function opt(p,stepId){const on=stepId&&S.picks[stepId]===p.id,lock=!stepId||S.done[stepId],price=p.mo?t('mo',fmt(p.mo)):L(p.pt);
  const inner=`<span class="rd"></span><b>${bd(p.n)}</b><span class="pr">${price}</span><span class="ds">${L(p.b)}</span><span class="mt"><span>${t('rating',{r:p.r.toFixed(1),n:p.j})}</span>${p.g?`<span class="g">${t('grad')} ${'★'.repeat(p.g)}</span>`:''}<span class="mr">${t('proRate')}</span></span>`;
  return lock?`<div class="opt${on?' on':''}${stepId?'':' flat'}">${inner}</div>`:`<button class="opt" role="radio" aria-checked="${!!on}" data-act="pick:${stepId}:${p.id}">${inner}</button>`}
const whyText=s=>L(s.w).replace('{ct}',dateAt(1,3));
/* pinned: the phone landing page pins the main button in the action bar, so only the second link stays in the flow */
function landBody(pinned){return `<h1 class="hl"><span>${t('h1a')}</span> <span>${t('h1b')}</span></h1><p class="lede">${t('lede')}</p>${licence()}
  <div class="cta">${pinned?'':`<a class="btn" href="#/roadmap" data-act="begin">${t('start')}</a>`}<a class="link" href="#/start">${t('own')}</a></div>
  <h2>${t('datesT')}</h2><div class="dates">${[[14,'dt1','dc1',0],[45,'dt2','dc2',0],[90,'dt3','dc3',1]].map(d=>`<div><b class="num"><span class="dk">${t('dayK')}</span>${d[0]}</b><span><strong>${t(d[1])}</strong><small class="${d[3]?'r':''}">${t(d[2])}</small></span></div>`).join('')}</div>
  <h2 class="looph">${t('loopT')}</h2><ol class="loop"><li><b>1</b>${t('loop1')}</li><li><b>2</b>${t('loop2')}</li><li><b>3</b>${t('loop3')}</li></ol>
  <div class="proof"><span>${t('proof1')}</span><span>${t('proof3')}</span><span>${t('partners')}</span></div>${LOGOS.cbd?`<div class="byc"><img src="${LOGOS.cbd}" width="118" height="26" alt="Commercial Bank of Dubai"><span>${t('byCbd')}</span></div>`:''}`}

/* ---------- screens ---------- */
const SC={
landing(){return `<div class="proto">${t('proto')}</div><main class="land"><div class="top"><span class="wm">D100</span>${langBtn()}</div>${landBody(1)}</main>
  <div class="actions end"><a class="btn" href="#/roadmap" data-act="begin">${t('start')}</a></div>`},

start(){const O=S._ob||(S._ob={licence:'mainland',activity:'cafe',emirati:true,capital:150000,biz:''});O.capital=Math.max(CAP[0],Math.min(CAP[1],+O.capital||150000));
  const r=(k,v,l,s,dis)=>dis?`<div class="opt off"><span class="rd"></span><b>${l}</b><span class="ds">${s}</span></div>`
    :`<button class="opt" role="radio" aria-checked="${O[k]===v}" data-act="ob:${k}:${v}"><span class="rd"></span><b>${l}</b>${s?`<span class="ds">${s}</span>`:''}</button>`;
  return `<div class="proto">${t('proto')}</div>${sub(wide?t('tRoad'):'D100',wide?'roadmap':'')}<main class="view">
  <h1>${t('obT')}</h1><p class="lede">${t('obS')}</p>
  <fieldset><legend>${t('q1')}</legend><div class="opts" role="radiogroup">${r('licence','mainland',t('q1a'),t('q1as'))}${r('licence','fz',t('q1b'),t('q1bs'),1)}</div></fieldset>
  <fieldset><legend>${t('q2')}</legend><div class="opts" role="radiogroup">${r('activity','cafe',t('q2a'))}${r('activity','shop',t('q2b'))}${r('activity','tours',t('q2c'),t('q2cs'),1)}</div></fieldset>
  <fieldset><legend>${t('q3')}</legend><div class="opts" role="radiogroup">${r('emirati',true,t('q3a'))}${r('emirati',false,t('q3b'))}</div></fieldset>
  <fieldset><legend>${t('q4')}</legend><input id="capn" type="text" inputmode="numeric" autocomplete="off" dir="ltr" data-min="${CAP[0]}" data-max="${CAP[1]}" value="${fmt(O.capital)}" aria-label="${t('q4')}">
   <input id="cap" type="range" min="${CAP[0]}" max="${CAP[1]}" step="5000" value="${O.capital}" aria-label="${t('q4')}"><div class="caprow num"><span>${fmt(CAP[0])}</span><span>${fmt(CAP[1])}</span></div></fieldset>
  <fieldset><label class="lbl" for="biz">${t('q5')}</label><input id="biz" type="text" maxlength="40" autocomplete="off" placeholder="${DEF_BIZ}" value="${esc(O.biz)}"><p class="note">${t('obNote')}</p></fieldset></main>
  <div class="actions end"><button class="btn" data-act="build">${t('build')}</button></div>`},

building(){return `<div class="proto">${t('proto')}</div><div class="building"><div class="seal">${seal()}</div><p>${t('b1')}</p><p>${t('b2')}</p><p>${t('b3')}</p></div>`},

roadmap(){const st=steps(),nx=nextOpen(),done=st.filter(s=>S.done[s.id]),sk=st.filter(s=>SK()[s.id]&&!S.done[s.id]),left=st.filter(s=>!S.done[s.id]&&!SK()[s.id]&&(!nx||s.id!==nx.id)),hard=st.find(s=>!S.done[s.id]&&s.hard);
  let h=`<div class="dayhead"><div class="d"><small>${t('day')}</small><span class="num">${S.day}</span> <i>${t('of100')}</i></div>
   <div class="m"><b>${t('stepsDone',{n:done.length,m:st.length})}</b>${hard?`${t('nextDue')}: ${t('dueDay',{d:hard.due})}`:''}</div></div>${ruler()}`;
  if(nx){const n=nx.due-S.day;h+=`<section class="next"><div class="k"><span>${t('doNext')}</span><span class="${n<=1?'r':''}">${t('dueDay',{d:nx.due})}${t('sep')}${when(n).toLowerCase()}</span></div>
   <h3>${L(nx.t)}</h3><p>${sents(whyText(nx))[0]}</p><a class="btn" href="#/${nx.bank?'bank':'step/'+nx.id}">${t('openStep')}</a></section>`}
  else if(sk.length)h+=`<section class="next"><h3>${t('skLeft',{n:sk.length})}</h3><a class="btn" href="${hrefOf(sk[0])}">${t('openStep')}</a></section>`;
  else h+=`<section class="next"><h3>${t('allDone')}</h3><a class="btn" href="#/day100">${t('mDay')}</a></section>`;
  if(sk.length)h+=`<h2 class="sk">${t('skT')} (${sk.length})</h2>${sk.map(stepRow).join('')}`;
  if(left.length){h+=`<h2>${t('todoT')}</h2>`;for(let p=1;p<=4;p++){const it=left.filter(x=>x.ph===p);if(it.length)h+=`<div class="ph${p===left[0].ph?' first':''}"><b>${t(PH[p].k)}</b><span>${t('days',{a:PH[p].a,b:PH[p].b})}</span></div>${it.map(stepRow).join('')}`}}
  if(done.length)h+=`<details class="donelist"><summary><span>${t('doneT')} (${done.length})</span></summary>${done.map(stepRow).join('')}</details>`;
  return shell(bar(),h,'roadmap')},

step(id){const st=steps(),s=stepById(id)||nextOpen()||st[0],dn=S.done[s.id],pv=s.cat?P[s.cat]:null,pk=S.picks[s.id],n=s.due-S.day,fine=s.fine?aed(s.fine):(s.fineTxt?L(s.fineTxt):''),
   lk=U(LINK[s.a]),pre=blockers(s),w=sents(whyText(s)),own=pk==='own',okPick=pk&&(!own||(OWN[s.id]||'').trim()),seen=VIS[s.id];
  const learn=`<details class="learn"><summary>${t('learn')}</summary>${w.length>1?`<p>${w.slice(1).join(' ')}</p>`:''}<b>${t('need')}</b><ul>${s.d.map(x=>`<li>${L(x)}</li>`).join('')}</ul>${pv?`<p class="note">${t('rank')}</p><p class="note">${t('sample')}</p>`:''}${s.soft?`<p class="note">${t('sampleStep')}</p>`:''}<p class="note">${t('pilotNote')}</p></details>`;
  let foot='',h=`${dn?`<div class="stampbox">${doneStamp(dn)}</div>`:''}<p class="meta"><b>${t('stepOf',{i:st.indexOf(s)+1,m:st.length})}</b>${t('sep')}${t('dueDay',{d:s.due}).toLowerCase()}${dn||s.auto?'':t('sep')+when(n).toLowerCase()}</p><h1>${L(s.t)}</h1>
   <p class="body">${w[0]}</p>${fine?`<p class="risk">${t('missed')}: ${fine}</p>`:''}${!dn&&SK()[s.id]?`<p class="note">${t('skOn',{d:SK()[s.id]})}</p>`:''}`;
  if(dn){const nx=nextOpen();h+=`<p class="note">${t('doneOn',{d:dn})}${pk&&pv?t('sep')+bd(esc(own?OWN[s.id]||'':(pv.find(p=>p.id===pk)||{}).n||'')):''}</p>${nx?`<a class="btn mt16" href="${hrefOf(nx)}">${t('cont',{t:L(nx.t)})}</a>`:''}${learn}`}
  else if(s.auto)h+=`<p class="note">${t('tracking')}</p>${learn}`;
  else if(pre.length)h+=`<div class="lock"><b>${t('lockT')}</b>${pre.map(q=>`<a class="link" href="${hrefOf(q)}">${L(q.t)}</a>`).join('')}</div>${skipBtn(s)}${learn}`;
  else{
   if(pv)h+=`<h2>${t('choose')}</h2><div class="opts" role="radiogroup">${pv.map(p=>opt(p,s.id)).join('')}<button class="opt" role="radio" aria-checked="${own}" data-act="pick:${s.id}:own"><span class="rd"></span><b>${t('ownP')}</b></button></div>
     ${own?`<input id="own" data-step="${s.id}" type="text" maxlength="40" placeholder="${t('ownPh')}" value="${esc(OWN[s.id]||'')}" class="mt10">`:''}`;
   if(lk)h+=`<a class="btn${seen?' sec':''} mt18" href="${lk}" target="_blank" rel="noopener" data-act="visit:${s.id}">${t('openSite',{n:bd(L(A[s.a]))})}${I.ext}</a><p class="note">${t('goesTo',{h:bdl(hostOf(lk))})}</p>`;
   h+=learn;foot=`<button class="btn${lk&&!seen?' sec':''}" data-act="done:${s.id}" ${pv&&!okPick?'disabled':''}>${pv?(okPick?t('confirmPick'):t('pickFirst')):(lk&&!seen?t('already'):t('iDid'))}</button>${skipBtn(s)}`}
  return shell(sub(t('tRoad'),'roadmap'),h,'roadmap',foot)+skipSheet(s)},

bank(){const st=steps(),dn=S.done.s2,pk=S.bankPick||'up',bk=BANKS.find(x=>x.id===pk)||BANKS[0],seen=VIS.s2,nx=nextOpen();
  let foot='',h=`${dn?`<div class="stampbox">${doneStamp(dn)}</div>`:''}<p class="meta"><b>${t('stepOf',{i:2,m:st.length})}</b>${t('sep')}${t('dueDay',{d:7}).toLowerCase()}</p><h1>${t('bankT')}</h1><p class="body">${L(st[1].w)}</p>${!dn&&SK().s2?`<p class="note">${t('skOn',{d:SK().s2})}</p>`:''}`;
  if(dn)h+=`<p class="note">${t('bkDone',{d:dn})}</p>${nx?`<a class="btn mt16" href="${hrefOf(nx)}">${t('cont',{t:L(nx.t)})}</a>`:''}`;
  else h+=`<div class="banks" role="radiogroup">${BANKS.map(x=>`<button class="bk" role="radio" aria-checked="${pk===x.id}" data-act="bankpick:${x.id}">${LOGOS[x.id]?`<img${x.id==='up'?' class="dk"':''} src="${LOGOS[x.id]}" width="${x.w}" height="${x.h}" alt="${x.n}">`:`<span class="mono">${x.m}</span><span>${x.n}</span>`}${x.rec?`<small>${t('recommended')}</small>`:''}</button>`).join('')}</div>
   <p class="note mt8">${pk==='up'?t('propPartner')+'. ':''}${t('notPartners')}</p>
   <a class="btn${seen?' sec':''} mt16" href="${U(bk.u)}" target="_blank" rel="noopener" data-act="visit:s2">${t('openSite',{n:bd(bk.n)})}${I.ext}</a><p class="note">${t('goesTo',{h:bdl(hostOf(U(bk.u)))})}</p>
   <details class="learn"><summary>${t(pk==='up'?'bkWhat':'learn')}</summary>${pk==='up'?`<ul>${['bk1','bk2','bk3'].map(k=>`<li>${t(k)}</li>`).join('')}</ul><p class="note">${t('bkSrc')}</p>`:`<p>${t('anyP')}</p>`}</details>`,foot=`<button class="btn${seen?'':' sec'}" data-act="done:s2">${seen?t('iDid'):t('already')}</button>${skipBtn(st[1])}`;
  return shell(sub(t('tRoad'),'roadmap'),h,'roadmap',foot)+skipSheet(st[1])},

cash(){const b=bal(S.day),m=monthly(),z=zeroDay(),up=ONEOFF.filter(o=>o.d>S.day),upSum=up.reduce((a,o)=>a+o.a,0),R=rtl();
  const W=354,H=168,px=d=>{const v=3+(d-1)/99*(W-6);return R?W-v:v},top=Math.max(S.capital,bal(100,true)),py=v=>24+(1-Math.max(0,v)/top)*(H-52);
  const line=(a,z2,sl)=>{let p='';for(let d=a;d<=z2;d++){const v=bal(d,sl);p+=(p?'L':'M')+px(d).toFixed(1)+' '+py(v).toFixed(1);if(v<0)break}return p};
  const y0=py(0),endN=z||100,as=R?'end':'start',ae=R?'start':'end';
  const svg=`<svg class="ltr" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('bal')}" font-family="IBM Plex Sans,IBM Plex Sans Arabic,sans-serif" font-size="10.5">
   <line x1="3" x2="${W-3}" y1="${y0}" y2="${y0}" stroke="#111318" stroke-width="1.2"/>
   ${Array.from({length:100},(_,i)=>i+1).map(d=>`<line x1="${px(d).toFixed(1)}" x2="${px(d).toFixed(1)}" y1="${y0}" y2="${y0+(d%10===0?7:d%5===0?5:3)}" stroke="#B4B6BE" stroke-width="1"/>`).join('')}
   <line x1="${px(OPEN)}" x2="${px(OPEN)}" y1="18" y2="${y0}" stroke="#B4B6BE" stroke-dasharray="2 3"/>
   <text x="${px(OPEN)}" y="12" fill="#555A66" text-anchor="middle">${t('opens')}${t('sep')}${t('day').toLowerCase()} ${OPEN}</text>
   <text x="${px(1)}" y="${py(S.capital)-8}" fill="#555A66" text-anchor="${as}">${fmt(S.capital)}</text>
   <text x="${px(100)}" y="${py(bal(100,true))-8}" fill="#2845A6" font-weight="600" text-anchor="${ae}">${fmt(bal(100,true))}</text>
   <path d="${line(S.day,100,true)}" fill="none" stroke="#2845A6" stroke-width="2.2" stroke-dasharray="6 4"/>
   <path d="${line(S.day,endN,false)}" fill="none" stroke="#C2311D" stroke-width="2.2" stroke-dasharray="6 4"/>
   <path d="${line(1,S.day,false)}" fill="none" stroke="#111318" stroke-width="2.6" stroke-linejoin="round"/>
   <circle cx="${px(S.day)}" cy="${py(b)}" r="4.5" fill="#111318" stroke="#F4F4F1" stroke-width="2"/>
   ${[1,25,50,75,100].map(d=>`<text x="${px(d)}" y="${H-3}" fill="#555A66" text-anchor="${d===1?as:d===100?ae:'middle'}">${d}</text>`).join('')}</svg>`;
  const rows=[['rent',7500],['team',14000],['supplies',6200],['other2',3800]];
  const h=`<p class="say">${z&&z<=110?t('cashRun',{z}):t('cashOk')}</p><p class="lede m0">${t('cashPlan')}</p>
  <div class="figs"><div><small>${t('bal')}</small><b>${aed(b)}</b></div><div><small>${t('costs')}</small><b>${fmt(m)}</b></div><div><small>${t('runway')}</small><b>${(b/m).toFixed(1)} ${t('months')}</b></div></div>
  <div class="chart">${svg}<div class="legend"><span><i></i>${t('lgA')}</span><span><i class="p1"></i>${t('lgP')}</span><span><i class="p2"></i>${t('lgN')}</span></div></div>
  ${z&&z<=110?`<div class="sees"><b>${t('seeT')}</b>${t('seeP',{a:fmt(upSum),f:up.length?up[0].d:S.day,l:up.length?up[up.length-1].d:S.day,z,w:fmt(m/30*7)})}</div>`:`<div class="sees ok"><b>${t('seeT')}</b>${t('seeOk')}</div>`}
  ${sell('pro','upCash')}
  ${up.length?`<h2>${t('coming')}</h2><div class="rows">${up.map(o=>`<div><span>${t(o.k)}<small>${t('dueDay',{d:o.d})}</small></span><span class="amt">${aed(o.a)}</span></div>`).join('')}</div>`:''}
  <h2>${t('where')}</h2><div class="rows">${rows.map(r=>`<div><span>${t(r[0])}</span><span class="amt">${aed(r[1])}</span></div>`).join('')}
   ${S.extra.map(x=>`<div class="new"><span>${bd(x.n)}<small>${t('added')}</small></span><span class="amt">${aed(x.mo)}</span></div>`).join('')}</div>
  <p class="note">${t('src')}</p>`;
  return shell(bar(),h,'cash')},

stars(){const sc=score(),n=starsOf(sc),nxt=THR[n],cr=CREDIT[n],nx=nextOpen(),un=['u1','u2','u3','u4','u5'];
  const h=`${S.unlock?`<div class="unlock"><b>${t('earned',{n})}</b><span>${t('earnedP',{s:sc,t:L((stepById(S.unlockStep)||stepById('s7')).t)})}</span>${nx?`<a class="btn" href="${hrefOf(nx)}">${t('cont',{t:L(nx.t)})}</a>`:''}</div>`:''}
  <h1>${t('recT')}</h1><p class="lede">${t('plaqueSo')}</p>${plaque(n,'D100',t('day')+' '+S.day+' '+t('of100'),S.unlock)}
  <div class="scoreline"><b class="num">${sc}<small> ${t('of100')}</small></b><span>${nxt?t('nextStar',{p:nxt-sc,n:n+1}):t('top')}</span></div>
  <div class="meter"><span data-w="${sc}"></span>${THR.map((x,i)=>`<i data-x="${x}"></i><em class="${sc>=x?'hit':''}" data-x="${x}">${i+1}★</em>`).join('')}</div>
  ${nxt&&nx?`<div class="rows"><a href="#/${nx.bank?'bank':'step/'+nx.id}"><span>${t('nextHow',{t:L(nx.t)})}</span><span class="amt">${plus(6)} ${I.chev.replace('class="ico','class="ico inl')}</span></a></div>`:''}
  <section class="credit"><small>${t('credit')}</small>${cr?`<p>${t('creditNow')}</p><b class="num">${aed(cr)}</b><p>${CREDIT[n+1]?t('creditNext',{n:n+1,x:fmt(CREDIT[n+1])})+' ':''}${t('illus')}</p>`:`<p>${t('creditNone')}</p>`}</section>
  ${sell('exec','upStar')}<div class="gap14"></div>${S.unlock?`<a class="btn sec" href="#/cash">${t('seeCash')}</a>`:''}
  <h2>${t('unlockT')}</h2><div class="rows">${un.map((k,i)=>`<div class="start${i+1===n?' cur':(i+1>n?' dim':'')}"><span class="sn">${'★'.repeat(i+1)}</span><span>${t(k)}</span></div>`).join('')}</div>
  <h2>${t('earnT')}</h2><div class="rows"><div><span>${t('e1')}</span><span class="amt">${plus(6)}</span></div><div><span>${t('e2')}</span><span class="amt">${plus(1)}</span></div><div><span>${t('e3')}</span><span class="amt">${plus(5)}</span></div></div>
  <p class="note">${t('noBuy')}</p>`;
  return shell(bar(),h,'stars')},

market(){const C=Object.keys(P);
  const h=`<h1>${t('mkT')}</h1><p class="aside">${t('mkBan')}</p>
  <div class="cats" role="tablist">${C.map(c=>`<button role="tab" aria-selected="${cat===c}" data-act="cat:${c}">${t('c_'+c)}</button>`).join('')}</div>
  <div class="opts">${P[cat].map(p=>opt(p,null)).join('')}</div>
  <h2>${t('mkHow')}</h2><p class="body">${t('mkHowP')} ${t('rank')}</p><p class="note">${t('sample')}</p>`;
  return shell(bar(),h,'market')},

programmes(){const list=PROG.filter(p=>!p.em||S.emirati),sh=S.sheet&&PROG.find(p=>p.id===S.sheet),sc=score();
  const h=`<h1>${t('prT')}</h1><p class="lede">${t('prS')}</p>`+list.map(p=>`<article class="prog"><small>${t('exMatch')}</small><h3>${L(p.n)}</h3><span class="by">${L(p.by)}</span><p>${L(p.p)}</p>
   <p class="why">${t('prWhy')}: ${L(p.y)}</p><button class="btn sec" data-act="sheet:${p.id}">${t('prGo')}</button></article>`).join('');
  let page=shell(sub(t('tMore')),h,'more');
  if(sh)page+=`<div class="sheet-bg" data-act="closesheet"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t" tabindex="-1" data-stop="1"><h3 id="sheet-t">${L(sh.n)}</h3><p class="note m0">${t('shT')}</p>
   <dl class="dl"><dt>${t('shBiz')}</dt><dd>${bd(esc(bizName()))}</dd><dt>${t('shLic')}</dt><dd>${t('q1a')}</dd><dt>${t('shAct')}</dt><dd>${t(S.activity==='shop'?'q2b':'q2a')}</dd>
   <dt>${t('shOwn')}</dt><dd>${t(S.emirati?'q3a':'q3b')}</dd><dt>${t('shDay')}</dt><dd>${S.day}</dd><dt>${t('shRec')}</dt><dd>${'★'.repeat(starsOf(sc))||'–'} ${sc}</dd></dl>
   <p class="note m12">${t('shNote')}</p>${PLINK[sh.id]?`<a class="btn mb8" href="${PLINK[sh.id]}" target="_blank" rel="noopener">${t('openSite',{n:bd(L(sh.by))})}${I.ext}</a>`:''}<button class="btn sec" data-act="closesheet">${t('close')}</button></div></div>`;
  return page},

nudges(){const h=`<h1>${t('ngT')}</h1><p class="lede">${t('ngS')}</p><div class="thread">
  <div class="msg"><small>${t('dueDay',{d:30})}</small>${t('n1')}</div><div class="msg"><small>${t('dueDay',{d:35})}</small>${t('n2')}</div>
  <div class="msg"><small>${t('ngToday')}</small>${t('n3')}<br><a class="link" href="#/step/s7">${t('n3a')}</a></div>
  <div class="msg later"><small>${t('sched')}</small>${t('n4')}</div></div>
  <h2>${t('chan')}</h2><div class="rows"><div><span>${t('wa')}<small>${t('pro')}</small></span><span class="sw off"></span></div><div><span>${t('em')}</span><span class="sw"></span></div>
  <div><span>${t('hot')}<small>${t('hotS')}</small></span><span class="sw off"></span></div></div>${sell('pro','upMsg')}`;
  return shell(sub(t('tMore')),h,'more')},

tiers(){const li=a=>a.map(k=>`<li>${I.tick}<span>${t(k)}</span></li>`).join('');
  const h=`<h1>${t('tiT')}</h1><p class="lede">${t('tiS')}</p>
  <section class="tier"><header><b>${t('free')}</b><span class="p num">${aed(0)}</span></header><ul>${li(['f1','f2','f3','f4'])}</ul></section>
  <section class="tier"><header><b>${t('pro')}</b><span class="p num">${aed(149)} <small>${t('perMo')}</small></span></header><ul>${li(['pp1','pp2','pp3','pp4','pp5'])}</ul></section>
  <section class="tier"><header><b>${t('exec')}</b><span class="p num">${aed(999)} <small>${t('perMo')}</small></span></header><ul>${li(['x1','x2','x3','x4'])}</ul></section>
  <section class="tier em"><header><b>${t('emT')}</b></header><ul>${li(['em1','em2'])}</ul></section><p class="note">${t('tiNote')}</p>`;
  return shell(sub(t('tMore')),h,'more')},

day100(){const h=`<h1>${t('dT')}</h1><p class="lede">${t('dS',{b:bd(esc(bizName()))})}</p>${plaque(4,t('gradOf'),t('gradWhen',{m:dateAt(100,0,{month:'long',year:'numeric'})}))}
  <h2>${t('after')}</h2><div class="rows"><div><span>${t('a1')}</span></div><div><span>${t('a2')}</span></div><div><span>${t('a3')}</span></div></div>
  ${sell('exec','upDay')}<button class="btn mt18" data-act="toast:becomeT">${t('become')}</button>`;
  return shell(sub(t('tMore')),h,'more')},

more(){const r=(href,l,act)=>`<a href="${href}" ${act?`data-act="${act}"`:''}><span>${l}</span>${I.chev}</a>`;
  const h=`<h1>${t('mT')}</h1>
  <div class="rows mt12">${r('#/programmes',t('mProg'))}${r('#/nudges',t('mNudge'))}${r('#/tiers',t('mPlans'))}${r('#/day100',t('mDay'))}${r('#/bank',t('mBank'))}${r('#/shots',t('mShots'))}</div>
  <h2>${t('mDemo')}</h2><div class="rows">${r('#/roadmap',t('mReset'),'reset')}${r('#/start',t('mFresh'))}${S.day<37?r('#/roadmap',t('mJump'),'jump'):''}</div>
  <p class="note">${t('partners')}</p>`;
  return shell(bar(),h,'more')}
};

/* ---------- desktop left column ---------- */
function pitch(){$('#pitch').innerHTML=`<div class="ptop"><span class="wm">D100</span><span class="note m0">${t('concept')}</span></div>${landBody()}
  <div class="pfoot"><a class="link" href="#/shots">${t('all')}</a><button class="link" data-act="lang">${t('other')}</button></div>`}

/* ---------- router ---------- */
const ORDER=['landing','start','roadmap','step','bank','cash','stars','market','programmes','nudges','tiers','day100'];
function parse(h){const raw=(h==null?location.hash:h).replace(/^#\/?/,''),[path,qs]=raw.split('?'),seg=path.split('/').filter(Boolean),q=new URLSearchParams(qs||'');return{name:seg[0]||'',arg:seg[1],q}}
function html(name,arg){if(name==='step')return SC.step(arg||'s7');return (SC[name]||SC.roadmap)()}
function render(){
  const r=parse();
  /* ?lang= and the ?s= demo states apply once per link, not on every re-render, so a sheet opened by ?s=warn can be closed */
  if(location.hash!==applied){applied=location.hash;
  if(r.q.get('lang'))lang=r.q.get('lang')==='ar'?'ar':'en';
  if(r.q.get('s')==='after'&&!S.done.s7){S.picks.s7='rateb';S.extra=[{n:'Rateb Payroll',mo:150}];S.done.s7=S.day;S.unlock=3;S.unlockStep='s7'}
  if(r.q.get('s')==='slam')S.slam={day:S.day};
  if(r.q.get('s')==='new'&&S.day!==1)S=fresh({biz:DEF_BIZ,activity:'cafe',emirati:true,capital:150000});
  if(r.q.get('s')==='skip'&&!S.done.s7)SK().s7=S.day;
  if(r.q.get('s')==='warn')S.warn=r.arg||'s7';}
  document.documentElement.lang=lang;document.documentElement.dir=rtl()?'rtl':'ltr';
  wide=matchMedia(WIDE).matches;sid=0;
  const app=$('#app');app.dir=rtl()?'rtl':'ltr';
  if(r.name==='shots'){document.body.classList.add('is-shots');shots();return}
  document.body.classList.remove('is-shots');
  const name=r.name||(wide?'roadmap':'landing');
  if(name==='building')setTimeout(()=>{if(parse().name==='building')go('#/roadmap')},2600);
  if(name!=='programmes')S.sheet=null;
  if(name!=='step'&&name!=='bank')S.warn=null;
  if(name!=='stars'&&name!=='cash')S.unlock=0;
  /* remember where each screen was scrolled to; give it back on a re-render of the same screen and on the way back to it */
  const key=name+(r.arg||''),old=$('.view',app)||$('.land',app);
  if(old&&app.dataset.route){const d=$('details.donelist',app);SCR[app.dataset.route]={y:old.scrollTop,open:!!(d&&d.open)}}
  const mem=(app.dataset.route===key||goingBack)?SCR[key]:null;goingBack=false;
  app.innerHTML=html(name,r.arg)+(S.slam?`<div class="slam">${doneStamp(S.slam.day)}</div>`:'');
  app.dataset.route=key;paint(app);
  /* an open sheet is a modal dialog: the screen behind is inert and does not scroll, and focus moves into the sheet */
  const sheet=$('.sheet',app);app.classList.toggle('has-sheet',!!sheet);
  if(sheet){for(const ch of app.children)if(!ch.classList.contains('sheet-bg'))ch.setAttribute('inert','');if(!sheet.contains(document.activeElement))try{sheet.focus({preventScroll:true})}catch(e){sheet.focus()}}
  if(mem&&mem.open){const d=$('details.donelist',app);if(d)d.open=true}
  const v=$('.view',app)||$('.land',app);if(v&&mem)v.scrollTop=mem.y;
  pitch();save();
}
/* sizes that depend on data are set through the CSSOM: the Content-Security-Policy does not allow style attributes */
function paint(root){root.querySelectorAll('[data-w]').forEach(e=>{e.style.width=e.dataset.w+'%'});root.querySelectorAll('[data-x]').forEach(e=>{e.style[rtl()?'right':'left']=e.dataset.x+'%'})}
function shots(){const el=$('#shots');el.dir=rtl()?'rtl':'ltr';
  el.innerHTML=`<header><h1>${t('shotsT')}</h1><div class="cta"><button class="link" data-act="lang">${t('other')}</button><a class="btn" href="#/">${t('backApp')}</a></div></header>
  <div class="shots-grid">${ORDER.map((n,i)=>`<div class="shot"><div class="shot-frame" role="link" tabindex="0" data-act="open:${n==='step'?'step/s7':n}" aria-label="${t('n_'+n)}"><div class="app" dir="${rtl()?'rtl':'ltr'}">${html(n,'s7')}</div></div><p dir="${rtl()?'rtl':'ltr'}">${i+1}. ${t('n_'+n)}</p></div>`).join('')}</div>`;paint(el)}
/* the toast is a row of the shell above the action bar, so it cannot cover a button. It is removed in place: a re-render would drop focus and close the keyboard. */
function say(k){toast=t(k);clearTimeout(toastT);toastT=setTimeout(()=>{toast=null;const el=$('#app .toast');if(el)el.remove()},2600)}
function go(h){if(location.hash===h)render();else location.hash=h}

/* live links: the official site opens in a new tab. The button turns into "Done. Stamp it" when the judge comes back, which the browser reports
   with visibilitychange (tab switch), pageshow (back from a same-tab visit) or focus. The visit is saved first, so it also survives iOS reloading the tab.
   The timer only covers a browser that never left the page, e.g. a blocked pop-up. */
let away=null,awayT=0,hold=0;
function returned(){if(!away)return;away=null;clearTimeout(awayT);render()}
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(away)away.hid=true}else returned()});
addEventListener('pageshow',e=>{if(e.persisted)render();else returned()});
addEventListener('focus',()=>{if(away&&away.hid&&!document.hidden)returned()});
/* double-tap guard: for a third of a second after a stamp or a skip, taps do nothing. The second tap of a double tap would otherwise land on whatever
   has just appeared under the finger: the next step's Skip, or the tab under the sheet's last button. */
document.addEventListener('click',e=>{if(Date.now()<hold){e.preventDefault();e.stopPropagation()}},true);
/* sheets: opening one adds a history entry, so the phone's back button closes it. Closing by button, backdrop or Escape takes that entry away again. */
function shut(){if(!S.warn&&!S.sheet)return;S.warn=null;S.sheet=null;render();const o=opener&&$('#app [data-act="'+opener+'"]');if(o)o.focus()}
function closeSheet(){if(history.state&&history.state.sheet)history.back();else shut()}
addEventListener('popstate',e=>{if(!(e.state&&e.state.sheet))shut()});
document.addEventListener('click',e=>{
  /* a link inside a sheet replaces the sheet's history entry instead of stacking on it */
  const inSheet=e.target.closest('.sheet a[href^="#/"]');if(inSheet&&history.state&&history.state.sheet){e.preventDefault();S.warn=null;S.sheet=null;location.replace(inSheet.getAttribute('href'));return}
  /* in-app Back: go back in history when the plan is the previous entry, otherwise replace this entry. Either way no new entry, so the phone's back button never bounces to the step again. */
  const bk=e.target.closest('a.back');if(bk&&!e.metaKey&&!e.ctrlKey){e.preventDefault();const h=bk.getAttribute('href'),n=TRAIL.length;
    if(n>1&&TRAIL[n-2]===keyOf(h))history.back();else{TRAIL.pop();goingBack=true;location.replace(h)}return}
  const el=e.target.closest('[data-act]');if(!el)return;
  if(e.target.closest('[data-stop]')&&el.classList.contains('sheet-bg'))return;
  const [a,b,c]=el.dataset.act.split(':');
  if(a==='lang'){lang=rtl()?'en':'ar';if(location.hash.includes('lang=')){e.preventDefault();go(location.hash.replace(/([?&])lang=\w+/,'$1lang='+lang));return}render();return}
  if(a==='open'){go('#/'+el.dataset.act.slice(5));return}
  if(a==='begin'){if(!S.touched){S=demo();CK={};VIS={};OWN={}}toast=null;setTimeout(render,0);return}
  if(a==='reset'){S=demo();CK={};VIS={};OWN={};toast=null;wipe();setTimeout(render,0);return}
  if(a==='jump'){S=demo({biz:S.biz,activity:S.activity,emirati:S.emirati,capital:S.capital});setTimeout(render,0);return}
  if(a==='ob'){const O=S._ob,i=$('#biz');if(i)O.biz=i.value;O[b]=c==='true'?true:c==='false'?false:(b==='capital'?+c:c);render();return}
  if(a==='build'){const O=S._ob||{},i=$('#biz'),biz=(i&&i.value.trim())||DEF_BIZ;
    S=fresh({biz,activity:O.activity||'cafe',emirati:O.emirati!==false,capital:O.capital||150000,touched:1});CK={};VIS={};OWN={};go('#/building');return}
  if(a==='cat'){cat=b;render();return}
  if(a==='pick'){S.touched=1;S.picks[b]=c;render();if(c==='own'){const o=$('#own');if(o)o.focus()}return}
  if(a==='visit'){S.touched=1;VIS[b]=1;save();away={hid:document.hidden};clearTimeout(awayT);awayT=setTimeout(()=>{if(away&&!away.hid&&!document.hidden)returned()},1500);return}
  if(a==='check'){CK[b]=!CK[b];render();return}
  if(a==='bankpick'){S.touched=1;S.bankPick=b;render();return}
  if(a==='sheet'||a==='warn'){if(a==='sheet')S.sheet=b;else S.warn=b;opener=el.dataset.act;try{history.pushState({sheet:1},'')}catch(e){}render();return}
  if(a==='closesheet'){closeSheet();return}
  if(a==='skip'){S.touched=1;SK()[b]=S.day;S.warn=null;const nx=nextOpen(),dest=nx?hrefOf(nx):'#/roadmap';say('toastSkip');hold=Date.now()+350;
    if(history.state&&history.state.sheet&&location.hash!==dest)location.replace(dest);else go(dest);return}
  if(a==='toast'){say(b);render();return}
  if(a==='done'){if(S.slam)return;const s=stepById(b);if(blockers(s).length)return;const before=starsOf(score());S.touched=1;S.done[b]=S.day;delete SK()[b];
    if(s.cat&&S.picks[b]){const p=P[s.cat].find(x=>x.id===S.picks[b]);if(p&&p.mo)S.extra.push({n:p.n,mo:p.mo})}
    const after=starsOf(score()),calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
    S.slam={day:S.day};render();
    setTimeout(()=>{S.slam=null;hold=Date.now()+350;if(after>before){S.unlock=after;S.unlockStep=b;go('#/stars')}else{const nx=nextOpen();say('toastDone');go(nx?hrefOf(nx):'#/roadmap')}},calm?600:1250);
    return}
});
document.addEventListener('input',e=>{const el=e.target;
  if(el.id==='biz'&&S._ob){S._ob.biz=el.value;save()}
  if(el.id==='own'){OWN[el.dataset.step]=el.value;save();const k=$('#confirm .btn');if(k){const ok=!!el.value.trim();k.disabled=!ok;k.textContent=ok?t('confirmPick'):t('pickFirst')}}
  /* capital: field and slider share one range. The field is text with thousands separators; Arabic-Indic digits from an Arabic keyboard are read as numbers. */
  if(el.id==='cap'){const O=S._ob;O.capital=+el.value;$('#capn').value=fmt(O.capital);save()}
  if(el.id==='capn'){const O=S._ob,d=digits(el.value).slice(0,8),n=Math.min(CAP[1],+d||0);el.value=d?fmt(n):'';O.capital=Math.max(CAP[0],n);$('#cap').value=O.capital;save()}});
document.addEventListener('change',e=>{if(e.target.id==='capn'&&S._ob)e.target.value=fmt(S._ob.capital)});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches&&e.target.matches('[role=link]'))e.target.click();
  const sh=$('#app .sheet');if(!sh)return;
  if(e.key==='Escape'){e.preventDefault();closeSheet();return}
  if(e.key==='Tab'){const f=[...sh.querySelectorAll('a[href],button:not([disabled])')];if(!f.length)return;const a=document.activeElement,first=f[0],last=f[f.length-1];
    if(e.shiftKey&&(a===first||a===sh||!sh.contains(a))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(a===last||!sh.contains(a))){e.preventDefault();first.focus()}}});
/* after a move to another screen: start at the top and put focus on its heading, so a screen reader announces where the judge landed */
function focusHead(){const el=$('#app .unlock')||$('#app h1')||$('#app .dayhead');if(!el)return;el.setAttribute('tabindex','-1');try{el.focus({preventScroll:true})}catch(e){el.focus()}}
/* TRAIL mirrors the tab's history so "back" can be told from "forward": back restores the scroll position, forward starts at the top */
const keyOf=h=>{const r=parse(h);return r.name+(r.arg||'')};
addEventListener('hashchange',()=>{const k=keyOf(),n=TRAIL.length;let back=goingBack;
  if(n>1&&TRAIL[n-2]===k){TRAIL.pop();back=true}else if(TRAIL[n-1]!==k)TRAIL.push(k);
  goingBack=back;render();if(!back){const v=$('#app .view')||$('#app .land');if(v)v.scrollTop=0}focusHead()});
addEventListener('resize',()=>{const w=matchMedia(WIDE).matches;if(w!==wide)render()});
/* first visit: a phone set to Arabic opens in Arabic. A saved choice or ?lang= in the link wins. */
if(!load()&&/^ar\b/i.test(navigator.language||''))lang='ar';
TRAIL.push(keyOf());
{const ql=parse().q.get('lang');if(ql)lang=ql==='ar'?'ar':'en'}
/* first paint: wait for the fonts of the first screen (they are preloaded), at most 0.9s, so the text does not jump when they swap in. The static shell shows meanwhile. */
const FONTS={en:[['400 16px "IBM Plex Sans"','D'],['600 16px "IBM Plex Sans"','D'],['600 16px "IBM Plex Serif"','D']],ar:[['400 16px "IBM Plex Sans Arabic"','\u0639'],['700 16px "IBM Plex Sans Arabic"','\u0639'],['400 16px "IBM Plex Sans"','1']]};
const fonts=l=>document.fonts&&document.fonts.load?Promise.all(FONTS[l].map(f=>document.fonts.load(f[0],f[1]))).catch(()=>{}):Promise.resolve();
let booted=false;const boot=()=>{if(booted)return;booted=true;render();setTimeout(()=>fonts(rtl()?'en':'ar'),1500)};
fonts(lang).then(boot);setTimeout(boot,900);
})();
