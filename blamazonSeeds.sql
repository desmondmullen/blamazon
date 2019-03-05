USE blamazonDB;

INSERT INTO accounts
    (user_name, user_password, first_name, last_name, email_address, account_type)
VALUES
    ('guest', '', '', '', '', ''),
    ('user', 'user', 'Angie', 'Spong', 'angie.spong@gmail.com', 'user'),
    ('manager', 'manager', 'Vivian', 'Mullen', 'vkm@busylittlestudios.com', 'manager'),
    ('administrator', 'administrator', 'Liam', 'Daniel', 'ldm@busylittlestudios.com', 'administrator'),
    ('admin', 'admin', 'Liam', 'Daniel', 'ldm@busylittlestudios.com', 'administrator'),
    ('supervisor', 'supervisor', 'Desmond', 'Mullen', 'dsm@desmondmullen.com', 'administrator'),
    ('dsmullen', 'dsmullen', 'Desmond', 'Mullen', 'dsm@desmondmullen.com',
        'administrator')
;

INSERT INTO account_types
    (account_type_name, account_type_description)
VALUES
    ('administrator', 'admininstrator/supervisor'),
    ('manager', 'can manage departments'),
    ('user', 'user/customer')
;

INSERT INTO departments
    (department_name, overhead_costs)
VALUES
    ('Apparel', 200),
    ('Electronics', 300),
    ('Books', 250),
    ('Household', 300)
;

INSERT INTO products
    (department_name, product_name, product_desc, price, stock_quantity, cost, sold)
VALUES
    ('Apparel', 'Dress Shirt', 'Blue, 100% cotton long sleeve shirt, sz M', 19.95, 50, 7.65, 5),
    ('Apparel', 'Levis Jeans', 'Levis 501 jeans, size 32/32', 39.95, 40, 15.50, 0),
    ('Apparel', 'Black Socks', 'Black, 97% cotton/3% spandex ankle socks', 7.95, 70, 3.25, 7),
    ('Electronics', 'Flat Screen TV', 'LG 37" flat screen smart TV', 495.95, 30, 247.75, 0),
    ('Electronics', 'iPad', 'Apple iPad IV, Space Grey', 295.95, 30, 167.15, 2),
    ('Electronics', 'Laser Printer', 'HP MD7050 Laser Printer', 375.95, 20, 194.30, 0),
    ('Books', 'The Book of Dust', 'The Book of Dust, by Phillip Pullman', 24.95, 10, 11.75, 1),
    ('Books', 'Harry Potter', 'Harry Potter Goes Nuts, by J.K. Rowling', 25.75, 20, 12.29, 0),
    ('Books', 'Great Big World', 'Great Big World, by Richard Scarry', 14.95, 15, 6.75, 2),
    ('Household', 'Toaster Oven', 'Cuisinart Toast-O-Matic toaster', 45.95, 20, 19.85, 3),
    ('Household', 'Rice Cooker', 'Zojirushi 2qt rice cooker', 65.95, 15, 29.80, 0),
    ('Household', 'Mixing Bowl Set', 'Martha Stewart Home mixing bowl set', 25.95, 10, 13.70, 2)
    ;