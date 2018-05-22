import { TextInput, FieldBtn, TxIcon, Flex, Sp } from './common'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'
import Web3 from 'web3'

export default class AmountFields extends React.Component {
  static propTypes = {
    availableETH: PropTypes.string.isRequired,
    ethAmount: PropTypes.string,
    usdAmount: PropTypes.string,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.shape({
      ethAmount: PropTypes.string,
      usdAmount: PropTypes.string
    }).isRequired
  }

  static SMALL_VALUE_PLACEHOLDER = '< 0.01'
  static INVALID_PLACEHOLDER = 'Invalid amount'

  static initialState = {
    ethAmount: null,
    usdAmount: null
  }

  static onInputChange = (state, ETHprice, id, value) => ({
    ...state,
    usdAmount:
      id === 'ethAmount'
        ? utils.toUSD(
            value,
            ETHprice,
            AmountFields.INVALID_PLACEHOLDER,
            AmountFields.SMALL_VALUE_PLACEHOLDER
          )
        : state.usdAmount,
    ethAmount:
      id === 'usdAmount'
        ? utils.toETH(value, ETHprice, AmountFields.INVALID_PLACEHOLDER)
        : state.ethAmount
  })

  onMaxClick = () => {
    const ethAmount = Web3.utils.fromWei(this.props.availableETH)
    this.props.onChange({ target: { id: 'ethAmount', value: ethAmount } })
  }

  render() {
    const { autoFocus, ethAmount, usdAmount, onChange, errors } = this.props

    return (
      <Flex.Row justify="space-between">
        <Flex.Item grow="1" basis="0">
          <FieldBtn
            data-testid="max-btn"
            tabIndex="-1"
            onClick={this.onMaxClick}
            float
          >
            MAX
          </FieldBtn>
          <TextInput
            data-testid="ethAmount-field"
            placeholder={
              ethAmount === AmountFields.INVALID_PLACEHOLDER
                ? AmountFields.INVALID_PLACEHOLDER
                : '0.00'
            }
            autoFocus={autoFocus}
            onChange={onChange}
            error={errors.ethAmount}
            label="Amount (ETH)"
            value={
              ethAmount === AmountFields.INVALID_PLACEHOLDER ? '' : ethAmount
            }
            id="ethAmount"
          />
        </Flex.Item>
        <Sp mt={6} mx={1}>
          <TxIcon />
        </Sp>
        <Flex.Item grow="1" basis="0">
          <TextInput
            data-testid="usdAmount-field"
            placeholder={
              usdAmount === AmountFields.INVALID_PLACEHOLDER
                ? AmountFields.INVALID_PLACEHOLDER
                : usdAmount === AmountFields.SMALL_VALUE_PLACEHOLDER
                  ? AmountFields.SMALL_VALUE_PLACEHOLDER
                  : '0.00'
            }
            onChange={onChange}
            error={errors.usdAmount}
            label="Amount (USD)"
            value={
              usdAmount === AmountFields.INVALID_PLACEHOLDER ||
              usdAmount === AmountFields.SMALL_VALUE_PLACEHOLDER
                ? ''
                : usdAmount
            }
            id="usdAmount"
          />
        </Flex.Item>
      </Flex.Row>
    )
  }
}
