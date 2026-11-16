/**
 * Admin Module
 * پنل مدیریت با دسترسی کامل به داده‌ها و فیلدها
 */

const Admin = {
  currentTab: 'dashboard',

  render() {
    return `
      <div class="p-4 pb-8">
        <h2 class="text-xl font-bold text-slate-800 mb-4">پنل مدیریت</h2>
        
        <!-- Admin Tabs -->
        <div class="flex gap-2 overflow-x-auto hide-scrollbar mb-5 pb-1">
          <button data-tab="dashboard" class="admin-tab px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${this.currentTab === 'dashboard' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}">
            داشبورد
          </button>
          <button data-tab="fields" class="admin-tab px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${this.currentTab === 'fields' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}">
            مدیریت فیلدها
          </button>
          <button data-tab="records" class="admin-tab px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${this.currentTab === 'records' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}">
            مدیریت داده‌ها
          </button>
          <button data-tab="users" class="admin-tab px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${this.currentTab === 'users' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}">
            کاربران
          </button>
          <button data-tab="settings" class="admin-tab px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${this.currentTab === 'settings' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}">
            تنظیمات
          </button>
        </div>

        <div id="admin-content">
          ${this.renderTabContent()}
        </div>
      </div>
    `;
  },

  renderTabContent() {
    switch (this.currentTab) {
      case 'dashboard': return this.renderDashboard();
      case 'fields': return this.renderFieldsManager();
      case 'records': return this.renderRecordsManager();
      case 'users': return this.renderUsers();
      case 'settings': return this.renderSettings();
      default: return this.renderDashboard();
    }
  },

  renderDashboard() {
    const records = Storage.getRecords();
    const byType = {
      rolling: records.filter(r => r.type === 'rolling').length,
      turning: records.filter(r => r.type === 'turning').length,
      guide: records.filter(r => r.type === 'guide').length,
      furnace: records.filter(r => r.type === 'furnace').length
    };

    return `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white rounded-2xl p-4 border border-slate-100">
            <p class="text-xs text-slate-500 mb-1">کل رکوردها</p>
            <p class="text-2xl font-bold text-slate-800">${records.length}</p>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-100">
            <p class="text-xs text-slate-500 mb-1">کاربران</p>
            <p class="text-2xl font-bold text-slate-800">${Storage.getUsers().length}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-100">
          <h3 class="font-semibold text-sm text-slate-700 mb-3">توزیع گزارش‌ها</h3>
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600">خط نورد</span>
              <span class="font-bold text-blue-600">${byType.rolling}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600">تراشکاری</span>
              <span class="font-bold text-amber-600">${byType.turning}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600">هادی‌سازی</span>
              <span class="font-bold text-violet-600">${byType.guide}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600">کوره</span>
              <span class="font-bold text-rose-600">${byType.furnace}</span>
            </div>
          </div>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div class="flex gap-3">
            <i data-lucide="shield" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <p class="text-sm font-medium text-amber-800">دسترسی کامل مدیر</p>
              <p class="text-xs text-amber-700 mt-1">شما می‌توانید تمام داده‌ها، فیلدها و تنظیمات را ویرایش، حذف یا اضافه کنید.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderFieldsManager() {
    const formTypes = [
      { key: 'rolling', label: 'خط نورد', color: 'blue' },
      { key: 'turning', label: 'تراشکاری', color: 'amber' },
      { key: 'guide', label: 'هادی‌سازی', color: 'violet' },
      { key: 'furnace', label: 'کوره', color: 'rose' }
    ];

    return `
      <div class="space-y-4">
        <p class="text-sm text-slate-500">از این بخش می‌توانید فیلدهای هر فرم را اضافه، ویرایش یا حذف کنید.</p>
        
        ${formTypes.map(ft => {
          const fields = Storage.getFormFields(ft.key);
          return `
            <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div class="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 class="font-semibold text-sm text-slate-800">${ft.label}</h3>
                <button onclick="Admin.addField('${ft.key}')" class="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-lg">
                  + فیلد جدید
                </button>
              </div>
              <div class="p-3 space-y-2">
                ${fields.length === 0 ? '<p class="text-xs text-slate-400 text-center py-3">فیلدی تعریف نشده</p>' : 
                  fields.map((f, idx) => `
                    <div class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                      <span class="text-xs text-slate-400 w-5">${idx + 1}</span>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-slate-700 truncate">${f.label}</p>
                        <p class="text-[11px] text-slate-400">${f.type} ${f.required ? '• الزامی' : ''}</p>
                      </div>
                      <button onclick="Admin.editField('${ft.key}', '${f.id}')" class="p-1.5 rounded-lg hover:bg-white text-slate-500">
                        <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="Admin.deleteField('${ft.key}', '${f.id}')" class="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  `).join('')
                }
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderRecordsManager() {
    const records = Storage.getRecords();

    return `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-500">${records.length} رکورد موجود</p>
          <button onclick="if(confirm('تمام رکوردها حذف شوند؟')){localStorage.setItem('steel_records','[]');App.toast('همه رکوردها حذف شد','success');Admin.refresh();}" 
                  class="text-xs px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg">
            حذف همه
          </button>
        </div>
        
        ${records.length === 0 ? `
          <div class="text-center py-10 text-slate-400 text-sm">رکوردی وجود ندارد</div>
        ` : records.map(r => `
          <div class="bg-white rounded-xl p-3 border border-slate-100 flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 truncate">${r.title}</p>
              <p class="text-xs text-slate-400">${r.type} • ${new Date(r.createdAt).toLocaleDateString('fa-IR')}</p>
            </div>
            <button onclick="Storage.deleteRecord('${r.id}');App.toast('حذف شد','success');Admin.refresh();" 
                    class="p-2 rounded-lg hover:bg-rose-50 text-rose-500">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderUsers() {
    const users = Storage.getUsers();
    const roleLabels = { admin: 'مدیر', supervisor: 'سرشیفت', operator: 'اپراتور' };

    return `
      <div class="space-y-3">
        ${users.map(u => `
          <div class="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
              ${u.name.charAt(0)}
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm text-slate-800">${u.name}</p>
              <p class="text-xs text-slate-400">${roleLabels[u.role] || u.role} • ${u.username}</p>
            </div>
          </div>
        `).join('')}
        
        <div class="bg-slate-50 rounded-xl p-4 text-center text-xs text-slate-500">
          برای افزودن کاربر جدید در نسخه بعدی امکان‌پذیر خواهد بود
        </div>
      </div>
    `;
  },

  renderSettings() {
    const settings = Storage.getSettings();

    return `
      <div class="space-y-4">
        <div class="bg-white rounded-2xl p-4 border border-slate-100 space-y-4">
          <div>
            <label class="form-label">نام کارخانه</label>
            <input type="text" id="setting-factory" class="form-input" value="${settings.factoryName || ''}">
          </div>
          <div>
            <label class="form-label">نسخه اپلیکیشن</label>
            <input type="text" id="setting-version" class="form-input" value="${settings.version || '1.0.0'}" readonly>
          </div>
          <button onclick="Admin.saveSettings()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-medium text-sm">
            ذخیره تنظیمات
          </button>
        </div>

        <div class="bg-white rounded-2xl p-4 border border-slate-100">
          <h3 class="font-semibold text-sm mb-3">اطلاعات سیستم</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">حالت</span>
              <span class="text-emerald-600 font-medium">آفلاین / PWA</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">ذخیره‌سازی</span>
              <span>LocalStorage</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">آخرین همگام‌سازی</span>
              <span>${settings.lastSync ? new Date(settings.lastSync).toLocaleString('fa-IR') : 'هنوز انجام نشده'}</span>
            </div>
          </div>
        </div>

        <button onclick="if(confirm('تمام داده‌های محلی پاک شود؟')){localStorage.clear();location.reload();}" 
                class="w-full py-3 bg-rose-50 text-rose-700 rounded-xl font-medium text-sm border border-rose-200">
          پاک کردن تمام داده‌ها
        </button>
      </div>
    `;
  },

  // Actions
  addField(formType) {
    const label = prompt('عنوان فیلد جدید را وارد کنید:');
    if (!label) return;

    const fields = Storage.getFormFields(formType);
    const newField = {
      id: 'f_' + Date.now(),
      label: label,
      type: 'text',
      required: false,
      order: fields.length + 1
    };
    fields.push(newField);
    Storage.saveFormFields(formType, fields);
    App.toast('فیلد جدید اضافه شد', 'success');
    this.refresh();
  },

  editField(formType, fieldId) {
    const fields = Storage.getFormFields(formType);
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const newLabel = prompt('عنوان جدید فیلد:', field.label);
    if (newLabel && newLabel !== field.label) {
      field.label = newLabel;
      Storage.saveFormFields(formType, fields);
      App.toast('فیلد ویرایش شد', 'success');
      this.refresh();
    }
  },

  deleteField(formType, fieldId) {
    if (!confirm('این فیلد حذف شود؟')) return;
    let fields = Storage.getFormFields(formType);
    fields = fields.filter(f => f.id !== fieldId);
    Storage.saveFormFields(formType, fields);
    App.toast('فیلد حذف شد', 'success');
    this.refresh();
  },

  saveSettings() {
    const settings = Storage.getSettings();
    settings.factoryName = document.getElementById('setting-factory')?.value || settings.factoryName;
    Storage.saveSettings(settings);
    App.toast('تنظیمات ذخیره شد', 'success');
  },

  refresh() {
    // Re-bind tabs after re-render
    const container = document.getElementById('main-content');
    if (container) {
      container.innerHTML = this.render();
      lucide.createIcons();
      this.bindTabs();
    }
  },

  bindTabs() {
    document.querySelectorAll('.admin-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTab = btn.dataset.tab;
        this.refresh();
      });
    });
  }
};

// Auto-bind when admin page loads
document.addEventListener('click', (e) => {
  if (e.target.closest('.admin-tab')) {
    const btn = e.target.closest('.admin-tab');
    Admin.currentTab = btn.dataset.tab;
    const content = document.getElementById('admin-content');
    if (content) {
      content.innerHTML = Admin.renderTabContent();
      lucide.createIcons();
      
      // Update tab styles
      document.querySelectorAll('.admin-tab').forEach(t => {
        if (t.dataset.tab === Admin.currentTab) {
          t.className = 'admin-tab px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-slate-900 text-white';
        } else {
          t.className = 'admin-tab px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white text-slate-600 border border-slate-200';
        }
      });
    }
  }
});
