/* eslint-disable require-path-exists/exists */
/* eslint-disable import/no-unresolved */
import ConvertETHtoLMRForm from '../converter/ConvertETHtoLMRForm';
import * as amountFields from './AmountFields.test.js';
import * as gasEditor from './GasEditor.test.js';
import * as testUtils from '../../testUtils';
import { Simulate } from 'react-testing-library';
import React from 'react';

const element = <ConvertETHtoLMRForm tabs={<div />} />;

const ETHprice = 250;

describe('<ConvertETHtoLMRForm/>', () => {
  it.skip('should match its snapshot', () => {
    const { container } = testUtils.reduxRender(element, getInitialState());
    expect(container).toMatchSnapshot();
  });

  describe('When editing the amount fields', () => {
    amountFields.runEditTests(element, getInitialState(), ETHprice);
  });

  describe('When submitting the form', () => {
    amountFields.runValidateTests(element, getInitialState(), 'ethToLmr-form');

    gasEditor.runValidateTests(element, getInitialState(), 'ethToLmr-form');

    it('displays the confirmation view if there are no errors', () => {
      const { queryByTestId, getByTestId } = testUtils.reduxRender(
        element,
        getInitialState()
      );
      expect(queryByTestId('confirmation')).toBeNull();
      const amountField = getByTestId('ethAmount-field');
      const useMinimum = getByTestId('useMinimum-cb');
      amountField.value = '1';
      useMinimum.checked = false;
      Simulate.change(amountField);
      Simulate.change(useMinimum);
      Simulate.submit(getByTestId('ethToLmr-form'));
      expect(queryByTestId('confirmation')).not.toBeNull();
    });
  });
});

function getInitialState() {
  return testUtils.getInitialState({
    rates: { ETH: { token: 'ETH', price: ETHprice } }
  });
}
