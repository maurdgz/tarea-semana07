import React, { useState, useEffect } from "react";
import { Container, Card, Alert } from "react-bootstrap";
import UserService from "../services/user.service";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        setError(
          (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        );
      }
    );
  }, []);

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h3>Admin Board</h3>
        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <p>{content}</p>
        )}
      </Card>
    </Container>
  );
};

export default BoardAdmin;
