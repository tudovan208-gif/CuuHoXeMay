/**
 * MINH THỨC MOTOR 24/7 - CORE LOGIC & INTERACTION SCRIPT
 * Hotline: 0902117116
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initEmergencyForm();
  initPriceCalculator();
  initReviews();
  initContactForm();
  initModals();
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  });

  // Dropdown menus (TP.HCM & Hà Nội)
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  const closeDropdowns = (except = null) => {
    dropdowns.forEach((dd) => {
      if (dd !== except) {
        dd.classList.remove('open');
        const btn = dd.querySelector('.nav-dropdown-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  };

  dropdowns.forEach((dd) => {
    const btn = dd.querySelector('.nav-dropdown-toggle');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 1180;
      const isTouchNoHover = window.matchMedia('(hover: none)').matches;
      if (isMobile || (isTouchNoHover && !dd.classList.contains('open'))) {
        e.preventDefault();
        e.stopPropagation();
        const willOpen = !dd.classList.contains('open');
        closeDropdowns(dd);
        dd.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) closeDropdowns();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      if (navMenu.classList.contains('open')) {
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      } else {
        closeDropdowns();
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      }
    });

    // Close mobile menu on click nav link (except dropdown toggles on mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (link.classList.contains('nav-dropdown-toggle') && window.innerWidth <= 1180) return;
        navMenu.classList.remove('open');
        closeDropdowns();
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdowns();
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      }
    });
  }

  // Active section scrollspy
  function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }
}

/* ==========================================================================
   2. EMERGENCY DISPATCH FORM (HERO WIDGET & QUICK SOS)
   ========================================================================== */
function initEmergencyForm() {
  const form = document.getElementById('heroDispatchForm');
  const btnLocate = document.getElementById('btnLocate');
  const locationInput = document.getElementById('rescueLocation');

  // Lấy vị trí GPS tự động
  if (btnLocate && locationInput) {
    btnLocate.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast('Trình duyệt không hỗ trợ định vị GPS tự động', 'error');
        return;
      }

      btnLocate.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Đang lấy...`;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(5);
          const lng = position.coords.longitude.toFixed(5);
          locationInput.value = `Tọa độ GPS: ${lat}, ${lng} (Đang định vị tại TP.HCM)`;
          btnLocate.innerHTML = `✓ Đã định vị`;
          showToast('Đã xác định tọa độ khẩn cấp thành công!', 'success');
        },
        (error) => {
          console.warn('Geolocation error:', error);
          locationInput.value = 'TP. Hồ Chí Minh (Vui lòng nhập số nhà / tên đường)';
          btnLocate.innerHTML = `Thử lại`;
          showToast('Vui lòng cấp quyền vị trí hoặc nhập trực tiếp tên đường', 'info');
        },
        { timeout: 8000 }
      );
    });
  }

  // Submit emergency dispatch
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const phone = form.rescuePhone.value.trim();
      const location = form.rescueLocation.value.trim();
      const problem = form.rescueProblem.value;
      const vehicleType = form.querySelector('input[name="vehicleType"]:checked')?.value || 'car';

      if (!phone) {
        showToast('Vui lòng nhập số điện thoại để đội cứu hộ liên hệ!', 'error');
        form.rescuePhone.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `Đang kết nối đội xe...`;
      submitBtn.disabled = true;

      try {
        const payload = { phone, location, problem, vehicleType, timestamp: new Date().toISOString() };
        const result = await window.RescueApi.sendRescueDispatch(payload);

        openDispatchSuccessModal(result, payload);
        form.reset();
        if (btnLocate) btnLocate.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v4m0 12v4M2 12h4m12 0h4"></path></svg> <span>Lấy vị trí</span>`;
      } catch (err) {
        showToast('Có lỗi xảy ra. Quý khách vui lòng gọi Hotline trực tiếp 0902117116!', 'error');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// Modal thông báo cứu hộ đang điều động
function openDispatchSuccessModal(result, payload) {
  const modal = document.getElementById('dispatchModal');
  if (!modal) return;

  const modalCode = document.getElementById('dispatchOrderCode');
  const modalVehicle = document.getElementById('dispatchVehicle');
  const modalLocation = document.getElementById('dispatchLocation');
  const modalTruck = document.getElementById('dispatchTruck');

  if (modalCode) modalCode.innerText = result.code || 'CHX-889922';
  if (modalVehicle) modalVehicle.innerText = getVehicleLabel(payload.vehicleType);
  if (modalLocation) modalLocation.innerText = payload.location || 'Khu vực TP. Hồ Chí Minh';
  if (modalTruck) modalTruck.innerText = result.assignedRescueTruck || 'Đội cứu hộ sàn trượt Quận 1 - Bình Thạnh';

  modal.classList.add('active');
  startCountdownTimer(15 * 60, document.getElementById('dispatchTimer'));
}

function getVehicleLabel(type) {
  const map = {
    car: 'Ô tô 4-7 chỗ',
    suv: 'SUV / Bán tải',
    motor: 'Xe máy & PKL',
    vespa: 'Xe Vespa',
    luxury: 'Xe sang gầm thấp',
    truck: 'Xe tải nhẹ'
  };
  return map[type] || 'Phương tiện';
}

function startCountdownTimer(durationSeconds, displayElement) {
  if (!displayElement) return;
  let timer = durationSeconds;
  
  if (window.dispatchInterval) clearInterval(window.dispatchInterval);
  
  window.dispatchInterval = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    displayElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (--timer < 0) {
      clearInterval(window.dispatchInterval);
      displayElement.innerText = "Đội xe đã tới điểm!";
    }
  }, 1000);
}

