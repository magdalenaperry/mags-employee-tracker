const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Connect to database
const db = mysql.createConnection({
        host: 'localhost',
        // MySQL username,
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log(`\n \n \n Connected to the employee_db for the CODING CAMP HOSPITAL EMPLOYEES MANAGING SYSTEM. \n \n \n`)
);

const initPromptQs = [{
    type: 'list',
    name: 'init',
    message: "Please select from the following options.",
    loop: false, // stops the loop of choices
    choices: [{
            name: "View all Departments"
        },
        {
            name: "View all Roles"
        },
        {
            name: "View all Employees"
        },
        {
            name: "Add a Department"
        },
        {
            name: "Add a Role"
        },
        {
            name: "Add an Employee"
        },
        {
            name: "Delete a Department"
        }, 
        {
            name: "Delete a Role"
        },
        {
            name: "Delete an Employee"
        },
        {
            name: "View Department Budgets"
        }
    ]
}]
// initial selection
const initialScreen = function () {
    inquirer.prompt(initPromptQs).then((answer) => {
        switch (answer.init) {
            case "View all Departments":
                viewDept();
                break;
            case "View all Roles":
                viewRoles();
                break;
            case "View all Employees":
                viewEmployees();
                break;
            case "Add a Department":
                addDept();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            // case "Update an Employee's Role":
            //     updateEmployee();
            //     break;
            // case "Update Manager":
            //     updateManager();
            //     break;
            // case "View Employees by Manager":
            //     empByManager();
            //     break;
            // case "View Employees by Department":
            //     empByDept();
            //     break;
            case "Delete a Department":
                delDept();
                break;
            case "Delete a Role":
                delRole();
                break;
            case "Delete an Employee":
                delEmp();
                break;
            case "View Department Budgets":
                deptBudget();
                break;
        }
    })
}

const goBack = function () {
    inquirer.prompt(
        [{
            type: "rawlist",
            message: "What would you like to do next?",
            name: "confirm",
            choices: [{
                    name: 'Exit Program'
                },
                {
                    name: 'Return to Initial Screen'
                }
            ]
        }]
    ).then((answers) => {
        if (answers.confirm === 'Exit Program') {
            process.exit();
        } else if (answers.confirm === 'Return to Initial Screen') {
            initialScreen();
        }
    })
}

// VIEW DEPT list
const viewDept = function () {
    db.query(`SELECT * FROM department`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log('\n \n Departments \n ')
        console.table(results);
        goBack();
    });
}

// VIEW ROLE list
const viewRoles = () => {
    db.query(`SELECT * FROM roles`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log('\n \n Roles \n ')
        console.table(results);
        goBack();
    });
}

// VIEW EMPLOYEE list
const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log('\n \n Employees \n ')
        console.table(results);
        goBack();
    });
}

// ADDS DEPT, send back to init screen after confirmation message
const addDept = function () {
    inquirer.prompt(addDepartmentQs).then((answer) => {
        const dept = answer.department
        db.query(`INSERT INTO department (dept_name) VALUES (?)`, dept, function (err, results) {
            if (err) {
                console.log(err);
            }
            console.log(`\n \n The ${dept} Department has been added. \n \n`)
            goBack();
        });
    })
}

// ADDS ROLE & SETS DEPT, sends back to init screen after confirmation message
const addRole = () => {
    inquirer.prompt(addRoleQs).then((answer) => {
        db.query(
            `INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)`,
            [answer.title, answer.salary, 1],
            function (err, results) {
                if (err) {
                    console.log(err);
                }
                chooseDeptforRole(results.insertId);
            }

        )
    })
}

const chooseDeptforRole = (departmentId) => {
    db.query(`
    SELECT 
    id AS value,
    dept_name AS name
    FROM department
    `, (err, departments) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'What is the department?',
            name: 'department',
            choices: departments
        }).then((answers) => {
            db.query(
                'UPDATE roles SET dept_id = ? WHERE id = ?',
                [answers.department, departmentId],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`\n \n You have added a new role. \n \n`);
                    }
                    goBack();
                })
        })
    });
};

