DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;


CREATE TABLE department ( 
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
dept_name VARCHAR(30) NOT NULL 
);

CREATE TABLE roles (  
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,      
title VARCHAR(30) NOT NULL,     
salary DECIMAL,     
dept_id INT NOT NULL,    
FOREIGN KEY(dept_id) REFERENCES department(id)     
);

CREATE TABLE employee (  
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,     
first_name VARCHAR(30) NOT NULL,     
last_name VARCHAR(30) NOT NULL,     
role_id INT,    
mgr_id INT,     
FOREIGN KEY(role_id) REFERENCES roles(id),     
FOREIGN KEY(mgr_id) REFERENCES employee(id)     
);

