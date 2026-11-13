# Minh Thức Motor — UI/UX & Brand Design System Rules

Tài liệu này định nghĩa bộ quy chuẩn thiết kế (Design System) và trải nghiệm người dùng (UI/UX) bắt buộc cho dự án **Minh Thức Motor 24/7**. Mọi AI Agent khi chỉnh sửa hoặc tạo mới giao diện trong kho code này phải tuân thủ nghiêm ngặt các nguyên tắc dưới đây để tránh giao diện "khuôn mẫu AI" (AI-generated template clichés).

---

## 1. Cá Tính Thương Hiệu (Brand Persona): "Industrial Editorial & Daylight Rescue"
- **Tinh thần chủ đạo:** Xưởng kỹ thuật cơ khí chính hãng kết hợp Trung tâm điều phối khẩn cấp ban ngày (lấy cảm hứng từ Porsche Service, Bosch Car Service, Grab Rescue).
- **Sáng sủa & Độ tương phản cao ngoài trời:** Khách hàng gọi cứu hộ thường đang đứng ngoài đường dưới trời nắng gắt hoặc trong tình huống khẩn cấp. Giao diện **BẮT BUỘC dùng nền sáng (Daylight-first)** làm chủ đạo:
  - Nền chính (`--bg-main`): Trắng sứ ấm `#FAF8F5` và Trắng tinh khiết `#FFFFFF`.
  - Nền phân tách khu vực (`--bg-surface`): Xám đá sáng `#F1F5F9` hoặc Kem nhạt `#FFF7ED`.
  - Chữ chính (`--text-main`): Xanh than cơ khí đậm `#0F172A` (tương phản AAA).
  - Điểm nhấn thương hiệu (`--primary`): Cam cứu hộ cơ khí `#EA580C` kết hợp Đỏ tín hiệu khẩn cấp `#DC2626` và Xanh lá trực chiến `#16A34A`.

---

## 2. Các Khuôn Mẫu AI Bị Cấm Tuyệt Đối (Anti-AI-Cliché Rules)
1. **CẤM phủ màn đen u tối lên toàn trang:** Không dùng Header đen đặc, không phủ lớp `rgba(0,0,0,0.85)` tối sầm lên toàn bộ màn hình Hero, không dùng Modal/Popup nền đen.
2. **CẤM lặp lại công thức tiêu đề AI:** Không được thiết kế mọi section đều theo một khuôn: *"Badge hình viên thuốc căn giữa + Tiêu đề IN HOA có 2 chữ cuối tô màu gradient cam-vàng + Mô tả 2 dòng căn giữa"*.
3. **CẤM lạm dụng chữ Gradient và đèn Neon (`box-shadow` glow lòe loẹt):** Chỉ dùng màu đặc (solid color) sắc nét, hoặc gạch chân/khối highlight kỹ thuật.
4. **CẤM đóng khung 3 cột thẻ giống hệt nhau từ đầu đến cuối trang:** Phải thay đổi nhịp điệu bố cục (Visual Rhythm) giữa các khu vực:
   - Khu vực Mở đầu (Hero): Bố cục bất đối xứng (Editorial Split) + Khung ảnh thực địa + Bảng điều lệnh (Dispatch Console) đánh số bước `01 → 04`.
   - Khu vực Quy trình: Dải băng 4 bước ngang (Horizontal Process Strip) có số thứ tự lớn (`01`, `02`, `03`, `04`).
   - Khu vực Dịch vụ: Tiêu đề 2 cột bất đối xứng (trái: tiêu đề lớn, phải: thông số/mô tả) + Thẻ hồ sơ kỹ thuật có mã dịch vụ (`SRV-01`..`SRV-06`).
   - Khu vực Bảng giá: Giao diện bảng niêm yết minh bạch kèm Công cụ tự tính phí cứu hộ theo km thực tế.

---

