import React, { useState } from 'react';
import withBalanceBlockState from '../../store/hocs/withBalanceBlockState';
import styled from 'styled-components';
import { LumerinLightIcon } from '../icons/LumerinLightIcon';
import { EtherIcon } from '../icons/EtherIcon';

import { BaseBtn, DisplayValue } from '../common';

const relSize = ratio => `calc(100vw / ${ratio})`;
const sizeMult = mult => `calc(5px * ${mult})`;

const Container = styled.div`
  margin: 1.6rem 0 1.6rem;
  background-color: ${p => p.theme.colors.xLight};
  height: 100px;
  width: 400px;
  padding: 0 1.6rem 0 1.6rem;
  border-radius: 5px;
  display: flex;
`;

const Balance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.75em 1.6rem 0.75em 1rem;
  height: 90%;
  position: relative;
  @media (min-width: 1040px) {
  }
`;

const IconLogoContainer = styled.div`
  padding: 2.4rem 1.2rem;
  height: 100px;
  display: block !important;
  flex-shrink: 0;

  /* @media (min-width: 800px) {
    display: block !important;
  } */
`;

const Primary = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: -1px;
  color: ${p => p.theme.colors.darker};
  margin: 0 1.6rem;
  flex-grow: 1;
  position: relative;
  // top: ${relSize(-400)};
  // font-size: ${relSize(58)};
  font-size: min(max(20px,4vw),24px);
  max-width: 120px;
  min-width: 20px;
  overflow: scroll;

  @media (min-width: 1440px) {
    font-size: ${({ large }) => (large ? '3.6rem' : '2.8rem')};
  }
`;

const Secondary = styled.div`
  display: block;
  line-height: 1;
  font-weight: 600;
  color: ${p => p.theme.colors.darker};
  white-space: nowrap;
  position: relative;
  top: ${relSize(-400)};
  font-size: ${relSize(48)};

  @media (min-width: 800px) {
    font-size: ${relSize(68)};
  }

  @media (min-width: 1440px) {
    font-size: 2.2rem;
  }
`;

const UsdValue = styled.div`
  font-size: 12px;
  color: #8e8e8e;
  position: absolute;
  top: 62px;
`;

const LeftBtn = styled(BaseBtn)`
  height: 60%;
  font-size: 1.5rem;
  margin-right: 0.4rem;
  border-radius: 5px;
  background-color: ${p => p.theme.colors.primary};
  color: ${p => p.theme.colors.light};

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;

const RightBtn = styled(BaseBtn)`
  height: 60%;
  font-size: 1.5rem;
  margin-left: 0.4rem;
  border-radius: 5px;
  border: 1px solid ${p => p.theme.colors.primary};
  background-color: ${p => p.theme.colors.light};
  color: ${p => p.theme.colors.primary};

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;

const BtnRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 200px;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

function BalanceBlock({
  sendDisabled,
  sendDisabledReason,
  ethBalance,
  lmrBalance,
  lmrBalanceUSD,
  onTabSwitch
}) {
  const [assetMode, setAssetMode] = useState('LMR');

  const handleToggleAssetMode = e => setAssetMode(e.target.dataset.asset);
  const handleTabSwitch = e => {
    e.preventDefault();

    onTabSwitch(e.target.dataset.modal);
  };

  const LumerinMode = () => (
    <>
      <LumerinLightIcon size="5rem" />
      <Balance>
        <Primary data-testid="lmr-balance">
          <DisplayValue shouldFormate={false} value={lmrBalance} />
        </Primary>
        {lmrBalanceUSD && <UsdValue>≈ {lmrBalanceUSD}$</UsdValue>}
        {/* TODO: Fix ethBalance */}
        {/* <Secondary data-testid="eth-balance">ETH {ethBalance}</Secondary> */}
      </Balance>
    </>
  );

  const EtherMode = () => (
    <>
      <EtherIcon size="6rem" data-asset="ETH" onClick={handleToggleAssetMode} />
      <Balance>
        <Primary data-testid="eth-balance" large>
          <DisplayValue shouldFormate={false} value={ethBalance} />
        </Primary>
        <Secondary data-testid="lmr-balance" hide>
          <LumerinLightIcon size="2rem" /> {lmrBalance}
        </Secondary>
      </Balance>
    </>
  );

  return (
    <>
      <Container>
        <LumerinMode />

        <BtnRow>
          {/* <LeftBtn
            data-asset="ETH"
            data-testid="receive-btn"
            block
          >
            toggle {assetMode}
          </LeftBtn> */}
          <LeftBtn
            data-modal="receive"
            data-testid="receive-btn"
            onClick={handleTabSwitch}
            block
          >
            Receive
          </LeftBtn>

          <RightBtn
            data-modal="send"
            data-disabled={sendDisabled}
            data-rh={sendDisabledReason}
            data-testid="send-btn"
            onClick={sendDisabled ? null : handleTabSwitch}
            block
          >
            Send
          </RightBtn>
        </BtnRow>
      </Container>
    </>
  );
}

export default withBalanceBlockState(BalanceBlock);
