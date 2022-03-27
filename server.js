const inquirer = require('inquirer');

const initPromptQs = [{
    type: 'list',
    name: 'init',
    message: "Please select from the following options.",
    loop: false, // stops the loop of choices
    choices: [
        { name: "View all Departments"}, 
        { name: "View all Roles"},
        { name: "View all Employees"}, 
        { name: "Add a Department"},
        { name: "Add a Role"},
        { name: "Add an Employee"},
        { name: "Update an Employee's Role"}, 
        { name: "Update Manager"}, //
        { name: "View Employees by Manager"}, //
        { name: "View Employees by Department"}, //
        { name: "Delete a Department"}, //
        { name: "Delete a Role"}, //
        { name: "Delete an Employee"} //
    ] 
    }]

const initialScreen = function () {
    inquirer.prompt(initPromptQs).then((answer) => {
        switch (answer.init) {
            case "View all Departments": 
                viewDept();
                break;
            case "View all Roles": viewRoles();
                break;
            case "View all Employees": viewEmployees();
                break;
            case "Add a Department": addDept();
                break;
            case "Add a Role": addRole();
                break;
            case "Add an Employee": addEmployee();
                break;
            case "Update an Employee's Role": updateEmployee();
                break;
            case "Update Manager": updateManager();
                break;
            case "View Employees by Manager": empByManager();
                break;
            case "View Employees by Department": empByDept();
                break;
            case "Delete a Department": delDept();
                break;
            case "Delete a Role": delRole();
                break;
            case "Delete an Employee": delEmp();
                break;
        }
    })
}

const viewDept = () => {

}

const viewRoles = () => {

}

const viewEmployees = () => {

}

const addDept = () => {

}

const addRole = () => {

}

const addEmployee = () => {

}

const updateEmployee = () => {

}

const updateManager = () => {

}

const empByManager = () => {

}

const empByDept = () => {

}

const delDept = () => {

}
const delRole = () => {

}
const delEmp = () => {

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
}, {
    type: "list",
    message: "What is the employee's role",
    // choices: roleArray,

}]


// add Role Qs
const addRoleQs = [{
    type: "input",
    message: "What is the name of the role?",
    name: "first"
}, {
    type: "input",
    message: "What is role's base salary?",
    name: "last"
}, {
    type: "list",
    message: "What department is this role based?",
    // choices: roleArray,

}]

initialScreen();