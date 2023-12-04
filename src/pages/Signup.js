import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useSignupUserMutation } from "../services/appApi";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import bot from "../assets/profile.avif";

const Signup = () => {
  // states for email,password and name

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [signupUser, { isLoading, error }] = useSignupUserMutation();

  // image upload states
  const [image, setImage] = useState(null);
  const [uploadImg, setuploadImg] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  // function for profile image validation
  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size > 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  }
  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "a9siepkj");
    try {
      setuploadImg(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/djsuinkuq/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setuploadImg(false);
      return urlData.url;
    } catch (error) {
      setuploadImg(false);
      console.log(error);
    }
  }
  // function for handle sign up
  async function handleSignup(e) {
    e.preventDefault();
    if (!image) return alert("Please upload profile picture");
    if (!name) return alert("Please enter the name");
    if (!email) return alert("Please enter the email");
    const url = await uploadImage(image);
    console.log(url);
    // user sign-upo
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
        console.log(data);
        navigate("/chat");
      }
    });
  }

  return (
    <Container>
      <Row>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <div className="signup-profile-pic-container">
              <img
                src={previewImg || bot}
                alt=""
                className="signup-profile-pic"
              />
              <label htmlFor="image-upload" className="image-upload-lable">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={validateImg}
              />
            </div>
            <h1 className="text-center">Create an account</h1>
            {error && <p className="alert alert-danger">{error.data}</p>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="formBasicCheckbox"
            ></Form.Group>
            <Button variant="primary" type="submit">
              {uploadImg || isLoading ? "signing-in..." : "signup"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account ? <Link to="/Login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="signup_bg"></Col>
      </Row>
      ;
    </Container>
  );
};

export default Signup;
