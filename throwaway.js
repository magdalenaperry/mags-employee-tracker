function updateEmployee() {
    db.query(`
    SELECT
    id AS value, 
    CONCAT(first_name, ' ', last_name) AS name 
    FROM employee 
    `, (err, employees) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'Which employee?',
            name: 'employee',
            choices: employees
        }).then((answer) => {
            // console.log(answer.employee);
            db.query(`
        SELECT
        id AS value, 
        title AS name
        FROM role 
        `, (err, roles) => {
                inquirer.prompt({
                    type: 'rawlist',
                    message: 'Which role would you like to switch this employee to?',
                    name: 'role',
                    choices: roles
                }).then((answer) => {
                    db.query(
                        'UPDATE employee SET role_id = ? WHERE id = ?',
                        [answer.role, employeeID],
                        (err, result) => {
                            init();
                        })
                })
            });
        })
    });
}