import React from 'react';
import { Container } from 'reactstrap';

import NavBar from './NavBar';
import Footer from './Footer';

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => (
  <main id="app" className="d-flex flex-column h-100" data-testid="layout">
    <NavBar />
    <Container className="flex-grow-1 mt-5">{children}</Container>
    <Footer />
  </main>
);

export default Layout;
