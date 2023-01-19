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
  background-color: #fff;
  height: 106px;
  max-width: 60%;
  padding: 6px 1.6rem 6px 1.6rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
`;

const SecondaryContainer = styled.div`
  display: flex;
  min-height: 90px;
  justify-content: space-between;
  align-items: center;
`;

const WalletBalanceHeader = styled.div`
  font-size: 1.3rem;
  text-align: center;
  color: ${p => p.theme.colors.primary};
`;

const Balance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.75em 1.6rem 0.75em 1rem;
  height: 90%;
  position: relative;
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
  font-weight: 500;
  letter-spacing: -1px;
  color: ${p => p.theme.colors.primary};
  margin: 0 1.6rem;
  flex-grow: 1;
  font-size: min(max(20px, 4vw), 24px);
  min-width: 20px;
  overflow: scroll;
  font-size: 2.8rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Secondary = styled.div`
  display: block;
  line-height: 1;
  font-weight: 600;
  color: ${p => p.theme.colors.darker};
  white-space: nowrap;
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
  top: 55px;
`;

const LeftBtn = styled(BaseBtn)`
  height: 60%;
  font-size: 1.5rem;
  margin-right: 0.4rem;
  border-radius: 5px !important;
  background-color: ${p => p.theme.colors.translucentPrimary};
  color: ${p => p.theme.colors.light};

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;

const RightBtn = styled(BaseBtn)`
  height: 60%;
  font-size: 1.5rem;
  margin-left: 0.4rem;
  border-radius: 5px !important;
  border: 1px solid ${p => p.theme.colors.translucentPrimary};
  background-color: ${p => p.theme.colors.light};
  color: ${p => p.theme.colors.translucentPrimary};

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

const LumerinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 90px;
`;

const LMR = styled.span`
  font-size: 1.25rem;
  margin-left: 5px;
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
    <LumerinContainer>
      <Balance>
        <WalletBalanceHeader>Wallet Balance</WalletBalanceHeader>
        <Primary data-testid="lmr-balance">
          <LumerinLightIcon size="2rem" />
          <DisplayValue
            shouldFormate={true}
            value={lmrBalance}
            post={<LMR>LMR</LMR>}
          />
        </Primary>
        {lmrBalanceUSD !== undefined && <UsdValue>≈ {lmrBalanceUSD}</UsdValue>}
        {/* TODO: Fix ethBalance */}
        {/* <Secondary data-testid="eth-balance">ETH {ethBalance}</Secondary> */}
      </Balance>
    </LumerinContainer>
  );

  const EtherMode = () => (
    <>
      <EtherIcon size="6rem" data-asset="ETH" onClick={handleToggleAssetMode} />
      <Balance>
        <Primary data-testid="eth-balance" large>
          <DisplayValue shouldFormate={false} value={ethBalance} />
        </Primary>
        <Secondary data-testid="lmr-balance" hide>
          <LumerinLightIcon size="30px" /> {lmrBalance}
        </Secondary>
      </Balance>
    </>
  );

  return (
    <>
      <Container>
        <SecondaryContainer>
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
        </SecondaryContainer>
      </Container>
    </>
  );
}

export default withBalanceBlockState(BalanceBlock);
