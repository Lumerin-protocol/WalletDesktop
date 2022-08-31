import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '@lumerin/wallet-ui-logic/src/theme';
import React from 'react';

import LeftArrowIcon from '../../../icons/LeftArrowIcon';
import RightArrowIcon from '../../../icons/RightArrowIcon';
import { ContractIcon } from '../../../icons/ContractIcon';

export const TxIcon = ({ txType, size = '3.6rem' }) => {
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
};
