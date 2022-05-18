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
            name: 'action',
            message: 'Please select an action:',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a New Department', 'Add a New Role', 'Add a New Employee', 'Update Employee Role', 'Quit'],
            validate: actionInput => {
                if (actionInput) {
                    return true;
                } else {
                    console.log('Please select an action.')
                    return false;
                }
            }
        }
    ]).then(action => {
        console.log(action.action);

        if (action.action === 'View All Departments') {
            viewDepartments();
        } else if (action.action === 'View All Roles') {
            viewRoles();
        } else if (action.action === 'View All Employees') {
            viewEmployees();
        } else if (action.action === 'Add a New Department') {
            newDepartment();
        } else if (action.action === 'Add a New Role') {
            newRole();
        } else if (action.action === 'Add a New Employee') {
            newEmployee();
        } else if (action.action === 'Update Employee Role') {
            updateRole();
        } else {
            console.log('Goodbye! To restart, clear terminal with CNTRL+C and run command "node app.js"')
        }
    });
};

// to display departments table
const viewDepartments = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            throw err;
        } 
        console.table(res);
        mainMenu();
    });
};

// to display roles table 
const viewRoles = () => {
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            throw err;
        } 
        console.table(res);
        mainMenu();
    });
};

// to display employees table 
const viewEmployees = () => {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) {
            throw err;
        } 
        console.table(res);
        mainMenu();
    });
};

// adding new department 
const newDepartment = () => {
    console.log(`
    ----------------------------------------
        Enter a new department
    ----------------------------------------`);

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What's the new department's name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('No name has been entered, please try again.');
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
const newRole = () => {
    console.log(`
    ----------------------------------------
            Enter a new role
    ----------------------------------------`);

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
                        console.log("No job title has been entered, please try again.")
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
                        console.log("No salary has been entered, please try again.")
                    }
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: "What's the new role's department id?",
                choices: res.map(departments => departments.name),
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log("No department id has been entered, please try again.")
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
const newEmployee = () => {
    console.log(`
    ----------------------------------------
            Enter a new employee
    ----------------------------------------`);

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
                        console.log("No first name has been entered, please try again.")
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
                        console.log("No last name has been entered, please try again.")
                    }
                }
            },
            {
                type: 'input',
                name: 'manager_id',
                message: "What's the new employee's manager's employee id?",
                validate: manager_idInput => {
                    if (manager_idInput) {
                        return true;
                    } else {
                        console.log("No manager id has been entered, please try again.")
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
                        console.log("No role id has been entered, please try again.")
                    }
                }
            }
        ]).then((employee) => {
            const selectedRole = res.find(roles => roles.job_title === employee.role_name);

            db.query('INSERT INTO employees SET ?', {
                first_name: employee.first_name,
                last_name: employee.last_name,
                manager_id: employee.manager_id,
                role_id: selectedRole.id
            });

            mainMenu();
        });
    });
};

// to update an employee's role 
const updateRole = () => {

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
                        console.log('No employee has been selected, please try again.');
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
                                console.log('No role id has been entered, please try again.');
                                return false;
                            }
                        }
                    }
                ]).then(selectedEmployee => {
                    const selectedRole = res.find(roles => roles.job_title === selectedEmployee.role_id);

                    db.query("UPDATE employees SET ? WHERE last_name = " + "'" + employeeLastName + "'", {
                        role_id: selectedRole.id
                    });

                    mainMenu();
                });
            });
        });
    });
};

// mainMenu();