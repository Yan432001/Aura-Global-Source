import React from 'react';
import { Card, Col, Progress, Row, Space, Table, Tag, Typography } from 'antd';
import { products } from '../../data/shopData';
import { formatCurrency } from '../../utils/uiTheme';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text, Title } = Typography;

const inventoryRows = products.slice(0, 8).map((product) => ({
  key: product.id,
  name: product.name,
  category: product.category,
  price: formatCurrency(product.price),
  stock: product.inStock ? 'Available' : 'Out of stock',
  branch: product.branch,
}));

const columns = [
  { title: 'Product', dataIndex: 'name', key: 'name' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Branch', dataIndex: 'branch', key: 'branch' },
  { title: 'Price', dataIndex: 'price', key: 'price' },
  {
    title: 'Status',
    dataIndex: 'stock',
    key: 'stock',
    render: (value) => (
      <Tag color={value === 'Available' ? 'green' : 'red'} style={{ borderRadius: 999 }}>
        {value}
      </Tag>
    ),
  },
];

const AdminProducts = () => {
  const adminTheme = useAdminTheme();
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: `linear-gradient(140deg, rgba(255,255,255,0.98), ${adminTheme.systemTealSoft})` }} styles={{ body: { padding: 24 } }}>
        <Tag style={{ borderRadius: 999, border: 'none', background: adminTheme.systemTealSoft, color: adminTheme.systemTeal, padding: '6px 12px', fontWeight: 700, marginBottom: 12 }}>
          Inventory controller
        </Tag>
        <Title level={2} style={{ marginTop: 0, marginBottom: 8, color: adminTheme.text }}>
          Product and stock command layer
        </Title>
        <Text style={{ color: adminTheme.subtext, fontSize: 16 }}>
          Monitor availability, branch distribution, and catalog health in a controller-style layout.
        </Text>
      </Card>

      <Row gutter={[18, 18]}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 16, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 20 } }}>
            <Text style={{ color: adminTheme.subtext }}>Catalog size</Text>
            <Title level={3} style={{ margin: '8px 0 0', color: adminTheme.text }}>{products.length}</Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 16, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 20 } }}>
            <Text style={{ color: adminTheme.subtext }}>Available inventory</Text>
            <Title level={3} style={{ margin: '8px 0 0', color: adminTheme.text }}>{products.filter((product) => product.inStock).length}</Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 16, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 20 } }}>
            <Text style={{ color: adminTheme.subtext }}>Recovery needed</Text>
            <Title level={3} style={{ margin: '8px 0 0', color: adminTheme.text }}>{products.filter((product) => !product.inStock).length}</Title>
          </Card>
        </Col>
      </Row>

      <Row gutter={[18, 18]}>
        <Col xs={24} xl={10}>
          <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 22 } }}>
            <Title level={4} style={{ marginTop: 0, color: adminTheme.text }}>
              Inventory readiness
            </Title>
            <Text style={{ color: adminTheme.subtext, display: 'block', marginBottom: 18 }}>
              Fast pulse on the main stock programs.
            </Text>

            <Space direction="vertical" size={18} style={{ width: '100%' }}>
              <div>
                <Text strong style={{ color: adminTheme.text }}>Electronics replenishment</Text>
                <Progress percent={78} strokeColor={adminTheme.systemTeal} trailColor="rgba(18,35,59,0.08)" />
              </div>
              <div>
                <Text strong style={{ color: adminTheme.text }}>Fashion assortment freshness</Text>
                <Progress percent={64} strokeColor={adminTheme.systemOrange} trailColor="rgba(18,35,59,0.08)" />
              </div>
              <div>
                <Text strong style={{ color: adminTheme.text }}>Branch sync accuracy</Text>
                <Progress percent={97} strokeColor={adminTheme.success} trailColor="rgba(18,35,59,0.08)" />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 22 } }}>
            <Title level={4} style={{ marginTop: 0, color: adminTheme.text }}>
              Inventory table
            </Title>
            <Text style={{ color: adminTheme.subtext, display: 'block', marginBottom: 18 }}>
              Snapshot of product modules connected to the storefront.
            </Text>
            <Table columns={columns} dataSource={inventoryRows} pagination={false} size="small" scroll={{ x: 640 }} />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default AdminProducts;
