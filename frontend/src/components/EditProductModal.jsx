import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../features/category/categorySlice';
import { getSubcategories } from '../features/subcategory/subcategorySlice';
import { updateProductById } from '../features/products/productSlice';

function EditProductModal({ product, show, onClose, onEditSuccess }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(product?.title || '');
  const [category, setCategory] = useState(product?.category || '');
  const [subcategory, setSubcategory] = useState(product?.subcategory || '');
  const [description, setDescription] = useState(product?.description || '');
  const [variants, setVariants] = useState(
    product?.variants?.length > 0
      ? product.variants.map(v => ({ ram: v.ram, price: v.price, quantity: v.quantity }))
      : [{ ram: '', price: '', quantity: '' }]
  );

  const categories = useSelector(state => state.category.categories || []);
  const subcategories = useSelector(state => state.subcategory.subcategories || []);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (category) {
      dispatch(getSubcategories(category));
    }
  }, [dispatch, category]);

  useEffect(() => {
    setTitle(product?.title || '');
    setCategory(product?.category || '');
    setSubcategory(product?.subcategory || '');
    setDescription(product?.description || '');
    setVariants(
      product?.variants?.length > 0
        ? product.variants.map(v => ({ ram: v.ram, price: v.price, quantity: v.quantity }))
        : [{ ram: '', price: '', quantity: '' }]
    );
  }, [product]);

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { ram: '', price: '', quantity: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        title,
        category,
        subcategory,
        description,
        variants,
      };

      dispatch(updateProductById({ id: product._id, productData: updatedProduct }))
      onEditSuccess?.();
      onClose();
    } catch (error) {
      alert(error.message || 'Failed to update product');
    }
  };

  const filteredSubcategories = Array.isArray(subcategories)
    ? subcategories.filter(sub => sub.category === category)
    : [];

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Label>Variants</Form.Label>
          {variants.map((variant, idx) => (
            <Row key={idx} className="mb-2">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="RAM"
                  value={variant.ram}
                  onChange={e => handleVariantChange(idx, 'ram', e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={e => handleVariantChange(idx, 'price', e.target.value)}
                  min={0}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Quantity"
                  value={variant.quantity}
                  onChange={e => handleVariantChange(idx, 'quantity', e.target.value)}
                  min={0}
                  required
                />
              </Col>
            </Row>
          ))}
          <div className="mb-3 text-end">
            <Button variant="dark" size="sm" onClick={handleAddVariant} type="button">
              Add Variant
            </Button>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">-- Choose Category --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subcategory</Form.Label>
            <Form.Select
              value={subcategory}
              onChange={e => setSubcategory(e.target.value)}
              disabled={!category}
              required
            >
              <option value="">-- Choose Subcategory --</option>
              {filteredSubcategories.map(sub => (
                <option key={sub._id} value={sub.subCategory}>{sub.subCategory}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Product
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditProductModal;
