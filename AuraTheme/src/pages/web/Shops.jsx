import React, { useMemo, useState, useEffect } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Grid,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  CloseOutlined,
  FilterOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SendOutlined,
  ShopOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { branches, products, shops as defaultShops } from '../../data/shopData';
import { getLiveStores } from '../../data/frontEndControlStore';
import { publicTheme } from '../../utils/webTheme';
import TelegramMiniAppModal, { BOTFATHER_CONFIG } from '../../components/web/shared/TelegramMiniAppModal';
import RetailShopCard from '../../components/web/shared/RetailShopCard';
import ShopQuickViewModal from '../../components/web/shared/ShopQuickViewModal';

const { useBreakpoint } = Grid;
const { Paragraph, Text, Title } = Typography;

const Shops = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [messageApi, contextHolder] = message.useMessage();

  // Search & Filter State
  const [search, setSearch] = useState(urlQuery);
  const [branch, setBranch] = useState('all');
  const [minRating, setMinRating] = useState('all');
  const [fastReplyOnly, setFastReplyOnly] = useState(false);
  const [shops, setShops] = useState(getLiveStores);

  useEffect(() => {
    const handleUpdate = (e) => setShops(e.detail);
    window.addEventListener('aura_frontend_stores_updated', handleUpdate);
    return () => window.removeEventListener('aura_frontend_stores_updated', handleUpdate);
  }, []);

  // Modals & Panels State
  const [previewShop, setPreviewShop] = useState(null);
  const [telegramShop, setTelegramShop] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridMode, setGridMode] = useState(6); // 4 or 6 per row (matches image.png 6-per-row mode)
  const [wishlistedShopIds, setWishlistedShopIds] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_favorite_shops');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (urlQuery !== undefined) {
      setSearch(urlQuery);
    }
  }, [urlQuery]);

  const toggleShopWishlist = (shop) => {
    const isSaved = wishlistedShopIds.includes(shop.id);
    const updated = isSaved
      ? wishlistedShopIds.filter((id) => id !== shop.id)
      : [...wishlistedShopIds, shop.id];

    setWishlistedShopIds(updated);
    try {
      localStorage.setItem('aura_favorite_shops', JSON.stringify(updated));
    } catch {}

    if (isSaved) {
      messageApi.info(`${shop.name} removed from favorites`);
    } else {
      messageApi.success(`${shop.name} added to favorites`);
    }
  };

  const handleShare = async (shop) => {
    const shareUrl = `${window.location.origin}/shops/${shop.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: shop.name,
          text: shop.summary,
          url: shareUrl,
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      messageApi.success('Shop link copied to clipboard');
    } catch {
      messageApi.info('Link ready: ' + shareUrl);
    }
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    if (branch !== 'all') count++;
    if (minRating !== 'all') count++;
    if (fastReplyOnly) count++;
    return count;
  }, [search, branch, minRating, fastReplyOnly]);

  const clearAllFilters = () => {
    setSearch('');
    setBranch('all');
    setMinRating('all');
    setFastReplyOnly(false);
    setSearchParams({});
  };

  // Filtered Shops List
  const filteredShops = useMemo(() => {
    const query = search.toLowerCase().trim();

    return shops.filter((shop) => {
      if (shop.activeOnWebsite === false) return false;

      const matchesSearch =
        !query ||
        shop.name.toLowerCase().includes(query) ||
        shop.summary.toLowerCase().includes(query) ||
        (shop.branch && shop.branch.toLowerCase().includes(query)) ||
        (shop.specialties && shop.specialties.some((s) => s.toLowerCase().includes(query)));

      const matchesBranch = branch === 'all' || shop.branch === branch;
      const matchesRating = minRating === 'all' || shop.rating >= Number(minRating);
      const matchesReply = !fastReplyOnly || (shop.responseTime && shop.responseTime.includes('10'));

      return matchesSearch && matchesBranch && matchesRating && matchesReply;
    });
  }, [search, branch, minRating, fastReplyOnly]);

  // Responsive Grid Column Configuration (4 vs 6 per row)
  const shopColumnProps = useMemo(() => {
    if (gridMode === 6) {
      return filtersOpen && screens.lg
        ? { xs: 12, sm: 8, md: 6, lg: 6, xl: 4, xxl: 4 }
        : { xs: 12, sm: 8, md: 6, lg: 4, xl: 4, xxl: 4 }; // 24 / 4 = 6 columns per row!
    }
    return filtersOpen && screens.lg
      ? { xs: 12, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 }
      : { xs: 12, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6 }; // 24 / 6 = 4 columns per row!
  }, [gridMode, filtersOpen, screens.lg]);

  // Sidebar Filter Panel (desktop & mobile drawer)
  const filterPanel = (
    <Card
      style={{
        borderRadius: 24,
        border: `1px solid ${publicTheme.border}`,
        background: publicTheme.cardBackground,
        boxShadow: publicTheme.lightShadow,
      }}
      styles={{ body: { padding: 18 } }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ color: publicTheme.text, fontSize: 16 }}>
            Shop Filters
          </Text>
          {activeFiltersCount > 0 && (
            <Button type="link" size="small" onClick={clearAllFilters} style={{ padding: 0 }}>
              Reset
            </Button>
          )}
        </div>

        {/* Search */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 6, color: publicTheme.text }}>
            Search Shops
          </Text>
          <Input
            placeholder="Search by name, hub, specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined style={{ color: publicTheme.subtext }} />}
            allowClear
            style={{ borderRadius: 14 }}
          />
        </div>

        {/* Fulfillment Hub / Branch */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 6, color: publicTheme.text }}>
            Fulfillment Hub
          </Text>
          <Select
            value={branch}
            onChange={setBranch}
            style={{ width: '100%' }}
            options={branches.map((b) => ({ label: b.name, value: b.id }))}
          />
        </div>

        {/* Rating filter */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 6, color: publicTheme.text }}>
            Minimum Rating
          </Text>
          <Select
            value={minRating}
            onChange={setMinRating}
            style={{ width: '100%' }}
            options={[
              { label: 'All Ratings', value: 'all' },
              { label: '★ 4.8 & Above', value: '4.8' },
              { label: '★ 4.9 & Above', value: '4.9' },
            ]}
          />
        </div>

        {/* Quick response filter */}
        <div
          style={{
            borderRadius: 18,
            border: `1px solid ${publicTheme.softBorder}`,
            background: publicTheme.cardMuted,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <Text strong style={{ display: 'block', color: publicTheme.text }}>
              Fast Dispatch
            </Text>
            <Text style={{ color: publicTheme.subtext, fontSize: 12 }}>
              Replies &lt; 10 min
            </Text>
          </div>
          <Switch checked={fastReplyOnly} onChange={setFastReplyOnly} />
        </div>
      </Space>
    </Card>
  );

  return (
    <div style={{ padding: 0 }}>
      {contextHolder}

      {/* Top Header Frosted Panel */}
      <Card
        className="frosted-panel stagger-rise"
        style={{
          borderRadius: screens.xs ? 22 : 34,
          border: `1px solid ${publicTheme.border}`,
          boxShadow: publicTheme.shadow,
          background: publicTheme.heroBackground,
          marginBottom: screens.xs ? 16 : 24,
        }}
        styles={{ body: { padding: screens.xs ? 18 : 28 } }}
      >
        <Space direction="vertical" size={screens.xs ? 10 : 16} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Tag
              style={{
                borderRadius: 999,
                border: 'none',
                background: publicTheme.pill,
                color: publicTheme.primary,
                fontWeight: 700,
                padding: screens.xs ? '4px 10px' : '8px 14px',
                fontSize: screens.xs ? 11 : 12,
              }}
            >
              Shop directory
            </Tag>
            <Tag
              style={{
                borderRadius: 999,
                border: '1px solid rgba(36, 129, 204, 0.25)',
                background: 'rgba(36, 129, 204, 0.08)',
                color: '#2481cc',
                fontWeight: 700,
                padding: screens.xs ? '4px 10px' : '6px 12px',
                fontSize: screens.xs ? 11 : 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <SendOutlined />
              Connected with @BotFather ({BOTFATHER_CONFIG.botUsername})
            </Tag>
          </div>

          <Title
            level={1}
            style={{
              margin: 0,
              color: publicTheme.text,
              fontSize: 'clamp(24px, 4vw, 48px)',
              lineHeight: 1.1,
            }}
          >
            Browse shops first, then view all products inside each shop.
          </Title>

          <Paragraph
            style={{
              margin: 0,
              color: publicTheme.subtext,
              fontSize: screens.xs ? 13 : 16,
              maxWidth: 860,
            }}
          >
            Explore verified vendor storefronts and hubs. Adapt the grid between 4 and 6 columns per row with open/close filter bar and direct Telegram E-Menu integration.
          </Paragraph>
        </Space>
      </Card>

      {/* Control Toolbar - Exactly matching image.png */}
      <div
        style={{
          borderRadius: screens.xs ? 18 : 24,
          border: `1px solid ${publicTheme.border}`,
          background: publicTheme.cardBackground,
          boxShadow: publicTheme.lightShadow,
          padding: screens.xs ? 12 : 16,
          marginBottom: screens.xs ? 16 : 24,
        }}
      >
        <Row gutter={[12, 12]} align="middle" justify="space-between">
          <Col xs={12} sm={12} lg={10}>
            <Text style={{ color: publicTheme.subtext, fontSize: screens.xs ? 12 : 14 }}>
              Showing <Text strong style={{ color: publicTheme.text }}>{filteredShops.length}</Text> shops
            </Text>
          </Col>
          <Col xs={12} sm={12} lg={14}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* Mobile / Tablet Filter Button */}
              {!screens.lg && (
                <Badge count={activeFiltersCount} size="small">
                  <Button
                    type={activeFiltersCount > 0 ? 'primary' : 'default'}
                    icon={<FilterOutlined />}
                    onClick={() => setMobileFilterOpen(true)}
                    style={{
                      borderRadius: 12,
                      fontWeight: 700,
                      height: 36,
                      fontSize: screens.xs ? 12 : 13,
                    }}
                  >
                    Filters
                  </Button>
                </Badge>
              )}

              {/* Desktop Filters Toggle and Grid Mode Selectors */}
              {screens.lg && (
                <>
                  <Button
                    icon={filtersOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    onClick={() => setFiltersOpen((current) => !current)}
                    style={{ borderRadius: 14, fontWeight: 700 }}
                  >
                    {filtersOpen ? 'Close filter bar' : 'Open filter bar'}
                  </Button>
                  <Space.Compact>
                    <Button
                      type={gridMode === 4 ? 'primary' : 'default'}
                      onClick={() => setGridMode(4)}
                      style={{ fontWeight: 700 }}
                    >
                      4 per row
                    </Button>
                    <Button
                      type={gridMode === 6 ? 'primary' : 'default'}
                      onClick={() => setGridMode(6)}
                      style={{ fontWeight: 700 }}
                    >
                      6 per row
                    </Button>
                  </Space.Compact>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>

      {/* Grid Layout with Optional Sidebar */}
      <Row gutter={screens.xs ? [12, 12] : [20, 20]} align="top">
        {filtersOpen && screens.lg && (
          <Col xs={0} lg={6}>
            {filterPanel}
          </Col>
        )}

        <Col xs={24} lg={filtersOpen ? 18 : 24}>
          {filteredShops.length === 0 ? (
            <Card
              style={{
                borderRadius: 24,
                border: `1px solid ${publicTheme.border}`,
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <Empty
                description={
                  <Space direction="vertical" size={4}>
                    <Text strong style={{ fontSize: 16 }}>No shops match your filters</Text>
                    <Text type="secondary">Try resetting your search query or branch filters</Text>
                  </Space>
                }
              >
                <Button type="primary" onClick={clearAllFilters} style={{ borderRadius: 12, marginTop: 8 }}>
                  Clear all filters
                </Button>
              </Empty>
            </Card>
          ) : (
            <Row gutter={screens.xs ? [10, 10] : screens.sm ? [12, 12] : [16, 16]}>
              {filteredShops.map((shop) => {
                const shopProducts = products.filter((p) => p.shopId === shop.id);
                const isWishlisted = wishlistedShopIds.includes(shop.id);

                return (
                  <Col {...shopColumnProps} key={shop.id}>
                    <RetailShopCard
                      shop={shop}
                      shopProducts={shopProducts}
                      gridMode={gridMode}
                      onPreview={(s) => setPreviewShop(s)}
                      onWishlist={toggleShopWishlist}
                      isWishlisted={isWishlisted}
                      onLike={(s) => messageApi.success(`You liked ${s.name}`)}
                      onShare={handleShare}
                      onOpenTelegram={(s) => setTelegramShop(s)}
                    />
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>

      {/* Mobile / Tablet Filter Drawer */}
      <Drawer
        title="Shop Filters"
        placement="left"
        closable={false}
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        width={340}
        extra={<Button type="text" icon={<CloseOutlined />} onClick={() => setMobileFilterOpen(false)} />}
      >
        {filterPanel}
      </Drawer>

      {/* Shop Quick View Modal */}
      <ShopQuickViewModal
        shop={previewShop}
        open={Boolean(previewShop)}
        onClose={() => setPreviewShop(null)}
        onOpenTelegram={(s) => setTelegramShop(s)}
        shopProducts={previewShop ? products.filter((p) => p.shopId === previewShop.id) : []}
      />

      {/* Telegram Mini App Modal */}
      <TelegramMiniAppModal
        open={Boolean(telegramShop)}
        onClose={() => setTelegramShop(null)}
        shop={telegramShop}
        allProducts={products}
      />
    </div>
  );
};

export default Shops;
