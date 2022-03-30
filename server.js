const inquirer = require('inquirer');
const mysql = require('mysql2');
// const consoleTable = require('console.table');

// Connect to database
const db = mysql.createConnection({
        host: 'localhost',
        // MySQL username,
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
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
            name: "Update an Employee's Role"
        },
        {
            name: "Update Manager"
        }, //
        {
            name: "View Employees by Manager"
        }, //
        {
            name: "View Employees by Department"
        }, //
        {
            name: "Delete a Department"
        }, //
        {
            name: "Delete a Role"
        }, //
        {
            name: "Delete an Employee"
        } //
    ]
}]
// initial selection
const initialScreen = function () {
    inquirer.prompt(initPromptQs).then((answer) => {
        switch (answer.init) {
            case "View all Departments":
                console.log('hello')
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
            case "Update an Employee's Role":
                updateEmployee();
                break;
            case "Update Manager":
                updateManager();
                break;
            case "View Employees by Manager":
                empByManager();
                break;
            case "View Employees by Department":
                empByDept();
                break;
            case "Delete a Department":
                delDept();
                break;
            case "Delete a Role":
                delRole();
                break;
            case "Delete an Employee":
                delEmp();
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

// view department list
const viewDept = function () {
    db.query(`SELECT * FROM department`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
        goBack();
    });
}

// view role list
const viewRoles = () => {
    db.query(`SELECT * FROM roles`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
        goBack();
    });
}

// view employee list
const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
        goBack();
    });
}

// add Department, send back to init screen after confirmation message
const addDept = function () {
    inquirer.prompt(addDepartmentQs).then((answer) => {
        const dept = answer.department
        db.query(`INSERT INTO department (dept_name) VALUES (?)`, dept, function (err, results) {
            if (err) {
                console.log(err);
            }
            console.log(`\n The ${dept} Department has been added. \n`)
            goBack();
        });
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
            // console.log(answers.department);
            db.query(
                'UPDATE roles SET dept_id = ? WHERE id = ?',
                [answers.department, departmentId],
                (err, result) => {
                    // console.log(result);
                    db.query('SELECT * FROM roles', (err, roles) => {
                        console.log(roles);
                    });
                    goBack();
                })
            })
        });
    };
    
    // add role, send back to init screen after confirmation message
    const addRole = () => {
        inquirer.prompt(addRoleQs).then((answer) => {
            db.query(`INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)`,
                [answer.title, answer.salary, 1],
                function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                        // logs the id of last inserted role (##id, title, salary, dept_id)
                        // console.log(results.insertId)
                        console.log(results.insertId)
                        chooseDeptforRole(results.insertId);
                }
            )
        })
    }
    
    

// const chooseDeptforRole = (roleID) => {
//     db.query(`
//         SELECT 
//         id AS value, 
//         dept_name AS name 
//         FROM department
//         `,(err, departments) => {
//         // this works!
//         // console.log(departments);
//         inquirer.prompt({
//             type: 'rawlist',
//             message: 'Which department is this role in?',
//             name: 'dept_name',
//             // value: 'id',
//             choices: departments,
//             loop: false
//         })
//         // this does not work!
//         .then((answers) => {

//             db.query(`
//             UPDATE roles SET dept_id = ? where role.id = ?`,
//             [answers.dept_name, roleID],
//                 // figure out how to get the dept_id
//                 (err, result) => {
//                     (err, result) => {
//                     db.query('SELECT * FROM roles', (err, roles) => {
//                         console.log('You have updated your role department id')
//                         viewRoles();
//                     });
//                 })
//         })
//     });
// };

















// add employee, send back to init screen after confirmation message
const addEmployee = () => {
    inquirer.prompt(addEmployeeQs).then((answer) => {
        db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)',
            [answer.first, answer.last, 2],
            function (err, results) {
                if (err) {
                    console.log(err);
                }
                // logs the id of last inserted role
                console.log(results.insertId)
                // console.log(results)
                addManager(results.insertId);
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
                    console.log(result);
                    db.query('SELECT * FROM employee', (err, employees) => {
                        console.table(employees);
                    });
                })
        })
    });
};









// bonus
const updateEmployee = () => {
    // db.query(`UPDATE employee SET`, 3, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(result);
    // });
}
// bonus
const updateManager = () => {
    // db.query(`DELETE FROM course_names WHERE id = ?`, 3, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(result);
    // });
}
// bonus
const empByManager = () => {

}
// bonus
const empByDept = () => {

}
// bonus
const delDept = () => {
    // db.query(`DELETE FROM course_names WHERE id = ?`, 3, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(result);
    // });
}
// bonus
const delRole = () => {

}
//bonus
const delEmp = () => {

}


// =======================Questions=======================
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
    }
    // , 
    // {
    //     type: "list",
    //     message: "What is the employee's role?",
    //     name: "role",
    //     choices: roleArray
    // }, {
    //     type: "list",
    //     message: "Who is the employee's Manager?",
    //     name: "mgr",
    //     choices: mgrArray
    // }
]

// add Role Qs
const addRoleQs = [{
    type: "input",
    message: "What is the name of the role?",
    name: "title"
}, {
    type: "input",
    message: "What is the role's salary?",
    name: "salary"
}
// , {
//     type: "rawlist",
//     message: "What is department id?",
//     name: "dept_id",
//     choices: [1, 2, 3, 4, 5, 6, 7, 8]
// }
]

// bonus
// view total budget of a department

initialScreen()