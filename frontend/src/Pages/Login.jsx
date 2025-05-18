import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, FloatingLabel, Form } from 'react-bootstrap';
import bg from '../assets/bg.png';
import { CiMail, CiLock } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';  // use react-router-dom, not react-router
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/services/authSlice';  // adjust path if needed

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, errorMessage } = useSelector(state => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/'); // redirect to home page on successful login
    }

    // Reset auth state on component unmount or before next login
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch login thunk with email & password
    dispatch(login({ email, password }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid>
        <Row className="shadow rounded overflow-hidden m-auto" style={{ height: '90vh', width: '70%', backgroundColor: '#ffffff' }}>
          <Col
            md={8}
            sm={12}
            className="d-flex justify-content-center align-items-center"
            style={{ padding: '40px 20px', backgroundColor: '#ffffff' }}
          >
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <h1 className="text-center mb-4 fw-bold text-warning">
                Sign in to <br /> your Account
              </h1>
              <Form onSubmit={handleSubmit}>
                <FloatingLabel
                  controlId="floatingInput"
                  label={
                    <>
                      <CiMail className="m-1" size={22} />
                      Email
                    </>
                  }
                  className="mb-3"
                >
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    style={{ backgroundColor: '#F4F8F5' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingPassword"
                  label={
                    <>
                      <CiLock className="m-1" size={22} />Password
                    </>
                  }
                  className='mb-3'
                >
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    style={{ backgroundColor: '#F4F8F5' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FloatingLabel>
                {isError && (
                  <p className="text-danger text-center">{errorMessage}</p>
                )}
                <div className="d-flex justify-content-center mt-3">
                  <a href="#" className="text-decoration-none text-dark fw-bolder">
                    Forgot password?
                  </a>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    className="rounded-5 px-5 py-2 text-light fw-bold"
                    variant="warning"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
          <Col
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center text-light"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center px-3">
              <h2 className="fw-bold">Hello Friend!</h2>
              <p>
                Enter your personal details and <br />
                start your journey with us.
              </p>
              <div className="d-grid gap-2">
                <Link to={'/register'}>
                  <Button className="rounded-5" variant="outline-light" size="lg">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div >
  );
}

export default Login;
