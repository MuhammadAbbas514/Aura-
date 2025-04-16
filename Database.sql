-- Create Database
CREATE DATABASE AuraCosmeticsDB;
GO

-- Use the Database
USE AuraCosmeticsDB;
GO


-- Create Tables
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARBINARY(64) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(10,2) NOT NULL,
    ImageUrl NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Cart (
    CartId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(ProductId) ON DELETE CASCADE,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    AddedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
    TotalPrice DECIMAL(10,2) NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) DEFAULT 'Pending',
    ShippingAddress NVARCHAR(255) NOT NULL
);

CREATE TABLE OrderDetails (
    OrderDetailId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(OrderId) ON DELETE CASCADE,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(ProductId),
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price DECIMAL(10,2) NOT NULL
);

CREATE TABLE Checkout (
    CheckoutId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(OrderId) ON DELETE NO ACTION,
    CheckoutDate DATETIME DEFAULT GETDATE(),
    PaymentMethod NVARCHAR(50) NOT NULL,
    PaymentStatus NVARCHAR(50) DEFAULT 'Pending'
);


CREATE TABLE Favorites (
    FavoriteId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(ProductId) ON DELETE CASCADE
);


CREATE TABLE Feeds (
    Id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-incrementing primary key
    UserId INT NOT NULL,              -- Foreign key to Users table
    Rating INT NOT NULL,              -- User's rating (e.g., 1-5 scale)
    Feed NVARCHAR(MAX) NOT NULL,      -- Feed content
    CreatedAt DATETIME NOT NULL       -- Timestamp of feed creation
);


-- Create Stored Procedures

-- Procedure for Searching Products
CREATE PROCEDURE sp_GetProducts
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ProductId, Name, Description, Price, ImageUrl, CreatedAt
    FROM Products
END;
GO


CREATE PROCEDURE AddProduct
    @Name NVARCHAR(100),
    @Description NVARCHAR(MAX) = NULL, -- Default to NULL if not provided
    @Price DECIMAL(10,2),
    @ImageUrl NVARCHAR(MAX) = NULL     -- Default to NULL if not provided
AS
BEGIN
    -- Insert the product into the Products table
    INSERT INTO Products (Name, Description, Price, ImageUrl, CreatedAt, UpdatedAt)
    VALUES 
    (@Name, @Description, @Price, @ImageUrl, GETDATE(), GETDATE());

    -- Optionally, return the newly added ProductId if needed
    SELECT SCOPE_IDENTITY() AS NewProductId; -- Returns the ID of the last inserted product
END;


CREATE PROCEDURE GetProductById
    @ProductId INT
AS
BEGIN
    SELECT * FROM Products WHERE ProductId = @ProductId;
END;




CREATE PROCEDURE sp_SearchProducts
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ProductId, Name, Description, Price, ImageUrl, CreatedAt
    FROM Products
    WHERE Name LIKE '%' + @SearchTerm + '%'
       OR Description LIKE '%' + @SearchTerm + '%'
    ORDER BY Name;
END;
GO

-- Procedure for Login Authentication
create PROCEDURE sp_Login
    @Email NVARCHAR(100),
    @Password NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserId, Username, Email, CreatedAt
    FROM Users
    WHERE Email = @Email AND PasswordHash = HASHBYTES('SHA2_256', CONVERT(VARCHAR(255), @Password));
END;

GO

create PROCEDURE sp_RegisterUser
    @Username NVARCHAR(50),
    @Email NVARCHAR(100),
    @Password NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the email already exists
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
       SELECT 'Email already exists.' AS Message;
        RETURN;
    END

    -- Check if the username already exists
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
    BEGIN
        SELECT 'Username already exists.' AS Message;
        RETURN;
    END

    -- Insert new user with hashed password
    INSERT INTO Users (Username, Email, PasswordHash, CreatedAt)
    VALUES (@Username, @Email, HASHBYTES('SHA2_256', CONVERT(VARCHAR(255), @Password)), GETDATE());

    SELECT 'Registration successful' AS Message;
