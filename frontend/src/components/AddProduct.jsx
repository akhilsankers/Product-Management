import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../features/category/categorySlice';
import { getSubcategories } from '../features/subcategory/subcategorySlice';
import { addProduct } from '../features/products/productSlice';

function AddProduct({ onAddSuccess }) {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
  ]);
  const [variants, setVariants] = useState([{ ram: '', price: '', quantity: '' }]);

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
    return () => {
      images.forEach(img => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setSubcategory('');
    setDescription('');
    setImages([
      { file: null, preview: null },
      { file: null, preview: null },
      { file: null, preview: null },
    ]);
    setVariants([{ ram: '', price: '', quantity: '' }]);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { ram: '', price: '', quantity: '' }]);
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...images];
      if (updated[index]?.preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated[index] = {
        file,
        preview: URL.createObjectURL(file),
      };
      setImages(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('description', description);

      variants.forEach((variant, index) => {
        formData.append(`variants[${index}][ram]`, variant.ram);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][quantity]`, variant.quantity);
      });

      images.forEach(image => {
        if (image.file) formData.append('images', image.file);
      });

      await dispatch(addProduct(formData)).unwrap();
      onAddSuccess?.();
      handleClose();
    } catch (err) {
      alert(err.message || 'Failed to add product');
    }
  };

  const filteredSubcategories = Array.isArray(subcategories)
    ? subcategories.filter(sub => sub?.category === category)
    : [];

  return (
    <div>
      <Button variant="warning" className="ms-2 me-2" onClick={handleShow}>
        Add Product
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header className="w-100 d-flex justify-content-center" style={{ border: 'none' }}>
          <Modal.Title className="text-center">Add Product</Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-5">
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3 mb-0" style={{ width: '120px' }}>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Label>Variants</Form.Label>
            {variants.map((variant, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="RAM"
                    value={variant.ram}
                    onChange={(e) => handleVariantChange(index, 'ram', e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    min={0}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Quantity"
                    value={variant.quantity}
                    onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
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

            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3 mb-0" style={{ width: '120px' }}>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">-- Choose Category --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3 mb-0" style={{ width: '120px' }}>Subcategory</Form.Label>
              <Form.Select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={!category}
                required
              >
                <option value="">-- Choose Subcategory --</option>
                {filteredSubcategories.map(sub => (
                  <option key={sub._id} value={sub.subCategory}>{sub.subCategory}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Label className="me-3 mb-0" style={{ width: '120px' }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <div className="mb-3">
              <Form.Label>Upload Images</Form.Label>
              <Row>
                {[0, 1, 2].map((index) => (
                  <Col xs={12} md={4} className="mb-2 d-flex justify-content-center" key={index}>
                    <label
                      className="d-flex flex-column align-items-center justify-content-center border border-2 rounded shadow-sm"
                      style={{
                        cursor: 'pointer',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        backgroundColor: '#f8f9fa',
                        transition: 'transform 0.2s',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageChange(e, index)}
                        accept="image/*"
                      />
                      <img
                        src={
                          images[index]?.preview ||
                          'https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg'
                        }
                        alt="Upload"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: images[index]?.preview ? 1 : 0.6,
                        }}
                      />
                      {!images[index]?.preview && (
                        <span
                          className="position-absolute text-center"
                          style={{
                            bottom: '10px',
                            fontSize: '0.9rem',
                            color: '#555',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            padding: '2px 6px',
                            borderRadius: '6px',
                          }}
                        >
                          Click to Upload
                        </span>
                      )}
                    </label>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="w-100 d-flex justify-content-center" style={{ border: 'none' }}>
              <Button variant="secondary" onClick={handleClose} type="button" className="me-2">
                Close
              </Button>
              <Button variant="warning" type="submit">
                Add Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddProduct;
