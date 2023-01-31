import React, { useEffect, useState } from 'react';
import withCreateContractModalState from '../../../../store/hocs/withCreateContractModalState';
import { Modal, Body, CloseModal } from '../CreateContractModal.styles';
import { withRouter } from 'react-router-dom';

import { PurchaseFormModalPage } from './PurchaseFormModalPage';
import { PurchasePreviewModalPage } from './PurchasePreviewModalPage';

function PurchaseContractModal(props) {
  const {
    isActive,
    handlePurchase,
    close,
    contract,
    explorerUrl,
    lmrRate,
    history
  } = props;

  const [isPreview, setIsPreview] = useState(false);
  const [pool, setPool] = useState(null);

  useEffect(() => {
    props.getLocalIp({}).then(ip => {
      setInputs({
        ...inputs,
        address: `stratum+tcp://${ip}:${props.buyerPort}`
      });
    });
    props.getPoolAddress({}).then(pool => {
      setPool(pool);
    });
  }, [contract]);

  const toRfc2396 = formData => {
    const addressParts = formData.address
      .replace('stratum+tcp://', '')
      .split(':');
    const address = addressParts[0];
    const port = addressParts[1];
    // console.log(address, port);
    // const regex = /(^.*):\/\/(.*$)/;
    // const poolAddressGroups = address?.match(regex);
    // if (!poolAddressGroups) return;
    // const protocol = poolAddressGroups[1];
    // const host = poolAddressGroups[2];
    // console.log(poolAddressGroups);
    return `stratum+tcp://${formData.username}:${formData.password}@${address}:${port}`;
  };

  const handleClose = e => {
    setInputs({
      address: '',
      username: '',
      password: ''
    });
    setIsPreview(false);
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  const onEditPool = () => {
    history.push('/tools');
  };

  const [inputs, setInputs] = useState({
    address: '',
    username: '',
    password: ''
  });

  if (!isActive) {
    return <></>;
  }

  const pagesProps = {
    explorerUrl,
    onEditPool,
    inputs,
    pool,
    contract,
    rate: lmrRate
  };

  return (
    <Modal onClick={handleClose}>
      <Body onClick={handlePropagation}>
        {CloseModal(handleClose)}
        {isPreview ? (
          <PurchasePreviewModalPage
            {...pagesProps}
            onBackToForm={() => setIsPreview(false)}
            onPurchase={() => {
              handlePurchase(inputs, contract, toRfc2396(inputs));
            }}
          />
        ) : (
          <PurchaseFormModalPage
            {...pagesProps}
            close={close}
            setInputs={setInputs}
            onFinished={() => setIsPreview(true)}
          />
        )}
      </Body>
    </Modal>
  );
}

export default withRouter(withCreateContractModalState(PurchaseContractModal));
