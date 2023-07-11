import React, { useState } from 'react';
import { abbreviateAddress } from '../../../../utils';
import { IconTrashOff } from '@tabler/icons';
import styled from 'styled-components';

import { formatDuration, formatSpeed, formatPrice } from '../../utils';
import withContractsRowState from '../../../../store/hocs/withContractsRowState';
import Spinner from '../../../common/Spinner';

const RowContainer = styled.div`
  padding: 1.2rem 0;
  display: grid;
  grid-template-columns: 1fr 4fr 1fr 1fr;
  text-align: center;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  color: ${p => p.theme.colors.primary}
  height: 50px;
`;

const ContractValue = styled.label`
  display: flex;
  padding: 0 1.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  flex-direction: row;
  gap: 5px;
`;

const Circle = styled.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-block;

  background: ${p => p.color};
  color: #fff;
  text-align: center;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ArchiveRow(props) {
  const { explorerUrl, contract, handleRestore, symbol } = props;

  const [isProcessing, setIsProcessing] = useState(false);

  const wrapRestoreContract = async () => {
    setIsProcessing(true);
    await handleRestore(contract);
    setIsProcessing(false);
  };

  return (
    <RowContainer>
      <FlexCenter>
        <ContractValue onClick={() => window.openLink(explorerUrl)}>
          {abbreviateAddress(contract.id, 4)}
        </ContractValue>
      </FlexCenter>
      <FlexCenter style={{ justifyContent: 'space-between', padding: '0 5px' }}>
        {formatPrice(contract.price, symbol)} <span>|</span>
        {formatDuration(contract.length)} <span>|</span>
        {formatSpeed(contract.speed)}
      </FlexCenter>
      <FlexCenter style={{ justifyContent: 'space-evenly' }}>
        <Circle
          data-rh={`${contract?.stats?.successCount || 0} Completed`}
          color={'green'}
        >
          {contract?.stats?.successCount || 0}
        </Circle>
        <Circle
          data-rh={`${contract?.stats?.failCount || 0} Cancelled`}
          color={'red'}
        >
          {contract?.stats?.failCount || 0}
        </Circle>
      </FlexCenter>
      <FlexCenter>
        {isProcessing ? (
          <Spinner size="18px" />
        ) : (
          <IconTrashOff
            data-rh={`Restore contract`}
            onClick={wrapRestoreContract}
            style={{ cursor: 'pointer' }}
          />
        )}
      </FlexCenter>
    </RowContainer>
  );
}

export default withContractsRowState(ArchiveRow);
