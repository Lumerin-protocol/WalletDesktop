import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import Banner from './Banner';
import Flex from './Flex';
import Sp from './Spacing';

const Container = styled(Flex.Column)`
  min-height: 100vh;
  padding: 3.2rem;
  background: ${p => p.theme.colors.light};
    top center;
`;

const Body = styled.div`
  max-width: 30rem;
  width: 100%;
  margin-top: 4rem;
  @media (min-height: 600px) {
    margin-top: 8rem;
  }
`;

const Title = styled.div`
  line-height: 3rem;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  cursor: default;
  color: ${p => p.theme.colors.dark} @media (min-height: 600px) {
    font-size: 2.4rem;
  }
`;

export default function AltLayout({ title, children, ...other }) {
  // static propTypes = {
  //   children: PropTypes.node.isRequired,
  //   title: PropTypes.string
  // }

  return (
    <Container align="center" {...other}>
      <Banner />
      <Body>
        {title && <Title>{title}</Title>}
        <Sp mt={2}>{children}</Sp>
      </Body>
    </Container>
  );
}
