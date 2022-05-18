INSERT INTO departments (name)
VALUES
    ('Manager'),
    ('Sales'),
    ('Accounting'),
    ('Customer Service'),
    ('Quality Assurance'),
    ('HR'),
    ('Warehouse')
;

INSERT INTO roles (job_title, salary, department_id)
VALUES
    ('Manager', 80000, 1),
    ('Assistant to the Manger', 65000, 1),
    ('Salesman', 65000, 2),
    ('Sales Woman', 60000, 2),
    ('Secretary', 55000, 4),
    ('Accountant', 69000, 3),
    ('Customer Service Director', 48000, 5),
    ('Quality Addurance Director', 50000, 4),
    ('Warehouse Manager', 85000, 7),
    ('Warehouse', 50000, 7),
    ('Human Resources Director', 45000, 6)
    ('Intern', 56000, 1)
;

INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES
    ('Michael', 'Scot', 1, 1),
    ('Pam', 'Beesly', NULL, 5),
    ('Jim', 'Halpert', 2, 3),
    ('Dwight', 'Schrute', NULL, 3)
    ('Stanley', 'Hudson', NULL, 3),
    ('Kevin', 'Malone', NULL, 6),
    ('Angela', 'Martin', NULL, 6),
    ('Philis', 'Vance', NULL, 3),
    ('Creed', 'Bratton', 4, 8),
    ('Oscar', 'Martinez', 3, 6),
    ('Kelly', 'Kapoor', NULL, 7),
    ('Toby', 'Flenderson', NULL, 11),
    ('Darryl', 'Philbin', 7, 9),
    ('Andy', 'Bernard', NULL, 3),
    ('Ryan', 'Howard', NULL, 12),
    ('Roy', 'Anderson', NULL,  10)
;