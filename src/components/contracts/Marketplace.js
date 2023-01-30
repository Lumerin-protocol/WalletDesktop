import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import withContractsState from '../../store/hocs/withContractsState';
import { LayoutHeader } from '../common/LayoutHeader';
import ContractsList from './contracts-list/ContractsList';
import { View } from '../common/View';
import { ToastsContext } from '../toasts';
import PurchaseContractModal from './modals/PurchaseModal/PurchaseContractModal';
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
  history,
  lmrBalance,
  ...props
}) {
  const [isModalActive, setIsModalActive] = useState(false);
  const [contractToPurchase, setContractToPurchase] = useState(undefined);
  const context = useContext(ToastsContext);
  const contractsToShow = contracts.filter(
    x => (Number(x.state) === 0 && x.seller !== address) || x.inProgress
  );
  // const contractsToShow = [
  //   {
  //     id: '0xe5765F6b5C8E3a47ac1Eb54c1288D810c87804B8',
  //     price: '200000000',
  //     speed: '50000000000000',
  //     length: '43200',
  //     buyer: '0x4f4815a4Af42689A6B4dDA18f155730c9ca8aD2D',
  //     seller: '0x4f4815a4Af42689A6B4dDA18f155730c9ca8aD2D',
  //     timestamp: '1668210828',
  //     state: '0',
  //     encryptedPoolData: '',
  //     limit: '0',
  //     balance: '1200000000'
  //   }
  // ];
  // useEffect(() => {
  //   if (contractsToShow.length) {
  //     setContractToPurchase(contractsToShow[0]);
  //     setIsModalActive(true);
  //     console.log(contractsToShow);
  //   }
  // }, [contracts]);

  const handlePurchase = (data, contract, url) => {
    console.log(data, contract, url);
    if (lmrBalance * 10 ** 8 < Number(contract.price)) {
      setIsModalActive(false);
      context.toast('error', 'Insufficient balance');
      return;
    }

    client.store.dispatch({
      type: 'purchase-temp-contract',
      payload: {
        id: contract.id,
        address
      }
    });
    client
      .purchaseContract({
        ...data,
        contractId: contract.id,
        speed: contract.speed,
        price: contract.price,
        length: contract.length,
        url
      })
      .then(d => {
        onWalletRefresh();
        context.toast(
          'success',
          'Contract is successfully submitted to purchase'
        );
        history.push('/buyer-hub');
      })
      .catch(e => {
        client.store.dispatch({
          type: 'purchase-contract-failed',
          payload: { id: contract.id }
        });
        context.toast('error', `Failed to purchase with error: ${e.message}`);
      });
    setIsModalActive(false);
  };

  const handleCloseModal = e => {
    setIsModalActive(false);
  };

  useEffect(() => {
    contractsRefresh();
  }, []);

  const tabs = [
    { value: 'contract', name: 'Contract', ratio: 2 },
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

  const rowRenderer = (contractsList, ratio) => ({ key, index, style }) => {
    return (
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
  };

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
        handlePurchase={handlePurchase}
        close={handleCloseModal}
      />
    </View>
  );
}

export default withRouter(withContractsState(Marketplace));
