import React, { useEffect, useState } from 'react';
import withCreateContractModalState from '../../../../store/hocs/withCreateContractModalState';
import { withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { PurchaseFormModalPage } from './PurchaseFormModalPage';
import { PurchasePreviewModalPage } from './PurchasePreviewModalPage';
import { toRfc2396 } from '../../../../utils';
import { PurchaseSuccessPage } from './PurchaseSuccessPage';
import Modal from '../Modal';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

function PurchaseContractModal(props) {
  const {
    isActive,
    handlePurchase,
    close,
    contract,
    explorerUrl,
    portCheckErrorLink,
    lmrRate,
    history,
    pool,
    showSuccess,
    symbol,
    marketplaceFee,
    isProxyPortPublic,
    getValidators
  } = props;

  const [isPreview, setIsPreview] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [validators, setValidators] = useState([]);

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    getValues,
    reset,
    trigger,
    watch
  } = useForm({
    mode: 'onChange'
  });

  useState(() => {
    getValidators().then(setValidators);
  }, []);

  useEffect(() => {
    setValue('address', `${props.ip}:${props.buyerPort}`);
    trigger('address');

    setValue('worker', contract?.id);
    trigger('worker');

    const poolParts = pool
      ? pool.replace('stratum+tcp://', '').split(':@')
      : [];

    const poolAddress = decodeURIComponent(poolParts[1] || '');
    setValue('pool', poolAddress);
    trigger('pool');

    const username = decodeURIComponent(poolParts[0] || '');
    setValue('username', username);
    trigger('username');
  }, [contract, isActive]);

  const handleClose = e => {
    reset();
    setIsPreview(false);
    close(e);
  };

  const wrapHandlePurchase = async validatorHost => {
    setIsPurchasing(true);
    const inputs = getValues();

    // TODO: move this to parent component
    const validatorMap = validators.reduce((acc, validator) => {
      acc[validator.addr] = validator;
      return acc;
    }, {});

    if (inputs.usePublicValidator) {
      // using third party validator
      const validator = validatorMap[inputs.publicValidator];
      if (!validator) {
        throw new Error('Validator not found');
      }
      console.log('validator', validator);

      await handlePurchase({
        validatorUrl: toRfc2396(validator.host),
        destUrl: toRfc2396(inputs.pool, inputs.username),
        validatorAddr: inputs.publicValidator,
        validatorPubKeyYparity: validator.pubKeyYParity,
        validatorPubKeyX: validator.pubKeyX,
        contractAddr: contract.id,
        price: contract.price,
        version: contract.version
      });
    } else {
      // using local validator
      await handlePurchase({
        validatorUrl: toRfc2396(inputs.address, inputs.worker),
        destUrl: toRfc2396(inputs.pool, inputs.username),
        validatorAddr: ZERO_ADDRESS,
        validatorPubKeyYparity: false,
        validatorPubKeyX: '0x' + '0'.repeat(64), // 32 bytes of zeros
        contractAddr: contract.id,
        price: contract.price,
        version: contract.version
      });
    }

    setIsPurchasing(false);
  };

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
    rate: lmrRate,
    marketplaceFee,
    history,
    validators
  };

  return (
    <Modal onClose={handleClose}>
      {showSuccess ? (
        <PurchaseSuccessPage
          close={handleClose}
          contractId={contract.id}
          price={contract.price}
          symbol={symbol}
        />
      ) : isPreview ? (
        <PurchasePreviewModalPage
          {...pagesProps}
          isPurchasing={isPurchasing}
          onBackToForm={() => setIsPreview(false)}
          onPurchase={wrapHandlePurchase}
          symbol={symbol}
          isProxyPortPublic={isProxyPortPublic}
          portCheckErrorLink={portCheckErrorLink}
        />
      ) : (
        <PurchaseFormModalPage
          {...pagesProps}
          close={close}
          register={register}
          handleSubmit={handleSubmit}
          formState={formState}
          onFinished={() => setIsPreview(true)}
          symbol={symbol}
          watch={watch}
        />
      )}
    </Modal>
  );
}

export default withRouter(withCreateContractModalState(PurchaseContractModal));
