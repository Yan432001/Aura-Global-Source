import React, { useMemo } from 'react';
import { Tag, Typography } from 'antd';
import GenericReportPage from './reports/GenericReportPage';
import { products } from '../../data/shopData';
import { formatCurrency } from '../../utils/uiTheme';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text } = Typography;

const statusColor = { Delivered: 'green', Pending: 'gold', Cancelled: 'red' };

const SalesReport = () => {
  const adminTheme = useAdminTheme();
  const rows = useMemo(
    () =>
      products.slice(0, 10).map((product, index) => ({
        key: product.id,
        orderId: `#SO-${2040 + index}`,
        product: product.name,
        units: 12 + index * 3,
        total: product.price * (12 + index * 3),
        status: ['Delivered', 'Delivered', 'Pending', 'Delivered', 'Cancelled'][index % 5],
        date: ['Mar 12', 'Mar 14', 'Mar 15', 'Mar 18', 'Mar 20', 'Mar 22', 'Mar 25', 'Mar 27', 'Mar 29', 'Mar 31'][index],
      })),
    []
  );

  const columns = [
    { title: 'Order', dataIndex: 'orderId', key: 'orderId', render: (v) => <Text strong style={{ color: adminTheme.primary }}>{v}</Text> },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Units', dataIndex: 'units', key: 'units' },
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
    <GenericReportPage
      title="Sales Report"
      subtitle="Order-level performance for the current reporting period"
      accent={adminTheme.primary}
      columns={columns}
      rows={rows}
    />
  );
};

export default SalesReport;
