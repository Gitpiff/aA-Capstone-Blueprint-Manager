const express = require('express');
const { check } = require('express-validator');
const { Employee } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation middlewares
const employeeValidator = [
  check('firstName')
    .isLength({ min: 2, max: 30 })
    .withMessage('First Name must have between 2 and 30 characters')
    .notEmpty()
    .withMessage('First Name is required'),
  check('lastName')
    .isLength({ min: 2, max: 30 })
    .withMessage('Last Name must have between 2 and 30 characters')
    .notEmpty()
    .withMessage('Last Name is required'),
  check('jobTitle')
    .isLength({ min: 2, max: 30 })
    .withMessage('Job Title must have between 2 and 30 characters')
    .notEmpty()
    .withMessage('Job Title is required'),
  check('hireDate')
    .isDate()
    .withMessage('Hire Date must be a valid date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Hire Date cannot be in the future');
      }
      return true;
    })
    .withMessage('Hire Date cannot be in the future'),
  check('contactNumber')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Must be a valid phone number')
    .notEmpty()
    .withMessage('Phone number is required'),
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .isLength({ min: 4, max: 30 })
    .withMessage('Email must have between 4 and 30 characters')
    .notEmpty()
    .withMessage('Email is required'),
  check('salary')
    .isInt({ min: 0 })
    .withMessage('Salary must be an integer and greater than or equal to 0')
    .notEmpty()
    .withMessage('Salary is required'),
  check('picture')
    .isURL()
    .withMessage('Must be a valid URL')
    .notEmpty()
    .withMessage('Picture URL is required'),
  handleValidationErrors
];

// GET all Employees
router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    next(error);
  }
});

// GET Employee by ID
router.get('/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    next(error);
  }
});

// POST create new Employee
router.post('/new', employeeValidator, async (req, res, next) => {
  try {
    const { firstName, lastName, jobTitle, picture, hireDate, contactNumber, email, salary } = req.body;
    const newEmployee = await Employee.create({ firstName, lastName, jobTitle, picture, hireDate, contactNumber, email, salary });
    res.status(201).json(newEmployee);
  } catch (error) {
    error.message = "Bad Request";
    error.status = 400;
    next(error);
  }
});

// PUT update Employee
router.put('/:id', employeeValidator, async (req, res, next) => {
  try {
    const { firstName, lastName, jobTitle, picture, hireDate, contactNumber, email, salary } = req.body;
    const employee = await Employee.findByPk(req.params.id);

    if (employee) {
      employee.firstName = firstName;
      employee.lastName = lastName;
      employee.jobTitle = jobTitle;
      employee.picture = picture;
      employee.hireDate = hireDate;
      employee.contactNumber = contactNumber;
      employee.email = email;
      employee.salary = salary;

      await employee.save();
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE Employee
router.delete('/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (employee) {
      await employee.destroy();
      res.status(200).json({ message: "Employee Successfully Removed from Project" });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
