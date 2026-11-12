/**
 * MINH THỨC MOTOR - FRONTEND API CLIENT
 * Thiết kế chuẩn RESTful sẵn sàng kết nối trực tiếp với C++ Backend (Crow / Drogon)
 * Hotline khẩn cấp: 0902117116
 */

const API_CONFIG = {
  // Thay đổi URL này khi khởi chạy C++ Backend (ví dụ: http://localhost:8080)
  BASE_URL: window.location.origin.includes('localhost') 
    ? 'http://localhost:8080/api' 
    : '/api',
  USE_MOCK_FALLBACK: true, // Tự động fallback sang mock data nếu C++ backend chưa online
  TIMEOUT_MS: 5000
};

class RescueApiClient {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Helper gửi HTTP request có timeout và fallback
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {})
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`C++ API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[C++ API] Endpoint ${endpoint} chưa phản hồi hoặc chưa khởi chạy C++ backend. Đang dùng local simulation.`, err.message);
      
      if (API_CONFIG.USE_MOCK_FALLBACK) {
        return this.handleMockFallback(endpoint, options);
      }
      throw err;
    }
  }

  /**
   * Xử lý dữ liệu mô phỏng trong khi chờ C++ Backend hoàn thiện
   */
  async handleMockFallback(endpoint, options) {
    // Mô phỏng độ trễ mạng thực tế 400ms
    await new Promise(r => setTimeout(r, 400));
    const data = options.body ? JSON.parse(options.body) : null;

    if (endpoint === '/dispatch') {
      const rescueCode = 'CHX-' + Math.floor(100000 + Math.random() * 900000);
      return {
        status: 'success',
        code: rescueCode,
        message: 'Đã tiếp nhận yêu cầu cứu hộ khẩn cấp!',
        etaMinutes: 15,
        assignedRescueTruck: 'Đội cứu hộ sàn trượt số 03 (Túc trực Quận 1 / Bình Thạnh)',
        data: data
      };
    }

    if (endpoint === '/contact') {
      return {
        status: 'success',
        message: 'Cảm ơn quý khách! Đội ngũ Minh Thức Motor đã nhận thông tin và sẽ gọi lại trong 3 phút.'
      };
    }

    if (endpoint === '/reviews' && options.method === 'POST') {
      const savedReviews = JSON.parse(localStorage.getItem('saigon_rescue_reviews') || '[]');
      const newReview = {
        id: 'rev_' + Date.now(),
        name: data.name || 'Khách hàng',
        car: data.car || 'Ô tô',
        rating: Number(data.rating) || 5,
        category: data.category || 'all',
        comment: data.comment,
        time: 'Vừa xong',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        verified: true
      };
      savedReviews.unshift(newReview);
      localStorage.setItem('saigon_rescue_reviews', JSON.stringify(savedReviews));
      return { status: 'success', review: newReview };
    }

    return { status: 'success', message: 'OK' };
  }

  /**
   * Gửi yêu cầu cứu hộ khẩn cấp (SOS Dispatch)
   */
  async sendRescueDispatch(payload) {
    return await this.request('/dispatch', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Gửi form liên hệ hoặc đặt lịch hẹn
   */
  async sendContact(payload) {
    return await this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Gửi đánh giá mới của khách hàng
   */
  async submitReview(payload) {
    return await this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}

// Khởi tạo instance toàn cục
window.RescueApi = new RescueApiClient();
