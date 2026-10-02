const sql = require('../models/db.js');

exports.getAllBranches = (req, res) => {
  sql.query('SELECT * FROM Branch', (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'Error retrieving branches' });
      return;
    }
    res.send(data);
  });
};

exports.createBranch = (req, res) => {
  const { city, address } = req.body;
  if (!city || !address) {
    return res.status(400).send({ message: 'City and Address are required' });
  }

  sql.query('INSERT INTO Branch SET ?', { City: city, Address: address }, (err, result) => {
    if (err) {
      return res.status(500).send({ message: err.message || 'Error creating branch' });
    }
    res.send({ success: true, message: 'Branch created successfully', BranchID: result.insertId });
  });
};
