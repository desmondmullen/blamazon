USE blamazonDB;

INSERT INTO accounts
    (user_name, user_password, first_name, last_name, account_type)
VALUES
    ('dsmullen', 'dsmullen', 'Desmond', 'Mullen', 'administrator'),
    ('pzm', 'pzm', 'Peter', 'Zvonimir', 'user'),
    ('user', 'user', 'Angie', 'Spong', 'user'),
    ('manager', 'manager', 'Vivian', 'Mullen', 'manager'),
    ('administrator', 'administrator', 'Liam', 'Daniel', 'administrator')
;

INSERT INTO account_types
    (account_type_name, account_type_description)
VALUES
    ('administrator', 'can create new users'),
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
    (product_name, department_name, price, stock_quantity, cost)
VALUES
    ('Dress Shirt', 'Apparel', 19.95, 50, 7.65),
    ('Levis Jeans', 'Apparel', 39.95, 40, 15.50),
    ('Black Socks', 'Apparel', 7.95, 70, 3.25),
    ('Flat Screen TV', 'Electronics', 495.95, 30, 247.75),
    ('iPad', 'Electronics', 295.95, 30, 167.15),
    ('Laser Printer', 'Electronics', 375.95, 20, 194.30),
    ('The Book of Dust', 'Books', 24.95, 10, 11.75),
    ('Harry Potter', 'Books', 25.75, 20, 12.29),
    ('What Do People Do All Day?', 'Books', 14.95, 15, 6.75),
    ('Toaster Oven', 'Household', 45.95, 20, 19.85),
    ('Rice Cooker', 'Household', 65.95, 15, 29.80),
    ('Mixing Bowl Set', 'Household', 25.95, 10, 13.70)
    ;