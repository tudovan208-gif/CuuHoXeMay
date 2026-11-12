# TÀI LIỆU KẾT NỐI VÀ HƯỚNG DẪN XÂY DỰNG BACKEND BẰNG C++
## Hệ Thống: Cứu Hộ Minh Thức Motor 24/7 (Hotline: 0902117116)

Tài liệu này được thiết kế để chuẩn bị sẵn sàng cho bước tiếp theo khi quý khách phát triển phần **Backend bằng ngôn ngữ C++**, giúp kết nối trơn tru với toàn bộ giao diện Frontend đã hoàn thiện.

---

### 1. KIẾN TRÚC TỔNG THỂ (C++ REST API SERVER)

Frontend hiện tại đã tích hợp sẵn module `js/api.js`. Khi backend C++ khởi chạy (mặc định tại cổng `8080`), chỉ cần chạy backend là frontend sẽ tự động giao tiếp trực tiếp qua các REST API endpoints chuẩn JSON.

```
       +---------------------------------------------+
       |           FRONTEND (HTML5/CSS3/ES6)         |
       |  - Trang chủ & SOS Dispatch                 |
       |  - Bảng giá & Công cụ dự tính               |
       |  - Đánh giá khách hàng & Form liên hệ       |
       +----------------------+----------------------+
                              |  HTTP / REST (JSON)
                              v
       +---------------------------------------------+
       |             C++ BACKEND SERVER              |
       |  Framework khuyên dùng: Crow C++ / Drogon   |
       |  - Bộ định tuyến REST API (Router)          |
       |  - Module Dispatch Khẩn Cấp (SMS / Telegram)|
       |  - Phục vụ Static Files (index.html, css, js)|
       +----------------------+----------------------+
                              |
                              v
       +---------------------------------------------+
       |               CƠ SỞ DỮ LIỆU                 |
       |       SQLite / PostgreSQL / MySQL           |
       +---------------------------------------------+
```

---

### 2. DANH SÁCH ENDPOINTS CẦN HIỆN THỰC BẰNG C++

#### Endpoint 1: Điều xe cứu hộ khẩn cấp
- **Method**: `POST`
- **Route**: `/api/dispatch`
- **Request Body (JSON)**:
  ```json
  {
    "phone": "0901234567",
    "location": "Cầu Sài Gòn, hướng từ Q1 qua Bình Thạnh",
    "problem": "battery",
    "vehicleType": "car",
    "timestamp": "2026-09-27T12:00:00.000Z"
  }
  ```
- **Response (JSON)**:
  ```json
  {
    "status": "success",
    "code": "CHX-889922",
    "message": "Đã tiếp nhận yêu cầu cứu hộ khẩn cấp!",
    "etaMinutes": 15,
    "assignedRescueTruck": "Đội cứu hộ sàn trượt số 02 (Bình Thạnh)"
  }
  ```

#### Endpoint 2: Gửi thông tin liên hệ / Đặt lịch
- **Method**: `POST`
- **Route**: `/api/contact`
- **Request Body (JSON)**:
  ```json
  {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "service": "emergency",
    "message": "Xe hết bình tại hầm Landmark 81"
  }
  ```
- **Response (JSON)**:
  ```json
  {
    "status": "success",
    "message": "Cảm ơn quý khách! Tổng đài 0902117116 sẽ gọi lại trong 3 phút."
  }
  ```

#### Endpoint 3: Lấy danh sách đánh giá của khách hàng
- **Method**: `GET`
- **Route**: `/api/reviews`
- **Response (JSON)**:
  ```json
  [
    {
      "id": "rev_1",
      "name": "Anh Trần Minh Tuấn",
      "car": "Mercedes C300 AMG",
      "rating": 5,
      "category": "luxury",
      "comment": "Cứu hộ sàn trượt đến rất nhanh, không trầy gầm xe...",
      "time": "2 ngày trước",
      "verified": true
    }
  ]
  ```

#### Endpoint 4: Thêm đánh giá mới
- **Method**: `POST`
- **Route**: `/api/reviews`
- **Request Body (JSON)**:
  ```json
  {
    "name": "Chị Lê Hoa",
    "car": "Mazda 3",
    "rating": 5,
    "category": "battery",
    "comment": "Dịch vụ kích bình rất nhanh và đúng giá."
  }
  ```

