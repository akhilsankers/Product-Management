import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import { Row, Col, Container, Form, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { AiOutlineHeart, AiFillHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai';

import AddCategory from '../components/AddCategory';
import AddSubcategory from '../components/AddSubcategory';
import AddProduct from '../components/AddProduct';

import { getSubcategories } from '../features/subcategory/subcategorySlice';
import { getCategories } from '../features/category/categorySlice';
import { getProducts } from '../features/products/productSlice';

import {
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
} from '../features/favorites/favoritesSlice';

function Home() {
    const [expanded, setExpanded] = useState({});
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;
    const dispatch = useDispatch();

    const categories = useSelector((state) => state.category.categories || []);
    const subcategories = useSelector((state) => state.subcategory.subcategories || []);
    const products = useSelector((state) => state.product.products || []);
    const favorites = useSelector((state) => state.favorite.favorites || []);

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getSubcategories());
        dispatch(getProducts());
        dispatch(fetchFavorites());
    }, [dispatch, reloadTrigger]);

    const toggleCategory = (categoryName) => {
        setExpanded((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };

    const handleCheckboxChange = (categoryName, subCategory) => {
        const key = `${categoryName}||${subCategory}`;
        setSelectedSubcategories((prev) =>
            prev.includes(key)
                ? prev.filter((item) => item !== key)
                : [...prev, key]
        );
        setCurrentPage(1);
    };

    const handleAddSuccess = () => {
        setReloadTrigger((prev) => !prev);
    };

    const handleFavoriteToggle = (productId) => {
        const isFavorited = favorites.some((fav) => fav.id === productId);
        if (isFavorited) {
            dispatch(removeFromFavorites(productId));
        } else {
            dispatch(addToFavorites(productId));
        }
    };

    // Filter products by selected category+subcategory pair
    const filteredProducts =
        selectedSubcategories.length > 0
            ? products.filter((product) =>
                  selectedSubcategories.includes(`${product.category}||${product.subcategory}`)
              )
            : products;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <Header />
            <div className="mt-3 d-flex justify-content-end px-5">
                <AddCategory onAddSuccess={handleAddSuccess} />
                <AddSubcategory onAddSuccess={handleAddSuccess} />
                <AddProduct onAddSuccess={handleAddSuccess} />
            </div>

            <Container fluid className="mt-3 px-5">
                <Row>
                    {/* Sidebar */}
                    <Col md={3} sm={12} className="mb-4">
                        <div>
                            <p style={{ color: '#003F62', fontSize: '1.2rem' }}>
                                <strong>Categories</strong>
                            </p>
                            <p style={{ color: '#888' }}>All Categories</p>

                            {categories.map((cat) => {
                                const filteredSubs = subcategories
                                    .filter((sub) => sub && sub.category === cat.name)
                                    .map((sub) => sub.subCategory);

                                return (
                                    <div className="mt-3" key={cat._id || cat.name}>
                                        <p
                                            className="d-flex align-items-center"
                                            style={{ cursor: 'pointer', marginBottom: '5px' }}
                                            onClick={() => toggleCategory(cat.name)}
                                        >
                                            {cat.name}
                                            {expanded[cat.name] ? (
                                                <IoIosArrowDown className="ms-2" />
                                            ) : (
                                                <IoIosArrowForward className="ms-2" />
                                            )}
                                        </p>

                                        {expanded[cat.name] && (
                                            <Form className="ms-3 mt-2">
                                                {filteredSubs.map((sub) => {
                                                    const key = `${cat.name}||${sub}`;
                                                    return (
                                                        <Form.Check
                                                            key={key}
                                                            type="checkbox"
                                                            label={sub}
                                                            className="mb-1"
                                                            checked={selectedSubcategories.includes(key)}
                                                            onChange={() =>
                                                                handleCheckboxChange(cat.name, sub)
                                                            }
                                                        />
                                                    );
                                                })}
                                            </Form>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Col>

                    {/* Products */}
                    <Col md={9} sm={12}>
                        <Row className="g-4">
                            {paginatedProducts.map((product) => (
                                <Col xs={12} sm={6} md={4} key={product._id}>
                                    <Card className="position-relative" style={{ height: '18rem' }}>
                                        <Button
                                            variant="light"
                                            className="position-absolute top-0 end-0 mt-2 me-2"
                                            style={{
                                                borderRadius: '50%',
                                                width: '30px',
                                                height: '30px',
                                                padding: '0',
                                                backgroundColor: '#B3D4E5',
                                            }}
                                            aria-label="Toggle favorite"
                                            onClick={() => handleFavoriteToggle(product._id)}
                                        >
                                            {favorites.some((fav) => fav.id === product._id) ? (
                                                <AiFillHeart size={20} color="red" />
                                            ) : (
                                                <AiOutlineHeart size={20} />
                                            )}
                                        </Button>

                                        <Link to={`/productdetails/${product._id}`}>
                                            <Card.Img
                                                variant="top"
                                                src={
                                                    product.images && product.images.length > 0
                                                        ? `http://localhost:5000/uploads/products/${product.images[0]}`
                                                        : 'https://via.placeholder.com/180'
                                                }
                                                className="mx-auto d-block mt-4"
                                                style={{
                                                    width: '180px',
                                                    height: '120px',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </Link>

                                        <Card.Body className="text-center">
                                            <Card.Title>{product.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                {product.description}
                                            </Card.Subtitle>
                                            <div>
                                                <AiFillStar color="#ffc107" />
                                                <AiFillStar color="#ffc107" />
                                                <AiFillStar color="#ffc107" />
                                                <AiFillStar color="#ffc107" />
                                                <AiOutlineStar color="#ccc" />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination */}
                        <div className="d-flex justify-content-center align-items-center mt-4">
                            <Button
                                variant="outline-primary"
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="me-2"
                            >
                                Previous
                            </Button>

                            <span>
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline-primary"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="ms-2"
                            >
                                Next
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;
