-- Database schema & initial seed data script for MSSQL

-- Drop existing tables if they exist
IF OBJECT_ID('dbo.Reviews', 'U') IS NOT NULL DROP TABLE dbo.Reviews;
IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Cart', 'U') IS NOT NULL DROP TABLE dbo.Cart;
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;

-- Users Table
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(100) NOT NULL,
    FullName NVARCHAR(100),
    Email NVARCHAR(100),
    Bio NVARCHAR(MAX),
    Role NVARCHAR(20) DEFAULT 'user',
    Avatar NVARCHAR(255) DEFAULT 'avatar1.jpg'
);

-- Products Table
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18, 2) NOT NULL,
    Image NVARCHAR(255),
    Category NVARCHAR(50)
);

-- Cart Table
CREATE TABLE Cart (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT DEFAULT 1,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- Orders Table
CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Completed',
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Reviews Table
CREATE TABLE Reviews (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    UserId INT NOT NULL,
    Comment NVARCHAR(MAX),
    Rating INT DEFAULT 5,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ProductId) REFERENCES Products(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Seed Data: Users
INSERT INTO Users (Username, Password, FullName, Email, Bio, Role, Avatar) VALUES
('admin', 'admin123', 'Administrator Account', 'admin@vulnshop.com', '<h2>System Admin</h2><p>Quyền quản trị tối cao toàn bộ hệ thống.</p>', 'admin', 'admin.png'),
('john_doe', 'user123', 'John Doe', 'john@example.com', 'Lập trình viên backend, đam mê security. <script>console.log("Bio XSS John")</script>', 'user', 'avatar1.jpg'),
('jane_smith', 'password123', 'Jane Smith', 'jane@example.com', 'VIP Customer - Khách hàng thân thiết', 'user', 'avatar2.jpg'),
('alice_hack', 'hacker2026', 'Alice Security Tester', 'alice@sec.test', 'Tester payload security: <img src=x onerror="alert(\'Bio XSS Alice\')">', 'user', 'avatar1.jpg'),
('bob_victim', 'secretpass99', 'Bob Victim User', 'bob@financial.org', 'Tài khoản mục tiêu thử nghiệm IDOR & lộ thông tin nhạy cảm.', 'user', 'avatar2.jpg');

-- Seed Data: Products
INSERT INTO Products (Name, Description, Price, Image, Category) VALUES
('Laptop Gaming CyberX', 'Laptop gaming cấu hình cực cao Core i9, RTX 4080 16GB, RAM 32GB', 2499.99, 'laptop.jpg', 'Electronics'),
('Smartphone Ultra Z', 'Điện thoại thông minh màn hình OLED 120Hz, Camera 108MP', 899.99, 'phone.jpg', 'Electronics'),
('Tai nghe NoiseCancelling', 'Tai nghe chống ồn chủ động ANC âm thanh Hi-Res Audio', 199.50, 'headphones.jpg', 'Audio'),
('Áo thun Developer', 'Áo thun 100% cotton in hình code bug fixing & refactoring', 25.00, 'tshirt.jpg', 'Fashion'),
('Bàn phím Cơ RGB Custom', 'Bàn phím cơ Switch Gateron Yellow, keycap PBT dính LED RGB 16.8 triệu màu', 149.00, 'keyboard.jpg', 'Peripherals'),
('Màn hình Cong 4K UltraWide 34 inch', 'Màn hình máy tính cong 144Hz HDR400 dành cho đồ họa và chơi game', 650.00, 'monitor.jpg', 'Electronics'),
('Chuột Không Dây Ergonomic', 'Chuột máy tính công thái học chống mỏi cổ tay, cảm biến 26K DPI', 45.99, 'mouse.jpg', 'Peripherals'),
('Balo Laptop Chống Nước SecPack', 'Balo đựng laptop 15.6 inch có ngăn khóa chống trộm và cổng sạc USB', 59.99, 'backpack.jpg', 'Accessories');

-- Seed Data: Cart
INSERT INTO Cart (UserId, ProductId, Quantity) VALUES
(2, 3, 2),
(2, 5, 1),
(4, 1, 1),
(5, 7, 3);

-- Seed Data: Orders
INSERT INTO Orders (UserId, TotalAmount, Status) VALUES
(1, 2499.99, 'Completed'),
(2, 224.50, 'Completed'),
(3, 899.99, 'Processing'),
(5, 5000.00, 'Shipped'),
(4, 149.00, 'Pending');

-- Seed Data: Reviews
INSERT INTO Reviews (ProductId, UserId, Comment, Rating) VALUES
(1, 2, 'Máy chạy rất mượt, mát! <b class="text-success">Rất hài lòng về sản phẩm này!</b>', 5),
(1, 4, '<script>alert("Stored XSS on Product Review 1")</script>Đánh giá sản phẩm tuyệt vời!', 5),
(2, 3, 'Pin dùng thoải mái 1 ngày rưỡi. Màn hình rực rỡ!', 4),
(2, 4, '<img src=x onerror="console.log(\'XSS Payload Loaded from Review\')">Thiết kế đẹp nhưng hơi nặng tay.', 3),
(5, 2, 'Gõ rất êm tay, âm thanh thõa mãn! <iframe src="javascript:alert(\'XSS iframe\')"></iframe>', 5);
