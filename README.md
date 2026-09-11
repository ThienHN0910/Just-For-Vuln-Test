# Just-For-Vuln-Test (JFVT)

Dự án Web Bán Hàng thương mại điện tử thử nghiệm lỗ hổng bảo mật được xây dựng bằng **Node.js (Express)**, **Vue 3 (Vite)**, và **Microsoft SQL Server (MSSQL)**.

## 🎯 Các Lỗ Hổng Bảo Mật Được Tích Hợp (Security Vulnerabilities)

1. **SQL Injection (SQLi)**:
   - **Login Endpoint (`POST /api/auth/login`)**: Sử dụng nối chuỗi SQL thô `WHERE Username = '${username}' AND Password = '${password}'`.
     - *Payload bypass login:* `admin' --` hoặc Username: `' OR '1'='1`
   - **Product Search (`GET /api/products?search=...`)**: Nối chuỗi trong `LIKE '%${search}%'`.
     - *Payload UNION Injection:* `' UNION SELECT 1, Username, Password, Email, 'leak' FROM Users --`

2. **Cross-Site Scripting (XSS)**:
   - **Reflected XSS**: Hiển thị từ khóa tìm kiếm trực tiếp trên giao diện bằng `v-html`.
     - *Payload:* `<img src=x onerror=alert('Reflected-XSS')>`
   - **Stored XSS**: Đánh giá sản phẩm (`POST /api/products/:id/reviews`) & Tiểu sử người dùng (`Bio` trong `/api/users/:id`).
     - *Payload:* `<script>alert('Stored-XSS')</script>` hoặc `<img src=x onerror=alert('Stored-XSS')>`

3. **Insecure Direct Object Reference (IDOR)**:
   - **User Profile (`GET & PUT /api/users/:id`)**: Cho phép đọc và chỉnh sửa hồ sơ người dùng bất kỳ mà không kiểm tra token người dùng đang đăng nhập.
   - **Order Details (`GET /api/orders/:id`)**: Cho phép đọc chi tiết đơn hàng của người dùng khác bằng cách đổi `Order ID`.

4. **Hardcoded Secrets / Weak Fallback**:
   - Trong `backend/routes/auth.js` sử dụng fallback secret yếu khi `.env` chưa được cấu hình.
   - Quản lý cấu hình qua `.env` & `.env.example`.

5. **Path Traversal / Arbitrary File Read**:
   - Endpoint `GET /api/files/download?file=...` ghép đường dẫn trực tiếp bằng `path.join(__dirname, '../uploads', req.query.file)` mà không validate `..`.
     - *Payload:* `../package.json`, `../server.js`, `../../.env`

---

## 🛠️ Cấu Hình & Cài Đặt (Setup & Run)

### 1. Cấu hình biến môi trường & Git Ignore
- Các file cấu hình biến môi trường đã được chuẩn hóa:
  - [.env.example](file:///E:/workspace/srcPrj/JFVT/.env.example)
  - [.env](file:///E:/workspace/srcPrj/JFVT/.env)
  - [.gitignore](file:///E:/workspace/srcPrj/JFVT/.gitignore)

### 2. Khởi tạo Cơ Sở Dữ Liệu MSSQL
- Chạy script SQL trong [backend/schema.sql](file:///E:/workspace/srcPrj/JFVT/backend/schema.sql) trên SQL Server (SSMS hoặc `sqlcmd`) để khởi tạo database `VulnShopDB` và các bảng `Users`, `Products`, `Cart`, `Orders`, `Reviews`.

### 3. Cài đặt Dependencies & Chạy Dự Án

```bash
# Cài đặt toàn bộ dependencies cho backend và frontend
npm run install:all

# Chạy Backend (Port 5000)
npm run dev:backend

# Chạy Frontend (Port 3000)
npm run dev:frontend
```

---

## 🤖 Cấu Hình Agent Skills (Matt Pocock Skills Configuration)

Dự án đã được scaffold cấu hình theo tiêu chuẩn Matt Pocock:
- **Issue tracker**: GitHub Issues. Chi tiết tại [docs/agents/issue-tracker.md](file:///E:/workspace/srcPrj/JFVT/docs/agents/issue-tracker.md).
- **Domain docs**: Single-context repository structure với root `CONTEXT.md`. Chi tiết tại [docs/agents/domain.md](file:///E:/workspace/srcPrj/JFVT/docs/agents/domain.md) và [AGENTS.md](file:///E:/workspace/srcPrj/JFVT/AGENTS.md).

   