END;
GO


CREATE PROCEDURE sp_GetOrdersWithDetails
    @UserId NVARCHAR(50)
AS
BEGIN
    SELECT 
        o.OrderId,
        o.OrderDate,
        o.ShippingAddress,
        od.ProductId,
        od.Quantity,
        od.Price,
        p.Name
    FROM Orders o
    INNER JOIN OrderDetails od ON o.OrderId = od.OrderId
    INNER JOIN Products p ON od.ProductId = p.ProductId
    WHERE o.UserId = @UserId;
END;




-- Procedure for Adding to Cart
CREATE PROCEDURE sp_AddToCart
    @UserId INT,
    @ProductId INT,
    @Quantity INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Cart WHERE UserId = @UserId AND ProductId = @ProductId)
    BEGIN
        UPDATE Cart
        SET Quantity = Quantity + @Quantity
        WHERE UserId = @UserId AND ProductId = @ProductId;
    END
    ELSE
    BEGIN
        INSERT INTO Cart (UserId, ProductId, Quantity) VALUES (@UserId, @ProductId, @Quantity);
    END
END;
GO


CREATE PROCEDURE sp_RemoveFromCart
    @UserId INT,
    @ProductId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Remove the product from the user's cart
    DELETE FROM Cart
    WHERE UserId = @UserId AND ProductId = @ProductId;
END;
GO

CREATE PROCEDURE sp_ClearCart
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Remove all items for the user from the cart
    DELETE FROM Cart
    WHERE UserId = @UserId;
END;
GO

CREATE PROCEDURE sp_GetCartItems
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.CartId,
        c.ProductId,
        p.Name,
        p.Price,
        c.Quantity,
        (p.Price * c.Quantity) AS TotalPrice
    FROM 
        Cart c
    INNER JOIN 
        Products p ON c.ProductId = p.ProductId
    WHERE 
        c.UserId = @UserId;
END;



create PROCEDURE sp_AddFavorite
    @userId INT,
    @productId INT
AS
BEGIN
    -- Check if the favorite already exists for the user and product
    IF EXISTS (SELECT 1 FROM Favorites WHERE UserId = @userId AND ProductId = @productId)
    BEGIN
        SELECT 'Already Added to Favourite' AS Message;
		return;
    END
    ELSE
    BEGIN
        -- If it does not exist, add the favorite
        INSERT INTO Favorites (UserId, ProductId)
        VALUES (@userId, @productId);

		
		
    END
END;


create PROCEDURE sp_removeFavorite
    @userId INT,
    @productId INT
AS
BEGIN
    -- Check if the favorite already exists for the user and product
    IF EXISTS (SELECT 1 FROM Favorites WHERE UserId = @userId AND ProductId = @productId)
    BEGIN
       delete from Favorites where UserId = @userId and ProductId = @productId
	   

	  
    END
    ELSE
    BEGIN
       SELECT 'Not Exists In Favourite' AS Message;
	   return;
    END
END;



CREATE PROCEDURE sp_GetFavorites
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Fetch all favorite products for the specified user
    SELECT 
        f.ProductId,
        p.Name,
        p.Description,
        p.Price,
        p.ImageUrl
    FROM 
        Favorites f
    INNER JOIN 
        Products p ON f.ProductId = p.ProductId
    WHERE 
        f.UserId = @UserId;
END;



CREATE PROCEDURE addFeed
    @UserId INT,
    @Rating INT,
    @Feed NVARCHAR(MAX)
AS
BEGIN
        -- Insert the feed into the Feeds table
        INSERT INTO Feeds (UserId, Rating, Feed, CreatedAt)
        VALUES (@UserId, @Rating, @Feed, GETDATE());

        -- Optionally, return a success message
       -- SELECT 'Feed added successfully' AS Message;
   
END;
GO



