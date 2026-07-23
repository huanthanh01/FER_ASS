# AI Audit Log

## 1. Thông tin chung

| Thông tin             | Nội dung                                                                      |
| --------------------- | ----------------------------------------------------------------------------- |
| Môn học               | Front-End web development with React                                          |
| Mã môn học            | FER202                                                                        |
| Lớp                   | SE20A03                                                                       |
| Học kỳ                | Semester 7                                                                    |
| Tên bài tập / Project | BadmintonShop (Full-stack Badminton E-Commerce Web & React Native Mobile App) |
| Tên sinh viên         | Đặng Phương Khôi Nguyên                                                       |
| MSSV                  | DE190434                                                                      |
| Giảng viên hướng dẫn  | Nguyễn Quang Tuyến                                                            |
| Ngày bắt đầu          | 13/05/2026                                                                    |
| Ngày hoàn thành       | 23/07/2026                                                                    |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [x] ChatGPT
- [ ] Gemini
- [x] Claude
- [x] GitHub Copilot
- [ ] Cursor
- [x] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [ ] Công cụ khác: ....................................

---

## 3. Mục tiêu sử dụng AI

Mô tả ngắn gọn sinh viên/nhóm đã sử dụng AI để hỗ trợ những công việc nào.

- Phân tích yêu cầu bài toán
- Gợi ý ý tưởng giải pháp
- Thiết kế database
- Thiết kế giao diện
- Viết code mẫu
- Debug lỗi
- Tối ưu code
- Viết test case
- Viết báo cáo

### Mô tả mục tiêu sử dụng AI

```text
- Các công cụ AI đã được sử dụng xuyên suốt vòng đời dự án để đẩy nhanh quá trình phát triển toàn diện nền tảng BadmintonShop trên các nền tảng React Web, React Native Mobile và Express Backend.
- Cụ thể, AI đã hỗ trợ thiết kế cấu trúc lược đồ cơ sở dữ liệu và tạo ra các bộ dữ liệu mẫu (người dùng, sản phẩm, phân tích doanh thu, danh mục).
- AI đã hỗ trợ xây dựng cấu trúc các thành phần giao diện người dùng (LoginForm, RegisterForm, BannerSlider, ShopProductGrid, ProductDetails, TopHeader, AdminProductsPage).
- AI đã hướng dẫn việc triển khai các hook tùy chỉnh và bộ điều khiển quản lý trạng thái (useAppController, AppContext và lưu trữ dữ liệu trong cơ sở dữ liệu SQLite).
- AI đã hỗ trợ xây dựng các mô-đun hệ thống trò chuyện socket thời gian thực và các trung tâm thông báo.
- AI đã được sử dụng để gỡ lỗi các sự cố xây dựng đa nền tảng, tối ưu hóa việc hiển thị thành phần React và quản lý cấu hình môi trường.
```

---

## 4. Nhật ký sử dụng AI chi tiết

> Mỗi lần sử dụng AI cho một phần quan trọng của bài tập/project, sinh viên cần ghi lại theo mẫu bên dưới.  
> Sinh viên/nhóm có thể nhân bản mẫu “Lần sử dụng AI” nhiều lần tùy theo số lần sử dụng AI thực tế.

---

### Lần sử dụng AI số 1

| Nội dung            | Thông tin                                                                             |
| ------------------- | ------------------------------------------------------------------------------------- |
| Ngày sử dụng        | 15/05/2026 - 20/05/2026                                                               |
| Công cụ AI          | Antigravity / ChatGPT                                                                 |
| Mục đích sử dụng    | Khởi tạo dự án, cấu hình không gian làm việc monorepo và thiết lập môi trường backend |
| Phần việc liên quan | Backend / Project Architecture / Config                                               |
| Mức độ sử dụng      | Hỗ trợ ít                                                                             |

#### 4.1. Prompt đã sử dụng

