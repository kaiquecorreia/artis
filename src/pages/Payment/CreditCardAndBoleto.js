import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { themr } from 'react-css-themr'
import Form from 'react-vanilla-form'
import { isEmpty, reject, isNil } from 'ramda'

import {
  Grid,
  Row,
  Col,
  Button,
} from '../../components'

import CreditCardForm from './CreditCardForm'
import BoletoForm from './BoletoForm'

import { required } from '../../utils/validations'
import updateMultipleAmount from '../../utils/helpers/updateMultipleAmount'
import formatToBRL from './../../utils/helpers/formatToBRL'

const applyThemr = themr('UIPaymentPage')

const defaultColSize = 12
const mediumColSize = 6

class CreditCardAndBoleto extends Component {
  constructor () {
    super()

    this.state = {
      formData: {},
      formValid: false,
      inputAmountNames: {
        first: 'creditcard-amount',
        second: 'boleto-amount',
      },
    }
  }

  handleChangeForm = (newFormData, errors) => {
    const { formData, inputAmountNames } = this.state
    const { transaction } = this.props

    const amounts = updateMultipleAmount({
      formData,
      newFormData,
      inputAmountNames,
      transaction,
    })

    this.setState({
      formData: amounts,
      formValid: isEmpty(reject(isNil, errors)),
    })
  }

  render () {
    const { theme,
      transaction,
      isBigScreen,
      handleSubmit,
    } = this.props

    const {
      formData,
      formValid,
      inputAmountNames,
    } = this.state

    const { amount, paymentMethods } = transaction
    const { boleto, creditcard } = paymentMethods

    const creditcardAmountInputName = `${inputAmountNames.first}`
    const boletoAmountInputName = `${inputAmountNames.second}`

    return (
      <Form
        data={formData}
        onChange={this.handleChangeForm}
        onSubmit={handleSubmit}
        customErrorProp="error"
        validation={{
          [creditcardAmountInputName]: [required],
          [boletoAmountInputName]: [required],
          cardNumber: [required],
          holderName: [required],
          expiration: [required],
          cvv: [required],
          installments: [required],
        }}
      >
        <Grid className={theme.page}>
          <Row>
            <Col
              tv={mediumColSize}
              desk={mediumColSize}
              tablet={mediumColSize}
              palm={defaultColSize}
            >
              <Col
                tv={defaultColSize}
                desk={defaultColSize}
                tablet={defaultColSize}
                palm={defaultColSize}
              >
                <span className={theme.title}>Cartão 1</span>
              </Col>
              <Col
                tv={defaultColSize}
                desk={defaultColSize}
                tablet={defaultColSize}
                palm={defaultColSize}
              >
                {CreditCardForm({
                  theme,
                  amount,
                  data: creditcard,
                  formData,
                  isBigScreen,
                  enableSplitAmount: true,
                  installmentsIndex: 0,
                  amountPrefixName: inputAmountNames.first,
                  showCreditCard: false,
                  confirmButtonVisible: false,
                  handleSubmit: this.handleSubmit,
                })}
              </Col>
            </Col>
            <Col
              tv={mediumColSize}
              desk={mediumColSize}
              tablet={mediumColSize}
              palm={defaultColSize}
            >
              <Col
                tv={defaultColSize}
                desk={defaultColSize}
                tablet={defaultColSize}
                palm={defaultColSize}
              >
                <span className={theme.title}>Boleto</span>
              </Col>
              <Col
                tv={defaultColSize}
                desk={defaultColSize}
                tablet={defaultColSize}
                palm={defaultColSize}
              >
                {BoletoForm({
                  theme,
                  amount,
                  data: boleto,
                  enableInputAmount: true,
                  amountPrefixName: inputAmountNames.second,
                  showBoletoDetails: false,
                  confirmButtonVisible: false,
                  handleSubmit: this.handleSubmit,
                })}
              </Col>
            </Col>
            <Col
              tv={defaultColSize}
              desk={defaultColSize}
              tablet={defaultColSize}
              palm={defaultColSize}
              alignEnd
            >
              <Col
                tv={defaultColSize}
                desk={defaultColSize}
                tablet={defaultColSize}
                palm={defaultColSize}
                alignEnd
              >
                <h4 className={theme.amount} >
                  Valor a pagar: {formatToBRL(amount)}
                </h4>
              </Col>
              <Col
                tv={defaultColSize}
                desk={defaultColSize}
                tablet={defaultColSize}
                palm={defaultColSize}
                alignEnd
                className={theme.footerNoPadding}
              >
                <Button
                  className={theme.confirmBtn}
                  size="extra-large"
                  relevance="normal"
                  type="submit"
                  disabled={!formValid}
                >
                  Confirmar
                </Button>
              </Col>
            </Col>
          </Row>
        </Grid>
      </Form>
    )
  }
}

CreditCardAndBoleto.propTypes = {
  theme: PropTypes.shape(),
  isBigScreen: PropTypes.bool.isRequired,
  transaction: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

CreditCardAndBoleto.defaultProps = {
  theme: {},
}

const mapStateToProps = ({ screenSize }) => ({
  isBigScreen: screenSize.isBigScreen,
})

export default connect(mapStateToProps, null)(applyThemr(CreditCardAndBoleto))
