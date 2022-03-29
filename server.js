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
    console.log(`Connected to the employee_db database.`)
);

const roleArray = [];
const mgrArray = [];
const deptArray = [];

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
// view department list
const viewDept = function () {
    db.query(`SELECT * FROM department`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);

        // find a better way to do this.
        setTimeout(() => {
            initialScreen()
        }, 5000);

    });

}
// view role list
const viewRoles = () => {
    db.query(`SELECT * FROM roles`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
        // console.log(results)
        // setTimeout(() => { initialScreen()}, 5000);
    });
}
// view employee list
const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
}
// add Department, send back to init screen after confirmation message
const addDept = function () {
    inquirer.prompt(addDepartmentQs).then((answer) => {
        const dept = answer.department
        db.query(`INSERT INTO department (dept_name) VALUES ('${dept}')`, function (err, results) {
            if (err) {
                console.log(err);
            }
            console.log(`\n The ${dept} Department has been added. \n` )
            initialScreen();
        });

    })
}

// add role, send back to init screen after confirmation message
const addRole = () => {
    inquirer.prompt(addRoleQs).then((answer) => {
        const title = answer.title;
        const salary = answer.salary;
        // TODO: find a way to create a role array
        db.query(`INSERT INTO roles (title, salary) VALUES ('${title}', '${salary}')`, function (err, results) {
            if (err) {
                console.log(err);
            }
            console.log(`\n The ${title} role has been added \n`)
            initialScreen();
        });

    })
}
// add employee, send back to init screen after confirmation message
const addEmployee = () => {
    inquirer.prompt(addEmployeeQs).then((answer) => {
        const first = answer.first;
        const last = answer.last;
        const name = `${first} ${last}`;
        const mgr = answer.mgr;
        console.log(name);

        db.query(`INSERT INTO employee (first_name, last_name) VALUES ('${first}', '${last}');`, function (err, results) {
            if (err) {
                console.log(err);
            }
            console.log(`\n Added ${name} to the list of employees. \n`);
            initialScreen();
        });

    })
}
const updateEmployee = () => {
    db.query(`UPDATE employee SET`, 3, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
    });



}
// bonus
const updateManager = () => {
    db.query(`DELETE FROM course_names WHERE id = ?`, 3, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
    });
}
// bonus
const empByManager = () => {

}
// bonus
const empByDept = () => {

}
// bonus
const delDept = () => {
    db.query(`DELETE FROM course_names WHERE id = ?`, 3, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
    });

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
    }, {
        type: "list", 
        message: "Which department does the role belong to?", 
        name: "dept", 
        choices: deptArray
    }
]

// bonus
// view total budget of a department


initialScreen()