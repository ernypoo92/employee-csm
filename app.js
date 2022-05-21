const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql = require('mysql2');


// Connecting to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'dundermiflin'
    },
    console.log('Connected to the dundermiflin database.')
);

db.connect(function() {
    mainMenu();
});


// main menu
const mainMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Please select an action:',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a New Department', 'Add a New Role', 'Add a New Employee', 'Update Employee Role', 'Close Application'],
            validate: choiceInput => {
                if (choiceInput) {
                    return true;
                } else {
                    console.log('Please select an action.')
                    return false;
                }
            }
        }
    ]).then(choice => {
        console.log(choice.choice);
        switch (choice.choice) {
            case 'View All Departments':
                viewDepartmentTable();
                break;
            case 'View All Roles':
                viewRolesTable();
                break;
            case 'View All Employees':
                viewEmployeeTable();
                break;
            case 'Add a New Department':
                addNewDepatment();
                break;
            case 'Add a New Role':
                addNewRole();
                break;
            case 'Add a New Employee':
                addNewEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Close Application':
                console.log('Application is Closed')
                break;
        }
    });
};

// to display departments table
const viewDepartmentTable = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            throw err;
        } 
        console.table(res);
        mainMenu();
    });
};

// to display roles table 
const viewRolesTable = () => {
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            throw err;
        } 
        console.table(res);
        mainMenu();
    });
};


// to display employees table 
const viewEmployeeTable = () => {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) {
            throw err;
        } 
        console.table(res);
        mainMenu();
    });
};

// adding new department 
const addNewDepatment = () => {
    console.log(`
    ------------------------------------------------
        Type in the name of your new department
    ------------------------------------------------`);

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What's the new department's name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('No name has been entered, please type in the name of your new department.');
                    return false;
                }
            }
        }
    ]).then((department) => {
        db.query('INSERT INTO departments SET ?', {
            name: department.name
        });

        mainMenu();
    });
};

// adding new role 
const addNewRole = () => {
    console.log(`
    -----------------------------------------
        Type in the name of your new role
    -----------------------------------------`);

    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            throw err;
        };
    
        return inquirer.prompt([
            {
                type: 'input',
                name: 'job_title',
                message: "What's the new role's job title?",
                validate: job_titleInput => {
                    if (job_titleInput) {
                        return true;
                    } else {
                        console.log("No job title has been entered, please type in the name of your new role.")
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: "What's the new role's salary?",
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log("No salary has been entered, please type in the new roles salary.")
                    }
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: "What's the new role's department id?",
                choices: res.map(departments => departments.name),
                validate: department_id => {
                    if (department_id) {
                        return true;
                    } else {
                        console.log("No department id has been entered, please type in the new roles department id.")
                    }
                }
            }

        ]).then((role) => {
            const selectedDepartment = res.find(departments => departments.name === role.department_id);

            db.query('INSERT INTO roles SET ?', {
                job_title: role.job_title,
                salary: role.salary,
                department_id: selectedDepartment.id
            });

            mainMenu();
        });
    })
};

// adding a new employee 
const addNewEmployee = () => {
    console.log(`
    ------------------------------------------
        Type in the name your new employee
    ------------------------------------------`);

    db.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            throw err;
        };
    
        return inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What's the new employee's first name?",
                validate: first_nameInput => {
                    if (first_nameInput) {
                        return true;
                    } else {
                        console.log("No first name has been entered, please type in the new employee's first name.")
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What's the new employee's last name?",
                validate: last_nameInput => {
                    if (last_nameInput) {
                        return true;
                    } else {
                        console.log("No last name has been entered, please type in the new employee's last name.")
                    }
                }
            },
            {
                type: 'input',
                name: 'manager_id',
                message: "What's the new employee's manager's id?",
                validate: manager_idInput => {
                    if (manager_idInput) {
                        return true;
                    } else {
                        console.log("No manager id has been entered, please type in the new employee's manager's id.")
                    }
                }
            },
            {
                type: 'list',
                name: 'role_name',
                message: "What's the new employee's role?",
                choices: res.map(roles => roles.job_title),
                validate: role_idInput => {
                    if (role_idInput) {
                        return true;
                    } else {
                        console.log("No role id has been entered, please type in the new employee's role.")
                    }
                }
            }
        ]).then((employee) => {
            const newEmpSelectedRole = res.find(roles => roles.job_title === employee.role_name);

            db.query('INSERT INTO employees SET ?', {
                first_name: employee.first_name,
                last_name: employee.last_name,
                manager_id: employee.manager_id,
                role_id: newEmpSelectedRole.id
            });

            mainMenu();
        });
    });
};

// to update an employee's role 
const updateEmployeeRole = () => {

    db.query('SELECT * FROM employees', (err, res) => {
        if (err) {
            throw err;
        };

        return inquirer.prompt([
            // asking user for employee id
            {
                type: 'list',
                name: 'employee_name',
                message: "Which employee would you like to update?",
                choices: res.map(employees => employees.last_name),
                validate: employee_idInput => {
                    if (employee_idInput) {
                        return true;
                    } else {
                        console.log('No employee has been selected, please select an employee using your keyboard.');
                        return false;
                    }
                }
            }
        ]).then((employeeName) => {
            const employeeLastName = employeeName.employee_name;

            db.query('SELECT * FROM roles', (err, res) => {
                if (err) {
                    throw err;
                };

                return inquirer.prompt([
                    // new role id
                    {
                        type: 'list',
                        name: 'role_id',
                        message: "What's the role id you'd like to update this employee to?",
                        choices: res.map(roles => roles.job_title),
                        validate: role_idInput => {
                            if (role_idInput) {
                                return true;
                            } else {
                                console.log('No role id has been entered, please type in the employees new role.');
                                return false;
                            }
                        }
                    }
                ]).then(selectedEmployee => {
                    const newEmpSelectedRole = res.find(roles => roles.job_title === selectedEmployee.role_id);

                    db.query("UPDATE employees SET ? WHERE last_name = " + "'" + employeeLastName + "'", {
                        role_id: newEmpSelectedRole.id
                    });

                    mainMenu();
                });
            });
        });
    });
};

// mainMenu();