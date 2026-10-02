import { useState, useEffect } from 'react';
import { getFD } from '../../api/fd';
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import Logo from '../Images/Logo2.png';

export default function FixedDepositView() {
  const [account, setAccount] = useState();

  const { fixedDepositID } = useParams();
  useEffect(() => {
    console.log(fixedDepositID);
    getFD(fixedDepositID).then((data) => setAccount(data));
  }, [fixedDepositID]);

  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9f0ff 0%, #f0f5ff 100%)', paddingBottom: '40px' }}>
      <div className='navbar' style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', background: 'white' }}>
        <img 
          className='aruci--logo' 
          src={Logo}
          onClick={() => navigate('/customerPortal/')}
          alt="logo"
          style={{ cursor: 'pointer' }}
        />
        <h1 className='topic' style={{ margin: 0, color: '#722ed1' }}>Fixed Deposit Details</h1>
      </div>
      
      <div style={{ maxWidth: 700, margin: '40px auto' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: 16, 
          padding: '32px', 
          boxShadow: '0 10px 30px rgba(114,46,209,0.1)',
          borderTop: '6px solid #722ed1'
        }}>
          <h2 style={{ color: '#555', marginBottom: 24, textAlign: 'center', fontSize: '1.8rem' }}>FD Certificate</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: '#fafafa', padding: '24px', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: 4 }}>Fixed Deposit ID</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#333' }}>{account?.AccountID || 'Loading...'}</div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: 4 }}>Deposit Amount</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#722ed1' }}>Rs. {account?.Amount?.toLocaleString() || '0'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: 4 }}>Plan Type</div>
              <div style={{ display: 'inline-block', background: '#f9f0ff', color: '#722ed1', padding: '4px 12px', borderRadius: 20, fontWeight: 600, border: '1px solid #d3adf7' }}>
                {account?.TypeID || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: 4 }}>Date Created</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#555' }}>
                {account?.DateCreated ? new Date(account.DateCreated).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #d9d9d9', paddingTop: 16, marginTop: 8 }}>
              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: 4 }}>Linked Savings Account</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1677ff' }}>Acc ID: {account?.SavingsAccountID || 'N/A'}</div>
            </div>
          </div>
          
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <button 
              onClick={() => navigate('/customerPortal')}
              style={{ padding: '12px 32px', background: '#722ed1', color: 'white', border: 'none', borderRadius: 8, fontSize: '16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(114,46,209,0.3)' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
