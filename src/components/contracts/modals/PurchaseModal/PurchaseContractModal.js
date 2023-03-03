import React, { useEffect, useState } from 'react';
import withCreateContractModalState from '../../../../store/hocs/withCreateContractModalState';
import { Modal, Body, CloseModal } from '../CreateContractModal.styles';
import { withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { PurchaseFormModalPage } from './PurchaseFormModalPage';
import { PurchasePreviewModalPage } from './PurchasePreviewModalPage';
import { toRfc2396 } from '../../../../utils';

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
              handlePurchase(
                inputs,
                contract,
                toRfc2396(inputs.address, inputs.worker)
              );
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
