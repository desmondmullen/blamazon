USE blamazonDB;

INSERT INTO accounts
    (user_name, user_password, first_name, last_name, email_address, account_type)
VALUES
    -- The guest row below is REQUIRED, the other rows are
    -- examples. Note that an administrator account is
    -- REQUIRED to be able to create manager and/or
    -- administrator accounts. User accounts can be created
    -- by anyone in the normal function of the program.
    ('guest', '', '', '', '', ''),

    ('user', 'user', 'Angie', 'Customer', 'arc@desmondmullen.com', 'user'),
    ('manager', 'manager', 'Vivian', 'Mullen', 'vkm@desmondmullen.com', 'manager'),
    ('administrator', 'administrator', 'Peter', 'Zvonimir', 'pzm@desmondmullen.com', 'administrator'),
    ('admin', 'admin', 'Liam', 'Daniel', 'ldm@desmondmullen.com', 'administrator'),
    ('supervisor', 'supervisor', 'Desmond', 'Mullen', 'dsm@desmondmullen.com', 'administrator')
;

INSERT INTO account_types
    (account_type_name, account_type_description)
VALUES
    -- The administrator, manager, and user rows below are
    -- REQUIRED. Other account types are not supported.
    ('administrator', 'admininstrator/supervisor'),
    ('manager', 'can manage departments'),
    ('user', 'user/customer')
;

INSERT INTO departments
    (department_name, overhead_costs)
VALUES
    -- There are no required rows in this table; these are
    -- examples. Departments can be created by administrators
    -- in the normal function of the program.
    ('Apparel', 200),
    ('Electronics', 300),
    ('Books', 250),
    ('Household', 300)
;

INSERT INTO products
    (department_id, product_name, product_desc, price, stock_quantity, cost, sold)
VALUES
    -- There are no required rows in this table; these are
    -- examples. Products can be created my managers in the
    -- normal function of the program.
    ('1', 'Dress Shirt', 'Blue, 100% cotton long sleeve shirt, sz M', 19.95, 50, 7.65, 5),
    ('1', 'Levis Jeans', 'Levis 501 jeans, size 32/32', 39.95, 40, 15.50, 0),
    ('1', 'Black Socks', 'Black, 97% cotton/3% spandex ankle socks', 7.95, 70, 3.25, 7),
    ('2', 'Flat Screen TV', 'LG 37" flat screen smart TV', 495.95, 30, 247.75, 0),
    ('2', 'iPad', 'Apple iPad IV, Space Grey', 295.95, 30, 167.15, 2),
    ('2', 'Laser Printer', 'HP MD7050 Laser Printer', 375.95, 20, 194.30, 0),
    ('3', 'The Book of Dust', 'The Book of Dust, by Phillip Pullman', 24.95, 10, 11.75, 1),
    ('3', 'Harry Potter', 'Harry Potter Goes Nuts, by J.K. Rowling', 25.75, 20, 12.29, 0),
    ('3', 'Great Big World', 'Great Big World, by Richard Scarry', 14.95, 15, 6.75, 2),
    ('4', 'Toaster Oven', 'Cuisinart Toast-O-Matic toaster', 45.95, 20, 19.85, 3),
    ('4', 'Rice Cooker', 'Zojirushi 2qt rice cooker', 65.95, 15, 29.80, 0),
    ('4', 'Mixing Bowl Set', 'Martha Stewart Home mixing bowl set', 25.95, 10, 13.70, 2)
    ;