```text
Khởi tạo cấu trúc dự án full-stack đa không gian làm việc cho ứng dụng thương mại điện tử cầu lông bao gồm React Native FE, React Vite Web dashboard và Express REST API Backend. Cung cấp các script npm gốc để chạy các không gian làm việc đồng thời và thiết lập các tệp bỏ qua cấu hình môi trường.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đã đề xuất bố cục thư mục chia BadmintonShop-FE, BadmintonShop-Web và các mô-đun Backend. Đã cung cấp các tập lệnh để thực thi đồng thời trong package.json gốc và các mẫu .gitignore toàn diện cho node_modules và thông tin xác thực .env.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Đã áp dụng bố cục thư mục được đề xuất, cấu trúc phụ thuộc package.json gốc, định nghĩa tập lệnh để thực thi không gian làm việc và cấu hình tệp .gitignore.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Đã cấu hình single shared node_modules resolution để tăng hiệu quả không gian làm việc, thêm biến môi trường tùy chỉnh cho cổng backend/URI cơ sở dữ liệu và thêm các tệp tài liệu.
```

#### 4.5. Minh chứng

| Loại minh chứng   | Nội dung                                                                                                                                                                                                                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link commit       | [4d713e0](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `chore: initialize backend environment configuration`, [2f7f3b9](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: enable 1 shared node_modules` |
| File liên quan    | [package.json](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/package.json), [.gitignore](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/.gitignore)                                                            |
| Screenshot        | N/A                                                                                                                                                                                                                                                                                                                                 |
| Kết quả chạy/test | Khởi tạo thành công không gian làm việc và cài đặt thành công các gói phụ thuộc trên tất cả các dự án con                                                                                                                                                                                                                           |
| Link video demo   | N/A                                                                                                                                                                                                                                                                                                                                 |
| Ghi chú khác      | Commit hashes: 4d713e0, 5dd4fba, 2f7f3b9                                                                                                                                                                                                                                                                                            |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Đã học cách thiết lập không gian làm việc đa gói với trình chạy tập lệnh thống nhất và các biện pháp bảo mật môi trường sạch.
```

---

### Lần sử dụng AI số 2

| Nội dung            | Thông tin                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| Ngày sử dụng        | 02/06/2026 - 05/06/2026                                                                                      |
| Công cụ AI          | Antigravity / Gemini                                                                                         |
| Mục đích sử dụng    | Tạo cơ sở dữ liệu giả lập cho các sản phẩm cầu lông, danh mục, người dùng và lược đồ người dùng Google OAuth |
| Phần việc liên quan | Database / Backend / Testing                                                                                 |
| Mức độ sử dụng      | Hỗ trợ nhiều                                                                                                 |

#### 4.1. Prompt đã sử dụng

```text
Tạo bộ dữ liệu JSON giả lập thực tế cho các sản phẩm cầu lông (vợt, giày, cầu lông, túi, quần áo) với thông số kỹ thuật (thương hiệu, giá cả, tồn kho, hình ảnh, xếp hạng) và hồ sơ người dùng giả lập bao gồm quyền hạn và thuộc tính xác thực đăng nhập Google.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đã tạo các mảng JSON có định dạng cho dữ liệu người dùng (`badmintonshop.users.json`) và logic tập lệnh tạo cơ sở dữ liệu (`utils/database.ts`) điền vào các sản phẩm và thông tin đăng nhập tài khoản quản trị.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Đã sử dụng trực tiếp cấu trúc bộ dữ liệu tạo sẵn cho thông tin xác thực người dùng ban đầu, thuộc tính danh mục sản phẩm và định nghĩa danh mục trong cả SQLite cục bộ trên thiết bị di động và bộ nhớ backend.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Đã cập nhật giá sản phẩm theo tiêu chuẩn tiền tệ địa phương, đính kèm tài sản hình ảnh web thực tế, thêm logic xử lý mã thông báo xác thực Google và xác minh các tập lệnh chèn cơ sở dữ liệu.
```

#### 4.5. Minh chứng

| Loại minh chứng   | Nội dung                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| Link commit       | [ec2b42c](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: seed user data`, [8f1e140](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: add product data and database seeding script`, [a5f0d0f](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: add google login` |
| File liên quan    | [badmintonshop.users.json](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/badmintonshop.users.json), [database.ts](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-FE/utils/database.ts)                                                                                                                                          |
| Screenshot        | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Kết quả chạy/test | Cơ sở dữ liệu đã được tạo sẵn thành công với người dùng và danh mục sản phẩm                                                                                                                                                                                                                                                                                                                                                                                       |     |
| Link video demo   | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Ghi chú khác      | Commits by Dang Phuong Khoi Nguyen                                                                                                                                                                                                                                                                                                                                                                                                                                 |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Đã học cách tạo các sơ đồ dữ liệu seed thực tế kết nối liền mạch giữa cơ sở dữ liệu khách hàng cục bộ và cơ sở dữ liệu backend.
```

---

### Lần sử dụng AI số 3

| Nội dung            | Thông tin                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Ngày sử dụng        | 10/06/2026 - 15/06/2026                                                                     |
| Công cụ AI          | GitHub Copilot / Antigravity                                                                |
| Mục đích sử dụng    | Trang chi tiết sản phẩm, thư viện hình ảnh, hiển thị đánh giá và các thành phần UI giỏ hàng |
| Phần việc liên quan | Frontend / Design / Component Architecture                                                  |
| Mức độ sử dụng      | Hỗ trợ ít                                                                                   |

#### 4.1. Prompt đã sử dụng

```text
Tạo các thành phần React và React Native cho chế độ xem Chi tiết sản phẩm bao gồm xem trước hình ảnh độ phân giải cao, ma trận thông số kỹ thuật sản phẩm, danh sách xếp hạng và đánh giá của khách hàng, bộ chọn số lượng và thanh hành động thêm vào giỏ hàng tương tác.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đã cung cấp các khối thành phần có thể tái sử dụng: `ProductCard`, `ProductImage`, `ProductInfo`, `ProductBottomBar`, `CartItem` và `CartSummary` với các cấu trúc prop phản hồi.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Đã tích hợp cấu trúc JSX, định nghĩa giao diện prop và logic xử lý trạng thái cho việc chọn băng chuyền hình ảnh và tăng số lượng.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Tạo các mô-đun kiểu riêng biệt (`ProductDetails.styles.ts`, `CartPage.css`), tùy chỉnh bảng màu, thêm các hộp thoại mô hình cảnh báo tùy chỉnh và kết nối ngữ cảnh trạng thái giỏ hàng.
```

#### 4.5. Minh chứng

| Loại minh chứng   | Nội dung                                                                                                                                                                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Link commit       | [44291f9](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement product detail page with reviews`, [4b9cd14](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement ProductCard, CartPage`                    |
| File liên quan    | [ProductDetailPage.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/pages/ProductDetailPage.jsx), [CartPage.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/pages/CartPage.jsx) |
| Screenshot        | N/A                                                                                                                                                                                                                                                                                                                                                    |
| Kết quả chạy/test | Trang chi tiết sản phẩm hiển thị đánh giá và cập nhật các mặt hàng trong giỏ hàng liền mạch                                                                                                                                                                                                                                                            |
| Link video demo   | N/A                                                                                                                                                                                                                                                                                                                                                    |
| Ghi chú khác      | Commits: 44291f9, c44c2ec, 4b9cd14                                                                                                                                                                                                                                                                                                                     |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Đã thành thạo các mẫu thành phần mô-đun trong React để hiển thị các cấu trúc dữ liệu lồng nhau phức tạp như đánh giá và thuộc tính sản phẩm động.
```

---

### Lần sử dụng AI số 4

| Nội dung            | Thông tin                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Ngày sử dụng        | 20/06/2026 - 25/06/2026                                                                  |
| Công cụ AI          | ChatGPT / Antigravity                                                                    |
| Mục đích sử dụng    | Hệ thống trò chuyện hỗ trợ thời gian thực sử dụng Socket.io và widget có thể kéo thả nổi |
| Phần việc liên quan | Frontend / Backend / Real-time Communication                                             |
| Mức độ sử dụng      | Hỗ trợ ít                                                                                |

#### 4.1. Prompt đã sử dụng

```text
Hướng dẫn cách làm tính năng chat realtime giữa khách hàng và nhân viên hỗ trợ bằng Socket.io trong React/React Native, bao gồm cách quản lý state tin nhắn và giao diện cơ bản.
```

#### 4.2. Kết quả AI gợi ý

```text
Gợi ý cách thiết lập các event listener cơ bản cho socket (`join_room`, `send_message`, `receive_message`) và phác thảo sơ bộ các component hiển thị tin nhắn.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Dùng bộ khung kết nối socket ban đầu và tham khảo cách phân chia state để xử lý tin nhắn gửi nhận.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Tự phát triển thêm phần xử lý khi mất kết nối, hiển thị số tin nhắn chưa đọc. Đối với phiên bản mobile, em tự cải tiến logic kéo thả cho nút chat và tùy chỉnh toàn bộ giao diện CSS của các tin nhắn để phù hợp với thiết kế.
```

#### 4.5. Minh chứng

| Loại minh chứng   | Nội dung                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link commit       | [07b8707](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement real-time support chat system with socket.io`, [ddf3fb5](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement support hub, report chat pages`                           |
| File liên quan    | [NotificationsPage.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/pages/NotificationsPage.jsx), [NotificationDetailPage.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/pages/NotificationDetailPage.jsx) |
| Screenshot        | N/A                                                                                                                                                                                                                                                                                                                                                                                |
| Kết quả chạy/test | Real-time chat messages transmit instantaneously between user and support hub                                                                                                                                                                                                                                                                                                      |
| Link video demo   | N/A                                                                                                                                                                                                                                                                                                                                                                                |
| Ghi chú khác      | Commits: 07b8707, af91032, ddf3fb5                                                                                                                                                                                                                                                                                                                                                 |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Việc tích hợp WebSocket vào React khá rắc rối ở phần vòng đời component, phải debug khá nhiều để tránh bị duplicate tin nhắn.
```

---

### Lần sử dụng AI số 5

| Nội dung            | Thông tin                                                                        |
| ------------------- | -------------------------------------------------------------------------------- |
| Ngày sử dụng        | 01/07/2026 - 05/07/2026                                                          |
| Công cụ AI          | GitHub Copilot / Antigravity                                                     |
| Mục đích sử dụng    | User authentication flow (Login/Register), Profile management, and Theme Context |
| Phần việc liên quan | Frontend / Auth / State Management                                               |
| Mức độ sử dụng      | Hỗ trợ nhiều                                                                     |

#### 4.1. Prompt đã sử dụng

```text
Gợi ý cấu trúc cho màn hình đăng nhập, đăng ký và cách validate form dữ liệu, đồng thời cho xin khung sườn để làm ThemeContext chuyển đổi light/dark mode.
```

#### 4.2. Kết quả AI gợi ý

```text
Cung cấp một số regex để validate email/mật khẩu, khung UI cơ bản cho form và cách thiết lập `ThemeContext` đơn giản.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Tham khảo các mẫu regex validate dữ liệu và khung sườn cơ bản của ThemeContext để làm nền tảng.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Tự phát triển các hộp thoại thông báo lỗi khi đăng nhập không thành công, xử lý lưu token bảo mật vào local storage và hoàn thiện tính năng quản lý chỉnh sửa thông tin người dùng.
```

#### 4.5. Minh chứng

| Loại minh chứng   | Nội dung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link commit       | [a1a3748](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement user authentication flow`, [460bbbd](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement full-stack user authentication, profile management`                                                                                                                                                                  |
| File liên quan    | [LoginForm.tsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-FE/components/auth/LoginForm.tsx), [AuthPage.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/pages/Auth/AuthPage.jsx), [ProfilePage.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/pages/ProfilePage.jsx) |
| Screenshot        | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Kết quả chạy/test | User registration, login authentication, and profile updates function properly                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Link video demo   | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Ghi chú khác      | Commits: ab4d5fb, a1a3748, 460bbbd                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Quản lý session đăng nhập và truyền context theme xuống các component con giúp em hiểu rõ hơn về cách chia sẻ state toàn cục.
```

---

### Lần sử dụng AI số 6

| Nội dung            | Thông tin                                                                          |
| ------------------- | ---------------------------------------------------------------------------------- |
| Ngày sử dụng        | 10/07/2026 - 15/07/2026                                                            |
| Công cụ AI          | Antigravity / Gemini                                                               |
| Mục đích sử dụng    | Admin Dashboard layout, Product CRUD management page, and Revenue analytics charts |
| Phần việc liên quan | Frontend / Admin / Data Visualization                                              |
| Mức độ sử dụng      | Hỗ trợ ít                                                                          |

#### 4.1. Prompt đã sử dụng

```text
Làm sao để dựng giao diện Admin Dashboard quản lý sản phẩm (CRUD) và vẽ biểu đồ doanh thu dựa trên dữ liệu mảng?
```

#### 4.2. Kết quả AI gợi ý

```text
Gợi ý các thành phần cơ bản của trang `AdminProductsPage.jsx`, cách chia trang cho bảng dữ liệu và logic biến đổi mảng dữ liệu để nạp vào biểu đồ.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Dùng khung bố cục của bảng danh sách sản phẩm và tham khảo thuật toán nhóm dữ liệu doanh thu.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Tự lập trình toàn bộ phần tải ảnh sản phẩm, viết các hàm định dạng tiền tệ, xác thực các ô nhập số lượng/giá và tùy chỉnh giao diện bảng hiển thị.
```

#### 4.5. Minh chứng

| Loại minh chứng   | Nội dung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link commit       | [66feb73](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement admin dashboard`, [9859598](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement admin dashboard with backend revenue analytics`, [0e54c03](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement AdminProductsPage` |
| File liên quan    | [AdminProductsPage.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/pages/AdminProductsPage.jsx), [AdminRevenuePage.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/pages/AdminRevenuePage.jsx)                                                                                                                               |
| Screenshot        | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Kết quả chạy/test | Product CRUD operations and revenue charts function correctly in Admin view                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Link video demo   | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Ghi chú khác      | Commits: 66feb73, bf04332, 9859598, 0e54c03                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Làm trang Admin mất nhiều thời gian hơn em nghĩ, đặc biệt là phần lọc dữ liệu và đồng bộ trạng thái khi thêm sửa xóa sản phẩm.
```

---

### Lần sử dụng AI số 7

| Nội dung            | Thông tin                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Ngày sử dụng        | 20/07/2026 - 22/07/2026                                                                    |
| Công cụ AI          | Antigravity                                                                                |
| Mục đích sử dụng    | AppController custom hook, AppContext state provider, and TopHeader navigation integration |
| Phần việc liên quan | Frontend / State Controller / SQLite Persistence                                           |
| Mức độ sử dụng      | Hỗ trợ ít                                                                                  |

#### 4.1. Prompt đã sử dụng

```text
Làm thế nào để gom chung logic xử lý giỏ hàng, thông tin user auth và đồng bộ SQLite vào một custom hook `useAppController` để dùng chung cho cả Web và Mobile?
```

#### 4.2. Kết quả AI gợi ý

```text
Đề xuất cấu trúc file cho `useAppController.ts` và cách bọc ứng dụng bằng `AppProvider.tsx` để truyền các hàm xử lý xuống dưới.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Tham khảo ý tưởng tách biệt phần logic nghiệp vụ ra khỏi các component giao diện.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Tự bọc các hàm tính toán giỏ hàng bằng `useMemo` để tối ưu hiệu năng, code thêm phần hiển thị số lượng ở TopHeader và tự xử lý các trường hợp lỗi khi thiết bị mất kết nối mạng.
```

#### 4.5. Minh chứng

| Loại minh chứng   | Nội dung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link commit       | [7276a9c](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement application controller with SQLite`, [c9ba820](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement AppContext`, [13e32c4](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: implement AppController hook`, [d2c10ba](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS) `feat: add TopHeader component` |
| File liên quan    | [useAppController.ts](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-FE/controllers/useAppController.ts), [AppContext.jsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-Web/src/context/AppContext.jsx), [TopHeader.tsx](file:///c:/Users/Dang/Documents/FER202/FER202-SE20A03-DE190434-Dang_Phuong_Khoi_Nguyen/Slot%2018/FER_ASS/BadmintonShop-FE/components/landing/TopHeader.tsx)                                                                                                    |
| Screenshot        | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Kết quả chạy/test | Centralized state controller manages auth, cart, and SQLite storage reliably                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Link video demo   | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Ghi chú khác      | Commits: 7276a9c, c9ba820, 13e32c4, d2c10ba                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Việc tách riêng logic ra một custom hook khiến code gọn gàng hơn hẳn và dễ debug khi có lỗi xảy ra.
```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

Đánh dấu mức độ AI hỗ trợ ở từng hạng mục.

| Hạng mục                    | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú                                |
| --------------------------- | :-----------: | :----------: | :-------------: | :-----------: | -------------------------------------- |
| Phân tích yêu cầu           |               |      X       |                 |               | Phân tích và chia nhỏ yêu cầu          |
| Viết user story/use case    |               |      X       |                 |               | Xác định phạm vi tính năng             |
| Thiết kế database           |               |              |        X        |               | Cấu trúc dữ liệu mẫu                   |
| Thiết kế kiến trúc hệ thống |               |      X       |                 |               | Gợi ý mô hình dự án đa nền tảng        |
| Thiết kế giao diện          |               |      X       |                 |               | Tham khảo bố cục và màu sắc            |
| Code frontend               |               |              |        X        |               | Dựng khung component và trang          |
| Code backend                |               |      X       |                 |               | Gợi ý route API và controller logic    |
| Debug lỗi                   |               |      X       |                 |               | Sửa lỗi liên quan đến socket           |
| Viết test case              |               |      X       |                 |               | Kiểm thử API và xác thực form         |
| Kiểm thử sản phẩm           |       X       |              |                 |               | Kiểm thử thủ công trên máy ảo và trình duyệt |
| Tối ưu code                 |       X       |              |                 |               | Tự tối ưu lại các hàm bằng useMemo     |
| Viết báo cáo                |       X       |              |                 |               | Tự tổng hợp tài liệu                   |
| Làm slide thuyết trình      |               |      X       |                 |               | Tham khảo cấu trúc slide               |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI                                                                            | Cách phát hiện                                                              | Cách xử lý/cải tiến                                                                               |
| --: | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
|   1 | Gợi ý code dùng cú pháp SQLite cũ không còn được hỗ trợ tốt trên React Native.               | Bị lỗi build khi chạy Metro bundler ở file `database.ts`.                   | Tự tìm tài liệu và chuyển sang dùng hàm bất đồng bộ của Expo SQLite (`SQLite.openDatabaseAsync`). |
|   2 | Gợi ý hardcode cứng các đường dẫn gọi API (kiểu `http://localhost:5000`).                    | Ứng dụng mobile không gọi được API khi chạy trên máy ảo hoặc thiết bị thật. | Tự thiết lập một file config chung (`api/config.js`) để đổi endpoint linh hoạt theo môi trường.   |
|   3 | Gợi ý viết các hàm cập nhật state trong hook mà không dùng memoize, gây render lại liên tục.  | Ứng dụng giảm hiệu năng, React DevTools cảnh báo re-render quá nhiều.         | Tự tối ưu lại bằng cách bọc các hàm tính toán và sự kiện giỏ hàng qua `useMemo` và `useCallback`.  |

---

## 7. Kiểm chứng kết quả AI

Mô tả cách sinh viên/nhóm kiểm tra lại kết quả do AI gợi ý.

### Nội dung kiểm chứng

```text
1. Kiểm tra môi trường chạy:
   - Tự khởi động server bằng `npm run dev` cho cả Web Vite và backend Express.
   - Chạy Metro bundler (`npx expo start`) và kiểm thử thực tế giao diện trên máy ảo mobile.

2. Kiểm tra tính năng thực tế:
   - Kiểm thử thủ công toàn bộ quy trình đăng ký, đăng nhập (kể cả đăng nhập bằng Google).
   - Đóng vai khách hàng để tìm kiếm sản phẩm, thêm vào giỏ hàng và đặt hàng.
   - Dùng tài khoản admin để thử thêm mới và xóa sản phẩm, sau đó check lại trong database xem dữ liệu có thay đổi đúng không.

3. Kiểm thử hệ thống chat:
   - Mở hai cửa sổ trình duyệt và máy ảo cùng lúc để kiểm tra việc gửi và nhận dữ liệu qua socket trong thời gian thực.

4. Kiểm tra giao diện:
   - Thay đổi kích thước màn hình để kiểm tra bố cục (layout) trên các thiết bị mobile hoặc tablet.
   - Kiểm thử việc chuyển đổi Light/Dark mode trên nhiều trang khác nhau.
```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

Mô tả phần sinh viên tự làm, phần AI hỗ trợ và phần đã tự cải tiến.

```text
- Đặng Phương Khôi Nguyên:
  + Tự làm: Code các luật gitignore, gom chung node_modules để tiết kiệm dung lượng, thiết kế cấu trúc dữ liệu người dùng, cấu hình xác thực Google, và rà soát toàn bộ tài liệu.
  + AI hỗ trợ: Xin khung JSON dữ liệu mẫu và gợi ý cách thiết lập script trong package.json.
  + Tự cải tiến: Chỉnh lại toàn bộ giá và thông số sản phẩm cho thực tế, tự fix lỗi CORS khi gọi API backend và xử lý token đăng nhập an toàn hơn.
```

### 8.2. Đối với bài nhóm

| Thành viên              | MSSV          | Nhiệm vụ chính                                                                                                 | Có sử dụng AI không? | Minh chứng đóng góp                                                                            |
| ----------------------- | ------------- | -------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| Đặng Phương Khôi Nguyên | DE190434      | Project setup, Shared node_modules, User seed dataset, Google Auth, Env config, Documentation                  | Có                   | Commits `16f7f0d`, `2f7f3b9`, `ec2b42c`, `a5f0d0f`, `4d713e0`, `5dd4fba`, `8f1e140`            |
| Thanh Anh Huấn          | (Team Member) | Layout architecture, Product detail & cart UI, Admin dashboard & revenue analytics, AppController, Socket chat | Có                   | Commits `e1d1ea0`, `68b9e18`, `44291f9`, `07b8707`, `9859598`, `7276a9c`, `13e32c4`, `d2c10ba` |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
AI giúp em tiết kiệm thời gian ở các bước setup ban đầu, tạo bộ dữ liệu mẫu nhanh chóng và cho các ý tưởng về cách chia component UI sao cho hợp lý.
```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
Em không dùng code gọi API gán cứng (hardcode) localhost của AI vì nó sẽ không hoạt động trên mobile, và em cũng bỏ qua các đoạn code SQLite cũ mà AI đề xuất do chúng gây lỗi ứng dụng.
```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Em kiểm thử bằng cách chạy ứng dụng liên tục trên máy ảo, dùng Postman gọi thử API và kiểm tra cơ sở dữ liệu thủ công mỗi lần thao tác thêm sửa xóa.
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Viết thủ công các dữ liệu mẫu sản phẩm. Ngoài ra, việc tự tìm hiểu cấu hình socket cho việc chat hai chiều giữa mobile và web cũng sẽ mất thêm nhiều thời gian.
```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
Em đã hiểu cách tách logic ra khỏi UI bằng custom hooks, biết cách vận dụng Context API để quản lý state tốt hơn và hiểu sâu hơn về vòng đời component trong React.
```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
AI giống như một công cụ tra cứu nhanh chứ không phải giải pháp tự động hoàn toàn. Bất cứ dòng code nào AI đưa ra cũng phải đọc lại, kiểm tra và chỉnh sửa lại cho khớp với dự án, nếu áp dụng nguyên văn mà không kiểm tra thì dễ gặp lỗi hệ thống.
```

---

## 10. Cam kết học thuật

Sinh viên/nhóm cam kết rằng:

- Nội dung AI hỗ trợ đã được ghi nhận trung thực.
- Không nộp nguyên văn kết quả AI mà không kiểm tra.
- Có khả năng giải thích các phần đã nộp.
- Chịu trách nhiệm về tính đúng đắn của sản phẩm cuối cùng.
- Hiểu rằng việc sử dụng AI không khai báo có thể ảnh hưởng đến kết quả đánh giá.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
| ----------------------- | ------------- |
| Đặng Phương Khôi Nguyên | 23/07/2026    |
