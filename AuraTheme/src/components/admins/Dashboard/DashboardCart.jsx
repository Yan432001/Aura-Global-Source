import { Card,Statistic, Typography, Flex } from 'antd';
import {ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
const { Text } = Typography;

const DashboardCard = ({ title, prefixIcon, trend, trendValue, trendColor, valueColor, total }) => (
    
  <Card hoverable style={{ borderRadius: 10, overflow: 'hidden' }}>
    <Flex justify="space-between" align="center" gap="small">
      <Statistic
        title={<Text type="secondary">{title}</Text>}
        value={  total }
        prefix={prefixIcon}
        valueStyle={{ color: valueColor, fontWeight: 'bold' }}
      />
      <Flex vertical align="end">
        <Text style={{ color: trendColor, fontWeight: 'bold' }}>
          {trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {trendValue} 
        </Text>
        
        <Text type="secondary" style={{ fontSize: 12 }}>
        vs last month
        </Text>
      </Flex>
    </Flex>
  </Card>
);

export default DashboardCard;