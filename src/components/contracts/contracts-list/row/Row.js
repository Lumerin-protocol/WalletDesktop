import withContractsRowState from 'lumerin-wallet-ui-logic/src/hocs/withContractsRowState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import Details from './Details';
import Amount from './Amount';
import Icon from './Icon';

const Container = styled.div`
  margin-left: 1.6rem;
  padding: 1.2rem 2.4rem 1.2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const Label = styled.label`
  color: black;
  font-size: 1rem;
`;

class Row extends React.Component {
  static propTypes = {
    contract: PropTypes.any
  };

  render() {
    console.log('props: ', this.props);
    const { contract, ...other } = this.props;

    // TODO: Add better padding
    return (
      <Container {...other}>
        <Label>{contract.status}</Label>
        <Label>{contract.deviceName}</Label>
        <Label>{contract.hashrate}</Label>
      </Container>
    );
  }
}

export default withContractsRowState(Row);
