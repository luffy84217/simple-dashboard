import React from 'react';
import { Alert } from 'reactstrap';

type Props = {
  children?: React.ReactNode;
};

const ErrorMessage: React.FC<Props> = ({ children }) => (
  <Alert color="danger" fade={false} data-testid="error">
    {children}
  </Alert>
);

export default ErrorMessage;
