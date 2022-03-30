USE employee_db;
INSERT INTO department(id, dept_name)
VALUES
(001, 'Attending Physicians'),
(002, 'Residents'),
(003, 'Administration'),
(004, 'Board of Directors'), 
(005, 'Legal'), 
(006, 'Technicians');

INSERT INTO roles(id, title, salary, dept_id)
VALUES
(0001, 'Cardiologist', 400000, 001),
(0002, 'Intern', 65000, 002),
(0003, 'Administrative Assistant', 35000, 003),
(0004, 'Director of Public Health', 250000, 004),
(0005, 'Malpractice Lawyer', 120000, 005),
(0006, 'Ultrasound Tech', 65000, 006),
(0007, 'Radiologist', 500000, 001),
(0008, 'Pediatrician', 250000, 001),
(0009, 'Director of Patient Advocacy', 200000, 004),
(0010, 'Mammography Tech', 70000, 006);

INSERT INTO employee(id, last_name, first_name, role_id, mgr_id)
VALUES
(01, 'Perry', 'Brad', 001,  null),
(02, 'Smith', 'Jane', 005,  01),
(03, 'Johnson', 'Anthony', 006, 01),
(04, 'Cooper', 'Sheldon', 006, 01),
(05, 'Fulesh', 'Sofia', 001, null),
(06, 'Vakrim', 'Robert', 004, null),
(07, 'Almazan', 'Abdul', 001, null),
(08, 'Gonzales', 'Samantha', 002, null),
(09, 'Jung', 'David', 003, null),
(10, 'VanTassel', 'Joanne', 005, null);


