import withSendDrawerState from 'lumerin-wallet-ui-logic/src/hocs/withSendDrawerState';
import PropTypes from 'prop-types';
import React from 'react';

import { Drawer, Tabs } from '../common';
import SendCoinForm from './SendCoinForm';
import SendLMRForm from './SendLMRForm';

class SendDrawer extends React.Component {
  static propTypes = {
    sendLmrDisabledReason: PropTypes.string,
    sendLmrDisabled: PropTypes.bool.isRequired,
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
            id: 'lmr',
            label: 'LMR',
            'data-rh': this.props.sendLmrDisabledReason,
            disabled: this.props.sendLmrDisabled
          },
          { id: 'coin', label: this.props.coinSymbol }
        ]}
      />
    );

    return (
      <Drawer
        onRequestClose={this.props.onRequestClose}
        data-testid="send-drawer"
        isOpen={this.props.isOpen}
        title="Send Transaction"
      >
        {this.state.activeTab === 'coin' && <SendCoinForm tabs={tabs} />}
        {this.state.activeTab === 'lmr' && <SendLMRForm tabs={tabs} />}
      </Drawer>
    );
  }
}

export default withSendDrawerState(SendDrawer);