---

### 3. MÃ NGUỒN C++ MẪU (SỬ DỤNG CROW C++ FRAMEWORK)

Dưới đây là đoạn mã nguồn mẫu hoàn chỉnh bằng C++20 sử dụng thư viện **Crow** (nhẹ, nhanh và cú pháp tương tự Express/Flask):

```cpp
// server.cpp
#include "crow.h"
#include <iostream>
#include <string>
#include <random>

std::string generate_order_code() {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    static std::uniform_int_distribution<> dis(100000, 999999);
    return "CHX-" + std::to_string(dis(gen));
}

int main() {
    crow::SimpleApp app;

    // Bật CORS cho phép frontend gọi API mượt mà
    // Route 1: Kiểm tra trạng thái hệ thống
    CROW_ROUTE(app, "/api/health")([]() {
        crow::json::wvalue res;
        res["status"] = "online";
        res["service"] = "Cuu Ho Minh Thuc Motor 24/7";
        res["hotline"] = "0902117116";
        return res;
    });

    // Route 2: Tiếp nhận yêu cầu cứu hộ khẩn cấp
    CROW_ROUTE(app, "/api/dispatch").methods("POST"_method)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON payload");
        }

        std::string phone = body["phone"].s();
        std::string location = body["location"].s();
        std::string problem = body["problem"].s();

        std::cout << "[SOS DISPATCH] Khách gọi: " << phone 
                  << " | Vị trí: " << location 
                  << " | Sự cố: " << problem << std::endl;

        // Xử lý gửi thông báo đến Telegram Bot hoặc SMS tài xế tại đây...

        crow::json::wvalue res;
        res["status"] = "success";
        res["code"] = generate_order_code();
        res["etaMinutes"] = 15;
        res["assignedRescueTruck"] = "Đội cứu hộ sàn trượt trung tâm Q1 - Bình Thạnh";
        res["message"] = "Đã tiếp nhận yêu cầu! Đội cứu hộ đang xuất phát.";

        crow::response response(res);
        response.add_header("Access-Control-Allow-Origin", "*");
        response.add_header("Content-Type", "application/json");
        return response;
    });

    // Route 3: Form liên hệ
    CROW_ROUTE(app, "/api/contact").methods("POST"_method)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        std::cout << "[CONTACT] " << body["name"].s() 
                  << " (" << body["phone"].s() << "): " 
                  << body["message"].s() << std::endl;

        crow::json::wvalue res;
        res["status"] = "success";
        res["message"] = "Cảm ơn quý khách! Tổng đài 0902117116 đã tiếp nhận.";

        crow::response response(res);
        response.add_header("Access-Control-Allow-Origin", "*");
        return response;
    });

    std::cout << "==================================================" << std::endl;
    std::cout << " CỨU HỘ MINH THỨC MOTOR C++ BACKEND SERVER STARTED" << std::endl;
    std::cout << " Port: 8080 | Hotline: 0902117116               " << std::endl;
    std::cout << "==================================================" << std::endl;

    app.port(8080).multithreaded().run();
    return 0;
}
```

---

### 4. HƯỚNG DẪN BIÊN DỊCH VÀ KHỞI CHẠY C++ BACKEND

Khi quý khách yêu cầu làm backend sau, các bước thực hiện sẽ là:
1. Tạo file `CMakeLists.txt`:
   ```cmake
   cmake_minimum_required(VERSION 3.14)
   project(MinhThucMotorBackend)
   set(CMAKE_CXX_STANDARD 20)

   find_package(Crow REQUIRED)
   add_executable(server server.cpp)
   target_link_libraries(server Crow::Crow)
   ```
2. Build bằng `g++` hoặc `clang` hoặc `MSVC (Visual Studio)`:
   ```bash
   mkdir build && cd build
   cmake ..
   cmake --build .
   ./server
   ```
3. Khi server chạy tại `http://localhost:8080`, frontend sẽ tự động chuyển từ chế độ mô phỏng sang chế độ kết nối dữ liệu thật 100%!
