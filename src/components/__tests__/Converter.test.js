import * as testUtils from '../../testUtils';
import { Simulate } from 'react-testing-library';
import Converter from '../converter/Converter';
import React from 'react';

describe('<Converter/>', () => {
  it('displays a "waiting..." message until the first converter status is received', () => {
    const { queryByTestId, store } = testUtils.reduxRender(
      <Converter />,
      getInitialState()
    );
    expect(queryByTestId('waiting')).not.toBeNull();
    store.dispatch(converterStatusUpdated(dummyStatus()));
    expect(queryByTestId('waiting')).toBeNull();
  });

  describe('If LMR conversions ARE ALLOWED', () => {
    it('opens Convert drawer when Convert button is clicked', () => {
      const { queryByTestId, getByTestId } = testUtils.reduxRender(
        <Converter />,
        getInitialState(dummyStatus(), inDailyAuction())
      );
      const btn = testUtils.withDataset(getByTestId('convert-btn'), 'modal');
      expect(queryByTestId('convert-drawer')).toBeNull();
      Simulate.click(btn);
      expect(queryByTestId('convert-drawer')).not.toBeNull();
    });

    describe('if connectivity is lost', () => {
      it('Convert button is disabled', () => {
        const { queryByTestId, getByTestId, store } = testUtils.reduxRender(
          <Converter />,
          getInitialState(dummyStatus(), inDailyAuction())
        );
        store.dispatch(goOffline());
        const btn = testUtils.withDataset(getByTestId('convert-btn'), 'modal');
        expect(queryByTestId('convert-drawer')).toBeNull();
        Simulate.click(btn);
        expect(queryByTestId('convert-drawer')).toBeNull();
      });

      it('Convert button shows a tooltip when hovered', () => {
        const { getByTestId, store } = testUtils.reduxRender(
          <Converter />,
          getInitialState(dummyStatus(), inDailyAuction())
        );
        expect(getByTestId('convert-btn').getAttribute('data-rh')).toBeNull();
        store.dispatch(goOffline());
        expect(getByTestId('convert-btn').getAttribute('data-rh')).toBe(
          "Can't convert while offline"
        );
      });
    });
  });
});

function converterStatusUpdated(payload = {}) {
  return {
    type: 'converter-status-updated',
    payload
  };
}

function goOffline() {
  return {
    type: 'connectivity-state-changed',
    payload: { ok: false }
  };
}

const dummyStatus = (overrides = {}) => ({
  availableEth: '100',
  availableLmr: '100',
  currentPrice: '10',
  ...overrides
});

const inDailyAuction = (overrides = {}) => ({
  nextAuctionStartTime: testUtils.inOneHour(),
  tokenRemaining: '1',
  currentAuction: 10,
  currentPrice: '33000000000',
  genesisTime: testUtils.twoWeeksAgo(),
  ...overrides
});

function getInitialState(converterStatus = null, auctionStatus = null) {
  return testUtils.getInitialState({
    converter: { status: converterStatus },
    auction: { status: auctionStatus }
  });
}
