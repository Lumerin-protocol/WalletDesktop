import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import ConvertCoinToLMRForm from './ConvertCoinToLMRForm';
import ConvertLMRtoCoinForm from './ConvertLMRtoCoinForm';
import { Drawer, Tabs } from '../common';

const Arrow = styled.span`
  color: ${p => p.theme.colors.primary};
  position: relative;
  margin: 0 8px;
  transform: scale3d(1.5, 1.5, 1);
  display: inline-block;
`;

export default class ConvertDrawer extends React.Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    coinSymbol: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  state = { activeTab: 'coin' };

  componentDidUpdate(prevProps) {
    if (this.props.isOpen && prevProps.isOpen !== this.props.isOpen) {
      this.setState({ activeTab: 'coin' });
    }
  }

  onTabChange = activeTab => this.setState({ activeTab });

  render() {
    const tabs = (
      <Tabs
        onClick={this.onTabChange}
        active={this.state.activeTab}
        items={[
          {
            id: 'coin',
            label: (
              <React.Fragment>
                {this.props.coinSymbol}
                <Arrow>&rarr;</Arrow>
                LMR
              </React.Fragment>
            )
          },
          {
            id: 'lmr',
            label: (
              <React.Fragment>
                LMR
                <Arrow>&rarr;</Arrow>
                {this.props.coinSymbol}
              </React.Fragment>
            )
          }
        ]}
      />
    );

    return (
      <Drawer
        onRequestClose={this.props.onRequestClose}
        data-testid="convert-drawer"
        isOpen={this.props.isOpen}
        title="Converter"
      >
        {this.state.activeTab === 'coin' && (
          <ConvertCoinToLMRForm tabs={tabs} />
        )}
        {this.state.activeTab === 'lmr' && <ConvertLMRtoCoinForm tabs={tabs} />}
      </Drawer>
    );
  }
}
