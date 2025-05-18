import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import { Col, Row, Button, Spinner, Alert } from 'react-bootstrap';
import { getProductById } from '../features/products/productSlice';
import EditProductModal from '../components/EditProductModal';

function Productdetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productDetail: product, loading, error } = useSelector((state) => state.product);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRam, setSelectedRam] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        setMainImage(`https://product-management-i88p.onrender.com/uploads/products/${product.images[0]}`);
      } else {
        setMainImage('');
      }

      if (product.variants && product.variants.length > 0) {
        setSelectedRam(product.variants[0].ram);
        setQuantity(1);
      }
    }
  }, [product]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };
  const selectedVariant = product?.variants?.find((v) => v.ram === selectedRam);
  const stock = selectedVariant?.quantity ?? product?.stock ?? 0;
  const price = selectedVariant?.price ?? product?.price ?? 0;

  useEffect(() => {
    if (quantity > stock) {
      setQuantity(stock);
    }
    if (quantity < 1) {
      setQuantity(1);
    }
  }, [stock, quantity]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center mt-5">
          <Alert variant="danger">{error}</Alert>
        </div>
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <Header />
      <div className="p-4" style={{ maxWidth: 1500, margin: 'auto' }}>
        <Row className="gy-4">
          <Col md={6} className="d-flex flex-column">
            <div
              style={{
                width: '100%',
                maxWidth: 500,
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
              }}
            >
              <img
                src={mainImage}
                alt="Main Product"
                style={{ width: '100%', height: 'auto', borderRadius: 8, objectFit: 'contain' }}
              />
              <div className="d-flex justify-content-start flex-wrap mt-3 gap-2">
                {(product.images && product.images.length > 0
                  ? product.images.map((img) => `https://product-management-i88p.onrender.com/uploads/products/${img}`)
                  : []
                ).map((thumb, index) => (
                  <img
                    key={index}
                    src={thumb}
                    alt={`thumb-${index}`}
                    style={{
                      width: 64,
                      height: 64,
                      cursor: 'pointer',
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: mainImage === thumb ? '2px solid #007bff' : '1px solid #ccc',
                      boxShadow: mainImage === thumb ? '0 0 5px #007bff' : 'none',
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onClick={() => setMainImage(thumb)}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
                  />
                ))}
              </div>
            </div>
          </Col>

          <Col md={6}>
            <h1 className="mb-3" style={{ fontWeight: '700', fontSize: '2rem' }}>
              {product.title}
            </h1>
            <p
              className="mb-2"
              style={{ fontWeight: '700', fontSize: '1.5rem', color: '#28a745' }}
            >
              ${price.toFixed(2)}
            </p>
            <p className="mb-2" style={{ color: '#198754', fontWeight: 500 }}>
              Availability: {stock > 0 ? 'In stock' : 'Out of stock'}
            </p>
            <p className="mb-4" style={{ color: '#dc3545', fontWeight: 500 }}>
              Hurry up! Only {stock} product{stock !== 1 && 's'} left in stock!
            </p>

            <div className="mb-4">
              <span style={{ fontWeight: 600, marginRight: 10 }}>RAM:</span>
              {product.variants &&
                product.variants.length > 0 &&
                [...new Set(product.variants.map((v) => v.ram))].map((ram) => (
                  <button
                    key={ram}
                    onClick={() => setSelectedRam(ram)}
                    className={`btn btn-outline-primary me-2 mb-2 ${selectedRam === ram ? 'active' : ''}`}
                    style={{ minWidth: 60 }}
                  >
                    {ram}GB
                  </button>
                ))}
            </div>

            <div className="mb-4 d-flex align-items-center">
              <span style={{ fontWeight: 600, marginRight: 10 }}>Quantity:</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span
                style={{
                  margin: '0 15px',
                  fontWeight: 600,
                  minWidth: 30,
                  textAlign: 'center',
                  fontSize: '1.1rem',
                }}
              >
                {quantity}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
              >
                +
              </Button>
            </div>

            <div className="d-flex gap-3">
              <Button variant="warning" style={{ flex: 1 }} onClick={handleEditClick}>
                Edit product
              </Button>
               <Button
                variant="primary"
                style={{ flex: 1 }}
                disabled={stock === 0}
              >
                Buy it now
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {showEditModal && (
        <EditProductModal show={showEditModal}  onClose={() => setShowEditModal(false)} product={product} />
      )}
    </>
  );
}

export default Productdetails;
