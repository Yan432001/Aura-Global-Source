import React from 'react';
import { Avatar, Card, Col, Row, Space, Table, Tag, Typography } from 'antd';
import { formatCurrency } from '../../utils/uiTheme';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text, Title } = Typography;

const avatarUrl = (seed) => `https://i.pravatar.cc/80?img=${seed}`;

const customers = [
  { key: 1, name: 'Richard Dorn', email: 'richard@ap.com', orders: 18, spend: 2840, tier: 'Gold', avatar: avatarUrl(1) },
  { key: 2, name: 'Randal Dare', email: 'randal@dotcom.com', orders: 6, spend: 640, tier: 'Silver', avatar: avatarUrl(2) },
  { key: 3, name: 'Bickie Bob', email: 'bickiebob@dotcom.com', orders: 24, spend: 4120, tier: 'Gold', avatar: avatarUrl(3) },
  { key: 4, name: 'Emma Wilson', email: 'emmawilson@dotcom.com', orders: 3, spend: 210, tier: 'Bronze', avatar: avatarUrl(4) },
  { key: 5, name: 'Hugh Jackma', email: 'hughjackma@dotcom.com', orders: 11, spend: 1580, tier: 'Silver', avatar: avatarUrl(5) },
  { key: 6, name: 'Angelina Hose', email: 'angelinahose@dotcom.com', orders: 31, spend: 5960, tier: 'Gold', avatar: avatarUrl(6) },
];

const tierColor = { Gold: 'gold', Silver: 'blue', Bronze: 'orange' };

const stats = [
  { label: 'Total Customers', value: customers.length.toLocaleString() },
  { label: 'Gold Tier', value: customers.filter((c) => c.tier === 'Gold').length },
  { label: 'Avg. Lifetime Spend', value: formatCurrency(customers.reduce((a, c) => a + c.spend, 0) / customers.length) },
];

const CustomersManagement = () => {
  const adminTheme = useAdminTheme();
  const cardStyle = { borderRadius: 16, border: `1px solid ${adminTheme.border}`, background: adminTheme.card, height: '100%' };

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space size={10}>
          <Avatar size={34} src={record.avatar} />
          <div>
            <Text strong style={{ display: 'block', color: adminTheme.text }}>{name}</Text>
            <Text style={{ color: adminTheme.subtext, fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    { title: 'Orders', dataIndex: 'orders', key: 'orders' },
    { title: 'Lifetime Spend', dataIndex: 'spend', key: 'spend', render: formatCurrency },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (v) => <Tag color={tierColor[v]} style={{ borderRadius: 999 }}>{v}</Tag>,
    },
  ];

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <div>
        <Title level={4} style={{ margin: 0, color: adminTheme.text }}>Customers Management</Title>
        <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>Storefront customer accounts, tiers, and spend</Text>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={24} sm={8} key={stat.label}>
            <Card style={cardStyle} styles={{ body: { padding: 18 } }}>
              <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>{stat.label}</Text>
              <Title level={3} style={{ margin: '4px 0 0', color: adminTheme.text }}>{stat.value}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
        <Table columns={columns} dataSource={customers} pagination={{ pageSize: 8, size: 'small' }} size="small" scroll={{ x: 560 }} />
      </Card>
    </Space>
  );
};

export default CustomersManagement;