/* ==========================================================================
   3. INTERACTIVE PRICING CALCULATOR
   ========================================================================== */
function initPriceCalculator() {
  const vehicleSelect = document.getElementById('calcVehicle');
  const serviceSelect = document.getElementById('calcService');
  const distanceRange = document.getElementById('calcDistance');
  const distanceDisplay = document.getElementById('distanceDisplay');
  const priceDisplay = document.getElementById('calcPriceDisplay');
  const btnBookWithPrice = document.getElementById('btnBookWithPrice');

  if (!vehicleSelect || !serviceSelect || !distanceRange || !priceDisplay) return;

  function calculatePrice() {
    const vehicle = vehicleSelect.value;
    const service = serviceSelect.value;
    const km = parseInt(distanceRange.value, 10);

    if (distanceDisplay) {
      distanceDisplay.innerText = `${km} km`;
    }

    // Biểu phí tính toán theo chuẩn TP.HCM
    let basePrice = 0;
    let kmRate = 0;

    // Phí dịch vụ cố định tại chỗ (kích bình, vá vỏ, súc bình)
    if (service === 'battery') {
      if (vehicle === 'motor') basePrice = 150000;
      else if (vehicle === 'car4_5') basePrice = 250000;
      else if (vehicle === 'car7_suv') basePrice = 300000;
      else if (vehicle === 'luxury') basePrice = 350000;
      else basePrice = 400000;
      kmRate = 0; // Cứu hộ tại chỗ không tính km kéo
    } else if (service === 'tire') {
      if (vehicle === 'motor') basePrice = 120000;
      else if (vehicle === 'car4_5') basePrice = 200000;
      else if (vehicle === 'car7_suv') basePrice = 250000;
      else if (vehicle === 'luxury') basePrice = 300000;
      else basePrice = 350000;
      kmRate = 0;
    } else if (service === 'unlock_fuel') {
      basePrice = 250000;
      kmRate = 0;
    } else {
      // Dịch vụ kéo xe / sàn trượt
      if (vehicle === 'motor') {
        basePrice = 200000;
        kmRate = 15000;
      } else if (vehicle === 'car4_5') {
        basePrice = 500000;
        kmRate = 22000;
      } else if (vehicle === 'car7_suv') {
        basePrice = 600000;
        kmRate = 25000;
      } else if (vehicle === 'luxury') {
        basePrice = 750000; // Sàn trượt đặc biệt chống cạ gầm
        kmRate = 28000;
      } else {
        basePrice = 850000;
        kmRate = 32000;
      }
    }

    let total = basePrice;
    if (kmRate > 0 && km > 4) {
      total += (km - 4) * kmRate;
    }

    // Format tiền VND
    priceDisplay.innerText = new Intl.NumberFormat('vi-VN').format(total) + ' đ';
  }

  vehicleSelect.addEventListener('change', calculatePrice);
  serviceSelect.addEventListener('change', calculatePrice);
  distanceRange.addEventListener('input', calculatePrice);

  // Quick book based on calculation
  if (btnBookWithPrice) {
    btnBookWithPrice.addEventListener('click', () => {
      const vText = vehicleSelect.options[vehicleSelect.selectedIndex].text;
      const sText = serviceSelect.options[serviceSelect.selectedIndex].text;
      const price = priceDisplay.innerText;

      // Scroll to emergency form and auto-fill note
      const heroForm = document.getElementById('heroDispatchForm');
      if (heroForm) {
        heroForm.scrollIntoView({ behavior: 'smooth' });
        const locationInput = document.getElementById('rescueLocation');
        if (locationInput && !locationInput.value) {
          locationInput.placeholder = `Báo giá ước tính: ${price} (${sText})`;
        }
        showToast(`Đã chọn: ${sText} cho ${vText}. Giá ước tính ${price}`, 'info');
      }
    });
  }

  // Initial calculation
  calculatePrice();
}

