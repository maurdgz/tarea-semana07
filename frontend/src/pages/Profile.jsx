import React from "react";
import { Container, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h3>Profile: <strong>{user.username}</strong></h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Authorities:</strong></p>
        <ul>
          {user.roles &&
            user.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </Card>
    </Container>
  );
};

export default Profile;
