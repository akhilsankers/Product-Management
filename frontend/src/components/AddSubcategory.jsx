import { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addSubcategory } from '../features/subcategory/subcategorySlice';
import { getCategories } from '../features/category/categorySlice'

function AddSubcategory({ onAddSuccess }) {
    const [show, setShow] = useState(false);
    const [category, setCategory] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const categories = useSelector(state => state.category.categories || []);

    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.subcategory);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !subCategoryName) {
            alert('Please select a category and enter a sub-category name');
            return;
        }
        dispatch(addSubcategory({ category, subCategory: subCategoryName }))
            .unwrap()
            .then(() => {
                setCategory('');
                setSubCategoryName('');
                onAddSuccess?.()
                handleClose();
            })
            .catch((err) => {
                alert(err.message || 'Failed to add subcategory');
            });
    };

    return (
        <div>
            <Button variant='warning' className='ms-2 me-2' onClick={handleShow}>
                Add Sub Category
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <div className='p-3'>
                    <Modal.Header style={{ border: 'none' }}>
                        <Modal.Title>Add Sub Category</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Select Category</Form.Label>
                                <Form.Select
                                    aria-label="Select Category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">-- Choose Category --</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Floating className="mb-3">
                                <Form.Control
                                    type="text"
                                    id="floatingSubCategory"
                                    placeholder="Enter sub-category name"
                                    value={subCategoryName}
                                    onChange={(e) => setSubCategoryName(e.target.value)}
                                />
                                <label htmlFor="floatingSubCategory">Sub Category</label>
                            </Form.Floating>

                            {error && <p className="text-danger">{error}</p>}
                        </Form>
                    </Modal.Body>

                    <Modal.Footer style={{ border: 'none' }}>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="warning" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Adding...' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}

export default AddSubcategory;
