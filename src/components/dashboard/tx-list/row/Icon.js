import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from 'lumerin-wallet-ui-logic/src/theme';
import React from 'react';

import LeftArrowIcon from '../../../icons/LeftArrowIcon';
import RightArrowIcon from '../../../icons/RightArrowIcon';
import ContractIcon from '../../../icons/ContractIcon';

const Pending = styled.div`
  color: #ababab;
  border: 1px solid #ababab;
  border-radius: 1.2rem;
  height: 2.4rem;
  width: 2.4rem;
  line-height: 2.2rem;
  text-align: center;
  font-size: 1.2rem;
`;

export default function Icon({ txType }) {
  const size = '3.6rem';
  if (txType === 'received') {
    return <LeftArrowIcon fill="#42A1A2" />;
  }

  if (txType === 'sent') {
    return <RightArrowIcon fill="#DB2642" />;
  }

  return (
    <>
      <ContractIcon fill="#42A1A2" />
    </>
  );
}
