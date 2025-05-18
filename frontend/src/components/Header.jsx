import { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Badge, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/services/authSlice';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getProducts } from '../features/products/productSlice';

function Header() {
    const [show, setShow] = useState(false);
    const [query, setQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const products = useSelector((state) => state.product.products || []);
    const favorites = useSelector((state) => state.favorite.favorites || []);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        console.log('Favorites:', favorites);
        setShow(true)
    };

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setFilteredProducts([]);
            setShowSearchModal(false);
        } else {
            const results = products.filter(product =>
                product.title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(results);
            setShowSearchModal(true);
        }
    };

    const handleResultClick = (productId) => {
        navigate(`/productdetails/${productId}`);
        setQuery('');
        setFilteredProducts([]);
        setShowSearchModal(false);
    };

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#003F62' }}>
            <div className="container-fluid">
                <Navbar.Brand as={Link} to="/" className="text-light" style={{ fontSize: '24px', minWidth: '500px' }}>
                    Product-Manager
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ backgroundColor: '#003F62' }}>
                    <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
                </Navbar.Toggle>

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between position-relative">
                    {/* Search Bar */}
                    <div style={{ position: 'relative' }} className="me-auto mx-3 mt-2 mt-lg-0">
                        <Form className="d-flex align-items-center" style={{ backgroundColor: 'white', borderRadius: '30px' }}>
                            <Form.Control
                                type="text"
                                placeholder="Search"
                                value={query}
                                onChange={handleSearchChange}
                                style={{
                                    minWidth: '400px',
                                    border: 'none',
                                    backgroundColor: 'white',
                                    boxShadow: 'none',
                                    height: '40px',
                                    borderRadius: '30px'
                                }}
                            />
                            <Button
                                className="text-light"
                                style={{
                                    backgroundColor: '#EDA415',
                                    border: 'none',
                                    padding: '16px 50px',
                                    borderRadius: '30px'
                                }}
                            >
                                Search
                            </Button>
                        </Form>

                        {/* Search Result Dropdown */}
                        {showSearchModal && filteredProducts.length > 0 && (
                            <div
                                className="position-absolute bg-white shadow-sm rounded mt-2"
                                style={{
                                    width: '100%',
                                    zIndex: 10,
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}
                            >
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        onClick={() => handleResultClick(product._id)}
                                        className="px-3 py-2 border-bottom hover:bg-light"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>{product.title}</strong>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Nav className="d-flex align-items-center">
                        {/* Favorites Button */}
                        <Nav.Item className="ms-3 text-light" onClick={handleShow} style={{ cursor: 'pointer' }}>
                            <i className="fa-solid fa-heart me-1"></i>
                            <Badge pill bg="warning">{favorites.length}</Badge>
                        </Nav.Item>

                        {/* Auth Buttons */}
                        {user ? (
                            <>
                                <Nav.Item className="ms-3 me-2 text-light">
                                    {user.username || user.name || 'User'}
                                </Nav.Item>
                                <Nav.Item className="ms-3">
                                    <Button variant="outline-warning" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </Nav.Item>
                            </>
                        ) : (
                            <Nav.Item className="ms-3 me-2 text-light">
                                <Link to="/login" className="text-light text-decoration-none">
                                    <i className="fa-solid fa-user me-1"></i> Sign In
                                </Link>
                            </Nav.Item>
                        )}

                        {/* Cart Icon Placeholder */}
                        <Nav.Item className="ms-3 text-light">
                            <i className="fa-solid fa-cart-shopping me-1"></i>
                            Cart <Badge pill bg="warning">0</Badge>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </div>

            {/* Offcanvas for Favorites */}
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Navbar expand="lg" style={{ backgroundColor: '#003F62' }}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Wishlist</Offcanvas.Title>
                    </Offcanvas.Header>
                </Navbar>

                <Offcanvas.Body>
                    {favorites.length === 0 ? (
                        <p>No favorite items yet.</p>
                    ) : (

                        <ul className="list-unstyled">
                            {favorites.map((fav) => (
                                <li key={fav._id} className="mb-3 d-flex align-items-center">
                                    <Link
                                        to={`/productdetails/${fav.product._id}`}
                                        className="d-flex align-items-center text-decoration-none text-dark"
                                        style={{ width: '100%' }}
                                    >
                                        <img
                                            src={fav.product.images?.[0]
                                                ? `https://product-management-i88p.onrender.com/uploads/products/${fav.product.images[0]}`
                                                : '/placeholder.jpg'}
                                            alt={fav.product?.title || 'Product'}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                marginRight: '10px'
                                            }}
                                        />
                                        <div>
                                            <strong>{fav.product?.title}</strong>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </Navbar>
    );
}

export default Header;