// ADDS EMPLOYEE & SELECTS MANAGER \\, send back to init screen after confirmation 
const addEmployee = () => {
    inquirer.prompt(addEmployeeQs).then((answer) => {
        db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)',
            [answer.first, answer.last, 2],
            function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    var newRoleId = results.insertId
                    addManager(results.insertId);
                }
            });
    })
}

const addManager = (employee_id) => {
    db.query(`
    SELECT 
    id AS value, 
    CONCAT(first_name, ' ', last_name) AS name 
    FROM employee 
    WHERE NOT id = ?
    `, employee_id, (err, managers) => {
        inquirer.prompt({
            type: 'rawlist',
            message: "Who's the manager?",
            name: 'manager',
            choices: managers
        }).then((answers) => {
            db.query(
                'UPDATE employee SET mgr_id = ? WHERE id = ?',
                [answers.manager, employee_id],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`\n \n You have added a new employee. \n \n`)
                    }
                    goBack();
                })
        })
    });
};

// DELETES DEPARTMENT (added constraint to foreign keys in schema)
const delDept = () => {
    db.query(`
    SELECT 
    id AS value, 
    dept_name AS name 
    FROM department
    `, (err, departments) => {
        inquirer.prompt({
            type: 'rawlist',
            message: "What's the department you wish to delete?",
            name: 'department',
            choices: departments
        }).then((answers) => {
            db.query(
                'DELETE FROM department WHERE id = ?',
                [answers.department],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`\n \n You have deleted a department. \n \n`);
                    }
                    goBack();
                })
        })
    });
};

// DELETES ROLE, (added constraint to foreign keys in schema)
const delRole = () => {
    db.query(`
    SELECT 
    id AS value, 
    title AS name 
    FROM roles
    `, (err, roles) => {
        inquirer.prompt({
            type: 'rawlist',
            message: "What's the role you wish to delete?",
            name: 'role',
            choices: roles
        }).then((answers) => {
            db.query(
                'DELETE FROM roles WHERE id = ?',
                [answers.role],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`\n \n You have deleted a role. \n \n`);
                    }
                    goBack();
                })
        })
    });
};

//DELETES EMPLOYEE, (added constraint to foreign keys in schema)
const delEmp = () => {
    db.query(`
    SELECT 
    id AS value, 
    CONCAT(first_name, ' ', last_name) AS name
    FROM employee
    `, (err, employees) => {
        inquirer.prompt({
            type: 'rawlist',
            message: "Who is the employee you wish to delete?",
            name: 'employee',
            choices: employees
        }).then((answers) => {
            db.query(
                'DELETE FROM employee WHERE id = ?',
                [answers.employee],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`\n \n You have deleted an employee.\n \n`);
                    }
                    goBack();
                })
        })
    });
};

// View Department Budget
const deptBudget = function () {
    db.query(`
 SELECT
 id as value,
 dept_name as name
 FROM department
    `, (err, departments) => {
        inquirer.prompt({
            type: 'rawlist',
            message: "Choose a department to view salary.",
            name: 'department',
            choices: departments
        }).then((answers) => {
            db.query(
                `SELECT 
                SUM(salary) AS salary
                FROM roles where dept_id = ?;
                `,
                [answers.department],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`\n \n The department salary is ${result[0].salary}! \n \n`)
                    }
                    goBack();

                })
        })
    });

}

// add Department Qs
const addDepartmentQs = [{
    type: "input",
    message: "What is the the department name?",
    name: "department"
}]

// add Employee Qs
const addEmployeeQs = [{
    type: "input",
    message: "What is the employee's first name?",
    name: "first"
}, {
    type: "input",
    message: "What is the employee's last name?",
    name: "last"
}]

// add Role Qs
const addRoleQs = [{
    type: "input",
    message: "What is the name of the role?",
    name: "title"
}, {
    type: "input",
    message: "What is the role's salary?",
    name: "salary"
}]


initialScreen();