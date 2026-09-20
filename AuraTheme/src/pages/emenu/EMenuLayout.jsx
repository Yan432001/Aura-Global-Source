import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './emenu.css';

export default function EMenuLayout() {
  const { billerId } = useParams();
  const [data, setData] = useState({ store: null, categories: [], products: [] });
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch(`http://localhost:5173/api/emenu/shop/${billerId}`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err));
  }, [billerId]);

  if (!data.store) return <div className="loading">Loading menu...</div>;

  const filteredProducts = activeCategory === 'all'
    ? data.products
    : data.products.filter(p => p.category_id === activeCategory);

  return (
    <div className="emenu-screen">
      <div className="emenu-container">
        {/* Store Header */}
        <header className="store-header">
          <h2>{data.store.name}</h2>
          <p>{data.store.address}</p>
        </header>

        {/* Categories Pills */}
        <div className="category-scroll">
          <button 
            className={activeCategory === 'all' ? 'active' : ''} 
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? 'active' : ''}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <main className="product-list">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="product-card">
              <img src={prod.image || '/placeholder.png'} alt={prod.name} />
              <div className="product-info">
                <h4>{prod.name}</h4>
                <p className="price">${prod.price}</p>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}