import React from 'react';
import { Row, Col, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { publicTheme } from '../../../utils/webTheme';

const { Text, Title } = Typography;

const footerColumns = [
  {
    title: 'Solutions',
    links: [
      { label: 'Shop directory', to: '/shops' },
      { label: 'Retail products', to: '/products' },
      { label: 'Service support', to: '/service' },
      { label: 'Learning academy', to: '/learn' },
    ],
  },
  {
    title: 'Operations',
    links: [
      { label: 'Admin portal', to: '/admins/dashboard' },
      { label: 'Order workspace', to: '/cart' },
      { label: 'User profile', to: '/profile' },
    ],
  },
  {
    title: 'Business Focus',
    links: [
      { label: 'Start business', to: '/learn' },
      { label: 'Shop support', to: '/service' },
      { label: 'Community education', to: '/learn' },
    ],
  },
];

const Footer = () => (
  <div style={{ padding: '0 16px 18px' }}>
    <Row style={{ marginTop: 'auto' }}>
      <Col xs={24}>
        <div
          style={{
            padding: '36px 28px',
            background: 'linear-gradient(150deg, rgba(24, 43, 53, 0.98), rgba(47, 111, 237, 0.96))',
            borderRadius: 32,
            color: '#dbe8e4',
            boxShadow: publicTheme.shadow,
          }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={9}>
              <Space direction="vertical" size={10}>
                <Title level={3} style={{ margin: 0, color: 'white' }}>
                  Aura Supply Platform
                </Title>
                <Text style={{ color: 'rgba(219,232,228,0.78)' }}>
                  A clearer business website with shops, retail products, service support, and business learning.
                </Text>
                <Text style={{ color: 'rgba(219,232,228,0.62)' }}>
                  Built for buyers, operations teams, and supplier partners who need one clear digital workspace.
                </Text>
              </Space>
            </Col>

            {footerColumns.map((column) => (
              <Col xs={24} sm={8} lg={5} key={column.title}>
                <Space direction="vertical" size={10}>
                  <Text style={{ color: 'white', fontWeight: 700 }}>{column.title}</Text>
                  {column.links.map((item) => (
                    <Link key={item.label} to={item.to} style={{ color: 'rgba(219,232,228,0.74)' }}>
                      {item.label}
                    </Link>
                  ))}
                </Space>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(219,232,228,0.14)' }}>
            <Text style={{ color: 'rgba(219,232,228,0.58)' }}>
              Copyright 2026 Aura Supply. B2B supplier chain, service, and learning platform.
            </Text>
          </div>
        </div>
      </Col>
    </Row>
  </div>
);

export default Footer;
