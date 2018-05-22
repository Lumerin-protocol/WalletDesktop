import { Simulate } from 'react-testing-library'
import * as testUtils from '../../testUtils'
import AmountFields from '../AmountFields'
import React from 'react'

const element = (
  <AmountFields availableETH="100" onChange={jest.fn()} errors={{}} />
)

describe('<AmountFields/>', () => {
  it('should match its snapshot', () => {
    const { container } = testUtils.reduxRender(element)
    expect(container).toMatchSnapshot()
  })
})

export function runEditTests(element, initialState, rate) {
  it('updates the USD field when ETH field changes', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    const ethField = getByTestId('ethAmount-field')
    const usdField = getByTestId('usdAmount-field')
    expect(ethField.value).toBe('')
    expect(usdField.value).toBe('')
    ethField.value = '1'
    Simulate.change(ethField)
    expect(usdField.value).toBe(rate.toString())
  })

  it('updates the ETH field when USD field changes', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    const ethField = getByTestId('ethAmount-field')
    const usdField = getByTestId('usdAmount-field')
    usdField.value = '500'
    Simulate.change(usdField)
    expect(ethField.value).toBe((500 / rate).toString())
  })

  it('updates ETH and USD fields when MAX button is clicked', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    const ethField = getByTestId('ethAmount-field')
    const usdField = getByTestId('usdAmount-field')
    Simulate.click(getByTestId('max-btn'))
    expect(ethField.value).toBe('5000')
    expect(usdField.value).toBe((5000 * rate).toString())
  })

  it('displays a "Invalid amount" placeholder in USD field when ETH value is invalid', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    const ethField = getByTestId('ethAmount-field')
    const usdField = getByTestId('usdAmount-field')
    expect(usdField.placeholder).toBe('0.00')
    ethField.value = 'foo'
    Simulate.change(ethField)
    expect(usdField.value).toBe('')
    expect(usdField.placeholder).toBe('Invalid amount')
  })

  it('displays a "< $0.01" placeholder in USD field when ETH equivalent value is small', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    const ethField = getByTestId('ethAmount-field')
    const usdField = getByTestId('usdAmount-field')
    expect(usdField.placeholder).toBe('0.00')
    ethField.value = '0.0000001'
    Simulate.change(ethField)
    expect(usdField.value).toBe('')
    expect(usdField.placeholder).toBe('< 0.01')
  })

  it('displays a "Invalid amount" placeholder in ETH field when USD value is invalid', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    const ethField = getByTestId('ethAmount-field')
    const usdField = getByTestId('usdAmount-field')
    expect(ethField.placeholder).toBe('0.00')
    usdField.value = 'foo'
    Simulate.change(usdField)
    expect(ethField.value).toBe('')
    expect(ethField.placeholder).toBe('Invalid amount')
  })
}

export function runValidateTests(
  element,
  initialState,
  formTestId,
  fieldTestId = 'ethAmount-field'
) {
  it('displays an error if AMOUNT is not provided', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    testUtils.testValidation(getByTestId, formTestId, {
      formData: { [fieldTestId]: '' },
      errors: { [fieldTestId]: 'Amount is required' }
    })
  })

  it('displays an error if AMOUNT is negative', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    testUtils.testValidation(getByTestId, formTestId, {
      formData: { [fieldTestId]: '-1' },
      errors: { [fieldTestId]: 'Amount must be greater than 0' }
    })
  })

  it('displays an error if AMOUNT is an invalid value', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    testUtils.testValidation(getByTestId, formTestId, {
      formData: { [fieldTestId]: 'foo' },
      errors: { [fieldTestId]: 'Invalid amount' }
    })
  })

  it('displays an error if AMOUNT is more than what we have', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    testUtils.testValidation(getByTestId, formTestId, {
      formData: { [fieldTestId]: '10000' },
      errors: { [fieldTestId]: 'Insufficient funds' }
    })
  })

  it('displays an error if AMOUNT is not weiable', () => {
    const { getByTestId } = testUtils.reduxRender(element, initialState)
    testUtils.testValidation(getByTestId, formTestId, {
      formData: { [fieldTestId]: '0.0000000000000000000000000000001' },
      errors: { [fieldTestId]: 'Invalid amount' }
    })
  })
}
