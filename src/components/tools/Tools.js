import { withRouter, NavLink } from 'react-router-dom';
import withToolsState from '../../store/hocs/withToolsState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import ConfirmModal from './ConfirmModal';
import TestModal from './TestModal';
import WalletStatus from './WalletStatus';
import { ConfirmationWizard, TextInput, Flex, BaseBtn, Sp } from '../common';
import Spinner from '../common/Spinner';
import { View } from '../common/View';
import { ToastsContext } from '../../components/toasts';
import ConfirmProxyConfigModal from './ConfirmProxyConfigModal';
import RevealSecretPhraseModal from './RevealSecretPhraseModal';
import { Message } from './ConfirmModal.styles';
import ExportPrivateKeyModal from './ExportPrivateKeyModal';
import { generatePoolUrl } from '../../utils';

const Container = styled.div`
  margin-left: 2rem;
  height: 85vh;
  overflow-y: scroll;
`;

const TitleContainer = styled.div`
  display: flex;
  padding: 1.8rem 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  width: 100%;
  z-index: 2;
  right: 0;
  left: 0;
  top: 0;
`;

const Title = styled.label`
  font-size: 2.4rem;
  line-height: 3rem;
  white-space: nowrap;
  margin: 0;
  font-weight: 600;
  color: ${p => p.theme.colors.dark};
  margin-bottom: 4.8px;
  margin-right: 2.4rem;
  cursor: default;

  @media (min-width: 1140px) {
    margin-right: 0.8rem;
  }

  @media (min-width: 1200px) {
    margin-right: 1.6rem;
  }
`;

const Confirmation = styled.div`
  color: ${p => p.theme.colors.danger};
  background-color: ${p => p.theme.colors.medium};
  border-radius: 4px;
  padding: 0.8rem 1.6rem;
`;

const ValidationMsg = styled.div`
  font-size: 1.4rem;
  margin-left: 1.6rem;
  opacity: 0.75;
`;

const StyledBtn = styled(BaseBtn)`
  width: 40%;
  height: 40px;
  font-size: 1.5rem;
  border-radius: 5px;
  padding: 0 0.6rem;
  background-color: ${p => p.theme.colors.primary};
  color: ${p => p.theme.colors.light};

  @media (min-width: 1040px) {
    width: 35%;
    height: 40px;
    margin-left: 0;
    margin-top: 1.6rem;
  }
`;

const Subtitle = styled.h3`
  color: ${p => p.theme.colors.dark};
`;

const StyledParagraph = styled.p`
  color: ${p => p.theme.colors.dark};

  span {
    font-weight: bold;
  }
`;

const WalletInfo = styled.h4`
  color: ${p => p.theme.colors.dark};
`;

export const Input = styled(TextInput)`
  outline: 0;
  border: 0px;
  background: #eaf7fc;
  border-radius: 15px;
  padding: 1.2rem 1.2rem;
  margin-top: 0.25rem;
`;

const getPoolAndAccount = url => {
  if (!url) return {};
  const addressParts = url.replace('stratum+tcp://', '').split(':');
  return {
    account: decodeURIComponent(addressParts[0]),
    pool: `${addressParts[1].slice(1)}:${addressParts[2]}`
  };
};

const Select = styled.select`
  width: 35%;
  height: 40px;
  outline: 0;
  border: 0px;
  background: #eaf7fc;
  border-radius: 15px;
  padding: 1.2rem 1.2rem;
  margin-top: 0.25rem;
`;

