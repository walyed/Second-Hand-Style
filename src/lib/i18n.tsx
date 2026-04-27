"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Lang = "EN" | "עברית" | "عربي";

const translations = {
  // ──────────────── NAVBAR ────────────────
  "nav.browse": { EN: "Browse", "עברית": "עיון", "عربي": "تصفح" },
  "nav.sell": { EN: "Give", "עברית": "תן", "عربي": "أعطِ " },
  "nav.dashboard": { EN: "Dashboard", "עברית": "לוח בקרה", "عربي": "لوحة التحكم" },
  "nav.menu": { EN: "Menu", "עברית": "תפריט", "عربي": "القائمة" },
  "nav.navigationMenu": { EN: "Navigation menu", "עברית": "תפריט ניווט", "عربي": "قائمة التنقل" },
  "nav.signOut": { EN: "Sign Out", "עברית": "התנתק", "عربي": "تسجيل خروج" },
  "nav.loginRegister": { EN: "Login / Register", "עברית": "התחבר / הרשם", "عربي": "تسجيل دخول / تسجيل" },
  "nav.login": { EN: "Login", "עברית": "התחבר", "عربي": "تسجيل دخول" },

  // ──────────────── HOME PAGE ────────────────
  "home.hero.title1": { EN: "Bestow", "עברית": "Bestow", "عربي": "Bestow" },
  "home.hero.title2": { EN: "", "עברית": "", "عربي": "" },
  "home.hero.title3": { EN: "", "עברית": "", "عربي": "" },
  "home.hero.subtitle": {
    EN: "Where giving becomes a way of life.",
    "עברית": "נתינה שהופכת לדרך חיים.",
    "عربي": "العطاء يصبح أسلوب حياة.",
  },
  "home.hero.subtitleBefore": { EN: "Where ", "עברית": "נ", "عربي": "ال" },
  "home.hero.subtitleAccent": { EN: "giving", "עברית": "תינה", "عربي": "عطاء" },
  "home.hero.subtitleAfter": { EN: " becomes a way of life.", "עברית": " שהופכת לדרך חיים.", "عربي": " يصبح أسلوب حياة." },
  "home.hero.desc": {
    EN: "Passing on furniture and items between people — with ease and warmth",
    "עברית": "מעבירים הלאה חפצים ורהיטים בין אנשים — בקלות ובחום",
    "عربي": "نمرر الأثاث والأغراض بين الناس — بكل سهولة ودفء",
  },
  "home.browseItems": { EN: "Find What You Need", "עברית": "מצא מה שאתה צריך", "عربي": "ابحث عما تحتاجه" },
  "home.startSelling": { EN: "Start Giving", "עברית": "התחל להעביר הלאה", "عربي": "ابدأ العطاء" },

  // Categories
  "cat.Furniture": { EN: "Furniture", "עברית": "רהיטים", "عربي": "أثاث" },
  "cat.Electronics": { EN: "Electrical Products", "עברית": "מוצרי חשמל", "عربي": "منتجات كهربائية" },
  "cat.Kitchen": { EN: "Housewares", "עברית": "כלי בית", "عربي": "أدوات المنزل" },
  "cat.Clothing": { EN: "Clothing", "עברית": "ביגוד", "عربي": "ملابس" },
  "cat.Other": { EN: "Other", "עברית": "אחר", "عربي": "أخرى" },

  // Featured section
  "home.featured.title": { EN: "Featured Pieces", "עברית": "פריטים מומלצים", "عربي": "قطع مميزة" },
  "home.featured.subtitle": {
    EN: "Hand-picked items that deserve a second life.",
    "עברית": "פריטים שנבחרו בקפידה שראויים לחיים חדשים.",
    "عربي": "قطع مختارة بعناية تستحق حياة ثانية.",
  },
  "home.viewAll": { EN: "View all", "עברית": "הצג הכל", "عربي": "عرض الكل" },
  "home.viewAllListings": { EN: "View all listings", "עברית": "הצג את כל המוצרים", "عربي": "عرض جميع المنتجات" },

  // How it works
  "home.how.badge": { EN: "How It Works", "עברית": "איך זה עובד", "عربي": "كيف يعمل" },
  "home.how.title": { EN: "The Bestow", "עברית": "דרך", "عربي": "طريقة" },
  "home.how.titleAccent": { EN: "Way", "עברית": "השוק", "عربي": "السوق" },
  "home.how.subtitle": {
    EN: "Three simple steps to a simpler, more intentional way to buy and sell.",
    "עברית": "שלושה צעדים פשוטים לדרך קלה יותר ומודעת יותר לקנות ולמכור.",
    "عربي": "ثلاث خطوات بسيطة لطريقة أبسط وأكثر وعياً للشراء والبيع.",
  },
  "home.step1.title": { EN: "Browse & Discover", "עברית": "עיינו וגלו", "عربي": "تصفح واكتشف" },
  "home.step1.desc": {
    EN: "Explore curated, high-quality second-hand items near you. Filter by category, condition, and location to find exactly what you need.",
    "עברית": "גלו פריטי יד שנייה איכותיים ומובחרים בקרבתכם. סננו לפי קטגוריה, מצב ומיקום כדי למצוא בדיוק את מה שאתם צריכים.",
    "عربي": "استكشف منتجات مستعملة عالية الجودة بالقرب منك. فلتر حسب الفئة والحالة والموقع للعثور على ما تحتاجه بالضبط.",
  },
  "home.step2.title": { EN: "Connect Securely", "עברית": "התחברו בבטחה", "عربي": "تواصل بأمان" },
  "home.step2.desc": {
    EN: "Our admin team personally facilitates every connection between buyer and seller — ensuring trust, safety, and a seamless experience.",
    "עברית": "צוות הניהול שלנו מתאם באופן אישי כל חיבור בין קונה למוכר — לבטיחות, אמון וחוויה חלקה.",
    "عربي": "يسهّل فريق الإدارة لدينا شخصياً كل اتصال بين المشتري والبائع — لضمان الثقة والأمان وتجربة سلسة.",
  },
  "home.step3.title": { EN: "Collect & Enjoy", "עברית": "אספו ותיהנו", "عربي": "استلم واستمتع" },
  "home.step3.desc": {
    EN: "Pick up your treasure and give it a second life. Sustainable shopping that feels great — for you and the planet.",
    "עברית": "אספו את האוצר שלכם ותנו לו חיים חדשים. קניות בר-קיימא שמרגישות נהדר — לכם ולכדור הארץ.",
    "عربي": "احصل على كنزك وامنحه حياة ثانية. تسوق مستدام يشعرك بالرضا — لك وللكوكب.",
  },

  // Stats
  "home.stat.itemsListed": { EN: "Items Listed", "עברית": "פריטים פורסמו", "عربي": "منتجات مُدرجة" },
  "home.stat.happyBuyers": { EN: "Happy Buyers", "עברית": "קונים מרוצים", "عربي": "مشترون سعداء" },
  "home.stat.satisfaction": { EN: "Satisfaction Rate", "עברית": "שביעות רצון", "عربي": "نسبة الرضا" },

  // ──────────────── BROWSE PAGE ────────────────
  "browse.title": { EN: "Explore Collection", "עברית": "גלו את האוסף", "عربي": "استكشف المجموعة" },
  "browse.searchPlaceholder": { EN: "Search items...", "עברית": "...חפש פריטים", "عربي": "...ابحث عن منتجات" },
  "browse.showing": { EN: "Showing", "עברית": "מציג", "عربي": "عرض" },
  "browse.results": { EN: "results", "עברית": "תוצאות", "عربي": "نتائج" },
  "browse.filters": { EN: "Filters", "עברית": "מסננים", "عربي": "فلاتر" },
  "browse.newest": { EN: "Newest Arrivals", "עברית": "חדשים ביותר", "عربي": "الأحدث" },
  "browse.priceLow": { EN: "Price: Low to High", "עברית": "מחיר: מהנמוך לגבוה", "عربي": "السعر: من الأقل للأعلى" },
  "browse.priceHigh": { EN: "Price: High to Low", "עברית": "מחיר: מהגבוה לנמוך", "عربي": "السعر: من الأعلى للأقل" },
  "browse.category": { EN: "Category", "עברית": "קטגוריה", "عربي": "الفئة" },
  "browse.condition": { EN: "Condition", "עברית": "מצב", "عربي": "الحالة" },
  "browse.location": { EN: "Location", "עברית": "מיקום", "عربي": "الموقع" },
  "browse.noItems": { EN: "No items found", "עברית": "לא נמצאו פריטים", "عربي": "لم يتم العثور على منتجات" },
  "browse.adjustFilters": {
    EN: "Try adjusting your filters to see more results.",
    "עברית": "נסו לשנות את המסננים כדי לראות יותר תוצאות.",
    "عربي": "حاول تعديل الفلاتر لرؤية المزيد من النتائج.",
  },
  "browse.clearFilters": { EN: "Clear all filters", "עברית": "נקה את כל המסננים", "عربي": "مسح جميع الفلاتر" },
  "browse.loadMore": { EN: "Load More", "עברית": "טען עוד", "عربي": "تحميل المزيد" },
  "browse.loading": { EN: "Loading...", "עברית": "...טוען", "عربي": "...جاري التحميل" },
  "browse.searchCity": { EN: "Search city...", "עברית": "חפש עיר...", "عربي": "ابحث عن مدينة..." },

  // Conditions
  "cond.New": { EN: "New", "עברית": "חדש", "عربي": "جديد" },
  "cond.Used": { EN: "Used", "עברית": "משומש", "عربي": "مستعمل" },
  "cond.Refurbished": { EN: "Refurbished", "עברית": "מחודש", "عربي": "مُجدد" },
  "cond.Special Deal": { EN: "Special Deal", "עברית": "מבצע מיוחד", "عربي": "عرض خاص" },

  // Cities
  "city.Tel Aviv": { EN: "Tel Aviv", "עברית": "תל אביב", "عربي": "تل أبيب" },
  "city.Jerusalem": { EN: "Jerusalem", "עברית": "ירושלים", "عربي": "القدس" },
  "city.Haifa": { EN: "Haifa", "עברית": "חיפה", "عربي": "حيفا" },
  "city.Eilat": { EN: "Eilat", "עברית": "אילת", "عربي": "إيلات" },

  // ──────────────── POST / SELL PAGE ────────────────
  "post.title": { EN: "Give an Item", "עברית": "תן פריט", "عربي": "أعطِ منتجًا" },
  "post.step1": { EN: "Photos & Details", "עברית": "תמונות ופרטים", "عربي": "صور وتفاصيل" },
  "post.step2": { EN: "Category & Condition", "עברית": "קטגוריה ומצב", "عربي": "الفئة والحالة" },
  "post.step3": { EN: "Review & Post", "עברית": "סקירה ופרסום", "عربي": "مراجعة ونشر" },
  "post.whatSelling": { EN: "What are you giving away?", "עברית": "מה אתם נותנים?", "عربي": "ماذا تهب به؟" },
  "post.titleLabel": { EN: "Title", "עברית": "כותרת", "عربي": "العنوان" },
  "post.titlePlaceholder": { EN: "e.g. Vintage Leather Sofa", "עברית": "למשל ספה עור וינטג'", "عربي": "مثال: أريكة جلدية كلاسيكية" },
  "post.photos": { EN: "Photos", "עברית": "תמונות", "عربي": "صور" },
  "post.dragDrop": { EN: "Drag & drop photos here", "עברית": "גררו ושחררו תמונות כאן", "عربي": "اسحب وأفلت الصور هنا" },
  "post.photoTip": {
    EN: "High quality photos make your item sell faster",
    "עברית": "תמונות באיכות גבוהה עוזרות למכור מהר יותר",
    "عربي": "الصور عالية الجودة تساعد في بيع منتجك بشكل أسرع",
  },
  "post.description": { EN: "Description", "עברית": "תיאור", "عربي": "الوصف" },
  "post.descPlaceholder": {
    EN: "Describe the item's features, history, and any flaws...",
    "עברית": "...תארו את תכונות הפריט, ההיסטוריה שלו וכל פגם",
    "عربي": "...صف ميزات المنتج وتاريخه وأي عيوب",
  },
  "post.categorize": { EN: "Categorize it", "עברית": "סווגו אותו", "عربي": "صنّفه" },
  "post.categoryLabel": { EN: "Category", "עברית": "קטגוריה", "عربي": "الفئة" },
  "post.conditionLabel": { EN: "Condition", "עברית": "מצב", "عربي": "الحالة" },
  "post.originalPrice": { EN: "Original Price", "עברית": "מחיר מקורי", "عربي": "السعر الأصلي" },
  "post.sellingPrice": { EN: "Selling Price", "עברית": "מחיר מכירה", "عربي": "سعر البيع" },
  "post.whereLocated": { EN: "Where is it located?", "עברית": "?היכן הפריט נמצא", "عربي": "أين يقع المنتج؟" },
  "post.cityLabel": { EN: "City", "עברית": "עיר", "عربي": "المدينة" },
  "post.selectCity": { EN: "Select a city...", "עברית": "...בחרו עיר", "عربي": "...اختر مدينة" },
  "post.summary": { EN: "Summary", "עברית": "סיכום", "عربي": "ملخص" },
  "post.untitled": { EN: "Untitled Item", "עברית": "פריט ללא שם", "عربي": "منتج بدون عنوان" },
  "post.back": { EN: "Back", "עברית": "חזרה", "عربي": "رجوع" },
  "post.next": { EN: "Next", "עברית": "הבא", "عربي": "التالي" },
  "post.postListing": { EN: "Give Item", "עברית": "תן פריט", "عربي": "إعطاء المنتج" },
  "post.success.title": { EN: "Item Shared!", "עברית": "!הפריט שותף", "عربي": "تمت مشاركة المنتج!" },
  "post.success.subtitle": {
    EN: "Your item is now live and ready to find a new home.",
    "עברית": "הפריט שלכם פעיל ומחכה למצוא בית חדש.",
    "عربي": "منتجك متاح الآن وجاهز للعثور على منزل جديد.",
  },
  "post.goToDashboard": { EN: "Go to Dashboard", "עברית": "עבור ללוח בקרה", "عربي": "الذهاب للوحة التحكم" },
  "post.viewListing": { EN: "View Listing", "עברית": "צפה במוצר", "عربي": "عرض المنتج" },
  "post.loginRequired": { EN: "Please log in to post an item", "עברית": "התחברו כדי לפרסם פריט", "عربي": "يرجى تسجيل الدخول لنشر منتج" },
  "post.specialDealLocked": { EN: "Auto-detected · selling at ≤20% of original price", "עברית": "זוהה אוטומטית · מחיר מכירה ≤20% מהמחיר המקורי", "عربي": "تم الكشف تلقائياً · سعر البيع ≤20% من السعر الأصلي" },

  // ──────────────── LOGIN PAGE ────────────────
  "login.welcome": { EN: "Welcome back.", "עברית": ".ברוכים השבים", "عربي": ".مرحباً بعودتك" },
  "login.quote": {
    EN: "The finest things in life are those that have already lived a little.",
    "עברית": "הדברים הטובים ביותר בחיים הם אלה שכבר חיו קצת.",
    "عربي": "أفضل الأشياء في الحياة هي تلك التي عاشت قليلاً بالفعل.",
  },
  "login.subtitle": { EN: "Log in to your account", "עברית": "התחברו לחשבון שלכם", "عربي": "سجل دخولك إلى حسابك" },
  "login.identifier": { EN: "Email or Phone Number", "עברית": "אימייל או מספר טלפון", "عربي": "البريد الإلكتروني أو رقم الهاتف" },
  "login.identifierPlaceholder": { EN: "email@example.com or 0501234567", "עברית": "email@example.com או 0501234567", "عربي": "email@example.com أو 0501234567" },
  "login.password": { EN: "Password", "עברית": "סיסמה", "عربي": "كلمة المرور" },
  "login.forgotPassword": { EN: "Forgot password?", "עברית": "?שכחתם סיסמה", "عربي": "نسيت كلمة المرور؟" },
  "login.submit": { EN: "Log In", "עברית": "התחבר", "عربي": "تسجيل دخول" },
  "login.noAccount": { EN: "Don't have an account?", "עברית": "?אין לכם חשבון", "عربي": "ليس لديك حساب؟" },
  "login.registerHere": { EN: "Register here", "עברית": "הירשמו כאן", "عربي": "سجل هنا" },
  "login.enterIdentifier": { EN: "Please enter your email or phone number", "עברית": "הזינו אימייל או מספר טלפון", "عربي": "يرجى إدخال بريدك الإلكتروني أو رقم هاتفك" },
  "login.errorEmailRequired": { EN: "Email or phone number is required", "עברית": "אימייל או מספר טלפון נדרש", "عربي": "البريد الإلكتروني أو رقم الهاتف مطلوب" },
  "login.errorPasswordRequired": { EN: "Password is required", "עברית": "סיסמה נדרשת", "عربي": "كلمة المرور مطلوبة" },
  "login.success": { EN: "Welcome back!", "עברית": "!ברוכים השבים", "عربي": "!مرحباً بعودتك" },

  // ──────────────── REGISTER PAGE ────────────────
  "register.title": { EN: "Join the circle.", "עברית": ".הצטרפו למעגל", "عربي": ".انضم إلى الدائرة" },
  "register.quote": {
    EN: "Curated quality. Sustainable choices. A marketplace for those who know.",
    "עברית": "איכות מובחרת. בחירות בנות-קיימא. שוק למי שמבין.",
    "عربي": "جودة مختارة. خيارات مستدامة. سوق لمن يعرف.",
  },
  "register.subtitle": { EN: "Create your account", "עברית": "צרו את החשבון שלכם", "عربي": "أنشئ حسابك" },
  "register.fullName": { EN: "Full Name", "עברית": "שם מלא", "عربي": "الاسم الكامل" },
  "register.namePlaceholder": { EN: "e.g. David Levi", "עברית": "למשל דוד לוי", "عربي": "مثال: أحمد محمد" },
  "register.email": { EN: "Email", "עברית": "אימייל", "عربي": "البريد الإلكتروني" },
  "register.emailPlaceholder": { EN: "email@example.com", "עברית": "email@example.com", "عربي": "email@example.com" },
  "register.phone": { EN: "Phone Number", "עברית": "מספר טלפון", "عربي": "رقم الهاتف" },
  "register.phonePlaceholder": { EN: "0501234567", "עברית": "0501234567", "عربي": "0501234567" },
  "register.password": { EN: "Password", "עברית": "סיסמה", "عربي": "كلمة المرور" },
  "register.submit": { EN: "Create Account", "עברית": "צור חשבון", "عربي": "إنشاء حساب" },
  "register.hasAccount": { EN: "Already have an account?", "עברית": "?כבר יש לכם חשבון", "عربي": "لديك حساب بالفعل؟" },
  "register.loginLink": { EN: "Log in", "עברית": "התחברו", "عربي": "تسجيل دخول" },
  "register.passwordShort": { EN: "Password must be at least 6 characters", "עברית": "הסיסמה חייבת להכיל לפחות 6 תווים", "عربي": "يجب أن تكون كلمة المرور 6 أحرف على الأقل" },
  "register.success": { EN: "Account created successfully!", "עברית": "!החשבון נוצר בהצלחה", "عربي": "!تم إنشاء الحساب بنجاح" },

  // ──────────────── DASHBOARD ────────────────
  "dash.title": { EN: "Dashboard", "עברית": "לוח בקרה", "عربي": "لوحة التحكم" },
  "dash.listNewItem": { EN: "Give New Item", "עברית": "תן פריט חדש", "عربي": "أعطِ منتجًا جديدًا" },
  "dash.seller": { EN: "Giver", "עברית": "נותן", "عربي": "المعطي" },
  "dash.activity": { EN: "Activity", "עברית": "פעילות", "عربي": "النشاط" },
  "dash.account": { EN: "Account", "עברית": "חשבון", "عربي": "الحساب" },
  "dash.profile": { EN: "Profile", "עברית": "פרופיל", "عربي": "الملف الشخصي" },
  "dash.settings": { EN: "Settings", "עברית": "הגדרות", "عربي": "الإعدادات" },
  "dash.logOut": { EN: "Log out", "עברית": "התנתק", "عربي": "تسجيل خروج" },

  // Tabs
  "dash.tab.listed": { EN: "Listed Items", "עברית": "פריטים מפורסמים", "عربي": "المنتجات المُدرجة" },
  "dash.tab.process": { EN: "In Process", "עברית": "בתהליך", "عربي": "قيد المعالجة" },
  "dash.tab.sold": { EN: "Given", "עברית": "נמסרו", "عربي": "تم العطاء" },
  "dash.tab.watchlist": { EN: "Watchlist", "עברית": "מועדפים", "عربي": "قائمة المراقبة" },
  "dash.tab.purchased": { EN: "Purchased", "עברית": "נרכשו", "عربي": "المُشتريات" },

  // Stats
  "dash.stat.active": { EN: "Active Listings", "עברית": "מוצרים פעילים", "عربي": "منتجات نشطة" },
  "dash.stat.inProcess": { EN: "In Process", "עברית": "בתהליך", "عربي": "قيد المعالجة" },
  "dash.stat.totalSold": { EN: "Total Given", "עברית": "סה״כ נמסרו", "عربي": "إجمالي المعطى" },
  "dash.stat.watchlist": { EN: "Watchlist", "עברית": "מועדפים", "عربي": "المراقبة" },
  "dash.stat.purchased": { EN: "Purchased", "עברית": "נרכשו", "عربي": "المُشتريات" },

  // Status badges
  "status.active": { EN: "Active", "עברית": "פעיל", "عربي": "نشط" },
  "status.inProcess": { EN: "In Process", "עברית": "בתהליך", "عربي": "قيد المعالجة" },
  "status.sold": { EN: "Given", "עברית": "נמסר", "عربي": "تم العطاء" },
  "status.saved": { EN: "Saved", "עברית": "שמור", "عربي": "محفوظ" },
  "status.waitingAdmin": { EN: "Waiting for Admin", "עברית": "ממתין למנהל", "عربي": "بانتظار المسؤول" },
  "status.purchased": { EN: "Purchased", "עברית": "נרכש", "عربي": "تم الشراء" },

  // Empty states
  "dash.empty.listed": { EN: "No active items", "עברית": "אין פריטים פעילים", "عربي": "لا توجد منتجات نشطة" },
  "dash.empty.listedSub": { EN: "Start giving by sharing your first item.", "עברית": "התחילו לתת על ידי שיתוף הפריט הראשון.", "عربي": "ابدأ العطاء بمشاركة أول منتج لك." },
  "dash.empty.listItem": { EN: "Give an Item", "עברית": "תן פריט", "عربي": "أعطِ منتجًا" },
  "dash.empty.process": { EN: "No items in process", "עברית": "אין פריטים בתהליך", "عربي": "لا توجد منتجات قيد المعالجة" },
  "dash.empty.processSub": { EN: "When a buyer requests an item, it will appear here.", "עברית": "כשקונה יבקש פריט, הוא יופיע כאן.", "عربي": "عندما يطلب مشترٍ منتجاً، سيظهر هنا." },
  "dash.empty.sold": { EN: "No items given yet", "עברית": "אין פריטים שנמסרו עדיין", "عربي": "لا توجد منتجات معطاة بعد" },
  "dash.empty.soldSub": { EN: "Give your first item to get started.", "עברית": "תנו את הפריט הראשון כדי להתחיל.", "عربي": "أعطِ أول منتج لك للبدء." },
  "dash.empty.watchlist": { EN: "Watchlist is empty", "עברית": "רשימת המועדפים ריקה", "عربي": "قائمة المراقبة فارغة" },
  "dash.empty.watchlistSub": { EN: "Browse items and save your favorites.", "עברית": "עיינו במוצרים ושמרו את המועדפים.", "عربي": "تصفح المنتجات واحفظ مفضلاتك." },
  "dash.empty.purchased": { EN: "No purchases yet", "עברית": "אין רכישות עדיין", "عربي": "لا توجد مشتريات بعد" },
  "dash.empty.purchasedSub": {
    EN: "When you request an item and the deal is confirmed, it will appear here.",
    "עברית": "כשתבקשו פריט והעסקה תאושר, הוא יופיע כאן.",
    "عربي": "عندما تطلب منتجاً ويتم تأكيد الصفقة، سيظهر هنا.",
  },
  "dash.browseItems": { EN: "Browse Items", "עברית": "עיינו במוצרים", "عربي": "تصفح المنتجات" },
  "dash.view": { EN: "View", "עברית": "צפה", "عربي": "عرض" },
  "dash.purchased.inProcess": { EN: "In Process", "עברית": "בתהליך", "عربي": "قيد المعالجة" },
  "dash.purchased.completed": { EN: "Completed", "עברית": "הושלמו", "عربي": "مكتملة" },

  // ──────────────── ITEM DETAIL PAGE ────────────────
  "item.originalPrice": { EN: "Original Price", "עברית": "מחיר מקורי", "عربي": "السعر الأصلي" },
  "item.sellingFor": { EN: "Selling for", "עברית": "נמכר ב", "عربي": "يُباع بـ" },
  "item.location": { EN: "Location", "עברית": "מיקום", "عربي": "الموقع" },
  "item.israel": { EN: "Israel", "עברית": "ישראל", "عربي": "إسرائيل" },
  "item.contactSeller": { EN: "Request Item", "עברית": "בקש פריט", "عربي": "طلب المنتج" },
  "item.dealInProgress": { EN: "Deal In Progress", "עברית": "עסקה בתהליך", "عربي": "الصفقة قيد التنفيذ" },
  "item.notAvailable": { EN: "Not Available", "עברית": "לא זמין", "عربي": "غير متوفر" },
  "item.guarantee.title": { EN: "Bestow Guarantee", "עברית": "אחריות השוק", "عربي": "ضمان السوق" },
  "item.guarantee.desc": {
    EN: "Every transaction is monitored by our admin team to ensure safety and authenticity.",
    "עברית": "כל עסקה מנוטרת על ידי צוות הניהול שלנו כדי להבטיח בטיחות ואותנטיות.",
    "عربي": "كل معاملة تتم مراقبتها من قبل فريق الإدارة لدينا لضمان الأمان والأصالة.",
  },
  "item.connectSecurely": { EN: "Request This Item", "עברית": "בקש פריט זה", "عربي": "اطلب هذا المنتج" },
  "item.connectDesc": {
    EN: "Our admin team will connect you with the seller within 24 hours.",
    "עברית": "צוות הניהול שלנו יחבר אתכם עם המוכר תוך 24 שעות.",
    "عربي": "سيقوم فريق الإدارة بربطك بالبائع خلال 24 ساعة.",
  },
  "item.cancel": { EN: "Cancel", "עברית": "ביטול", "عربي": "إلغاء" },
  "item.confirmRequest": { EN: "Confirm Request", "עברית": "אשר בקשה", "عربي": "تأكيد الطلب" },
  "item.requestSent": {
    EN: "Request sent! The admin team will connect you with the seller.",
    "עברית": "הבקשה נשלחה! צוות הניהול יחבר אתכם עם המוכר.",
    "عربي": "تم إرسال الطلب! سيقوم فريق الإدارة بربطك بالبائع.",
  },
  "item.loginRequired": { EN: "Please log in to contact the seller", "עברית": "התחברו כדי ליצור קשר עם המוכר", "عربي": "يرجى تسجيل الدخول للتواصل مع البائع" },
  "item.ownListing": { EN: "This is your own listing", "עברית": "זה המוצר שלך", "عربي": "هذا منتجك الخاص" },

  // ──────────────── 404 PAGE ────────────────
  "notFound.title": { EN: "404 Page Not Found", "עברית": "404 הדף לא נמצא", "عربي": "404 الصفحة غير موجودة" },
  "notFound.desc": {
    EN: "The page you're looking for doesn't exist or has been moved.",
    "עברית": "הדף שאתם מחפשים לא קיים או הועבר.",
    "عربي": "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
  },
  "notFound.goHome": { EN: "Go back home", "עברית": "חזרה לדף הבית", "عربي": "العودة للرئيسية" },

  // ──────────────── LISTING CARD ────────────────
  "card.loginWatchlist": { EN: "Please log in to save items to your watchlist", "עברית": "התחברו כדי לשמור פריטים למועדפים", "عربي": "يرجى تسجيل الدخول لحفظ المنتجات في قائمة المراقبة" },

  // ──────────────── FOOTER ────────────────
  "footer.tagline": {
    EN: "We believe that giving has the power to create a change in people, communities, and the environment. We are here to enable everyone to take part in a circle of care, where items are given new life and people connect with one another.",
    "עברית": "האתר נולד מתוך אמונה שלנתינה יש כוח לשנות — אנשים, קהילות וסביבה. אנחנו כאן כדי לאפשר לכל אחד לקחת חלק במעגל של אכפתיות, שבו חפצים מקבלים חיים חדשים ואנשים מתחברים זה לזה.",
    "عربي": "وُلد هذا الموقع من إيمان بأن للعطاء قوة على التغيير — تغيير الناس، والمجتمعات، والبيئة. نحن هنا لتمكين كل شخص من أن يكون جزءًا من دائرة من الاهتمام، حيث تحصل الأشياء على حياة جديدة ويتواصل الناس مع بعضهم البعض.",
  },
  "footer.explore": { EN: "Explore", "עברית": "עיון", "عربي": "استكشاف" },
  "footer.allItems": { EN: "All Items", "עברית": "כל הפריטים", "عربي": "جميع المنتجات" },
  "footer.company": { EN: "Company", "עברית": "חברה", "عربي": "الشركة" },
  "footer.aboutUs": { EN: "About Us", "עברית": "אודותינו", "عربي": "من نحن" },
  "footer.contact": { EN: "Contact", "עברית": "צור קשר", "عربي": "اتصل بنا" },
  "footer.terms": { EN: "Terms of Service", "עברית": "תנאי שימוש", "عربي": "شروط الخدمة" },
  "footer.privacy": { EN: "Privacy Policy", "עברית": "מדיניות פרטיות", "عربي": "سياسة الخصوصية" },
  "footer.rights": { EN: "Bestow. All rights reserved.", "עברית": "Bestow. כל הזכויות שמורות.", "عربي": "Bestow. جميع الحقوق محفوظة." },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("EN");

  useEffect(() => {
    const saved = localStorage.getItem("app-lang") as Lang | null;
    if (saved && (saved === "EN" || saved === "עברית" || saved === "عربي")) {
      setLangState(saved);
      document.documentElement.dir = saved === "EN" ? "ltr" : "rtl";
      document.documentElement.lang = saved === "EN" ? "en" : saved === "עברית" ? "he" : "ar";
    }
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    document.documentElement.dir = newLang === "EN" ? "ltr" : "rtl";
    document.documentElement.lang = newLang === "EN" ? "en" : newLang === "עברית" ? "he" : "ar";
    localStorage.setItem("app-lang", newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key as TranslationKey];
      if (!entry) return key;
      return entry[lang] || entry["EN"];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
