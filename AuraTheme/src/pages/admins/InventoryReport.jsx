import React, { useMemo } from 'react';
import { Tag, Typography } from 'antd';
import GenericReportPage from './reports/GenericReportPage';
import { products } from '../../data/shopData';
import { formatCurrency } from '../../utils/uiTheme';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text } = Typography;

const stockTag = (product) => {
  if (!product.inStock) return { label: 'Out of Stock', color: 'red' };
  return { label: 'In Stock', color: 'green' };
};

const InventoryReport = () => {
  const adminTheme = useAdminTheme();
  const rows = useMemo(
    () =>
      products.map((product) => {
        const tag = stockTag(product);
        return {
          key: product.id,
          name: product.name,
          category: product.category,
          branch: product.branch,
          value: product.price * 20,
          status: tag.label,
          statusColor: tag.color,
        };
      }),
    []
  );

  const columns = [
    { title: 'Product', dataIndex: 'name', key: 'name', render: (v) => <Text strong style={{ color: adminTheme.text }}>{v}</Text> },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Branch', dataIndex: 'branch', key: 'branch' },
    { title: 'Stock Value', dataIndex: 'value', key: 'value', render: formatCurrency },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v, record) => <Tag color={record.statusColor} style={{ borderRadius: 999 }}>{v}</Tag>,
    },
  ];

  return (
    <GenericReportPage
      title="Inventory Report"
      subtitle="Stock value and availability across branches"
      accent={adminTheme.systemTeal}
      columns={columns}
      rows={rows}
    />
  );
};

export default InventoryReport;
