import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import { DisplayValue } from '../../../common';

const Container = styled.div`
  line-height: 2.5rem;
  text-align: right;
  opacity: ${({ isPending }) => (isPending ? '0.5' : '1')};
  color: ${p =>
    p.isPending
      ? p.theme.colors.copy
      : p.isFailed
      ? p.theme.colors.danger
      : p.theme.colors.primary};
  display: flex;
  justify-content: flex-end;
  font-size: 2.3vw;

  @media (min-width: 800px) {
    font-size: 1.8vw;
  }

  @media (min-width: 1040px) {
    font-size: 1.5vw;
  }

  @media (min-width: 1440px) {
    font-size: 2.2rem;
  }
`;

const Label = styled.label`
  font-size: 3rem;
`;

export default class Total extends React.Component {
  // static propTypes = {
  //   isAttestationValid: PropTypes.bool,
  //   isProcessing: PropTypes.bool,
  //   isPending: PropTypes.bool,
  //   isFailed: PropTypes.bool.isRequired,
  //   symbol: PropTypes.string,
  //   socketType: PropTypes.oneOf([
  //     'import-requested',
  //     'attestation',
  //     'converted',
  //     'imported',
  //     'exported',
  //     'received',
  //     'auction',
  //     'unknown',
  //     'sent'
  //   ]).isRequired,
  //   value: PropTypes.string.isRequired,
  //   coinSymbol: PropTypes.string
  // }

  // eslint-disable-next-line complexity
  render() {
    return (
      <Container
        isPending={this.props.isPending}
        isFailed={this.props.isFailed}
      >
        <Label>{value}</Label>
      </Container>
    );
  }
}
