import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { UpOutlined } from '@ant-design/icons';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return visible ? (
    <Button
      type='primary'
      shape='circle'
      icon={<UpOutlined />}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 999,
        width: 44,
        height: 44,
        boxShadow: '0 4px 16px rgba(22,119,255,0.4)',
      }}
    />
  ) : null;
}