/* ==========================================================================
   4. CUSTOMER REVIEWS (REALTIME FILTER & REVIEW SUBMISSION)
   ========================================================================== */
const DEFAULT_REVIEWS = [
  {
    id: 'rev_1',
    name: 'Anh Trần Minh Tuấn',
    car: 'Toyota Vios (Bình Thạnh)',
    rating: 5,
    category: 'car',
    comment: 'Xe mình bị ngập nước chết máy gần cầu Sài Gòn. Gọi bên Minh Thức Motor khoảng 15 phút là anh em kỹ thuật có mặt kéo về gara an toàn. Làm việc rất cẩn thận và nhiệt tình.',
    time: '2 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'rev_2',
    name: 'Chị Lê Thị Bích Trâm',
    car: 'Hyundai Accent (Quận 7)',
    rating: 5,
    category: 'battery',
    comment: 'Sáng sớm chuẩn bị đi làm thì xe hết bình ắc quy đề không lên. May gọi hotline 0902117116 được hỗ trợ kích bình tận nơi chỉ trong 15 phút. Giá chuẩn 250k như tư vấn, rất nhanh gọn!',
    time: '4 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'rev_3',
    name: 'Bác Nguyễn Hoàng Long',
    car: 'Mitsubishi Xpander (Thủ Đức)',
    rating: 5,
    category: 'garage',
    comment: 'Xe bị sự cố hộp số giữa đường, đội cứu hộ đưa xe sàn trượt tới kéo về gara quen gần nhà. Tài xế lái xe cẩn thận, không làm trầy xước xe. Rất an tâm!',
    time: '1 tuần trước',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'rev_4',
    name: 'Anh Đỗ Quang Hải',
    car: 'Honda SH 150i (Quận 1)',
    rating: 5,
    category: 'motor',
    comment: 'Xe tay ga bị đứt curoa lúc tối muộn. Đội cứu hộ có xe bán tải chở xe về tận tiệm sửa xe, chằng dây cẩn thận không một vết xước. Phục vụ chu đáo.',
    time: '1 tuần trước',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'rev_5',
    name: 'Anh Vũ Hoàng Đức',
    car: 'Kia Morning (Gò Vấp)',
    rating: 5,
    category: 'battery',
    comment: 'Xe để lâu trong bãi không đi hết sạch điện bình. Thợ mang máy kích tới nổ máy trong 3 phút, kiểm tra đo sạc ắc quy cẩn thận miễn phí.',
    time: '2 tuần trước',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    verified: true
  },
  {
    id: 'rev_6',
    name: 'Chị Phạm Mai Khanh',
    car: 'Ford Ranger (Cao tốc Long Thành)',
    rating: 5,
    category: 'car',
    comment: 'Bị cán đinh nát lốp lúc 1h sáng trên cao tốc. Đội cứu hộ chạy đến thay lốp sơ cua và vá lại nhanh chóng giữa đêm. Cực kỳ biết ơn các anh, làm việc 24/24 chuẩn giờ.',
    time: '2 tuần trước',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    verified: true
  }
];

