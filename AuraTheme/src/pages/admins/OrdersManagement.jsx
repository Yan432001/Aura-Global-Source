import React from 'react';
import { Avatar, Card, Col, Row, Space, Table, Tag, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { formatCurrency } from '../../utils/uiTheme';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text, Title } = Typography;

const orders = [
  { key: 1, orderId: '#3413', customer: 'Richard Dorn', items: 82, total: 480, status: 'Delivered', date: 'Aug 09, 2025' },
  { key: 2, orderId: '#4113', customer: 'Randal Dare', items: 75, total: 525, status: 'Delivered', date: 'Aug 12, 2025' },
  { key: 3, orderId: '#4813', customer: 'Bickie Bob', items: 68, total: 570, status: 'Cancelled', date: 'Aug 14, 2025' },
  { key: 4, orderId: '#5513', customer: 'Emma Wilson', items: 61, total: 615, status: 'Pending', date: 'Aug 15, 2025' },
  { key: 5, orderId: '#6213', customer: 'Hugh Jackma', items: 54, total: 660, status: 'Delivered', date: 'Aug 17, 2025' },
  { key: 6, orderId: '#6913', customer: 'Angelina Hose', items: 47, total: 705, status: 'Pending', date: 'Aug 18, 2025' },
];

const statusColor = { Delivered: 'green', Pending: 'gold', Cancelled: 'red' };

const stats = [
  { label: 'Total Orders', value: orders.length },
  { label: 'Delivered', value: orders.filter((o) => o.status === 'Delivered').length },
  { label: 'Pending', value: orders.filter((o) => o.status === 'Pending').length },
  { label: 'Order Value', value: formatCurrency(orders.reduce((a, o) => a + o.total, 0)) },
];

const OrdersManagement = () => {
  const adminTheme = useAdminTheme();
  const cardStyle = { borderRadius: 16, border: `1px solid ${adminTheme.border}`, background: adminTheme.card, height: '100%' };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', render: (v) => <Text strong style={{ color: adminTheme.primary }}>{v}</Text> },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (name) => (
        <Space size={10}>
          <Avatar icon={<StarFilled />} style={{ background: `linear-gradient(135deg, ${adminTheme.primary}, #5b8def)` }} />
          <Text strong style={{ color: adminTheme.text }}>{name}</Text>
        </Space>
      ),
    },
    { title: 'Items', dataIndex: 'items', key: 'items' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: formatCurrency },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v) => <Tag color={statusColor[v]} style={{ borderRadius: 999 }}>{v}</Tag>,
    },
  ];

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <div>
        <Title level={4} style={{ margin: 0, color: adminTheme.text }}>Orders Management</Title>
        <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>Storefront order pipeline and fulfillment status</Text>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={12} md={6} key={stat.label}>
            <Card style={cardStyle} styles={{ body: { padding: 18 } }}>
              <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>{stat.label}</Text>
              <Title level={3} style={{ margin: '4px 0 0', color: adminTheme.text }}>{stat.value}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
        <Table columns={columns} dataSource={orders} pagination={{ pageSize: 8, size: 'small' }} size="small" scroll={{ x: 640 }} />
      </Card>
    </Space>
  );
};

export default OrdersManagement;
