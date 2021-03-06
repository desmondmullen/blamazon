DROP DATABASE IF EXISTS blamazonDB;
CREATE DATABASE blamazonDB;

USE blamazonDB;

CREATE TABLE accounts
(
    account_id integer not null
    auto_increment,
user_name varchar
    (50) not null,
user_password varchar
    (15) not null,
first_name varchar
    (50) not null,
last_name varchar
    (50) not null,
email_address varchar
    (50) not null
    default '',
account_type varchar
    (15) not null
    default 'user',
user_cart varchar
    (200) null,
primary key
    (account_id)
);

    CREATE TABLE account_types
    (
        account_type_id integer not null
        auto_increment,
account_type_name varchar
        (15) not null,
account_type_description varchar
        (50) not null,
primary key
        (account_type_id)
);

        CREATE TABLE departments
        (
            department_id integer not null
            auto_increment,
department_name varchar
            (100) not null,
overhead_costs decimal
            (10, 2) not null,
primary key
            (department_id)
);

            CREATE TABLE products
            (
                item_id integer not null
                auto_increment,
department_id integer not null,
product_name varchar
                (100) not null,                      
product_desc varchar
                (150) not null,
price decimal
                (10, 2) not null,
stock_quantity int
    not null,
product_sales decimal
                (10, 2) not null
    default 0,
cost decimal
                (10, 2) not null,
sold int not null
    default 0,
primary key
                (item_id)
);