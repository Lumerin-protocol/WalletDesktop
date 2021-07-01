import PropTypes from 'prop-types'
import styled from 'styled-components'
import React from 'react'

import { AltLayout, Btn, Sp } from '../common'
import SecondaryBtn from './SecondaryBtn'
import Message from './Message'

const Mnemonic = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 2;
  text-align: center;
  color: ${p => p.theme.colors.primary};
  word-spacing: 1.6rem;
`

export default class CopyMnemonicStep extends React.Component {
  static propTypes = {
    onUseUserMnemonicToggled: PropTypes.func.isRequired,
    onMnemonicCopiedToggled: PropTypes.func.isRequired,
    mnemonic: PropTypes.string
  }

  render() {
    return (
      <AltLayout title="Recovery Passphrase" data-testid="onboarding-container">
        <Message>
          Copy the following word list and keep it in a safe place. You will
          need these to recover your wallet in the future —don’t lose it.
        </Message>
        <Sp mt={3} mx={-8}>
          <Mnemonic data-testid="mnemonic-label">
            {this.props.mnemonic}
          </Mnemonic>
        </Sp>
        <Sp mt={5}>
          <Btn
            data-testid="copied-mnemonic-btn"
            autoFocus
            onClick={this.props.onMnemonicCopiedToggled}
            block
            key="confirmMnemonic"
          >
            I’ve copied it
          </Btn>
        </Sp>
        <Sp mt={2}>
          <SecondaryBtn
            data-testid="recover-btn"
            onClick={this.props.onUseUserMnemonicToggled}
            block
          >
            Or recover a wallet from a saved passphrase
          </SecondaryBtn>
        </Sp>
      </AltLayout>
    )
  }
}
