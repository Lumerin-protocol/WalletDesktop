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
    history,
    pool
  } = props;

  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    getValues,
    reset,
    trigger
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    setValue('address', `stratum+tcp://${props.ip}:${props.buyerPort}`);
    trigger('address');

    setValue('worker', contract?.id);
    trigger('worker');
  }, [contract]);

  useEffect(() => {
    setValue('address', `stratum+tcp://${props.ip}:${props.buyerPort}`);
    trigger('address');
  }, [isActive]);

  const toRfc2396 = formData => {
    const addressParts = formData.address
      .replace('stratum+tcp://', '')
      .split(':');
    const address = addressParts[0];
    const port = addressParts[1];
    const password = '';
    // This worker name and password won't be forwarded from the seller to the buyer.
    // Set url with {username}:{password} to preserve backward compatibility
    // This also should maintain consistency of data between UI/Blockchain/Proxy Router
    return `stratum+tcp://${formData.worker}:${password}@${address}:${port}`;
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
