import * as testUtils from '../../testUtils';
import ConvertDrawer from '../converter/ConvertDrawer';
import { Simulate } from 'react-testing-library';
import React from 'react';

const closeHandler = jest.fn();

const getElement = defaultTab => (
  <ConvertDrawer onRequestClose={closeHandler} defaultTab={defaultTab} isOpen />
);

describe.skip('<ConvertDrawer/>', () => {
  it('displays LMR TO ETH form when clicking the tab', () => {
    const { queryByTestId, getByTestId } = testUtils.reduxRender(
      getElement(),
      testUtils.getInitialState()
    );
    expect(queryByTestId('lmrToEth-form')).toBeNull();
    Simulate.click(testUtils.withDataset(getByTestId('lmrToEth-tab'), 'tab'));
    expect(queryByTestId('lmrToEth-form')).not.toBeNull();
  });

  it('displays ETH TO LMR form when clicking the tab', () => {
    const { queryByTestId, getByTestId } = testUtils.reduxRender(
      getElement('lmrToEth'),
      testUtils.getInitialState()
    );
    expect(queryByTestId('ethToLmr-form')).toBeNull();
    Simulate.click(testUtils.withDataset(getByTestId('ethToLmr-tab'), 'tab'));
    expect(queryByTestId('ethToLmr-form')).not.toBeNull();
  });
});
