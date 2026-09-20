import React from 'react';
import { Button, Carousel, Col, Modal, Row, Space, Tag, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { formatCurrency, publicTheme } from '../../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;

const ProductQuickViewModal = ({ product, open, onClose, onOrder }) => {
  if (!product) {
    return null;
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={980}
      centered
      styles={{ body: { padding: 24 } }}
      title={null}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={13}>
          <Carousel dots>
            {(product.images || [product.image]).map((image) => (
              <div key={image}>
                <div
                  style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    background: publicTheme.cardMuted,
                    aspectRatio: '1 / 1',
                  }}
                >
                  <img
                    data-product-image="true"
                    src={image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </Col>
        <Col xs={24} lg={11}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Tag style={{ margin: 0, borderRadius: 999, border: 'none', background: publicTheme.pill, color: publicTheme.primary, fontWeight: 700 }}>
                {product.brand}
              </Tag>
              <Title level={2} style={{ margin: '12px 0 8px', color: publicTheme.text }}>
                {product.name}
              </Title>
              <Paragraph style={{ margin: 0, color: publicTheme.subtext }}>
                {product.description}
              </Paragraph>
            </div>

            <div
              style={{
                borderRadius: 20,
                padding: 18,
                background: publicTheme.cardMuted,
                border: `1px solid ${publicTheme.softBorder}`,
              }}
            >
              <Text style={{ display: 'block', color: publicTheme.subtext, marginBottom: 6 }}>Price</Text>
              <Title level={2} style={{ margin: 0, color: publicTheme.primary }}>
                {formatCurrency(product.price)}
              </Title>
              <Text style={{ color: publicTheme.subtext }}>
                Stock available: {product.stockCount} units
              </Text>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 10, color: publicTheme.text }}>
                Colors
              </Text>
              <Space wrap>
                {(product.colors || []).map((item) => (
                  <Tag key={item} style={{ borderRadius: 999, padding: '6px 12px', borderColor: publicTheme.softBorder }}>
                    {item}
                  </Tag>
                ))}
              </Space>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 10, color: publicTheme.text }}>
                Sizes
              </Text>
              <Space wrap>
                {(product.sizes || []).map((item) => (
                  <Tag key={item} style={{ borderRadius: 999, padding: '6px 12px', borderColor: publicTheme.softBorder }}>
                    {item}
                  </Tag>
                ))}
              </Space>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 10, color: publicTheme.text }}>
                Product details
              </Text>
              <Space wrap>
                {(product.features || []).map((feature) => (
                  <Tag key={feature} style={{ borderRadius: 999, background: '#fff', borderColor: publicTheme.softBorder }}>
                    {feature}
                  </Tag>
                ))}
              </Space>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={(event) => onOrder?.(product, event.currentTarget)}
              style={{
                height: 48,
                borderRadius: 16,
                background: publicTheme.ribbon,
                border: 'none',
                fontWeight: 700,
              }}
            >
              Order product
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default ProductQuickViewModal;
