import React from 'react';

import { getCustomers } from '../api/customers';
import { Table } from 'antd';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import Logo from '../pages/Images/Logo2.png';
import '../pages/PageStyling/Navbar.css'

export default function CustomerList() {
  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'CustomerID',
      key: 'CustomerID',
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'DoB',
      dataIndex: 'dateofbirth',
      key: 'dateofbirth',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        return Date.parse(a.dateofbirth) - Date.parse(b.dateofbirth);
      },
    },
    {
      title: 'Address',
      dataIndex: 'Address',
      key: 'Address',
    },
  ];

  const [customers, setCustomers] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  // customer list is loaded on the first component render
  React.useEffect(() => loadCustomerList(), []);

  function loadCustomerList() {
    getCustomers()
      .then((data) => {
        setCustomers(data);
      })
      .catch((err) => console.log(err));
  }

  const navigate = useNavigate();

  const filteredCustomers = customers.filter(c => 
    String(c.CustomerID).includes(searchText) || 
    c.Name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className='navbar'>
        <img 
        className='aruci--logo' 
        src={Logo}
        onClick={() => navigate('/employeePortal/')} />
        <h1 className='topic'>Customer List</h1>
      </div>
      
      <div style={{ padding: '20px 40px' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h2>Registered Customers</h2>
          <input 
            type="text" 
            placeholder="🔍 Search by ID or Name..." 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ 
              padding: '8px 16px', 
              width: '300px', 
              borderRadius: '20px', 
              border: '1px solid #ccc',
              outline: 'none'
            }}
          />
        </div>
        <div className='table'>
          <Table dataSource={filteredCustomers} columns={columns} rowKey="CustomerID" />
        </div>
      </div>
    </div>
  );
}
