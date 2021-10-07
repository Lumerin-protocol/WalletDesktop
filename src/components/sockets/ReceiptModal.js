import React, { useState, useEffect, useContext } from 'react';
import withReceiptState from 'lumerin-wallet-ui-logic/src/hocs/withReceiptState';
import PropTypes from 'prop-types';

import Modal, { HeaderButton } from '../common/Modal';
import { ToastsContext } from '../toasts';
import Receipt from '../common/receipt/Receipt';

function ReceiptModal(props) {
  // static propTypes = {
  //   onRefreshRequest: PropTypes.func.isRequired,
  //   onRequestClose: PropTypes.func.isRequired,
  //   refreshStatus: PropTypes.oneOf(['init', 'pending', 'success', 'failure'])
  //     .isRequired,
  //   isOpen: PropTypes.bool.isRequired,
  //   hash: PropTypes.string
  // };

  const context = useContext(ToastsContext);
  useEffect(() => {
    if (props.refreshStatus === 'failure') {
      context.toast('error', 'Could not refresh');
    }
  }, []);

  if (!props.hash) return null;

  return (
    <Modal
      shouldReturnFocusAfterClose={false}
      onRequestClose={props.onRequestClose}
      headerChildren={
        <HeaderButton
          disabled={props.refreshStatus === 'pending'}
          onClick={props.onRefreshRequest}
        >
          {props.refreshStatus === 'pending' ? 'Syncing...' : 'Refresh'}
        </HeaderButton>
      }
      isOpen={props.isOpen}
      title="Receipt"
    >
      <Receipt {...props} />
    </Modal>
  );
}

export default withReceiptState(ReceiptModal);
