import { useEffect, useState } from 'react';
import { Badge, Popover, List, Tag, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { getCustomerOnlineLoans } from '../api/onlineloans';

export default function NotificationBell() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    getCustomerOnlineLoans()
      .then((data) => setLoans((data || []).filter((l) => !l.Approved)))
      .catch(() => {});
  }, []);

  const content = (
    <div style={{ width: 280 }}>
      {loans.length === 0 ? (
        <Empty description='No pending notifications' imageStyle={{ height: 40 }} />
      ) : (
        <List
          size='small'
          dataSource={loans}
          renderItem={(loan) => (
            <List.Item>
              <div>
                <Tag color='orange'>Pending</Tag>
                <span style={{ fontSize: '0.85rem' }}>
                  Loan #{loan.LoanID} — Rs. {loan.Amount?.toLocaleString()} awaiting approval
                </span>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover content={content} title='🔔 Notifications' trigger='click' placement='bottomRight'>
      <Badge count={loans.length} size='small' style={{ cursor: 'pointer' }}>
        <BellOutlined style={{ fontSize: '1.3rem', cursor: 'pointer', color: '#444' }} />
      </Badge>
    </Popover>
  );
}
