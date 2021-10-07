import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import { DisplayValue } from '../common';

const Container = styled.div`
  margin-top: 1.6rem;
  line-height: 1.6rem;
  font-size: 1.3rem;
  font-weight: 600;
  text-shadow: 0 1px 1px ${p => p.theme.colors.darkShade};
  opacity: ${p => (p.weak ? 0.5 : 1)};
`;

const ErrorMsg = styled.div`
  color: ${p => p.theme.colors.danger};
`;

export default class ConverterEstimates extends React.Component {
  static propTypes = {
    estimateError: PropTypes.string,
    coinSymbol: PropTypes.string.isRequired,
    convertTo: PropTypes.oneOf(['coin', 'LMR']).isRequired,
    estimate: PropTypes.string,
    rate: PropTypes.string
  };

  render() {
    return (
      <React.Fragment>
        {this.props.estimate && (
          <Container>
            You would get approximately{' '}
            <DisplayValue
              inline
              value={this.props.estimate}
              color="primary"
              post={` ${
                this.props.convertTo === 'LMR' ? 'LMR' : this.props.coinSymbol
              }`}
            />
            , which means a rate of{' '}
            <DisplayValue
              inline
              value={this.props.rate}
              post={` ${this.props.coinSymbol}/LMR.`}
            />
          </Container>
        )}
        {this.props.estimateError && (
          <Container>
            <ErrorMsg color="danger" mt={1}>
              Error getting conversion estimate: {this.props.estimateError}
            </ErrorMsg>
          </Container>
        )}
      </React.Fragment>
    );
  }
}
