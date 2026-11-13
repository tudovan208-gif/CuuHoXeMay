---
name: web-layout-ux
description: Enforces balanced symmetrical CSS Grid/Flexbox layouts, concise scannable Vietnamese microcopy, and unmistakable interactive button/form affordances. Activate this skill whenever creating, editing, or auditing HTML/CSS layouts, cards, grids, forms, or copywriting in this workspace.
---

# Web Layout Symmetry, Concise Copy & Visual Affordance Skill

Khi chỉnh sửa hoặc thiết kế bất kỳ giao diện nào trong dự án này, AI Agent bắt buộc thực hiện theo quy trình kiểm định 3 bước dưới đây:

## 1. Kiểm định Cân đối Bố cục (Layout Balance & Grid Symmetry Audit)
Trước khi hoàn tất code HTML/CSS, hãy kiểm tra mọi khu vực theo danh sách sau:
- **Đồng bộ chiều cao 2 cột (`1fr 1fr` hoặc bất đối xứng có kiểm soát):**
  - Mọi container dạng lưới (`.hero-grid`, `.pricing-wrapper`, `.contact-grid`) phải đặt `align-items: stretch`.
  - Các thẻ con trực tiếp bên trong mỗi ô lưới phải đặt `height: 100%`, `display: flex`, `flex-direction: column`, `justify-content: space-between` để phần chân thẻ (Footer / CTA) luôn nằm trên cùng một đường thẳng ngang.
- **Cấm chồng cột lệch chiều cao (No Unequal Stacked Columns):**
  - Nếu một section có 4 thẻ nội dung (ví dụ khu vực Bảng giá), hãy đặt cả 4 thẻ làm con trực tiếp của `.pricing-wrapper` với `grid-template-columns: repeat(2, 1fr)` và `align-items: stretch` để Hàng 1 (Thẻ 1 & Thẻ 2) cao bằng nhau, Hàng 2 (Thẻ 3 & Thẻ 4) cao bằng nhau.
  - Không dùng `position: sticky` trên 1 cột nếu cột bên cạnh cuộn tự do gây so le mép trên/dưới.
- **Cấm rớt dòng nút bấm (No Wrapping CTA Orphans):**
  - Trong khu vực Hero hoặc Card, chỉ đặt tối đa 2 nút CTA trên 1 hàng (`display: grid; grid-template-columns: 1fr 1fr` hoặc `display: flex; flex-wrap: nowrap`) để không có nút thứ 3 bị rớt lẻ loi xuống hàng dưới.

## 2. Kiểm định Nội dung Ngắn gọn (Concise & Actionable Copywriting)
Mọi đoạn văn bản hiển thị cho khách hàng phải tuân thủ giới hạn độ dài:
- **Tiêu đề Section (`h1`, `h2`):** Ngắn gọn từ **6 – 11 từ**, truyền tải trực tiếp lợi ích cốt lõi (Thời gian có mặt, Minh bạch giá, Phạm vi hỗ trợ).
- **Mô tả Section (`.section-desc`, `.hero-description`):** Tối đa **15 – 22 từ** (hiển thị vừa vặn trong 2 dòng trên máy tính).
- **Mô tả Thẻ Dịch vụ (`.service-desc`):** Tối đa **14 – 18 từ** (đồng nhất đúng 2 dòng ở tất cả 6 thẻ dịch vụ để chiều cao thẻ bằng nhau tuyệt đối).
- **Mục kiểm tra (`.service-feature-item`, `.pledge-item-premium`):** Tối đa **5 – 8 từ**, gọn trên 1 dòng đơn.

## 3. Kiểm định Rõ ràng Thao tác (Visual Affordance & Wayfinding)
Khách hàng nhìn vào màn hình trong 2 giây phải trả lời được ngay 3 câu hỏi:
1. **"Tôi đang ở mục nào?"** → Nhờ nhãn kỹ thuật đánh số thứ tự (`01 // DỊCH VỤ`, `02 // BẢNG GIÁ`, `03 // KHU VỰC`...) và tiêu đề ngắn gọn.
2. **"Tôi cần điền gì tiếp theo?"** → Nhờ các bước đánh số `01`, `02`, `03`, `04` trên nhãn ô nhập liệu và giá trị mặc định/gợi ý rõ ràng.
3. **"Tôi phải bấm vào nút nào?"** → Mỗi khung chỉ có 1 nút chính nổi bật nhất kèm động từ hành động rõ ràng (`GỌI NGAY: 0902 117 116`, `PHÁT LỆNH ĐIỀU XE`, `ĐẶT XE VỚI GIÁ NÀY`).