function initReviews() {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const openReviewModalBtn = document.getElementById('btnOpenReviewModal');
  const reviewForm = document.getElementById('newReviewForm');

  let currentCategory = 'all';

  function getAllReviews() {
    const local = JSON.parse(localStorage.getItem('saigon_rescue_reviews') || '[]');
    return [...local, ...DEFAULT_REVIEWS];
  }

  function renderReviews() {
    if (!reviewsContainer) return;
    const all = getAllReviews();
    const filtered = currentCategory === 'all' 
      ? all 
      : all.filter(r => r.category === currentCategory || currentCategory === 'all');

    reviewsContainer.innerHTML = filtered.map(r => `
      <div class="review-card">
        <div>
          <div class="review-top">
            <div class="review-author-wrap">
              <img src="${r.avatar}" alt="${r.name}" class="author-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'">
              <div>
                <div class="author-name">${escapeHtml(r.name)}</div>
                <div class="author-car">${escapeHtml(r.car)}</div>
              </div>
            </div>
            <div class="verified-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Đã xác thực
            </div>
          </div>
          <div class="rating-stars" style="margin-bottom: 12px;">
            ${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}
          </div>
          <p class="review-comment">"${escapeHtml(r.comment)}"</p>
        </div>
        <div class="review-bottom">
          <span class="review-tag">${getCategoryTag(r.category)}</span>
          <span>${r.time}</span>
        </div>
      </div>
    `).join('');
  }

  function getCategoryTag(cat) {
    const map = {
      all: 'Cứu hộ tổng hợp',
      car: 'Cứu hộ ô tô',
      battery: 'Kích bình ắc quy',
      garage: 'Chở về Gara',
      motor: 'Cứu hộ xe máy'
    };
    return map[cat] || 'Khách hàng 24/7';
  }

  // Filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      renderReviews();
    });
  });

  // Modal open
  if (openReviewModalBtn) {
    openReviewModalBtn.addEventListener('click', () => {
      const modal = document.getElementById('reviewModal');
      if (modal) modal.classList.add('active');
    });
  }

  // Submit new review
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = reviewForm.reviewName.value.trim();
      const car = reviewForm.reviewCar.value.trim();
      const rating = parseInt(reviewForm.reviewRating.value, 10) || 5;
      const category = reviewForm.reviewCategory.value;
      const comment = reviewForm.reviewComment.value.trim();

      if (!name || !comment) {
        showToast('Vui lòng điền họ tên và nội dung đánh giá!', 'error');
        return;
      }

      const payload = { name, car, rating, category, comment };
      await window.RescueApi.submitReview(payload);

      showToast('Cảm ơn quý khách đã gửi đánh giá quý báu!', 'success');
      reviewForm.reset();
      const modal = document.getElementById('reviewModal');
      if (modal) modal.classList.remove('active');
      renderReviews();
    });
  }

  renderReviews();
}

/* ==========================================================================
   5. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('mainContactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.contactName.value.trim();
    const phone = form.contactPhone.value.trim();
    const service = form.contactService.value;
    const message = form.contactMessage.value.trim();

    if (!name || !phone) {
      showToast('Vui lòng nhập tên và số điện thoại liên hệ!', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `Đang gửi yêu cầu...`;
    submitBtn.disabled = true;

    try {
      const payload = { name, phone, service, message };
      const res = await window.RescueApi.sendContact(payload);
      showToast(res.message || 'Gửi liên hệ thành công! Tổng đài sẽ gọi lại ngay.', 'success');
      form.reset();
    } catch (err) {
      showToast('Có lỗi xảy ra. Quý khách vui lòng gọi Hotline 0902117116!', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   6. MODAL UTILITIES
   ========================================================================== */
function initModals() {
  const closeBtns = document.querySelectorAll('.modal-close-btn, [data-close-modal]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
      if (window.dispatchInterval) clearInterval(window.dispatchInterval);
    });
  });

  // Close when clicking outside modal card
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        if (window.dispatchInterval) clearInterval(window.dispatchInterval);
      }
    });
  });
}

/* ==========================================================================
   7. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6600" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg} <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
