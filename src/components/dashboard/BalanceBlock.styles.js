import styled from 'styled-components';
import { BaseBtn } from '../common';

export const Container = styled.div`
  margin: 1.6rem 0 1.6rem;
  background-color: #fff;
  padding: 6px 1.6rem 6px 1.6rem;
  border-radius: 15px;
`;

export const SecondaryContainer = styled.div`
  display: flex;
  min-height: 90px;
  justify-content: space-between;
  align-items: center;
`;

export const WalletBalanceHeader = styled.div`
  font-size: 1.4rem;
  text-align: center;
  color: ${p => p.theme.colors.primary};
  margin: 0 0 0.3em;
`;

export const Primary = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: -1px;
  color: ${p => p.theme.colors.primary};
  margin: 0 2rem 0 0;
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

export const Btn = styled(BaseBtn)`
  font-size: 1.5rem;
  margin-left: 1rem;
  padding: 1.5rem 0;
  border-radius: 5px !important;
  border: 1px solid ${p => p.theme.colors.translucentPrimary};
  background-color: ${p => p.theme.colors.light};
  color: ${p => p.theme.colors.translucentPrimary};
`;

export const BtnAccent = styled(Btn)`
  background-color: ${p => p.theme.colors.translucentPrimary};
  color: ${p => p.theme.colors.light};
`;

export const BtnRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 200px;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const CoinsRow = styled.div`
  display: flex;
`;
