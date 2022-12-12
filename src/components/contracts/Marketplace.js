import React, { useState, useContext, useEffect } from 'react';
import withContractsState from '../../store/hocs/withContractsState';
import { LayoutHeader } from '../common/LayoutHeader';
import ContractsList from './contracts-list/ContractsList';
import { View } from '../common/View';
import { ToastsContext } from '../toasts';
import PurchaseContractModal from './modals/PurchaseContractModal';
import MarketplaceRow from './contracts-list/MarketplaceRow';
import { ContractsRowContainer } from './contracts-list/ContractsRow.styles';

function Marketplace({
  hasContracts,
  copyToClipboard,
  onWalletRefresh,
  syncStatus,
  activeCount,
  draftCount,
  address,
  client,
  contractsRefresh,
  contracts,
  ...props
}) {
  const [isModalActive, setIsModalActive] = useState(false);
  const [contractToPurchase, setContractToPurchase] = useState(undefined);

  const context = useContext(ToastsContext);
  const contractsToShow = [
    {
      id: '0xF568B28fa92C58A322661d1DBe22B22B4486c934',
      price: '200000000',
      speed: '100000000000000',
      length: '21600',
      buyer: '0x0000000000000000000000000000000000000000',
      seller: '0x7525960Bb65713E0A0e226EF93A19a1440f1116d',
      timestamp: '0',
      state: '0',
      encryptedPoolData: '',
      limit: '0',
      balance: '0'
    }
  ];
  // contracts.filter(
  //   x => Number(x.state) === 0 && x.seller !== address
  // );

  const handleCloseModal = e => {
    setIsModalActive(false);
  };

  useEffect(() => {
    contractsRefresh();
  }, []);

  const tabs = [
    { value: 'price', name: 'Price', ratio: 1 },
    { value: 'length', name: 'Duration', ratio: 1 },
    { value: 'speed', name: 'Speed (TH/s)', ratio: 1 },
    { value: 'action', name: 'Actions', ratio: 2 }
  ];

  const handleContractCancellation = (e, data) => {
    e.preventDefault();

    client
      .cancelContract({
        contractId: data.contractId,
        walletAddress: data.walletAddress,
        closeOutType: data.closeOutType
      })
      .then(() => contractsRefresh());
  };

  const rowRenderer = (contractsList, ratio) => ({ key, index, style }) => (
    <ContractsRowContainer style={style} key={`${key}-${index}`}>
      <MarketplaceRow
        data-testid="Marketplace-row"
        onPurchase={data => {
          console.log(data);
          setContractToPurchase(data);
          setIsModalActive(true);
        }}
        contract={contractsList[index]}
        address={address}
        ratio={ratio}
      />
    </ContractsRowContainer>
  );

  return (
    <View data-testid="contracts-container">
      <LayoutHeader
        title="Marketplace"
        address={address}
        copyToClipboard={copyToClipboard}
      ></LayoutHeader>

      <ContractsList
        hasContracts={hasContracts}
        onWalletRefresh={onWalletRefresh}
        syncStatus={syncStatus}
        cancel={handleContractCancellation}
        contractsRefresh={contractsRefresh}
        contracts={contractsToShow}
        address={address}
        customRowRenderer={rowRenderer}
        noContractsMessage={'No available contracts to buy.'}
        tabs={tabs}
      />

      <PurchaseContractModal
        isActive={isModalActive}
        contract={contractToPurchase}
        save={() => {}}
        deploy={() => {}}
        close={handleCloseModal}
      />
    </View>
  );
}

export default withContractsState(Marketplace);
