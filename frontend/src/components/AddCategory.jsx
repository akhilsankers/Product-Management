import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { createCategory } from '../features/category/categoryApi'; // adjust path if needed

function AddCategory({ onAddSuccess }) {
    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleClose = () => {
        setShow(false);
        resetForm();
    };

    const handleShow = () => {
        setShow(true);
        resetForm();
    };

    const resetForm = () => {
        setCategoryName('');
        setError('');
        setSuccess('');
    };

    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            await createCategory({ name: categoryName });
            setSuccess('Category added successfully');
            setError('');
            if (typeof onAddSuccess === 'function') {
                onAddSuccess();
            }
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch (err) {
            const errMsg = err?.response?.data?.message || err?.message || 'Something went wrong';
            setError(errMsg);
        }
    };

    return (
        <>
            <Button variant="warning" className="ms-2 me-2" onClick={handleShow}>
                Add Category
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                aria-labelledby="add-category-modal"
            >
                <div className="p-3">
                    <Modal.Header className="border-0 justify-content-center">
                        <Modal.Title id="add-category-modal" className="text-center">
                            Add Category
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}>
                            <Form.Floating className="mb-3">
                                <Form.Control
                                    type="text"
                                    id="floatingCategory"
                                    placeholder="Enter category name"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    autoFocus
                                />
                                <label htmlFor="floatingCategory">Category Name</label>
                            </Form.Floating>

                            {error && <div className="text-danger text-center">{error}</div>}
                            {success && <div className="text-success text-center">{success}</div>}
                        </Form>
                    </Modal.Body>

                    <Modal.Footer className="border-0 justify-content-center">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Cancel
                        </Button>
                        <Button variant="warning" onClick={handleAddCategory}>
                            Add
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
}

export default AddCategory;
