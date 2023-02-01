import React, { useEffect, useState } from 'react';
import withCreateContractModalState from '../../../../store/hocs/withCreateContractModalState';
import { Modal, Body, CloseModal } from '../CreateContractModal.styles';
import { withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    getValues,
    reset,
    trigger
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {
    props.getLocalIp({}).then(ip => {
      setValue('address', `stratum+tcp://${ip}:${props.buyerPort}`);
      trigger('address');
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
    return `stratum+tcp://${formData.username}:${formData.password}@${address}:${port}`;
  };

  const handleClose = e => {
    reset();
    setIsPreview(false);
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  const onEditPool = () => {
    history.push('/tools');
  };

  if (!isActive) {
    return <></>;
  }

  const pagesProps = {
    explorerUrl,
    onEditPool,
    inputs: getValues(),
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
              const inputs = getValues();
              handlePurchase(inputs, contract, toRfc2396(inputs));
            }}
          />
        ) : (
          <PurchaseFormModalPage
            {...pagesProps}
            close={close}
            register={register}
            handleSubmit={handleSubmit}
            formState={formState}
            onFinished={() => setIsPreview(true)}
          />
        )}
      </Body>
    </Modal>
  );
}

export default withRouter(withCreateContractModalState(PurchaseContractModal));