## 3. Nguyên Tắc UX Cho Dịch Vụ Cứu Hộ Khẩn Cấp
- **Quy tắc 3 giây:** Trong 3 giây đầu tiên mở trang, người dùng phải thấy ngay: (1) Số Hotline bấm gọi 1 chạm, (2) Thời gian có mặt cam kết (15 phút), và (3) Công cụ gửi vị trí GPS điều xe.
- **Số liệu & Mã định danh kỹ thuật (Monospace / Tabular Numerals):** Mọi con số (giá tiền, số điện thoại, thời gian đếm ngược, mã trạm trực) phải rõ ràng, thẳng hàng (`font-variant-numeric: tabular-nums`), tạo cảm giác chính xác của ngành kỹ thuật ô tô - xe máy.

---

## 4. Quy Tắc Bắt Buộc Về Bố Cục Cân Đối, Nội Dung Ngắn Gọn & Rõ Thao Tác
Mọi AI Agent khi tạo mới hoặc chỉnh sửa bất kỳ khu vực nào trên trang đều **PHẢI KIỂM TRA 3 TIÊU CHÍ NÀY**:

1. **Bố cục Cân đối Tuyệt đối (Strict Layout Symmetry & Grid Alignment):**
   - **Bằng mép trên & mép dưới:** Mọi lưới 2 cột (`.hero-grid`, `.pricing-wrapper`, `.contact-grid`), 3 cột (`.services-grid`), 4 cột (`.workflow-grid`, `.coverage-grid`) bắt buộc dùng `align-items: stretch` và thẻ con có `height: 100%` + `display: flex; flex-direction: column; justify-content: space-between` để mép trên và mép dưới của các cột ngang hàng luôn thẳng tắp 100%.
   - **Không rớt dòng lẻ loi (No Orphan Buttons/Cards):** Nhóm nút hành động (`.hero-cta-group`) chỉ đặt tối đa **2 nút chính nằm ngang bằng nhau** trên cùng 1 hàng, tuyệt đối không để nút thứ 3 bị rớt xuống dòng thứ 2 gây lệch bố cục.
   - **Lưới 2x2 Đối xứng:** Khi một khu vực có 4 khối thông tin (như Bảng giá gồm: *Công cụ tính phí*, *Biểu phí niêm yết*, *Hỗ trợ đa hãng*, *Cam kết 4 Không*), phải đặt trực tiếp vào lưới `grid-template-columns: 1fr 1fr` (2 hàng x 2 cột) thay vì chồng 2 cột lệch nhau và cấm dùng `position: sticky` làm lệch mép thẻ.

2. **Nội dung Ngắn gọn, Đúng Trọng tâm (Concise & Scannable Microcopy):**
   - **Tiêu đề chính (H1, H2):** Tối đa **8 – 12 từ**, gãy gọn, đi thẳng vào giải pháp cứu hộ.
   - **Mô tả phụ (Subtitle / Section Desc / Card Desc):** Tối đa **1 – 2 dòng ngắn (14 – 22 từ)**. Cắt bỏ toàn bộ văn phong quảng cáo dài dòng, sáo rỗng.
   - **Gạch đầu dòng tính năng (Checklist):** Tối đa **5 – 8 từ mỗi dòng**, nằm gọn trên 1 hàng duy nhất.

3. **Nhìn Vào Biết Ngay Đang Làm Gì & Bấm Vào Đâu (Immediate Visual Affordance):**
   - **Đánh số bước rõ ràng:** Mọi biểu mẫu tương tác (Phiếu điều xe, Công cụ tính phí) phải đánh số thứ tự `01`, `02`, `03`, `04` ở từng ô nhập để khách hàng biết chính xác thứ tự thao tác.
   - **Phân cấp nút bấm rõ rệt:** Mỗi khu vực chỉ có **1 nút hành động chính (Primary CTA)** tô màu đặc nổi bật (Đỏ khẩn cấp `#DC2626` hoặc Cam cơ khí `#EA580C`), nút phụ dùng nền trắng viền rõ nét hoặc xanh Zalo để khách không bao giờ bối rối khi cần bấm.

