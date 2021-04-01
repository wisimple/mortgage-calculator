import React, { Component } from "react";
import NumberFormat from "react-number-format";

export interface MortgageCalculatorValues {
  propertyValue: number;
  downpaymentPercentage: number;
  loanDurationInMonths: number;
  interestRate: number;
}

type WidgetProps = {
  defaultValues: MortgageCalculatorValues;
  onSubmitted: (formValues: MortgageCalculatorValues) => void;
};

type WidgetState = {
  formValues: MortgageCalculatorValues;
};

export default class MortagegeCalculatorWidget extends Component<WidgetProps, WidgetState> {
  constructor(props: WidgetProps) {
    super(props);
    this.state = {
      formValues: props.defaultValues,
    };
  }

  handleInputChange(key: string, value: any) {
    this.setState((prevState) => ({ ...prevState, formValues: { ...prevState.formValues, [key]: value } }));
  }

  handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    console.log(this.state.formValues);

    // this.props.onSubmitted(this.state.formValues);
  }

  // Methods for calculations
  calculateMonthlyPayment(): number {
    const { loanDurationInMonths } = this.state.formValues;
    return this.remaningWithInterest / (12 * loanDurationInMonths);
  }

  get remaningAmount(): number {
    const { propertyValue } = this.state.formValues;
    return propertyValue - this.downPaymentAmount;
  }

  get remaningWithInterest(): number {
    const { interestRate, loanDurationInMonths } = this.state.formValues;
    return this.remaningAmount * (1 + interestRate / 100) ** loanDurationInMonths;
  }

  get downPaymentAmount(): number {
    const { propertyValue, downpaymentPercentage } = this.state.formValues;
    return (propertyValue * downpaymentPercentage) / 100;
  }

  get monthlyPaymentString(): string {
    return this.calculateMonthlyPayment().toFixed();
  }

  render() {
    const { propertyValue, downpaymentPercentage, loanDurationInMonths, interestRate } = this.state.formValues;
    const { defaultValues } = this.props;
    return (
      <div className="card">
        <div className="card__body">
          <form className="form" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="form__item">
              <label htmlFor="propertyValue">Property Value</label>
              <NumberFormat
                className="form__input"
                id="propertyValue"
                defaultValue={defaultValues.propertyValue}
                thousandSeparator=","
                suffix=" AED"
                value={propertyValue}
                onValueChange={(values) => this.handleInputChange("propertyValue", values.floatValue)}
              />
            </div>
            <div className="form__item">
              <label htmlFor="downpaymentPercentage">
                <div className="flex justify-space-between">
                  <span>
                    Downpayment amount <small>({this.downPaymentAmount})</small>
                  </span>
                  <span className="color-primary">
                    <strong>{downpaymentPercentage}%</strong>
                  </span>
                </div>
              </label>
              <input
                type="range"
                min={20}
                max={80}
                className="form__input range-slider"
                // style={{
                //   background: `linear-gradient(to right, var(--color-primary) ${sliderPercent}%, rgb(206,206,206) ${sliderPercent}%)`,
                // }}
                id="downpaymentPercentage"
                name="downpaymentPercentage"
                value={downpaymentPercentage}
                onChange={({ target }) => {
                  this.handleInputChange("downpaymentPercentage", target.value);
                }}
              />
            </div>
            <div className="form__item">
              <label htmlFor="duration">
                <div className="flex justify-space-between">
                  <span>Loan duration</span>
                  <span className="color-primary">
                    <strong>{loanDurationInMonths} years</strong>
                  </span>
                </div>
              </label>
              <div className="radio__group">
                {[5, 10, 15, 20, 25].map((value, i) => (
                  <label key={value} htmlFor={`loanDurationInMonthsValue1${value}`}>
                    <input
                      type="radio"
                      id={`loanDurationInMonthsValue1${value}`}
                      name="loanDurationInMonths"
                      value={value}
                      checked={loanDurationInMonths === value}
                      onChange={({ target }) => this.handleInputChange("loanDurationInMonths", parseInt(target.value))}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form__item">
              <label htmlFor="interestRate">Property Value</label>
              <NumberFormat
                className="form__input"
                id="interestRate"
                defaultValue={defaultValues.interestRate}
                suffix="%"
                value={interestRate}
                onValueChange={(values) => this.handleInputChange("interestRate", values.floatValue)}
              />
            </div>
            <div className="form__item">
              <div className="flex justify-space-between items-center">
                <span className="amount-text">
                  <span>
                    {this.monthlyPaymentString} <span className="currency">AED</span>
                    <span className="amount-text__desc">per month</span>
                  </span>
                </span>
                <button className="button" type="submit">
                  SAVE
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
