/**
 * Storage Module
 * سامانه ثبت گزارش خط تولید میلگرد - فولاد ثامن پایتخت
 */

const Storage = {
  KEYS: {
    RECORDS: 'rebar_records_v2',
    OPERATORS: 'rebar_operators',
    SETTINGS: 'rebar_settings',
    FORM_FIELDS: 'rebar_form_fields',
    CURRENT_OPERATOR: 'rebar_current_operator'
  },

  SECTIONS: {
    rolling: {
      id: 'rolling',
      title: 'خط نورد',
      fullTitle: 'چک‌لیست خط نورد',
      icon: 'factory',
      color: 'blue',
      description: 'رافینگ و استندهای ۱ تا ۱۲'
    },
    turning: {
      id: 'turning',
      title: 'تراشکاری',
      fullTitle: 'گزارش کار تراشکاری',
      icon: 'cog',
      color: 'amber',
      description: 'ثبت کار روزانه پرسنل تراشکاری'
    },
    guide: {
      id: 'guide',
      title: 'هادی‌سازی',
      fullTitle: 'گزارش تعویض‌های هادی‌سازی',
      icon: 'replace',
      color: 'violet',
      description: 'تعویض جعبه، ناخنی، لوله و کنسولی'
    },
    furnace: {
      id: 'furnace',
      title: 'کوره',
      fullTitle: 'چک‌لیست کوره',
      icon: 'flame',
      color: 'rose',
      description: 'توقفات و علت سردی کوره'
    }
  },

  SHIFTS: {
    day: { id: 'day', title: 'روزکار', time: '۰۷:۰۰ تا ۱۹:۰۰' },
    night: { id: 'night', title: 'شب‌کار', time: '۱۹:۰۰ تا ۰۷:۰۰' }
  },

  init() {
    if (!localStorage.getItem(this.KEYS.RECORDS)) {
      localStorage.setItem(this.KEYS.RECORDS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.OPERATORS)) {
      localStorage.setItem(this.KEYS.OPERATORS, JSON.stringify([
        { id: 1, name: 'مدیر سیستم', section: 'all', role: 'admin' },
        { id: 2, name: 'علی رضایی', section: 'rolling', role: 'operator' },
        { id: 3, name: 'محمد کریمی', section: 'rolling', role: 'supervisor' },
        { id: 4, name: 'حسین موسوی', section: 'turning', role: 'operator' },
        { id: 5, name: 'رضا احمدی', section: 'guide', role: 'operator' },
        { id: 6, name: 'امیر حسینی', section: 'furnace', role: 'supervisor' }
      ]));
    }
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify({
        factoryName: 'فولاد ثامن پایتخت',
        lineName: 'خط تولید میلگرد',
        version: '2.0.0',
        cycle: '۲ روز روزکار • ۲ روز شب‌کار • ۲ روز استراحت'
      }));
    }
    if (!localStorage.getItem(this.KEYS.FORM_FIELDS)) {
      localStorage.setItem(this.KEYS.FORM_FIELDS, JSON.stringify(this.getDefaultFields()));
    }
  },

  getDefaultFields() {
    return {
      rolling: [
        { id: 'r1', label: 'چک و بررسی جعبه‌های ورودی و خروجی', type: 'checkbox', required: true, order: 1 },
        { id: 'r2', label: 'سفت بودن پیچ تاج و گوه‌ها', type: 'checkbox', required: true, order: 2 },
        { id: 'r3', label: 'بررسی دررفتگی غلتک‌ها', type: 'checkbox', required: true, order: 3 },
        { id: 'r4', label: 'بررسی پیچ پشت‌بند یاتاقان‌ها', type: 'checkbox', required: true, order: 4 },
        { id: 'r5', label: 'نظافت اکسید روی یاتاقان‌ها', type: 'checkbox', required: true, order: 5 },
        { id: 'r6', label: 'بررسی فیوزها', type: 'checkbox', required: true, order: 6 },
        { id: 'r7', label: 'چک کردن فیلرها', type: 'checkbox', required: true, order: 7 },
        { id: 'r8', label: 'سفت بودن پیچ اتصال استند به شاسی', type: 'checkbox', required: true, order: 8 },
        { id: 'r9', label: 'بررسی شکل ظاهری کالیبرها', type: 'checkbox', required: true, order: 9 },
        { id: 'r10', label: 'عملکرد آبپاش‌ها و روی کالیبر بودن', type: 'checkbox', required: true, order: 10 },
        { id: 'r11', label: 'بررسی کانال بین استندها', type: 'checkbox', required: true, order: 11 },
        { id: 'r12', label: 'بررسی دمای یاتاقان‌ها', type: 'checkbox', required: true, order: 12 }
      ],
      turning: [
        { id: 't1', label: 'نام قطعه', type: 'text', required: true, order: 1 },
        { id: 't2', label: 'تعداد', type: 'number', required: true, order: 2 },
        { id: 't3', label: 'وضعیت قطعه', type: 'select', options: ['سالم', 'نیاز به اصلاح', 'اسقاط'], required: true, order: 3 },
        { id: 't4', label: 'واحد درخواست‌کننده', type: 'text', required: true, order: 4 },
        { id: 't5', label: 'محل استفاده', type: 'text', required: false, order: 5 },
        { id: 't6', label: 'دستگاه', type: 'text', required: true, order: 6 },
        { id: 't7', label: 'نوع ماشین‌کاری', type: 'text', required: true, order: 7 },
        { id: 't8', label: 'تاریخ درخواست', type: 'date', required: true, order: 8 },
        { id: 't9', label: 'تاریخ تحویل', type: 'date', required: false, order: 9 },
        { id: 't10', label: 'زمان انجام (دقیقه)', type: 'number', required: false, order: 10 },
        { id: 't11', label: 'وضعیت انجام', type: 'select', options: ['انجام شد', 'در حال انجام', 'معلق'], required: true, order: 11 }
      ],
      guide: [
        { id: 'g1', label: 'موقعیت', type: 'select', options: ['ورودی', 'خروجی'], required: true, order: 1 },
        { id: 'g2', label: 'نوع فعالیت', type: 'select', options: ['تعویض جعبه', 'تعویض ناخنی', 'تعویض لوله یا راگا', 'تعویض کنسولی'], required: true, order: 2 }
      ],
      furnace: [
        { id: 'fu1', label: 'مدت توقف (دقیقه)', type: 'number', required: true, order: 1 },
        { id: 'fu2', label: 'توضیحات علت سردی / توقف', type: 'textarea', required: true, order: 2 },
        { id: 'fu3', label: 'بازدید شمش', type: 'checkbox', required: false, order: 3 },
        { id: 'fu4', label: 'تخلیه اکسید دهانه کوره', type: 'checkbox', required: false, order: 4 }
      ]
    };
  },

  getRecords() {
    return JSON.parse(localStorage.getItem(this.KEYS.RECORDS) || '[]');
  },

  saveRecord(record) {
    const records = this.getRecords();
    if (record.id) {
      const idx = records.findIndex(r => r.id === record.id);
      if (idx !== -1) {
        records[idx] = { ...records[idx], ...record, updatedAt: new Date().toISOString() };
      }
    } else {
      record.id = 'rec_' + Date.now();
      record.createdAt = new Date().toISOString();
      records.unshift(record);
    }
    localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(records));
    return record;
  },

  deleteRecord(id) {
    const records = this.getRecords().filter(r => r.id !== id);
    localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(records));
  },

  getRecordsBySection(sectionId) {
    return this.getRecords().filter(r => r.section === sectionId);
  },

  getTodayRecords() {
    const today = new Date().toDateString();
    return this.getRecords().filter(r => new Date(r.createdAt).toDateString() === today);
  },

  getOperators() {
    return JSON.parse(localStorage.getItem(this.KEYS.OPERATORS) || '[]');
  },

  getCurrentOperator() {
    const data = localStorage.getItem(this.KEYS.CURRENT_OPERATOR);
    return data ? JSON.parse(data) : null;
  },

  setCurrentOperator(operator) {
    if (operator) {
      localStorage.setItem(this.KEYS.CURRENT_OPERATOR, JSON.stringify(operator));
    } else {
      localStorage.removeItem(this.KEYS.CURRENT_OPERATOR);
    }
  },

  getFormFields(sectionId) {
    const all = JSON.parse(localStorage.getItem(this.KEYS.FORM_FIELDS) || '{}');
    return all[sectionId] || [];
  },

  saveFormFields(sectionId, fields) {
    const all = JSON.parse(localStorage.getItem(this.KEYS.FORM_FIELDS) || '{}');
    all[sectionId] = fields;
    localStorage.setItem(this.KEYS.FORM_FIELDS, JSON.stringify(all));
  },

  getSettings() {
    return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS) || '{}');
  },

  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
  },

  // تشخیص خودکار شیفت بر اساس ساعت فعلی
  getCurrentShift() {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 19) return this.SHIFTS.day;
    return this.SHIFTS.night;
  }
};
