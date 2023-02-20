import React from 'react';
import styled from 'styled-components';

import { Row, RightBtn, LeftBtn } from './CreateContractModal.styles';
import { truncateAddress } from '../utils';

const ReviewItems = styled.div`
  div {
    display: flex;
    justify-content: space-between;
    margin: 1.25rem 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eaf7fc;
    &:last-child {
      border-bottom: none;
    }
    h4 {
      font-weight: 100;
    }
    p {
      color: #014353;
      font-weight: 500;
    }
  }

  .total-cost {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    .price {
      font-size: 2rem;
    }
  }
`;

export const CreateContractPreview = ({
  data: { address, time, speed, price },
  submit,
  close
}) => {
  return (
    <>
      <ReviewItems>
        <div>
          <h4>Wallet Address</h4>
          <p>{truncateAddress(address, 'MEDIUM')}</p>
        </div>
        <div>
          <h4>Contract Time</h4>
          <p>{time} hours</p>
        </div>
        <div>
          <h4>Speed</h4>
          <p>{speed} TH/S</p>
        </div>
        <div>
          <h4>List Price</h4>
          <p>{price} LMR</p>
        </div>
      </ReviewItems>
      <Row>
        <LeftBtn onClick={close}>Cancel</LeftBtn>
        <RightBtn onClick={submit}>Confirm New Contract</RightBtn>
      </Row>
    </>
  );
};