CREATE PROCEDURE sp_UpdateCart
    @UserId INT,
    @ProductId INT,
    @Quantity INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the product already exists in the cart
    IF EXISTS (
        SELECT 1 
        FROM Cart 
        WHERE UserId = @UserId AND ProductId = @ProductId
    )
    BEGIN
        -- Update the quantity if the product exists
        UPDATE Cart
        SET Quantity = @Quantity
        WHERE UserId = @UserId AND ProductId = @ProductId;
    END
    ELSE
    BEGIN
        -- Insert a new record if the product does not exist
        INSERT INTO Cart (UserId, ProductId, Quantity)
        VALUES (@UserId, @ProductId, @Quantity);
    END
END;
GO





create PROCEDURE sp_PlaceOrder
    @UserId INT,
    @ShippingAddress NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Start a transaction
        BEGIN TRANSACTION;

        -- Validate the cart is not empty
        IF NOT EXISTS (SELECT 1 FROM Cart WHERE UserId = @UserId)
        BEGIN
            RAISERROR('Cart is empty. Cannot place an order.', 16, 1);
            RETURN;
        END

        -- Calculate total price for the order
        DECLARE @TotalPrice DECIMAL(10,2);
        SELECT @TotalPrice = SUM(p.Price * c.Quantity)
        FROM Cart c
        INNER JOIN Products p ON c.ProductId = p.ProductId
        WHERE c.UserId = @UserId;

        -- Insert a new order
        DECLARE @OrderId INT;
        INSERT INTO Orders (UserId, TotalPrice, OrderDate, Status, ShippingAddress)
        VALUES (@UserId, @TotalPrice, GETDATE(), 'Pending', @ShippingAddress);

        SET @OrderId = SCOPE_IDENTITY();

        -- Insert order details from the cart
        INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
        SELECT 
            @OrderId,
            c.ProductId,
            c.Quantity,
            p.Price
        FROM 
            Cart c
        INNER JOIN 
            Products p ON c.ProductId = p.ProductId
        WHERE 
            c.UserId = @UserId;

        -- Clear the user's cart
        DELETE FROM Cart
        WHERE UserId = @UserId;

        -- Commit the transaction
        COMMIT TRANSACTION;

        -- Return the OrderId
        SELECT @OrderId AS OrderId;

    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of an error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Return the error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO



-- Insert Sample Data
INSERT INTO Users (Username, Email, PasswordHash, CreatedAt)
VALUES 
('john_doe', 'john@example.com', HASHBYTES('SHA2_256', 'password123'), GETDATE()),
('jane_smith', 'jane@example.com', HASHBYTES('SHA2_256', 'securepassword'), GETDATE());

INSERT INTO Products (Name, Description, Price, ImageUrl, CreatedAt)
VALUES 
('Charlotte Tilbury Nude Lip', 'Luxurious nude lipstick.', 20.00, 'https://wwd.com/wp-content/uploads/2024/01/Charlotte-Tilbury-Hollywood-Icons-Best-Pink-Lipsticks.png?w=1000', GETDATE()),
('NARS Lip Set', 'Premium NARS lipstick set.', 30.00, 'https://incolorshop.com/cdn/shop/files/8_d9de27e8-ba81-479f-9947-248326751017.jpg?v=1724760195&width=360', GETDATE())

-- Verify Stored Procedures
EXEC sp_SearchProducts @SearchTerm = 'Lip';
EXEC sp_Login @Email = 'john@example.com', @Password = 'password123';
EXEC sp_GetProducts
GO




-- Create a Notifications table
CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    Message NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create a trigger for insert operations on the Orders table
CREATE TRIGGER trg_NotifyNewOrder
ON Orders
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert a notification for the user
    INSERT INTO Notifications (UserId, Message)
    SELECT 
        inserted.UserId,
        'Your order with ID ' + CAST(inserted.OrderId AS NVARCHAR) + ' has been placed successfully.'
    FROM inserted;
END;
GO






select * from Users


select * from Checkout

select * from OrderDetails
select * from Orders

select * from Products

select * from Cart


select * from Favorites
select * from Feeds

select * from Notifications

