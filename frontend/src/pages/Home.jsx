import React, { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import UserService from "../services/user.service";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        setContent(
          (error.response && error.response.data) ||
            error.message ||
            error.toString()
        );
      }
    );
  }, []);

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h3>Public Home</h3>
        <p>{content}</p>
      </Card>
    </Container>
  );
};

export default Home;
