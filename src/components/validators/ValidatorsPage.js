//@ts-check
import React, { useContext, useEffect, useState } from 'react';
import { LayoutHeader } from '../common/LayoutHeader';
import { View } from '../common/View';
import withValidatorsState from '../../store/hocs/withValidatorsState';
import Spinner from '../common/Spinner';
import {
  InputGroup,
  Row,
  Input,
  RightBtn,
  ErrorLabel
} from '../contracts/modals/CreateContractModal.styles';
import {
  fromLMRToTokenBaseUnits,
  fromTokenBaseUnitsToLMR
} from '../../utils/coinValue';
import { ToastsContext } from '../toasts';
import { Container, DefinitionList, Note } from './ValidatorPage.styles';
import { isHostPortValid, docUrl } from './utils';

const ValidatorsPage = ({
  isProxyPortPublic,
  registerValidator,
  deregisterValidator,
  getValidator,
  getValidatorsMinimalStake,
  getValidatorsRegisterStake,
  address
}) => {
  const [host, setHost] = useState('');
  const [stakeString, setStakeString] = useState('');
  const [registerStake, setRegisterStake] = useState(0);
  const [isLoading, setLoading] = useState(false);
  /** @type {[import('./Validator').Validator, any] } */
  const [validator, setValidator] = useState(null);
  const context = useContext(ToastsContext);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [minimalStake, setMinimalStake] = useState(0);

  const refreshValidator = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  useEffect(() => {
    const fetchValidator = async () => {
      const validator = await getValidator({ address }).catch(err => {
        context.toast('error', 'Failed to get validator');
        console.error('Failed to get validator', err);
      });
      if (validator === undefined) {
        return;
      }
      setValidator(validator);

      if (validator === null) {
        const registerStake = await getValidatorsRegisterStake().catch(err => {
          context.toast('error', 'Failed to get register stake');
          console.error('Failed to get register stake', err);
        });
        if (registerStake === undefined) {
          return;
        }
        setRegisterStake(registerStake);
        setStakeString(fromTokenBaseUnitsToLMR(registerStake).toString());
      } else {
        const minimalStake = await getValidatorsMinimalStake().catch(err => {
          context.toast('error', 'Failed to get minimal stake');
          console.error('Failed to get minimal stake', err);
        });
        if (minimalStake === undefined) {
          return;
        }
        setMinimalStake(Number(minimalStake));
      }
    };

    setLoading(true);
    fetchValidator().then(() => setLoading(false));
  }, [refreshTrigger]);

  const onRegister = async () => {
    if (isHostError || isStakeError) {
      return;
    }

    setLoading(true);
    const [ip, port] = host.split(':');
    try {
      await isProxyPortPublic({
        ip,
        port: Number(port)
      });
    } catch (e) {
      context.toast('error', 'Failed to check port availability');
      setLoading(false);
      setHost('');
      return;
    }

    try {
      await registerValidator({
        host,
        stake: fromLMRToTokenBaseUnits(stakeString)
      });
      context.toast('success', 'Validator registered successfully');
      refreshValidator();
    } catch (e) {
      context.toast('error', 'Failed to register validator: ' + e.message);
      console.error('Failed to register validator', e);
    } finally {
      setLoading(false);
    }
  };

  const onDeregister = async () => {
    try {
      await deregisterValidator({ address });
      context.toast('success', 'Validator deregistered successfully');
      refreshValidator();
    } catch (e) {
      context.toast('error', 'Failed to deregister validator: ' + e.message);
      console.error('Failed to deregister validator', e);
    } finally {
      setLoading(false);
    }
  };

  const isStakeError = isLoading
    ? false
    : fromLMRToTokenBaseUnits(stakeString) < registerStake;
  const isHostError = isLoading ? false : !isHostPortValid(host);

  return (
    <View data-testid="validators-container">
      <LayoutHeader title="Validator Hub" />
      <Note>
        <p>
          Welcome to the validator registration portal. Here you can register
          your wallet as a validator node on the network.{' '}
        </p>
        <p>
          While this page handles the blockchain registration process, you'll
          need to set up your validator node separately following our{' '}
          <a href={docUrl}>Technical Guide</a>.
        </p>
      </Note>

      <Container>
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
            }}
          >
            <Spinner size="25px" />
          </div>
        )}
        {!isLoading && !validator && (
          <>
            <div>
              <h3>Register as Validator</h3>

              <h5>
                Note: Please ensure that all details are correct. If the
                validator does not accept incoming connections after
                registration, a punishment fee will be charged.
              </h5>

              <p style={{ marginTop: 10 }}>Validator Host</p>
              <Row key="addressRow">
                <InputGroup key="addressGroup" style={{ margin: 0 }}>
                  <Input
                    onChange={e => setHost(e.target.value)}
                    value={host}
                    placeholder={'HOST_IP:PORT'}
                    type="text"
                    name="address"
                    key="address"
                    id="address"
                  />
                  {isHostError && (
                    <ErrorLabel>
                      Host must be in the format HOST:PORT or IP:PORT
                    </ErrorLabel>
                  )}
                </InputGroup>
              </Row>

              <p style={{ marginTop: 10 }}>Stake</p>
              <Row key="stakeRow">
                <InputGroup key="stakeGroup" style={{ margin: 0 }}>
                  <Input
                    value={stakeString}
                    onChange={e => setStakeString(e.target.value)}
                    type="number"
                    name="stake"
                    key="stake"
                    id="stake"
                  />
                  {isStakeError && (
                    <ErrorLabel>
                      Stake must be greater than{' '}
                      {fromTokenBaseUnitsToLMR(registerStake)} LMR
                    </ErrorLabel>
                  )}
                </InputGroup>
              </Row>
            </div>

            <div style={{ marginTop: 40 }}>
              <RightBtn
                onClick={() => onRegister()}
                disabled={isHostError || isStakeError}
              >
                Register
              </RightBtn>
            </div>
          </>
        )}

        {!isLoading && validator && (
          <div>
            <h3>You are registered as a validator</h3>
            <DefinitionList>
              <dt>Host:</dt>
              <dd>{validator.host}</dd>

              <dt>Stake:</dt>
              <dd>{fromTokenBaseUnitsToLMR(validator.stake)} LMR</dd>

              <dt>Complains:</dt>
              <dd>{validator.complains}</dd>

              <dt>Last Complainer:</dt>
              <dd>{validator.lastComplainer}</dd>
            </DefinitionList>

            {Number(validator.stake) < minimalStake && (
              <p>
                Your validator is not active because your stake is below
                minimal. Please increase your stake to{' '}
                {fromTokenBaseUnitsToLMR(minimalStake)} LMR
              </p>
            )}
            <div style={{ display: 'flex', gap: '1em' }}>
              <RightBtn
                onClick={() => {}}
                disabled={isHostError || isStakeError}
              >
                Update validator
              </RightBtn>
              <RightBtn onClick={() => onDeregister()}>Deregister</RightBtn>
            </div>
          </div>
        )}
      </Container>
    </View>
  );
};

export default withValidatorsState(ValidatorsPage);
