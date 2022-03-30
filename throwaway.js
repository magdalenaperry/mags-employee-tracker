const selectManager = (employee_id) => {
    db.query(`
    SELECT 
    id AS value, 
    CONCAT(first_name, ' ', last_name) AS name 
    FROM employee 
    WHERE NOT id = ?
    `, employee_id, (err, managers) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'Who\'s the manager?',
            name: 'manager',
            choices: managers
        }).then((answers) => {
            db.query(
                'UPDATE employee SET manager_id = ? WHERE id = ?',
                [answers.manager, employee_id],
                (err, result) => {
                    console.log(result);
                    db.query('SELECT * FROM employee', (err, employees) => {
                        console.log(employees);
                    });
                })
        })
    });
};

const addEmployee = () => {
    inquirer.prompt(
        [{
                message: 'What\'s the employee\'s first name?',
                name: 'first_name'
            },
            {
                message: 'What\'s the employee\'s last name?',
                name: 'last_name'
            }
        ]
    ).then((answers) => {
        db.query(
            'INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)',
            [answers.first_name, answers.last_name, 1],
            (err, result) => {
                selectManager(result.insertId);
            }
        );
    });
};
