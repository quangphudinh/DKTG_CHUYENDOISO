# Hệ thống Quản lý Can Phạm Nhân & Đăng ký Thăm gặp (Backend)

Đây là hệ thống Backend xây dựng bằng **Node.js, Express và MongoDB**, hỗ trợ quản lý hồ sơ Can phạm nhân (CPN), quản lý tài khoản người dùng (Thân nhân & Admin) và xử lý quy trình đăng ký thăm gặp trực tuyến.

## 🚀 Công nghệ sử dụng
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (sử dụng Mongoose ODM)
- **Authentication:** JWT (JSON Web Token) & bcryptjs
- **API Documentation:** Swagger UI (swagger-jsdoc & swagger-ui-express)

## 📁 Cấu trúc dự án (MVC)

\`\`\`text
quan-ly-cpn/
│
├── controllers/            # Nơi chứa toàn bộ logic xử lý API
│   ├── auth.controller.js  # Xử lý Đăng ký, Đăng nhập, Khóa/Mở tài khoản
│   ├── cpn.controller.js   # Xử lý CRUD hồ sơ Can Phạm Nhân
│   └── thamgap.controller.js # Xử lý Đăng ký & Xét duyệt thăm gặp
│
├── models/                 # Định nghĩa cấu trúc dữ liệu Database (Schema)
│   ├── index.js            # Gom các model lại để export chung
│   ├── cpn.model.js        # Lược đồ Can Phạm Nhân & Thân Nhân
│   ├── taikhoan.model.js   # Lược đồ Tài khoản
│   └── thamgap.model.js    # Lược đồ Đăng ký Thăm gặp
│
├── routes/                 # Định tuyến API URL và cấu hình Swagger Docs
│   ├── index.js            # Gom nhóm các route
│   ├── auth.routes.js      
│   ├── cpn.routes.js       
│   └── thamgap.routes.js   
│
├── utils/                  # Chứa các hàm/biến tiện ích dùng chung
│   └── constants.js        # Chứa hằng số (TRANG_THAI_THAM_GAP, ROLE)
│
├── .env                    # Biến môi trường (Chứa JWT_SECRET, MONGO_URI) - Không push lên Git
├── .gitignore              
├── index.js                # File chạy chính của Server
└── package.json            # Quản lý thư viện
\`\`\`

## ⚙️ Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- Cài đặt **Node.js** (phiên bản v16.x trở lên).
- Có tài khoản **MongoDB Atlas** (hoặc MongoDB cài cục bộ).

### 2. Cài đặt dự án
Clone dự án về máy và cài đặt các thư viện cần thiết:
\`\`\`bash
git clone <đường-dẫn-repo-của-bạn>
cd quan-ly-cpn
npm install
\`\`\`

### 3. Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc của dự án và khai báo các thông tin sau:
\`\`\`env
PORT=3000
MONGO_URI=mongodb+srv://<tài-khoản>:<mật-khẩu>@cluster...mongodb.net/QuanLyCPN?retryWrites=true&w=majority
JWT_SECRET=chuoi_ky_tu_bao_mat_cua_ban
\`\`\`

### 4. Khởi chạy Server
\`\`\`bash
# Chạy server môi trường dev (nếu đã cài nodemon)
npm run dev

# Hoặc chạy lệnh mặc định của Node
node index.js
\`\`\`
> Console sẽ báo:
> `✅ Kết nối MongoDB Atlas thành công!`
> `🚀 Server đang chạy tại http://localhost:3000`

## 📚 API Documentation (Swagger UI)
Sau khi khởi chạy Server, bạn có thể xem và test toàn bộ API trực tiếp trên giao diện trình duyệt tại đường dẫn:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

## 🛡️ Các chức năng chính (Format Trả về: `{ Status, Res }`)

### 1. Quản lý Tài khoản (Auth)
- `POST /api/auth/register`: Đăng ký tài khoản Thân nhân (Kiểm tra khớp CCCD CPN và CCCD Thân nhân). Tự động hash mật khẩu bằng `bcrypt`.
- `POST /api/auth/login`: Đăng nhập (Trả về Token JWT lưu tại local storage).
- `PUT /api/auth/lock/:taiKhoanId`: Vô hiệu hóa tài khoản.
- `PUT /api/auth/unlock/:taiKhoanId`: Kích hoạt lại tài khoản.

### 2. Quản lý Can Phạm Nhân (CPN)
- `GET /api/cpn`: Lấy danh sách toàn bộ CPN hoặc tìm kiếm theo Tên / CCCD.
- `POST /api/cpn`: Thêm mới hồ sơ CPN.
- `PUT /api/cpn/:id`: Cập nhật thông tin CPN.
- `DELETE /api/cpn/:id`: Xóa hồ sơ CPN.

### 3. Quản lý Đăng ký Thăm gặp
- `POST /api/thamgap`: Tạo phiếu đăng ký thăm gặp mới (Tự động lấy thông tin từ DB nếu mã `cpnId` và `thanNhanId` hợp lệ).
- `GET /api/thamgap`: Xem toàn bộ danh sách, lọc theo ngày hoặc tìm kiếm.
- `GET /api/thamgap/cpn/:cpnId`: Xem lịch sử thăm gặp của 1 CPN cụ thể, có thể lọc theo Tháng/Năm.
- `PUT /api/thamgap/:thamGapId`: Cập nhật trạng thái duyệt (Chờ duyệt, Đã duyệt, Từ chối, Hoàn thành). 
\`\`\`

<ElicitationsGroup message="File README.md đã sẵn sàng. Để dự án hoàn thiện hơn, bạn có muốn thiết lập thêm:">
  <Elicitation label="Cấu hình Token hết hạn và làm mới (Refresh Token)" query="Hướng dẫn cách thiết lập cơ chế Refresh Token để người dùng không bị văng ra ngoài khi Access Token (1 ngày) hết hạn."/>
  <Elicitation label="Tạo file Middleware xác thực" query="Tiến hành tạo file auth.middleware.js để giải mã JWT Token và chặn những người chưa đăng nhập truy cập API."/>
  <Elicitation label="Log lỗi chuyên nghiệp với Winston" query="Hướng dẫn cài đặt và cấu hình thư viện Winston để ghi log lỗi ra file text thay vì chỉ in ra console.log()."/>
</ElicitationsGroup>