const Tools = props => {
  const {
    getProxyRouterSettings,
    saveProxyRouterSettings,
    restartProxyRouter,
    setDefaultCurrency,
    selectedCurrency
  } = props;

  const RenderForm = goToReview => {
    const defState = {
      activeModal: null,
      testSocket: '',
      toast: {
        Show: false,
        Message: null,
        Type: 'info'
      },
      selectedCurrency: selectedCurrency
    };

    const [state, setState] = useState(defState);
    const [isRestarting, restartNode] = useState(false);
    const [proxyRouterSettings, setProxyRouterSettings] = useState({
      proxyRouterEditMode: false,
      isFetching: true
    });
    const [sellerPoolParts, setSellerPoolParts] = useState(null);
    const [buyerPoolParts, setBuyerPoolParts] = useState(null);

    const context = useContext(ToastsContext);

    const logPath = (() => {
      if (window.navigator.userAgent.indexOf('Win') !== -1)
        return '%USERPROFILE%\\AppData\\Roaming\\lumerin-wallet-desktop\\logs\\main.log';
      if (window.navigator.userAgent.indexOf('Mac') !== -1)
        return '~/Library/Logs/lumerin-wallet-desktop/main.log';
      return '~/.config/lumerin-wallet-desktop/logs/main.log';
    })();

    useEffect(() => {
      getProxyRouterSettings()
        .then(data => {
          setSellerPoolParts(getPoolAndAccount(data.sellerDefaultPool));
          setBuyerPoolParts(getPoolAndAccount(data.buyerDefaultPool));

          setProxyRouterSettings({
            ...data,
            isFetching: false
          });
        })
        .catch(err => {
          context.toast('error', 'Failed to fetch proxy-router settings');
        });
    }, []);

    const onCloseModal = () => {
      setState({ ...state, activeModal: null });
    };

    const onActiveModalClick = modal => {
      setState({ ...state, activeModal: modal });
    };

    const proxyRouterEditClick = () => {
      setProxyRouterSettings({
        ...proxyRouterSettings,
        proxyRouterEditMode: true
      });
    };

    const saveProxyRouterConfig = () => {
      onCloseModal();
      setProxyRouterSettings({
        ...proxyRouterSettings,
        proxyRouterEditMode: false,
        isFetching: true
      });
      return saveProxyRouterSettings({
        sellerDefaultPool: proxyRouterSettings.sellerDefaultPool,
        buyerDefaultPool: proxyRouterSettings.buyerDefaultPool
      })
        .catch(() => {
          context.toast('error', 'Failed to save proxy-router settings');
        })
        .finally(() => {
          setProxyRouterSettings({
            ...proxyRouterSettings,
            isFetching: false,
            proxyRouterEditMode: false
          });
        });
    };

    const confirmProxyRouterRestart = () => {
      saveProxyRouterConfig().then(() => {
        restartProxyRouter({}).catch(err => {
          context.toast('error', 'Failed to restart proxy-router');
        });
      });
    };

    const onRestartClick = async () => {
      onCloseModal();
      restartNode(true);

      await restartProxyRouter({}).catch(() => {
        context.toast('error', 'Failed to restart proxy-router');
      });

      // for UX
      setTimeout(() => {
        restartNode(false);
      }, 6000);
    };

    const { onInputChange, mnemonic, errors } = props;
    const { testSocket } = state;

    return (
      <Container>
        <Sp mt={-4}>
          {/* <Subtitle>Recover a Wallet</Subtitle>
          <form data-testid="recover-form" onSubmit={goToReview}>
            <StyledParagraph>
              Enter a valid twelve-word recovery phrase to recover another
              wallet.
            </StyledParagraph>
            <StyledParagraph>
              This action will replace your current stored seed!
            </StyledParagraph>
            <TextInput
              data-testid="mnemonic-field"
              autoFocus
              onChange={onInputChange}
              label="Recovery phrase"
              error={errors.mnemonic}
              value={mnemonic || ''}
              rows={2}
              id="mnemonic"
            />
            <Sp mt={4}>
              <Flex.Row align="center">
                <StyledBtn disabled={!props.isRecoverEnabled} submit>
                  Recover
                </StyledBtn>
                {!props.isRecoverEnabled && (
                  <ValidationMsg>
                    A recovery phrase must have exactly 12 words
                  </ValidationMsg>
                )}
              </Flex.Row>
            </Sp>
          </form> */}
          <Sp mt={5}>
            <Subtitle>Seller Default Currency</Subtitle>
            <StyledParagraph>
              This will set default currency to display prices and balances on
              Seller Hub.
              <div style={{ marginTop: '1rem' }}>
                <Select
                  onChange={e =>
                    setState({ ...state, selectedCurrency: e.target.value })
                  }
                >
                  <option
                    selected={state.selectedCurrency === 'BTC'}
                    key={'BTC'}
                    value={'BTC'}
                  >
                    BTC
                  </option>
                  <option
                    selected={state.selectedCurrency === 'LMR'}
                    key={'LMR'}
                    value={'LMR'}
                  >
                    LMR
                  </option>
                </Select>
              </div>
            </StyledParagraph>
            <StyledBtn
              disabled={state.selectedCurrency === selectedCurrency}
              onClick={() => setDefaultCurrency(state.selectedCurrency)}
            >
              Save
            </StyledBtn>
          </Sp>
          <Sp mt={5}>
            <Subtitle>Change Password</Subtitle>
            <StyledParagraph>
              This will allow you to change the password you use to access the
              wallet.
            </StyledParagraph>
            <NavLink data-testid="change-password-btn" to="/change-pass">
              <StyledBtn>Change Password</StyledBtn>
            </NavLink>
          </Sp>
          <Sp mt={5}>
            <Subtitle>Rescan Transactions List</Subtitle>
            <StyledParagraph>
              This will clear your local cache and rescan all your wallet
              transactions.
            </StyledParagraph>
            <StyledBtn onClick={() => onActiveModalClick('confirm-rescan')}>
              Rescan Transactions
            </StyledBtn>
            <ConfirmModal
              onRequestClose={onCloseModal}
              onConfirm={props.onRescanTransactions}
              isOpen={state.activeModal === 'confirm-rescan'}
            />
          </Sp>
          <Sp mt={5}>
            <Subtitle>Proxy-Router Configuration</Subtitle>
            {proxyRouterSettings.isFetching ? (
              <Spinner />
            ) : !proxyRouterSettings.proxyRouterEditMode ? (
              <>
                <StyledParagraph>
                  <div>
                    <span>Proxy Default Pool:</span> {sellerPoolParts?.pool}{' '}
                  </div>
                  <div>
                    <span>Proxy Default Account:</span>{' '}
                    {sellerPoolParts?.account}{' '}
                  </div>
                </StyledParagraph>
                {/* <StyledParagraph>
                  <div>
                    <span>Buyer Default Pool:</span> {buyerPoolParts?.pool}{' '}
                  </div>
                  <div>
                    <span>Buyer Default Account:</span>{' '}
                    {buyerPoolParts?.account}{' '}
                  </div>
                </StyledParagraph> */}
                <StyledBtn onClick={proxyRouterEditClick}>Edit</StyledBtn>
              </>
            ) : (
              <>
                <StyledParagraph>
                  Proxy Default Pool:{' '}
                  <Input
                    onChange={e =>
                      setSellerPoolParts({
                        ...sellerPoolParts,
                        pool: e.value
                      })
                    }
                    value={sellerPoolParts?.pool}
                  />
                </StyledParagraph>
                <StyledParagraph>
                  Proxy Default Account:{' '}
                  <Input
                    onChange={e =>
                      setSellerPoolParts({
                        ...sellerPoolParts,
                        account: e.value
                      })
                    }
                    value={sellerPoolParts?.account}
                  />
                </StyledParagraph>
                <hr></hr>
                {/* <StyledParagraph>
                  Buyer Default Pool:{' '}
                  <Input
                    onChange={e =>
                      setBuyerPoolParts({
                        ...buyerPoolParts,
                        pool: e.value
                      })
                    }
                    value={buyerPoolParts?.pool}
                  />
                </StyledParagraph>
                <StyledParagraph>
                  Buyer Default Account:{' '}
                  <Input
                    onChange={e =>
                      setBuyerPoolParts({
                        ...buyerPoolParts,
                        account: e.value
                      })
                    }
                    value={buyerPoolParts?.account}
                  />
                </StyledParagraph> */}
                <StyledBtn
                  onClick={() => {
                    setProxyRouterSettings({
                      ...proxyRouterSettings,
                      sellerDefaultPool: generatePoolUrl(
                        sellerPoolParts.account,
                        sellerPoolParts.pool
                      )
                      // buyerDefaultPool: generatePoolUrl(
                      //   buyerPoolParts.account,
                      //   buyerPoolParts.pool
                      // )
                    });
                    onActiveModalClick('confirm-proxy-restart');
                  }}
                >
                  Save
                </StyledBtn>
              </>
            )}

            <ConfirmModal
              onRequestClose={onCloseModal}
              onConfirm={props.onRescanTransactions}
              isOpen={state.activeModal === 'confirm-rescan'}
            />
            <ConfirmProxyConfigModal
              onRequestClose={onCloseModal}
              onConfirm={confirmProxyRouterRestart}
              onLater={saveProxyRouterConfig}
              isOpen={state.activeModal === 'confirm-proxy-restart'}
            />
          </Sp>
          <Sp mt={5}>
            <Subtitle>Restart Proxy Router</Subtitle>
            <StyledParagraph>
              Restart the connected Proxy Router.
            </StyledParagraph>
            {isRestarting ? (
              <Spinner size="20px" />
            ) : (
              <StyledBtn
                onClick={() =>
                  onActiveModalClick('confirm-proxy-direct-restart')
                }
              >
                Restart
              </StyledBtn>
            )}
            <ConfirmProxyConfigModal
              onRequestClose={onCloseModal}
              onConfirm={onRestartClick}
              onLater={onCloseModal}
              isOpen={state.activeModal === 'confirm-proxy-direct-restart'}
            />
          </Sp>

          <Sp mt={5}>
            <Subtitle>Sensitive Info</Subtitle>
            {!props.hasStoredSecretPhrase && (
              <StyledParagraph>
                To enable this feature you need to re-login to your wallet
              </StyledParagraph>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <StyledBtn
                disabled={!props.hasStoredSecretPhrase}
                onClick={() => onActiveModalClick('reveal-secret-phrase')}
              >
                Reveal Secret Recovery Phrase
              </StyledBtn>
              <StyledBtn
                style={{ marginTop: '1.6rem' }}
                onClick={() => onActiveModalClick('export-private-key')}
              >
                Export private key
              </StyledBtn>
            </div>
            <ExportPrivateKeyModal
              onRequestClose={() => {
                props.discardPrivateKey();
                onCloseModal();
              }}
              onLater={onCloseModal}
              onExportPrivateKey={props.onExportPrivateKey}
              privateKey={props.privateKey}
              copyToClipboard={props.copyToClipboard}
              onRevealPhrase={props.onRevealPhrase}
              isOpen={state.activeModal === 'export-private-key'}
            />
            <RevealSecretPhraseModal
              onRequestClose={() => {
                props.discardMnemonic();
                onCloseModal();
              }}
              onLater={onCloseModal}
              onShowMnemonic={props.onShowMnemonic}
              mnemonic={props.mnemonic}
              copyToClipboard={props.copyToClipboard}
              onRevealPhrase={props.onRevealPhrase}
              isOpen={state.activeModal === 'reveal-secret-phrase'}
            />
          </Sp>

          <Sp mt={5}>
            <Subtitle>Reset</Subtitle>
            <StyledParagraph>Set up your wallet from scratch.</StyledParagraph>
            <StyledBtn onClick={() => onActiveModalClick('confirm-logout')}>
              Reset
            </StyledBtn>

            <ConfirmProxyConfigModal
              title={'Reset your wallet'}
              message={
                <>
                  <Message>
                    Make sure you have your recovery phrase before reseting your
                    wallet. If you don’t have your recovery phrase, we suggest
                    you transfer all funds out of your wallet before you reset.
                    Otherwise you will lock yourself out of your wallet, and you
                    won’t have access to the funds in this wallet.
                  </Message>
                  <Message>Continue?</Message>
                </>
              }
              onRequestClose={onCloseModal}
              onConfirm={props.logout}
              onLater={onCloseModal}
              isOpen={state.activeModal === 'confirm-logout'}
            />
          </Sp>

          <Sp mt={5}>
            <Subtitle>Logs</Subtitle>
            <StyledParagraph>
              You can find wallet logs in the file: <br />
              <i>{logPath}</i>
            </StyledParagraph>
          </Sp>

          {/* <Sp mt={5}>
            <hr />
            <Subtitle>Run End-to-End Test</Subtitle>
            <StyledParagraph>
              Before running test, make sure that all your Lumerin node is up
              and running locally.
            </StyledParagraph>

            <TextInput
              data-testid="test-field"
              onChange={e => setState({ ...state, testSocket: e.targeValue })}
              label={process.env.PROXY_ROUTER_URL || ''}
              error={errors.mnemonic}
              value={testSocket || ''}
              rows={2}
              id="testSocket"
            />
            <br />
            <StyledBtn onClick={() => onActiveModalClick('confirm-test')}>
              Run Test
            </StyledBtn>
            <TestModal
              onRequestClose={onCloseModal}
              onConfirm={props.onRunTest}
              isOpen={state.activeModal === 'confirm-test'}
            />
          </Sp> */}
          <Sp mt={5}>
            <WalletInfo>Wallet Information</WalletInfo>
            <WalletStatus />
          </Sp>
        </Sp>
      </Container>
    );
  };

  const onWizardSubmit = password =>
    props.onSubmit(password).then(() => props.history.push('/wallet'));

  const renderConfirmation = () => (
    <Confirmation data-testid="confirmation">
      <h3>Are you sure?</h3>
      <p>This operation will overwrite and restart the current wallet!</p>
    </Confirmation>
  );

  return (
    <View data-testid="tools-container">
      <TitleContainer>
        <Title>Tools</Title>
      </TitleContainer>
      <ConfirmationWizard
        renderConfirmation={renderConfirmation}
        confirmationTitle=""
        onWizardSubmit={onWizardSubmit}
        pendingTitle="Recovering..."
        successText="Wallet successfully recovered"
        RenderForm={RenderForm}
        validate={props.validate}
        noCancel
        styles={{
          confirmation: {
            padding: 0
          },
          btns: {
            background: 'none',
            marginTop: '3.2rem',
            maxWidth: '200px',
            padding: 0
          }
        }}
      />
    </View>
  );
};

Tools.propTypes = {
  onRescanTransactions: PropTypes.func.isRequired,
  onRunTest: PropTypes.func.isRequired,
  isRecoverEnabled: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mnemonic: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  errors: PropTypes.shape({
    mnemonic: PropTypes.string
  }).isRequired
};

export default withToolsState(withRouter(Tools));
