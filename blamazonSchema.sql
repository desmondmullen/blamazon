DROP DATABASE IF EXISTS blamazonDB;
CREATE DATABASE blamazonDB;

use blamazonDB;

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
account_type varchar
      (15) not null default 'user',
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
overhead_costs int not null,
total_sales decimal
                  (10, 2) not null default 0,
primary key
                  (department_id)
);

                  CREATE TABLE products
                  (
                        item_id integer not null
                        auto_increment,
  product_name varchar
                        (100) not null,
  department_name varchar
                        (100) not null,
  price decimal
                        (10, 2) not null,
  stock_quantity int not null,
  product_sales decimal
                        (10, 2) not null default 0,
  cost decimal
                        (10, 2) not null,
  primary key
                        (item_id)
);