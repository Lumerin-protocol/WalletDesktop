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

const Container = styled.div`
  padding: 3rem 0 0 0;
  margin-left: 2rem;
  height: 80vh;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
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
`;

const WalletInfo = styled.h4`
  color: ${p => p.theme.colors.dark};
`;

const Tools = props => {
  const {
    getProxyRouterSettings,
    saveProxyRouterSettings,
    restartProxyRouter
  } = props;

  const RenderForm = goToReview => {
    const defState = {
      activeModal: null,
      testSocket: '',
      toast: {
        Show: false,
        Message: null,
        Type: 'info'
      }
    };

    const [state, setState] = useState(defState);
    const [isRestarting, restartNode] = useState(false);
    const [proxyRouterSettings, setProxyRouterSettings] = useState({
      proxyRouterEditMode: false,
      isFetching: true
    });
    const context = useContext(ToastsContext);

    useEffect(() => {
      getProxyRouterSettings()
        .then(data => {
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

    const proxyRouterSaveClick = () => {
      setProxyRouterSettings({
        ...proxyRouterSettings,
        proxyRouterEditMode: false,
        isFetching: true
      });
      saveProxyRouterSettings({
        sellerDefaultPool: proxyRouterSettings.sellerDefaultPool,
        buyerDefaultPool: proxyRouterSettings.buyerDefaultPool
      })
        .then(() => {
          restartProxyRouter({}).catch(err => {
            context.toast('error', 'Failed to restart proxy-router');
          });
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

    const onRestartClick = async () => {
      restartNode(true);

      let conf = {
        headers: {
          'content-type': 'application/json',
          accept: 'application/json'
        }
      };

      const restartHost =
        process.env.LUMERIN_RESTART_HOST || 'http://localhost';
      const restartPort = process.env.LUMERIN_RESTART_PORT || '8081';

      await axios
        .post(
          `${restartHost}:${restartPort}/signal`,
          {
            type: 'restart'
          },
          conf
        )
        .then(response => {
          if (process.env.DEBUG) {
            console.log(`received ${response} after restart`);
          }
          context.toast('success', response.data.message);
        })
        .catch(error => {
          context.toast('error', error.message);
        });

      // for UX
      setTimeout(() => {
        restartNode(false);
      }, 800);
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
            <Subtitle>Proxy-Router configuration</Subtitle>
            {proxyRouterSettings.isFetching ? (
              <Spinner />
            ) : !proxyRouterSettings.proxyRouterEditMode ? (
              <>
                <StyledParagraph>
                  Seller default pool: "{proxyRouterSettings.sellerDefaultPool}"
                </StyledParagraph>
                <StyledParagraph>
                  Buyer default pool: "{proxyRouterSettings.buyerDefaultPool}"
                </StyledParagraph>
                <StyledBtn onClick={proxyRouterEditClick}>Edit</StyledBtn>
              </>
            ) : (
              <>
                <StyledParagraph>
                  Seller default pool:{' '}
                  <TextInput
                    onChange={e =>
                      setProxyRouterSettings({
                        ...proxyRouterSettings,
                        sellerDefaultPool: e.value
                      })
                    }
                    value={proxyRouterSettings.sellerDefaultPool}
                    rows={1}
                  />
                </StyledParagraph>
                <StyledParagraph>
                  Buyer default pool:{' '}
                  <TextInput
                    onChange={e =>
                      setProxyRouterSettings({
                        ...proxyRouterSettings,
                        buyerDefaultPool: e.value
                      })
                    }
                    value={proxyRouterSettings.buyerDefaultPool}
                    rows={1}
                  />
                </StyledParagraph>
                <StyledBtn onClick={proxyRouterSaveClick}>Save</StyledBtn>
              </>
            )}

            <ConfirmModal
              onRequestClose={onCloseModal}
              onConfirm={props.onRescanTransactions}
              isOpen={state.activeModal === 'confirm-rescan'}
            />
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
          {/* TODO: intent: Connecct lumerin node in future */}
          {/* <Sp mt={5}>
            <hr />
            <Subtitle>Restart Lumerin Node</Subtitle>
            <StyledParagraph>
              Restart the connected Lumerin Node.
            </StyledParagraph>

            <br />
            <StyledBtn onClick={() => onRestartClick()} disabled={isRestarting}>
              Restart Node
            </StyledBtn>
            <Spinner show={isRestarting} />
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
