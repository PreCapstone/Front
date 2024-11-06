import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  height: 100%;
  overflow-y: auto;
`;

const MessageItem = styled.div`
  background-color: #f9f9f9;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const MessageHistory = ({ messages }) => (
  <Container>
    {messages.map((message, index) => (
      <MessageItem key={index}>{message}</MessageItem>
    ))}
  </Container>
);

export default MessageHistory;

