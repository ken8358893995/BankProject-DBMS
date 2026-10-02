import { useState, useEffect } from 'react';

import { getUnpaidOnlineInstallments } from '../../api/onlineloans';
import { getUnpaidPhysicalInstallments } from '../../api/physloans';

import { Table } from 'antd';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import Logo from '../Images/Logo2.png';
import '../PageStyling/Navbar.css';

export default function UnpaidLoanReport() {
  const columns = [
    {
      title: 'Installment ID',
      dataIndex: 'InstallmentID',
      key: 'InstallmentID',
    },
    {
      title: 'Loan ID',
      dataIndex: 'LoanID',
      key: 'LoanID',
    },
    {
      title: 'Deadline Date',
      dataIndex: 'DeadlineDate',
      key: 'DeadlineDate',
    },
    {
      title: 'Amount Rs.',
      dataIndex: 'Amount',
      key: 'Amount',
    },
    {
      title: 'Paid',
      dataIndex: 'Paid',
      key: 'Paid',
    },
  ];

  const [unpaidOnlineLoan, setUnpaidOnlineLoan] = useState();
  const [unpaidPhysicalLoan, setUnpaidPhysicalLoan] = useState();

  // loan list is loaded on the first component render
  useEffect(() => loadUnpaidOnlineLoan(), []);
  useEffect(() => loadUnpaidPhysicalLoan(), []);

  function loadUnpaidOnlineLoan() {
    getUnpaidOnlineInstallments()
      .then((data) => {
        setUnpaidOnlineLoan(data);
      })
      .catch((err) => console.log(err));
  }

  function loadUnpaidPhysicalLoan() {
    getUnpaidPhysicalInstallments()
      .then((data) => {
        setUnpaidPhysicalLoan(data);
      })
      .catch((err) => console.log(err));
  }
  const navigate = useNavigate();

  //loadLoanList();
  //console.log(loans);
  return (
    <div>
      <div className='navbar' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <img
            className='aruci--logo'
            src={Logo}
            onClick={() => navigate('/employeePortal/')}
            style={{ cursor: 'pointer' }}
          />
          <h1 className='topic' style={{ display: 'inline-block', marginLeft: 20 }}>Unpaid Loan Report</h1>
        </div>
        <button 
          onClick={() => window.print()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#fa8c16',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '20px'
          }}
        >
          🖨️ Export PDF
        </button>
      </div>
      <div className='table'>
        <h2>Unpaid Physical Loan Report</h2>
        <Table dataSource={unpaidPhysicalLoan} columns={columns} />
        <p>
          <b>Unpaid Physical Loan Count: </b>
          {unpaidPhysicalLoan?.length}
        </p>
      </div>

      <div className='table'>
        <h2>Unpaid Online Loan Report</h2>
        {<Table dataSource={unpaidOnlineLoan} columns={columns} />}
        <p>
          <b>Unpaid Online Loan Count: </b>
          {unpaidOnlineLoan?.length}
        </p>
      </div>
    </div>
  );
}
