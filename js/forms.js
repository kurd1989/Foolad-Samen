/**
 * Forms Module
 * فرم‌های ثبت گزارش خط تولید میلگرد
 */

const Forms = {
  stands: ['رافینگ', 'استند ۱', 'استند ۲', 'استند ۳', 'استند ۴', 'استند ۵',
           'استند ۶', 'استند ۷', 'استند ۸', 'استند ۹', 'استند ۱۰', 'استند ۱۱', 'استند ۱۲'],

  renderRollingForm() {
    const fields = Storage.getFormFields('rolling');
    const operator = Storage.getCurrentOperator();
    const shift = Storage.getCurrentShift();
    const today = new Date().toISOString().split('T')[0];

    let checkItems = '';
    fields.forEach(f => {
      checkItems += `
        <div class="check-item" data-field="${f.id}">
          <div class="check-box">
            <i data-lucide="check" class="w-4 h-4 text-white hidden check-icon"></i>
          </div>
          <span class="text-sm text-slate-700 flex-1">${f.label}</span>
          <input type="checkbox" name="check_${f.id}" class="hidden">
        </div>
      `;
    });

    let standBtns = '';
    this.stands.forEach((s, i) => {
      standBtns += `<button type="button" class="stand-btn" data-stand="${i}">${s}</button>`;
    });

    return `
      <div class="p-4 pb-8">
        <div class="flex items-center gap-3 mb-5">
          <button onclick="App.navigate('forms')" class="p-2 rounded-lg hover:bg-slate-100">
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
          <div>
            <h2 class="text-lg font-bold text-slate-800">چک‌لیست خط نورد</h2>
            <p class="text-xs text-slate-500">رافینگ + استند ۱ تا ۱۲</p>
          </div>
        </div>

        <form id="main-form" class="space-y-5">
          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <h3 class="font-semibold text-slate-700 text-sm">اطلاعات شیفت و اپراتور</h3>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label">شیفت</label>
                <select name="shift" class="form-select" required>
                  <option value="day" ${shift.id === 'day' ? 'selected' : ''}>روزکار (۰۷:۰۰-۱۹:۰۰)</option>
                  <option value="night" ${shift.id === 'night' ? 'selected' : ''}>شب‌کار (۱۹:۰۰-۰۷:۰۰)</option>
                </select>
              </div>
              <div>
                <label class="form-label">تاریخ</label>
                <input type="date" name="date" class="form-input" value="${today}" required>
              </div>
              <div>
                <label class="form-label">اپراتور</label>
                <input type="text" name="operator" class="form-input" value="${operator?.name || ''}" required>
              </div>
              <div>
                <label class="form-label">سرشیفت</label>
                <input type="text" name="supervisor" class="form-input" placeholder="نام سرشیفت">
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 class="font-semibold text-slate-700 text-sm mb-3">انتخاب دستگاه‌ها / استندها</h3>
            <div class="stand-grid">${standBtns}</div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 class="font-semibold text-slate-700 text-sm mb-3">آیتم‌های بازرسی</h3>
            <div class="space-y-2">${checkItems}</div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <label class="form-label">توضیحات و مشکلات مشاهده‌شده</label>
            <textarea name="notes" rows="3" class="form-input" placeholder="در صورت وجود مشکل یا نکته خاص بنویسید..."></textarea>
          </div>

          <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition">
            ثبت چک‌لیست خط نورد
          </button>
        </form>
      </div>
    `;
  },

  renderTurningForm() {
    const fields = Storage.getFormFields('turning');
    const operator = Storage.getCurrentOperator();
    const shift = Storage.getCurrentShift();

    let fieldHtml = '';
    fields.forEach(f => {
      fieldHtml += this.renderField(f);
    });

    return `
      <div class="p-4 pb-8">
        <div class="flex items-center gap-3 mb-5">
          <button onclick="App.navigate('forms')" class="p-2 rounded-lg hover:bg-slate-100">
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
          <div>
            <h2 class="text-lg font-bold text-slate-800">گزارش کار تراشکاری</h2>
            <p class="text-xs text-slate-500">ثبت کار روزانه پرسنل</p>
          </div>
        </div>

        <form id="main-form" class="space-y-5">
          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <div>
              <label class="form-label">نام اپراتور</label>
              <input type="text" name="operator" class="form-input" value="${operator?.name || ''}" required>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label">شیفت</label>
                <select name="shift" class="form-select" required>
                  <option value="day" ${shift.id === 'day' ? 'selected' : ''}>روزکار</option>
                  <option value="night" ${shift.id === 'night' ? 'selected' : ''}>شب‌کار</option>
                </select>
              </div>
              <div>
                <label class="form-label">تاریخ</label>
                <input type="date" name="date" class="form-input" value="${new Date().toISOString().split('T')[0]}" required>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <h3 class="font-semibold text-slate-700 text-sm">اطلاعات قطعه و کار</h3>
            ${fieldHtml}
          </div>

          <button type="submit" class="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition">
            ثبت گزارش کار تراشکاری
          </button>
        </form>
      </div>
    `;
  },

  renderGuideForm() {
    const operator = Storage.getCurrentOperator();
    const shift = Storage.getCurrentShift();
    const today = new Date().toISOString().split('T')[0];

    let standBtns = '';
    this.stands.forEach((s, i) => {
      standBtns += `<button type="button" class="stand-btn" data-stand="${i}">${s}</button>`;
    });

    return `
      <div class="p-4 pb-8">
        <div class="flex items-center gap-3 mb-5">
          <button onclick="App.navigate('forms')" class="p-2 rounded-lg hover:bg-slate-100">
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
          <div>
            <h2 class="text-lg font-bold text-slate-800">هادی‌سازی</h2>
            <p class="text-xs text-slate-500">گزارش تعویض قطعات</p>
          </div>
        </div>

        <form id="main-form" class="space-y-5">
          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label">تاریخ</label>
                <input type="date" name="date" class="form-input" value="${today}" required>
              </div>
              <div>
                <label class="form-label">شیفت</label>
                <select name="shift" class="form-select" required>
                  <option value="day" ${shift.id === 'day' ? 'selected' : ''}>روزکار</option>
                  <option value="night" ${shift.id === 'night' ? 'selected' : ''}>شب‌کار</option>
                </select>
              </div>
            </div>
            <div>
              <label class="form-label">نام پرسنل</label>
              <input type="text" name="operator" class="form-input" value="${operator?.name || ''}" required>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <h3 class="font-semibold text-slate-700 text-sm">جزئیات تعویض</h3>
            <div>
              <label class="form-label">موقعیت</label>
              <select name="position" class="form-select" required>
                <option value="">انتخاب کنید</option>
                <option value="ورودی">ورودی</option>
                <option value="خروجی">خروجی</option>
              </select>
            </div>
            <div>
              <label class="form-label">نوع فعالیت</label>
              <select name="activity" class="form-select" required>
                <option value="">انتخاب کنید</option>
                <option value="تعویض جعبه">تعویض جعبه</option>
                <option value="تعویض ناخنی">تعویض ناخنی</option>
                <option value="تعویض لوله یا راگا">تعویض لوله یا راگا</option>
                <option value="تعویض کنسولی">تعویض کنسولی</option>
              </select>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 class="font-semibold text-slate-700 text-sm mb-3">دستگاه‌های مرتبط</h3>
            <div class="stand-grid">${standBtns}</div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <label class="form-label">توضیحات</label>
            <textarea name="notes" rows="2" class="form-input" placeholder="توضیحات اضافی..."></textarea>
          </div>

          <button type="submit" class="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition">
            ثبت تعویض هادی‌سازی
          </button>
        </form>
      </div>
    `;
  },

  renderFurnaceForm() {
    const operator = Storage.getCurrentOperator();
    const shift = Storage.getCurrentShift();
    const today = new Date().toISOString().split('T')[0];

    return `
      <div class="p-4 pb-8">
        <div class="flex items-center gap-3 mb-5">
          <button onclick="App.navigate('forms')" class="p-2 rounded-lg hover:bg-slate-100">
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
          <div>
            <h2 class="text-lg font-bold text-slate-800">چک‌لیست کوره</h2>
            <p class="text-xs text-slate-500">علت سردی و توقفات کوره</p>
          </div>
        </div>

        <form id="main-form" class="space-y-5">
          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <div>
              <label class="form-label">تاریخ</label>
              <input type="date" name="date" class="form-input" value="${today}" required>
            </div>
            <div>
              <label class="form-label">نوبت کاری</label>
              <select name="shift" class="form-select" required>
                <option value="day" ${shift.id === 'day' ? 'selected' : ''}>روزکار (۰۷:۰۰ تا ۱۹:۰۰)</option>
                <option value="night" ${shift.id === 'night' ? 'selected' : ''}>شب‌کار (۱۹:۰۰ تا ۰۷:۰۰)</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label">گروه کاری</label>
                <input type="text" name="group" class="form-input" placeholder="گروه">
              </div>
              <div>
                <label class="form-label">سرپرست کوره</label>
                <input type="text" name="supervisor" class="form-input" placeholder="نام سرپرست" value="${operator?.name || ''}">
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <h3 class="font-semibold text-slate-700 text-sm">اطلاعات توقف</h3>
            <div>
              <label class="form-label">مدت توقف (دقیقه)</label>
              <input type="number" name="stopDuration" class="form-input" min="0" placeholder="مثلاً ۳۰">
            </div>
            <div>
              <label class="form-label">توضیحات علت سردی / توقف</label>
              <textarea name="notes" rows="3" class="form-input" placeholder="علت را شرح دهید..." required></textarea>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
            <div class="check-item" data-field="billet">
              <div class="check-box">
                <i data-lucide="check" class="w-4 h-4 text-white hidden check-icon"></i>
              </div>
              <span class="text-sm text-slate-700 flex-1">بازدید شمش انجام شد</span>
              <input type="checkbox" name="billetCheck" class="hidden">
            </div>
            <div class="check-item" data-field="oxide">
              <div class="check-box">
                <i data-lucide="check" class="w-4 h-4 text-white hidden check-icon"></i>
              </div>
              <span class="text-sm text-slate-700 flex-1">تخلیه اکسید دهانه کوره</span>
              <input type="checkbox" name="oxideDischarge" class="hidden">
            </div>
          </div>

          <button type="submit" class="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition">
            ثبت چک‌لیست کوره
          </button>
        </form>
      </div>
    `;
  },

  renderField(field) {
    if (field.type === 'text' || field.type === 'number' || field.type === 'date') {
      return `
        <div>
          <label class="form-label">${field.label}${field.required ? ' *' : ''}</label>
          <input type="${field.type}" name="${field.id}" class="form-input" ${field.required ? 'required' : ''}>
        </div>
      `;
    }
    if (field.type === 'select') {
      let options = '<option value="">انتخاب کنید</option>';
      (field.options || []).forEach(o => {
        options += `<option value="${o}">${o}</option>`;
      });
      return `
        <div>
          <label class="form-label">${field.label}${field.required ? ' *' : ''}</label>
          <select name="${field.id}" class="form-select" ${field.required ? 'required' : ''}>
            ${options}
          </select>
        </div>
      `;
    }
    if (field.type === 'textarea') {
      return `
        <div>
          <label class="form-label">${field.label}${field.required ? ' *' : ''}</label>
          <textarea name="${field.id}" rows="2" class="form-input" ${field.required ? 'required' : ''}></textarea>
        </div>
      `;
    }
    return '';
  },

  handleSubmit(page) {
    const form = document.getElementById('main-form');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const checkedItems = [];
    document.querySelectorAll('.check-item.checked').forEach(item => {
      checkedItems.push(item.dataset.field);
    });

    const selectedStands = [];
    document.querySelectorAll('.stand-btn.active').forEach(btn => {
      selectedStands.push(parseInt(btn.dataset.stand));
    });

    const operator = Storage.getCurrentOperator();
    const shiftMap = { day: 'روزکار', night: 'شب‌کار' };

    let section = '';
    let title = '';

    switch (page) {
      case 'form-rolling':
        section = 'rolling';
        title = 'چک‌لیست نورد - ' + (shiftMap[data.shift] || '') + ' - ' + (data.operator || '');
        break;
      case 'form-turning':
        section = 'turning';
        title = 'تراشکاری - ' + (data.t1 || data.operator || 'بدون عنوان');
        break;
      case 'form-guide':
        section = 'guide';
        title = 'هادی‌سازی - ' + (data.activity || '') + ' - ' + (data.position || '');
        break;
      case 'form-furnace':
        section = 'furnace';
        title = 'کوره - ' + (shiftMap[data.shift] || '') + ' - توقف ' + (data.stopDuration || 0) + ' دقیقه';
        break;
    }

    const record = {
      section,
      title,
      operatorName: data.operator || data.supervisor || operator?.name || '',
      shift: data.shift || '',
      shiftTitle: shiftMap[data.shift] || '',
      date: data.date || '',
      data: Object.assign({}, data, { checkedItems, selectedStands })
    };

    Storage.saveRecord(record);
    App.toast('گزارش با موفقیت ثبت شد', 'success');
    
    setTimeout(() => {
      App.navigate('reports');
    }, 700);
  }
};
