import React from 'react';
import { FiHeart, FiStar } from 'react-icons/fi';
import '../../assets/css/topproducts.css';
import img1 from '../../assets/images/products/image1.png';
import img2 from '../../assets/images/products/image2.png';
import img3 from '../../assets/images/products/image3.png';
import img4 from '../../assets/images/products/image4.png';
import img5 from '../../assets/images/products/image5.png';
import img6 from '../../assets/images/products/image6.png';

const products = [
  {
    id: 1,
    img: img1,
    name: 'Joyroom JR-QP191 10000mAh 22.5W Fast Charging',
    price: 1480,
    oldPrice: 1730,
    discount: 250,
    badge: 'Top Sale',
    rating: 0,
    reviews: 1,
    sold: 2,
    currency: '৳'
  },
  {
    id: 2,
    img: img2,
    name: 'Creative Handmade LED Night Light Mirror',
    price: 820,
    oldPrice: 999,
    discount: 179,
    badge: 'Top Sale',
    rating: 0,
    reviews: 0,
    sold: 11,
    currency: '৳'
  },
  {
    id: 3,
    img: img3,
    name: 'Cat HeadSet Premium',
    price: 1450,
    oldPrice: 1680,
    discount: 230,
    badge: 'Top Sale',
    rating: 0,
    reviews: 0,
    sold: 1,
    currency: '৳'
  },
  {
    id: 4,
    img: img4,
    name: '3D Wall Clock',
    price: 420,
    oldPrice: 580,
    discount: 160,
    badge: 'Popular',
    rating: 0,
    reviews: 0,
    sold: 79,
    currency: '৳'
  },
  {
    id: 5,
    img: img6,
    name: 'T800 Ultra Sr',
    price: 1150,
    oldPrice: 1350,
    discount: 200,
    badge: 'Top Sale',
    rating: 0,
    reviews: 0,
    sold: 6,
    currency: '৳'
  }
];

const TopProducts = () => {
  return (
    <section className="top-products-section">
      <div className="top-products-header">
        <h2>Top Sales <span className="dot"></span></h2>
      </div>
      <div className="top-products-list">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <div className="product-img-wrapper">
              <img src={product.img} alt={product.name} className="product-img" />
              <span className="discount-badge">- {product.discount}{product.currency}</span>
              <button className="fav-btn" aria-label="Add to favorites">
                <FiHeart />
              </button>
              <span className="top-sale-badge">
                <span className="badge-icon">🏆</span> {product.badge}
              </span>
            </div>
            <div className="product-info">
              <div className="product-title">{product.name}</div>
              <div className="product-pricing">
                <span className="product-price">{product.currency} {product.price}</span>
                <span className="product-old-price">{product.oldPrice}</span>
              </div>
              <div className="product-meta">
                <span className="product-rating">
                  <FiStar className="star" /> {product.rating}/5 ({product.reviews})
                </span>
                <span className="product-sold">{product.sold} Sold</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopProducts;
