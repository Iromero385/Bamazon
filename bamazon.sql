DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db

CREATE products (
    item_id INTEGER(11) Auto_Increment NOT NULL
    product_name VARCHAR(30),
    department_name VARCHAR(30),
    price DECIMAL(10, 2), 
    stock_quantity INTEGER(10)
    PRIMARY KEY (item_id)
);

INSERT INTO products  (product_name, department_name, price, stock_quantity)
VALUE ("Gloves", "Home",9.4,10), ("Pilots Pens","Office Supplies", 12.99,100);
