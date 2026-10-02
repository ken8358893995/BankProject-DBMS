import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getBranches } from '../api/branches';
import Logo from '../pages/Images/Logo2.png';

export default function BranchList() {
  const [branches, setBranches] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getBranches().then(data => setBranches(data || [])).catch(console.log);
  }, []);

  const columns = [
    { title: 'Branch ID', dataIndex: 'BranchID', key: 'BranchID' },
    { title: 'City', dataIndex: 'City', key: 'City' },
    { title: 'Address', dataIndex: 'Address', key: 'Address' },
  ];

  const filtered = branches.filter(b => 
    b.City.toLowerCase().includes(searchText.toLowerCase()) || 
    String(b.BranchID).includes(searchText)
  );

  return (
    <div>
      <div className='navbar'>
        <img className='aruci--logo' src={Logo} onClick={() => navigate('/employeePortal/')} />
        <h1 className='topic'>Branch List</h1>
      </div>
      <div style={{ padding: '20px 40px' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h2>Bank Branches</h2>
          <Input.Search 
            placeholder="Search by City or ID..." 
            allowClear
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }} 
          />
        </div>
        <Table dataSource={filtered} columns={columns} rowKey="BranchID" />
      </div>
    </div>
  );
}
