CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE Table departments (
    department_id INTEGER(11) Auto_Increment NOT NULL,
    department_name VARCHAR(30),
    over_head DECIMAL(15, 2), 
    PRIMARY KEY (department_id)
);


ALTER TABLE products
  ADD product_sales decimal(15,2);
