import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import withContractsState from '../../store/hocs/withContractsState';
import { LayoutHeader } from '../common/LayoutHeader';
import { View } from '../common/View';
import { ToastsContext } from '../toasts';
import ContractsList from './contracts-list/ContractsList';
import { ContractsRowContainer } from './contracts-list/ContractsRow.styles';
import MarketplaceRow from './contracts-list/MarketplaceRow';
import PurchaseContractModal from './modals/PurchaseModal/PurchaseContractModal';

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
  allowSendTransaction,
  ...props
}) {
  const [isModalActive, setIsModalActive] = useState(false);
  const [contractToPurchase, setContractToPurchase] = useState(undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const context = useContext(ToastsContext);
  const contractsToShow = contracts.filter(
    x => (Number(x.state) === 0 && x.seller !== address) || x.inProgress
  );

  const handlePurchase = async (data, contract, url) => {
    if (lmrBalance * 10 ** 8 < Number(contract.price * 1.01)) {
      setIsModalActive(false);
      context.toast('error', 'Insufficient balance');
      return;
    }
    await client.store.dispatch({
      type: 'purchase-temp-contract',
      payload: {
        id: contract.id,
        address
      }
    });
    await client.lockSendTransaction();
    await client
      .purchaseContract({
        ...data,
        contractId: contract.id,
        speed: contract.speed,
        price: contract.price,
        length: contract.length,
        url
      })
      .then(d => {
        setShowSuccess(true);
        context.toast(
          'success',
          'Contract is successfully submitted to purchase'
        );
        client.store.dispatch({
          type: 'purchase-contract-success',
          payload: { id: contract.id }
        });
      })
      .catch(e => {
        client.store.dispatch({
          type: 'purchase-contract-failed',
          payload: { id: contract.id }
        });
        context.toast('error', `Failed to purchase with error: ${e.message}`);
        setIsModalActive(false);
      })
      .finally(() => {
        client.unlockSendTransaction();
      });
  };

  const handleCloseModal = e => {
    setShowSuccess(false);
    setIsModalActive(false);
  };

  useEffect(() => {
    props.getLocalIp({}).then(props.setIp);
    props.getPoolAddress({}).then(props.setDefaultBuyerPool);
  }, []);

  const tabs = [
    { value: 'contract', name: 'Contract', ratio: 2 },
    { value: 'price', name: 'Price', ratio: 1 },
    { value: 'length', name: 'Duration', ratio: 1 },
    { value: 'speed', name: 'Speed', ratio: 1 },
    { value: 'action', name: 'Actions', ratio: 2 }
  ];

  const handleContractCancellation = (e, data) => {
    e.preventDefault();

    client.cancelContract({
      contractId: data.contractId,
      walletAddress: data.walletAddress,
      closeOutType: data.closeOutType
    });
  };

  const rowRenderer = (contractsList, ratio) => ({ key, index, style }) => (
    <ContractsRowContainer style={style} key={`${key}-${index}`}>
      <MarketplaceRow
        data-testid="Marketplace-row"
        onPurchase={data => {
          setContractToPurchase(data);
          setIsModalActive(true);
        }}
        contract={contractsList[index]}
        address={address}
        ratio={ratio}
        allowSendTransaction={allowSendTransaction}
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
        handlePurchase={handlePurchase}
        close={handleCloseModal}
        showSuccess={showSuccess}
      />
    </View>
  );
}

export default withRouter(withContractsState(Marketplace));
