import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  Col,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  Select,
  Button,
  Modal,
  message,
  Descriptions,
  Badge
} from 'antd';
import {
  ShopOutlined,
  SendOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { formatCurrency } from '../../utils/uiTheme';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text, Title } = Typography;

const statusColor = {
  Pending: 'gold',
  Confirmed: 'blue',
  Preparing: 'cyan',
  Ready: 'purple',
  Completed: 'green',
  Cancelled: 'red'
};

const OrdersManagement = () => {
  const adminTheme = useAdminTheme();
  const cardStyle = {
    borderRadius: 16,
    border: `1px solid ${adminTheme.border}`,
    background: adminTheme.card,
    height: '100%'
  };

  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [retryingId, setRetryingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/tma/orders';
      const params = {};
      if (selectedStore !== 'all') params.storeSlug = selectedStore;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const res = await axios.get(url, { params });
      if (res.data?.status) {
        setOrders(res.data.orders || res.data.data || []);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      message.error('Failed to load live orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get('/api/tma/stores');
      if (res.data?.status) {
        setStores(res.data.stores || res.data.data || []);
      }
    } catch (err) {
      console.warn('Stores fetch error:', err.message);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedStore, selectedStatus]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/api/tma/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.status) {
        message.success(`Order ${orderId} marked as ${newStatus}`);
        fetchOrders();
        if (selectedOrder && selectedOrder.referenceNo === orderId) {
          setSelectedOrder(res.data.data);
        }
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleRetryNotification = async (orderId) => {
    setRetryingId(orderId);
    try {
      const res = await axios.post(`/api/tma/orders/${orderId}/retry-notification`);
      if (res.data?.status) {
        message.success(`Telegram notification dispatched! (${res.data.notification_status})`);
        fetchOrders();
      }
    } catch (err) {
      message.error('Retry notification failed');
    } finally {
      setRetryingId(null);
    }
  };

  const stats = [
    { label: 'Total Orders', value: orders.length },
    {
      label: 'Pending',
      value: orders.filter((o) => (o.status || '').toLowerCase() === 'pending').length
    },
    {
      label: 'Preparing / Ready',
      value: orders.filter((o) =>
        ['preparing', 'ready', 'confirmed'].includes((o.status || '').toLowerCase())
      ).length
    },
    {
      label: 'Total Value',
      value: formatCurrency(orders.reduce((a, o) => a + Number(o.grandTotal || 0), 0))
    }
  ];

  const columns = [
    {
      title: 'Order Ref',
      dataIndex: 'referenceNo',
      key: 'referenceNo',
      render: (ref, record) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ color: adminTheme.primary, fontFamily: 'monospace' }}>
            {ref || `ORD-${record.id}`}
          </Text>
          <Text style={{ fontSize: 11, color: adminTheme.subtext }}>
            {record.orderType ? record.orderType.toUpperCase() : 'ORDER'}
          </Text>
        </Space>
      )
    },
    {
      title: 'Store',
      dataIndex: 'store_name',
      key: 'store_name',
      render: (storeName, record) => (
        <Space size={6}>
          <ShopOutlined style={{ color: adminTheme.primary }} />
          <Text strong style={{ color: adminTheme.text, fontSize: 13 }}>
            {storeName || record.store_slug}
          </Text>
        </Space>
      )
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => {
        const cust = record.customer || {};
        return (
          <Space direction="vertical" size={1}>
            <Text strong style={{ color: adminTheme.text, fontSize: 13 }}>
              {cust.name || 'Telegram Guest'}
            </Text>
            <Text orientation="left" style={{ fontSize: 11, color: '#3b82f6' }}>
              {cust.username ? (cust.username.startsWith('@') ? cust.username : `@${cust.username}`) : ''}
              {cust.phone ? ` • ${cust.phone}` : ''}
            </Text>
          </Space>
        );
      }
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record) => (
        <Text style={{ color: adminTheme.text }}>
          {(record.items || []).reduce((s, it) => s + (it.quantity || 1), 0)} items
        </Text>
      )
    },
    {
      title: 'Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (total) => (
        <Text strong style={{ color: adminTheme.text, fontSize: 13 }}>
          ${Number(total || 0).toFixed(2)}
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status || 'Pending'}
          onChange={(val) => handleUpdateStatus(record.referenceNo || record.id, val)}
          style={{ width: 125 }}
          size="small"
          options={[
            { label: 'Pending', value: 'Pending' },
            { label: 'Confirmed', value: 'Confirmed' },
            { label: 'Preparing', value: 'Preparing' },
            { label: 'Ready', value: 'Ready' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Cancelled', value: 'Cancelled' }
          ]}
        />
      )
    },
    {
      title: 'Telegram Dispatch',
      key: 'notification',
      render: (_, record) => {
        const notifStatus = record.store_notification || record.dispatchInfo?.notification_status;
        const isSuccess = notifStatus === 'Sent' || notifStatus === 'sent' || notifStatus === 'simulated';
        return (
          <Space size={6}>
            <Tag color={isSuccess ? 'green' : 'orange'} style={{ margin: 0, borderRadius: 8 }}>
              {isSuccess ? 'Dispatched' : 'Failed'}
            </Tag>
            {!isSuccess && (
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined spin={retryingId === (record.referenceNo || record.id)} />}
                onClick={() => handleRetryNotification(record.referenceNo || record.id)}
                title="Retry Telegram Notification"
              />
            )}
          </Space>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedOrder(record);
            setDetailModalOpen(true);
          }}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: adminTheme.text }}>
            Multi-Store Telegram Orders
          </Title>
          <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>
            Real-time pipeline, status updates, and Telegram store dispatches
          </Text>
        </div>

        <Space wrap>
          <Select
            value={selectedStore}
            onChange={setSelectedStore}
            style={{ width: 220 }}
            options={[
              { label: 'All Stores & Concepts', value: 'all' },
              ...stores.map((s) => ({ label: s.name, value: s.slug }))
            ]}
          />

          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 140 }}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Confirmed', value: 'Confirmed' },
              { label: 'Preparing', value: 'Preparing' },
              { label: 'Ready', value: 'Ready' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Cancelled', value: 'Cancelled' }
            ]}
          />

          <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={12} md={6} key={stat.label}>
            <Card style={cardStyle} styles={{ body: { padding: 18 } }}>
              <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>{stat.label}</Text>
              <Title level={3} style={{ margin: '4px 0 0', color: adminTheme.text }}>
                {stat.value}
              </Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey={(r) => r.referenceNo || r.id}
          loading={loading}
          pagination={{ pageSize: 10, size: 'small' }}
          size="middle"
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>
              {selectedOrder?.referenceNo}
            </span>
            <Tag color={statusColor[selectedOrder?.status || 'Pending']} style={{ borderRadius: 999 }}>
              {selectedOrder?.status || 'Pending'}
            </Tag>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          selectedOrder?.store_notification !== 'Sent' && (
            <Button
              key="retry"
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleRetryNotification(selectedOrder?.referenceNo || selectedOrder?.id)}
            >
              Retry Store Telegram Notification
            </Button>
          )
        ]}
        width={680}
      >
        {selectedOrder && (
          <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 12 }}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Store">{selectedOrder.store_name}</Descriptions.Item>
              <Descriptions.Item label="Date">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {selectedOrder.customer?.name} ({selectedOrder.customer?.username || '@guest'})
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedOrder.customer?.phone || 'None provided'}
              </Descriptions.Item>
              <Descriptions.Item label="Fulfillment">
                {selectedOrder.orderType ? selectedOrder.orderType.toUpperCase() : 'DINE_IN'}
              </Descriptions.Item>
              <Descriptions.Item label="Address/Table">
                {selectedOrder.customer?.address || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Note" span={2}>
                <Text italic>{selectedOrder.customer?.note || 'No special note'}</Text>
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ fontSize: 13, marginBottom: 8, display: 'block' }}>
                Order Items ({selectedOrder.items?.length || 0})
              </Text>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '8px 14px' }}>
                {(selectedOrder.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid #e2e8f0' : 'none'
                    }}
                  >
                    <div>
                      <Text strong>{it.name}</Text>
                      {it.selectedOptions && Object.keys(it.selectedOptions).length > 0 && (
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          {Object.entries(it.selectedOptions)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' • ')}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        Qty: {it.quantity} × ${Number(it.price).toFixed(2)}
                      </div>
                    </div>
                    <Text strong style={{ fontSize: 13 }}>
                      ${Number(it.subtotal || it.quantity * it.price).toFixed(2)}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#f1f5f9', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Subtotal:</span>
                <span>${Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Delivery / Service Fee:</span>
                <span>${Number(selectedOrder.deliveryFee || 0).toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: 15,
                  paddingTop: 6,
                  borderTop: '1px solid #cbd5e1'
                }}
              >
                <span>TOTAL:</span>
                <span style={{ color: '#2563eb' }}>${Number(selectedOrder.grandTotal || 0).toFixed(2)}</span>
              </div>
            </div>

            {selectedOrder.dispatchInfo && (
              <div style={{ background: '#eff6ff', borderRadius: 12, padding: '10px 14px', border: '1px solid #bfdbfe' }}>
                <Text strong style={{ color: '#1e40af', fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Telegram Store Destination: {selectedOrder.dispatchInfo.groupName}
                </Text>
                <div style={{ fontSize: 11, color: '#3b82f6' }}>
                  Target Chat ID: <code>{selectedOrder.dispatchInfo.targetGroupId}</code> • Status: <b>{selectedOrder.store_notification}</b>
                </div>
              </div>
            )}
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default OrdersManagement;
