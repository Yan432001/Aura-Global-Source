import React, { useState, useMemo, useEffect } from 'react';
import { Button, Carousel, Col, Modal, Row, Space, Tag, Typography, Tooltip } from 'antd';
import { ShoppingCartOutlined, CheckCircleFilled, TagOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { formatCurrency, publicTheme } from '../../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;

const ProductQuickViewModal = ({ product, open, onClose, onOrder }) => {
  if (!product) {
    return null;
  }

  // Derive size variants with associated price adjustments
  const sizeVariants = useMemo(() => {
    const rawSizes = product.sizes && product.sizes.length > 0
      ? product.sizes
      : ['Small', 'Medium', 'Large'];

    const basePrice = Number(product.price || 100);

    return rawSizes.map((sizeName, index) => {
      let priceAdjustment = 0;
      const lower = sizeName.toLowerCase();

      if (lower.includes('small') || lower.includes('compact') || lower.includes('single') || lower.includes('core') || lower === 's' || index === 0) {
        priceAdjustment = 0;
      } else if (lower.includes('medium') || lower.includes('pro') || lower.includes('plus') || lower.includes('team') || lower === 'm' || index === 1) {
        // approx 12-15% adjustment or scale based on price
        priceAdjustment = basePrice > 500 ? 80 : basePrice > 100 ? 25 : basePrice > 20 ? 5 : 1.25;
      } else if (lower.includes('large') || lower.includes('industrial') || lower.includes('max') || lower.includes('manager') || lower.includes('extended') || lower === 'l' || lower === 'xl' || index >= 2) {
        // approx 25-30% adjustment
        priceAdjustment = basePrice > 500 ? 160 : basePrice > 100 ? 50 : basePrice > 20 ? 10 : 2.50;
      }

      return {
        id: `size-${index}`,
        name: sizeName,
        priceAdjustment,
        isDefault: index === 0,
      };
    });
  }, [product]);

  // Selected size state
  const [selectedSizeVariant, setSelectedSizeVariant] = useState(sizeVariants[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);

  // Sync default variant when product changes
  useEffect(() => {
    if (sizeVariants.length > 0) {
      setSelectedSizeVariant(sizeVariants[0]);
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    setQuantity(1);
  }, [product, sizeVariants]);

  // Unit price with variant adjustment
  const unitPrice = Number(product.price || 0) + Number(selectedSizeVariant?.priceAdjustment || 0);
  const totalPrice = unitPrice * quantity;

  const handleOrder = (event) => {
    const customizedProduct = {
      ...product,
      selectedVariant: selectedSizeVariant,
      selectedSize: selectedSizeVariant?.name,
      selectedColor,
      priceAdjustment: selectedSizeVariant?.priceAdjustment || 0,
      price: unitPrice,
      quantity,
    };
    onOrder?.(customizedProduct, event.currentTarget);
  };

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
        {/* Left column: Product gallery */}
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

        {/* Right column: Customization & Variants */}
        <Col xs={24} lg={11}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Tag style={{ margin: 0, borderRadius: 999, border: 'none', background: publicTheme.pill, color: publicTheme.primary, fontWeight: 700 }}>
                {product.brand}
              </Tag>
              <Title level={2} style={{ margin: '10px 0 6px', color: publicTheme.text }}>
                {product.name}
              </Title>
              <Paragraph style={{ margin: 0, color: publicTheme.subtext, fontSize: 13 }}>
                {product.description}
              </Paragraph>
            </div>

            {/* Dynamic Price Box with Live Adjustment */}
            <div
              style={{
                borderRadius: 20,
                padding: '16px 20px',
                background: publicTheme.cardMuted,
                border: `1px solid ${publicTheme.softBorder}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <Text style={{ display: 'block', color: publicTheme.subtext, fontSize: 12, marginBottom: 2 }}>
                  Selected Variant Price
                </Text>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <Title level={2} style={{ margin: 0, color: publicTheme.primary, fontWeight: 800 }}>
                    {formatCurrency(unitPrice)}
                  </Title>
                  {selectedSizeVariant?.priceAdjustment > 0 && (
                    <Tag color="green" style={{ borderRadius: 6, fontWeight: 700, fontSize: 11 }}>
                      +{formatCurrency(selectedSizeVariant.priceAdjustment)}
                    </Tag>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Text style={{ color: publicTheme.subtext, fontSize: 12 }}>
                  In Stock: <strong style={{ color: '#10b981' }}>{product.stockCount} units</strong>
                </Text>
              </div>
            </div>

            {/* Item Variants - Size Selection with Associated Price Adjustments */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text strong style={{ color: publicTheme.text, fontSize: 13 }}>
                  <TagOutlined style={{ marginRight: 6, color: '#2563eb' }} />
                  Select Size Variant
                </Text>
                <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 700 }}>
                  Size: {selectedSizeVariant?.name}
                </span>
              </div>

              <Row gutter={[8, 8]}>
                {sizeVariants.map((variant) => {
                  const isSelected = selectedSizeVariant?.id === variant.id;
                  const adj = variant.priceAdjustment;

                  return (
                    <Col span={8} key={variant.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedSizeVariant(variant)}
                        style={{
                          width: '100%',
                          padding: '10px 8px',
                          borderRadius: 14,
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 3,
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#1e40af' : '#1e293b' }}>
                          {variant.name}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 6,
                            background: adj > 0 ? '#dcfce7' : '#f1f5f9',
                            color: adj > 0 ? '#15803d' : '#64748b',
                          }}
                        >
                          {adj > 0 ? `+${formatCurrency(adj)}` : 'Base price'}
                        </span>
                      </button>
                    </Col>
                  );
                })}
              </Row>
            </div>

            {/* Colors Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8, color: publicTheme.text, fontSize: 13 }}>
                  Color & Finish
                </Text>
                <Space wrap size={6}>
                  {product.colors.map((colorName) => {
                    const isSelected = selectedColor === colorName;
                    return (
                      <Tag.CheckableTag
                        key={colorName}
                        checked={isSelected}
                        onChange={() => setSelectedColor(colorName)}
                        style={{
                          borderRadius: 999,
                          padding: '4px 14px',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: 12,
                          border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                          background: isSelected ? '#2563eb' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          cursor: 'pointer',
                        }}
                      >
                        {colorName}
                      </Tag.CheckableTag>
                    );
                  })}
                </Space>
              </div>
            )}

            {/* Quantity Stepper & Order Action */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 6 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '4px 8px',
                  gap: 8,
                }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<MinusOutlined style={{ fontSize: 10 }} />}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 28, height: 28, borderRadius: 8 }}
                />
                <span style={{ fontWeight: 800, fontSize: 14, minWidth: 20, textAlign: 'center' }}>
                  {quantity}
                </span>
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined style={{ fontSize: 10 }} />}
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: 28, height: 28, borderRadius: 8 }}
                />
              </div>

              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleOrder}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 14,
                  background: publicTheme.ribbon,
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                }}
              >
                Order {selectedSizeVariant?.name} ({formatCurrency(totalPrice)})
              </Button>
            </div>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default ProductQuickViewModal;
