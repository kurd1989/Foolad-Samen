/**
 * Main Application
 * سامانه ثبت گزارش خط تولید میلگرد - فولاد ثامن پایتخت
 */

const App = {
  currentPage: 'home',
  deferredPrompt: null,

  init() {
    Storage.init();
    this.bindEvents();
    
    if (!Storage.getCurrentOperator()) {
      this.renderOperatorSelect();
    } else {
      this.renderPage('home');
    }
    
    this.setupPWA();
    lucide.createIcons();
  },

  bindEvents() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.page));
    });

    document.querySelectorAll('.drawer-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeDrawer();
        this.navigate(btn.dataset.page);
      });
    });

    document.getElementById('btn-menu')?.addEventListener('click', () => this.openDrawer());
    document.getElementById('btn-close-drawer')?.addEventListener('click', () => this.closeDrawer());
    document.getElementById('drawer-overlay')?.addEventListener('click', () => this.closeDrawer());
    document.getElementById('btn-install')?.addEventListener('click', () => this.installApp());
    document.getElementById('btn-sync')?.addEventListener('click', () => this.syncData());
  },

  navigate(page) {
    this.currentPage = page;

    document.querySelectorAll('.nav-btn').forEach(btn => {
      const isActive = btn.dataset.page === page;
      btn.classList.toggle('active', isActive);
      btn.classList.toggle('text-primary-600', isActive);
      btn.classList.toggle('text-slate-500', !isActive);
    });

    this.renderPage(page);
    window.scrollTo(0, 0);
  },

  renderPage(page) {
    const container = document.getElementById('main-content');
    if (!container) return;

    if (!Storage.getCurrentOperator() && page !== 'operator-select') {
      this.renderOperatorSelect();
      return;
    }

    switch (page) {
      case 'home':
        container.innerHTML = this.renderHome();
        break;
      case 'forms':
        container.innerHTML = this.renderFormsList();
        break;
      case 'reports':
        container.innerHTML = this.renderReports();
        break;
      case 'admin':
        container.innerHTML = Admin.render();
        break;
      case 'form-rolling':
        container.innerHTML = Forms.renderRollingForm();
        break;
      case 'form-turning':
        container.innerHTML = Forms.renderTurningForm();
        break;
      case 'form-guide':
        container.innerHTML = Forms.renderGuideForm();
        break;
      case 'form-furnace':
        container.innerHTML = Forms.renderFurnaceForm();
        break;
      default:
        container.innerHTML = this.renderHome();
    }

    lucide.createIcons();
    this.bindPageEvents(page);
  },

  bindPageEvents(page) {
    document.querySelectorAll('[data-operator]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.operator);
        const operator = Storage.getOperators().find(o => o.id === id);
        if (operator) {
          Storage.setCurrentOperator(operator);
          this.toast('خوش آمدید ' + operator.name, 'success');
          this.navigate('home');
        }
      });
    });

    document.getElementById('btn-change-operator')?.addEventListener('click', () => {
      Storage.setCurrentOperator(null);
      this.renderOperatorSelect();
    });

    if (page.startsWith('form-')) {
      const form = document.getElementById('main-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          Forms.handleSubmit(page);
        });
      }

      document.querySelectorAll('.check-item').forEach(item => {
        item.addEventListener('click', () => {
          item.classList.toggle('checked');
          const icon = item.querySelector('.check-icon');
          if (icon) icon.classList.toggle('hidden', !item.classList.contains('checked'));
          const checkbox = item.querySelector('input[type="checkbox"]');
          if (checkbox) checkbox.checked = item.classList.contains('checked');
        });
      });

      document.querySelectorAll('.stand-btn').forEach(btn => {
        btn.addEventListener('click', () => btn.classList.toggle('active'));
      });
    }

    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('آیا از حذف این گزارش مطمئن هستید؟')) {
          Storage.deleteRecord(btn.dataset.delete);
          this.toast('گزارش حذف شد', 'success');
          this.renderPage('reports');
        }
      });
    });

    document.querySelectorAll('[data-form]').forEach(card => {
      card.addEventListener('click', () => {
        this.navigate('form-' + card.dataset.form);
      });
    });
  },

  renderOperatorSelect() {
    const container = document.getElementById('main-content');
    const operators = Storage.getOperators();
    const sectionLabels = {
      all: 'همه بخش‌ها',
      rolling: 'خط نورد',
      turning: 'تراشکاری',
      guide: 'هادی‌سازی',
      furnace: 'کوره'
    };

    let html = `
      <div class="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <div class="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center mb-6">
          <i data-lucide="hard-hat" class="w-10 h-10 text-white"></i>
        </div>
        <h2 class="text-xl font-bold text-slate-800 mb-1">انتخاب اپراتور</h2>
        <p class="text-sm text-slate-500 mb-8 text-center">برای شروع ثبت گزارش، نام خود را انتخاب کنید</p>
        <div class="w-full space-y-3">
    `;

    operators.forEach(op => {
      const roleLabel = op.role === 'admin' ? 'مدیر' : (op.role === 'supervisor' ? 'سرشیفت' : 'اپراتور');
      html += `
            <button data-operator="${op.id}" 
                    class="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4 text-right active:scale-[0.98] transition">
              <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-lg">
                ${op.name.charAt(0)}
              </div>
              <div class="flex-1">
                <p class="font-semibold text-slate-800">${op.name}</p>
                <p class="text-xs text-slate-500">${sectionLabels[op.section] || op.section} • ${roleLabel}</p>
              </div>
              <i data-lucide="chevron-left" class="w-5 h-5 text-slate-400"></i>
            </button>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
    lucide.createIcons();
    this.bindPageEvents('operator-select');
  },

  renderHome() {
    const operator = Storage.getCurrentOperator();
    const shift = Storage.getCurrentShift();
    const todayRecords = Storage.getTodayRecords();
    const settings = Storage.getSettings();
    const sections = Storage.SECTIONS;

    let availableSections = Object.values(sections);
    if (operator && operator.section !== 'all') {
      availableSections = availableSections.filter(s => s.id === operator.section);
    }

    const today = new Date().toLocaleDateString('fa-IR');

    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
      violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-600' }
    };

    let sectionCards = '';
    availableSections.forEach(sec => {
      const c = colorMap[sec.color] || colorMap.blue;
      sectionCards += `
        <button data-form="${sec.id}" 
                class="card-hover w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 text-right">
          <div class="w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0">
            <i data-lucide="${sec.icon}" class="w-6 h-6 ${c.text}"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-slate-800">${sec.fullTitle}</h4>
            <p class="text-xs text-slate-500 mt-0.5">${sec.description}</p>
          </div>
          <i data-lucide="chevron-left" class="w-5 h-5 text-slate-400"></i>
        </button>
      `;
    });

    return `
      <div class="p-4 space-y-5">
        <div class="bg-gradient-to-l from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-slate-300 text-sm">سلام، ${operator?.name || 'کاربر'}</p>
              <h2 class="text-lg font-bold mt-0.5">${settings.lineName || 'خط تولید میلگرد'}</h2>
            </div>
            <button id="btn-change-operator" class="text-xs px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20">
              تغییر کاربر
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white/10 rounded-xl p-3">
              <p class="text-[11px] text-slate-300 mb-0.5">شیفت فعلی</p>
              <p class="font-bold text-sm">${shift.title}</p>
              <p class="text-[11px] text-slate-400">${shift.time}</p>
            </div>
            <div class="bg-white/10 rounded-xl p-3">
              <p class="text-[11px] text-slate-300 mb-0.5">تاریخ</p>
              <p class="font-bold text-sm">${today}</p>
              <p class="text-[11px] text-slate-400">${todayRecords.length} گزارش امروز</p>
            </div>
          </div>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
          <i data-lucide="calendar-clock" class="w-5 h-5 text-amber-600 flex-shrink-0"></i>
          <p class="text-xs text-amber-800">چرخه کاری: <strong>۲ روز روزکار • ۲ روز شب‌کار • ۲ روز استراحت</strong></p>
        </div>

        <div>
          <h3 class="font-bold text-slate-800 mb-3 px-1">ثبت گزارش بخش</h3>
          <div class="space-y-3">
            ${sectionCards}
          </div>
        </div>
      </div>
    `;
  },

  renderFormsList() {
    const operator = Storage.getCurrentOperator();
    let sections = Object.values(Storage.SECTIONS);
    
    if (operator && operator.section !== 'all') {
      sections = sections.filter(s => s.id === operator.section);
    }

    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
      violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-600' }
    };

    let cards = '';
    sections.forEach(sec => {
      const c = colorMap[sec.color] || colorMap.blue;
      cards += `
        <button data-form="${sec.id}" 
                class="card-hover w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 text-right">
          <div class="w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center">
            <i data-lucide="${sec.icon}" class="w-6 h-6 ${c.text}"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold">${sec.fullTitle}</h4>
            <p class="text-xs text-slate-500">${sec.description}</p>
          </div>
          <i data-lucide="chevron-left" class="w-5 h-5 text-slate-400"></i>
        </button>
      `;
    });

    return `
      <div class="p-4">
        <h2 class="text-xl font-bold text-slate-800 mb-1">فرم‌های گزارش</h2>
        <p class="text-sm text-slate-500 mb-5">فرم مربوط به بخش خود را انتخاب کنید</p>
        <div class="space-y-3">
          ${cards}
        </div>
      </div>
    `;
  },

  renderReports() {
    const operator = Storage.getCurrentOperator();
    let records = Storage.getRecords();

    if (operator && operator.section !== 'all' && operator.role !== 'admin') {
      records = records.filter(r => r.section === operator.section);
    }

    const typeLabels = {
      rolling: 'خط نورد',
      turning: 'تراشکاری',
      guide: 'هادی‌سازی',
      furnace: 'کوره'
    };

    const typeColors = {
      rolling: 'bg-blue-100 text-blue-700',
      turning: 'bg-amber-100 text-amber-700',
      guide: 'bg-violet-100 text-violet-700',
      furnace: 'bg-rose-100 text-rose-700'
    };

    if (records.length === 0) {
      return `
        <div class="empty-state">
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <i data-lucide="inbox" class="w-8 h-8 text-slate-400"></i>
          </div>
          <h3 class="font-bold text-slate-700 mb-1">هنوز گزارشی ثبت نشده</h3>
          <p class="text-sm text-slate-500 mb-6">از بخش فرم‌ها یک گزارش جدید ثبت کنید</p>
          <button onclick="App.navigate('forms')" class="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium">
            ثبت گزارش جدید
          </button>
        </div>
      `;
    }

    let items = '';
    records.forEach(r => {
      const canDelete = (operator?.role === 'admin' || operator?.role === 'supervisor');
      items += `
        <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                <span class="badge ${typeColors[r.section] || 'bg-slate-100 text-slate-700'}">
                  ${typeLabels[r.section] || r.section}
                </span>
                <span class="text-xs text-slate-400">
                  ${r.shiftTitle || ''} • ${new Date(r.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
              <p class="font-medium text-slate-800 text-sm">${r.title || 'بدون عنوان'}</p>
              <p class="text-xs text-slate-500 mt-1">${r.operatorName || ''}</p>
            </div>
            ${canDelete ? `
              <button data-delete="${r.id}" class="p-2 rounded-lg hover:bg-rose-50 text-rose-500">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    });

    return `
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-slate-800">گزارش‌های ثبت‌شده</h2>
          <span class="text-sm text-slate-500">${records.length} مورد</span>
        </div>
        <div class="space-y-3">
          ${items}
        </div>
      </div>
    `;
  },

  openDrawer() {
    document.getElementById('drawer')?.classList.add('open');
    const overlay = document.getElementById('drawer-overlay');
    overlay?.classList.remove('hidden');
    setTimeout(() => overlay?.classList.add('open'), 10);
  },

  closeDrawer() {
    document.getElementById('drawer')?.classList.remove('open');
    const overlay = document.getElementById('drawer-overlay');
    overlay?.classList.remove('open');
    setTimeout(() => overlay?.classList.add('hidden'), 300);
  },

  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
      success: 'bg-emerald-600 text-white',
      error: 'bg-rose-600 text-white',
      info: 'bg-slate-800 text-white',
      warning: 'bg-amber-500 text-white'
    };

    const toast = document.createElement('div');
    toast.className = 'toast ' + (colors[type] || colors.info);
    toast.innerHTML = '<span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  },

  setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  },

  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') this.toast('اپلیکیشن نصب شد', 'success');
      this.deferredPrompt = null;
    } else {
      this.toast('از منوی مرورگر گزینه «افزودن به صفحه اصلی» را انتخاب کنید', 'info');
    }
  },

  syncData() {
    this.toast('داده‌ها ذخیره شد (حالت آفلاین)', 'success');
  }
};
