import React, { useEffect, useState } from 'react';
import { List as RVList, AutoSizer } from 'react-virtualized';
import {
  Modal,
  Body,
  TitleWrapper,
  Title,
  Subtitle,
  CloseModal,
  RightBtn,
  Row
} from '../CreateContractModal.styles';
import { withClient } from '../../../../store/hocs/clientContext';
import AdjustContractRow from './AdjustContractRow';
import styled from 'styled-components';

const TableHeader = styled.div`
  padding: 1.2rem 0;
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr 1fr;
  text-align: center;
  font-weight: bold
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  color: ${p => p.theme.colors.primary}
  height: 50px;
`;

function AdjustProfitModal(props) {
  const {
    isActive,
    close,
    contracts,
    onApplySuggested,
    client,
    onAdjust
  } = props;
  const [showOverprofit, setShowOverprofit] = useState(false);
  const contractsToShow = showOverprofit
    ? contracts
    : contracts.filter(x => x.currentRate < 1);
  const [settings, setSettings] = useState({});
  useEffect(() => {
    client.getProfitSettings().then(settings => {
      setSettings(settings);
    });
  }, []);

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  if (!isActive) {
    return <></>;
  }

  const rowRenderer = contracts => ({ key, index, style }) => (
    <div style={style}>
      <AdjustContractRow
        style={style}
        key={contracts[index].id}
        item={contracts[index]}
        settings={settings}
        onAdjust={onAdjust}
      />
    </div>
  );

  return (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation} width={'60%'} maxWidth={'100%'}>
        {CloseModal(handleClose)}
        <TitleWrapper style={{ height: 'auto' }}>
          <Title>Adjust pricing for profit</Title>
        </TitleWrapper>
        <div>
          <input
            style={{ marginLeft: '10px' }}
            data-testid="show-overprofit"
            onChange={() => {
              setShowOverprofit(!showOverprofit);
            }}
            checked={showOverprofit}
            type="checkbox"
            id="overprofit"
          />
          Show excess profit contacts
        </div>
        <TableHeader>
          <div>Id</div>
          <div>Current Profit / Target Profit</div>
          <div>Current Price / Suggested Price</div>
          <div>Action</div>
        </TableHeader>
        <div style={{ height: '300px' }}>
          <AutoSizer>
            {({ width, height }) => (
              <RVList
                rowRenderer={rowRenderer(contractsToShow)}
                rowHeight={50}
                rowCount={contractsToShow.length}
                height={height || 500} // defaults for tests
                width={width || 500} // defaults for tests
              />
            )}
          </AutoSizer>
        </div>
        <div style={{ margin: '1.2rem' }}>
          NOTE: You will be charged marketplace fee and gas fee per updated
          contract.
        </div>
        <Row style={{ justifyContent: 'center' }}>
          <RightBtn
            type="submit"
            onClick={() => {
              const data = contractsToShow.map(x => ({
                id: x.id,
                price: x.estimatedPrice
              }));
              onApplySuggested(data);
            }}
          >
            Apply Suggested Prices
          </RightBtn>
        </Row>
      </Body>
    </Modal>
  );
}

export default withClient(AdjustProfitModal);
