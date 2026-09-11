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

-- Seed Data
INSERT INTO Users (Username, Password, FullName, Email, Bio, Role, Avatar) VALUES
('admin', 'admin123', 'Administrator', 'admin@vulnshop.com', 'System Admin account', 'admin', 'admin.png'),
('john_doe', 'user123', 'John Doe', 'john@example.com', 'Regular user profile', 'user', 'avatar1.jpg'),
('jane_smith', 'password123', 'Jane Smith', 'jane@example.com', 'VIP Customer', 'user', 'avatar2.jpg');

INSERT INTO Products (Name, Description, Price, Image, Category) VALUES
('Laptop Gaming CyberX', 'Laptop gaming cau hinh cao Core i9, RTX 4080', 2499.99, 'laptop.jpg', 'Electronics'),
('Smartphone Ultra Z', 'Dien thoai thong minh man hinh OLED 120Hz', 899.99, 'phone.jpg', 'Electronics'),
('Tai nghe NoiseCancelling', 'Tai nghe chong on chu dong am thanh Hifi', 199.50, 'headphones.jpg', 'Audio'),
('Ao thun Developer', 'Ao thun cotton in hinh code bug fixing', 25.00, 'tshirt.jpg', 'Fashion');

INSERT INTO Orders (UserId, TotalAmount, Status) VALUES
(1, 2499.99, 'Completed'),
(2, 224.50, 'Completed'),
(3, 899.99, 'Processing');

INSERT INTO Reviews (ProductId, UserId, Comment, Rating) VALUES
(1, 2, 'May dung rat mượt! <b>Rất hài lòng</b>', 5),
(2, 3, 'Pin dung duoc 1 ngay. Nice!', 4);
