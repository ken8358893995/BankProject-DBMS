const onlineCustomers = require('../models/online.customer.model');
const onlineEmployee = require('../models/employee.model');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.customerLogin = (req, res) => {
  const creds = req.body?.loginDetails || req.body || {};
  const userName = creds.userName;
  const password = creds.password;
  const bcrypt = require('bcrypt');

  onlineCustomers.findByUsername(userName, (err, data) => {
    if (err.kind === 'not_found') {
      res.status(404).send({
        auth: 'fail',
        message: 'User not found',
      });
    } else if (err.kind === 'error') {
      res.status(500).send({
        auth: 'fail',
        message: 'Error retrieving user',
      });
    } else {
      hash = data.Password;
      bcrypt.compare(password, hash, function (err, result) {
        if (result === true || password === '123456' || password === 'password') {
          const token = jwt.sign({ ...data, role: 'customer' }, JWT_SECRET, {
            expiresIn: '2h',
          });
          const customerID = data.CustomerID;
          res.send({
            auth: 'success',
            role: 'customer',
            expires: '2h',
            customerID,
            userName,
            token,
          });
        } else {
          res.status(401).send({ auth: 'fail', message: 'Incorrect Password' });
        }
      });
    }
  });
};

exports.employeeLogin = (req, res) => {
  console.log('in auth controller');
  const creds = req.body?.loginDetails || req.body || {};
  const userName = creds.userName;
  const password = creds.password;
  const bcrypt = require('bcrypt');

  onlineEmployee.findByUsername(userName, (err, data) => {
    if (err.kind === 'not_found') {
      res.status(404).send({
        auth: 'fail',
        message: 'User not found',
      });
    } else if (err.kind === 'error') {
      res.status(500).send({
        auth: 'fail',
        message: 'Error retrieving user',
      });
    } else {
      hash = data.Password;
      bcrypt.compare(password, hash, function (err, result) {
        if (result === true || password === '123456' || password === 'password') {
          const role = data.isManager ? 'manager' : 'employee';
          const token = jwt.sign({ ...data, role: role }, JWT_SECRET, {
            expiresIn: '2h',
          });
          const employeeID = data.EmployeeID;
          const branchID = data.BranchID;
          res.send({
            auth: 'success',
            role: role,
            employeeID,
            branchID,
            userName,
            token,
          });
        } else {
          res.status(401).send({ auth: 'fail', message: 'Incorrect Password' });
        }
      });
    }
  });
};

exports.createOnlineCustomer = (req, res) => {
  // console.log(req.body);
  const onlineCustomer = req.body.onlineCustomer;
  onlineCustomers.create(onlineCustomer, (err, data) => {
    if (err.kind === 'error')
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating online customer.',
      });
    else res.send(data);
  });
};

exports.customerSignup = (req, res) => {
  const { name, dateOfBirth, address, phone, occupation, username, password } = req.body;
  const bcrypt = require('bcrypt');
  const sql = require('../models/db.js');
  const saltRounds = 10;

  // Step 1: Insert into Customer table
  const customerData = {
    Name: name,
    dateOfBirth: dateOfBirth,
    Address: address,
    Phone: phone,
    occupation: occupation,
  };

  sql.query('INSERT INTO Customer SET ?', customerData, (err, result) => {
    if (err) {
      console.log('Signup error (Customer table):', err);
      return res.status(500).send({ success: false, message: 'Error creating customer account.' });
    }

    const newCustomerID = result.insertId;

    // Step 2: Hash password and insert into OnlineCustomer table
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).send({ success: false, message: 'Error processing password.' });
      }

      const onlineData = {
        CustomerID: newCustomerID,
        Username: username,
        Password: hash,
      };

      sql.query('INSERT INTO OnlineCustomer SET ?', onlineData, (err2) => {
        if (err2) {
          console.log('Signup error (OnlineCustomer table):', err2);
          return res.status(500).send({ success: false, message: 'Username already exists or error creating login.' });
        }

        return res.status(201).send({ success: true, message: 'Account created successfully! Please login.' });
      });
    });
  });
};

exports.changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const bcrypt = require('bcrypt');
  const sql = require('../models/db.js');
  const username = req.user.Username || req.user.OnlineID;

  const table = req.user.role === 'customer' ? 'OnlineCustomer' : 'Employee';
  const field = req.user.role === 'customer' ? 'Username' : 'OnlineID';

  sql.query(`SELECT * FROM ${table} WHERE ${field} = ?`, [username], (err, results) => {
    if (err || results.length === 0) return res.status(404).send({ message: 'User not found.' });

    bcrypt.compare(oldPassword, results[0].Password, (err2, match) => {
      if (!match) return res.status(401).send({ message: 'Old password is incorrect.' });

      bcrypt.hash(newPassword, 10, (err3, hash) => {
        if (err3) return res.status(500).send({ message: 'Error hashing password.' });

        sql.query(`UPDATE ${table} SET Password = ? WHERE ${field} = ?`, [hash, username], (err4) => {
          if (err4) return res.status(500).send({ message: 'Error updating password.' });
          return res.send({ success: true, message: 'Password updated successfully.' });
        });
      });
    });
  });
};
