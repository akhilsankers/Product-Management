import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/services/authSlice'; // adjust path as needed
import { Button, Container, Row, Col, FloatingLabel, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import bg from '../assets/bg.png';
import { CiMail, CiLock, CiUser } from "react-icons/ci";
import Login from './Login';
import { useNavigate } from 'react-router-dom';

function Regester() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
 const navigate = useNavigate();


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signup(formData));
    navigate('/login');
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid>
        <Row className="shadow rounded overflow-hidden m-auto" style={{ height: '90vh', width: '70%', backgroundColor: '#ffffff' }}>
          <Col
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center text-light"
            style={{
              backgroundImage:` url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center px-3">
              <h2 className="fw-bold">Hello Friend!</h2>
              <p>To keep connected with us please <br /> login with your personal info.</p>
              <div className="d-grid gap-2">
                <Link to="/login">
                  <Button className="rounded-5" variant="outline-light" size="lg">Sign in</Button>
                </Link>
              </div>
            </div>
          </Col>

          <Col md={8} sm={12} className="d-flex justify-content-center align-items-center" style={{ padding: '40px 20px', backgroundColor: '#ffffff' }}>
            <Form style={{ width: '100%', maxWidth: '400px' }} onSubmit={handleSubmit}>
              <h1 className="text-center mb-4 fw-bold text-warning">Create your Account</h1>

              <FloatingLabel controlId="floatingInputName" label={<><CiUser className="m-1" size={22} />Name</>} className="mb-3">
                <Form.Control type="text" name="username" placeholder="Name" style={{ backgroundColor: '#F4F8F5' }} value={formData.username} onChange={handleChange} required />
              </FloatingLabel>

              <FloatingLabel controlId="floatingInputEmail" label={<><CiMail className="m-1" size={22} />Email</>} className="mb-3">
                <Form.Control type="email" name="email" placeholder="name@example.com" style={{ backgroundColor: '#F4F8F5' }} value={formData.email} onChange={handleChange} required />
              </FloatingLabel>

              <FloatingLabel controlId="floatingInputPassword" label={<><CiLock className="m-1" size={22} />Password</>} className="mb-3">
                <Form.Control type="password" name="password" placeholder="Password" style={{ backgroundColor: '#F4F8F5' }} value={formData.password} onChange={handleChange} required />
              </FloatingLabel>
              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" className="rounded-5 px-5 py-2 text-light fw-bold" variant="warning" disabled={isLoading}>
                  {isLoading ? 'Signing up...' : 'Sign up'}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Regester;
