import { Component } from "react";
import CurrencyInput from "react-currency-input-field";

import axios from "axios";
import { number2MoneyString } from "../helpers";

type MortagageCalculatorDto = {
  propertyValue: string;
  downpaymentAmount: string;
  loanDuration: string;
  interestRate: string;
};

type State = {
  form: MortagageCalculatorDto;
  errors?: { propertyValue?: string; interestRate?: string };
  sliderPercent: number;
  loading?: boolean;
};

class MortagegeCalculator extends Component<{}, State> {
  state: State = {
    form: {
      propertyValue: "1200000",
      downpaymentAmount: "20",
      loanDuration: "15",
      interestRate: "2.99",
    },
    sliderPercent: 0,
  };

  setError(field: string, message: string) {
    this.setState((state) => ({
      ...state,
      errors: {
        ...state.errors,
        [field]: message,
      },
    }));
  }

  handleInputChange(value: string, name: string) {
    this.setState((state) => ({
      ...state,
      form: { ...state.form, [name]: value },
      errors: { ...state.errors, [name]: "" },
    }));
  }

  calculateMonthlyPayment(): string {
    const { propertyValue, loanDuration, downpaymentAmount, interestRate } = this.state.form;
    const propValueInt = parseInt(propertyValue);
    const loanDurationInt = parseInt(loanDuration);
    const downPaymentInt = parseInt(downpaymentAmount);
    const interestRateFloat = parseFloat(interestRate);

    // custom formula
    const remaningAmount = propValueInt - (propValueInt * downPaymentInt) / 100;
    const remaningWithInterest = remaningAmount * (1 + interestRateFloat / 100) ** loanDurationInt;
    return number2MoneyString(remaningWithInterest / (12 * loanDurationInt));
  }

  handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      this.setState({ loading: true });
      await axios.post("https://jsonplaceholder.typicode.com/todos", this.state.form);
    } catch (error) {}
    this.setState({ loading: false });
  };

  render() {
    const { form, loading, errors } = this.state;
    const { propertyValue, downpaymentAmount, loanDuration, interestRate } = form;

    const sliderPercent = ((parseInt(downpaymentAmount) - 20) * 100) / 60;

    // <--- just for showing in different styles
    const huePercent = 250 - sliderPercent * 2.5;
    document.body.style.setProperty("--color", `${huePercent}, 50%`);
    document.body.style.setProperty("--color-primary", "hsl(var(--color), var(--l))");
    document.body.style.setProperty("--color-secondary", "hsl(var(--color), calc(var(--l) + 20%))");
    document.body.style.setProperty("--border-radius", `${parseInt(loanDuration) / 2}px`);
    // just for showing in different styles --->

    return (
      <div className="card">
        <div className="card__body">
          <form className="form" onSubmit={this.handleOnSubmit}>
            <div className="form__group">
              <label htmlFor="propertyValue">Property value</label>
              <CurrencyInput
                id="propertyValue"
                name="propertyValue"
                className="form__input"
                allowDecimals={false}
                defaultValue={propertyValue}
                onValueChange={(value, name) => {
                  const valueInt = parseInt(value || "");
                  if (valueInt > 500000 && valueInt < 10000000) {
                    this.handleInputChange(value || "", "propertyValue");
                  } else {
                    this.setError("propertyValue", "Value should be between 1,200,000 and 10,000,000 AED");
                  }
                }}
              />
              {errors?.propertyValue && <span className="error">{errors.propertyValue}</span>}
            </div>
            <div className="form__group">
              <label htmlFor="downpaymentAmount">
                <div className="flex justify-space-between">
                  <span>
                    Downpayment amount{" "}
                    <small>
                      ({number2MoneyString((parseInt(propertyValue) * parseInt(downpaymentAmount)) / 100)}{" "}
                      AED)
                    </small>
                  </span>
                  <span className="color-primary">
                    <strong>{downpaymentAmount}%</strong>
                  </span>
                </div>
              </label>
              <input
                type="range"
                min={20}
                max={80}
                className="form__input range-slider"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) ${sliderPercent}%, rgb(206,206,206) ${sliderPercent}%)`,
                }}
                id="downpaymentAmount"
                name="downpaymentAmount"
                value={downpaymentAmount}
                onChange={({ target }) => {
                  this.handleInputChange(target.value, "downpaymentAmount");
                }}
              />
            </div>
            <div className="form__group">
              <label htmlFor="duration">
                <div className="flex justify-space-between">
                  <span>Loan duration</span>
                  <span className="color-primary">
                    <strong>{loanDuration} years</strong>
                  </span>
                </div>
              </label>
              <div className="radio__group" id="duration">
                {[5, 10, 15, 20, 25].map((value, i) => (
                  <label key={value} htmlFor={`loanDurationValue1${value}`}>
                    <input
                      type="radio"
                      id={`loanDurationValue1${value}`}
                      name="loanDuration"
                      value={value}
                      checked={loanDuration === value.toString()}
                      onChange={({ target }) => this.handleInputChange(target.value, "loanDuration")}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form__group">
              <label htmlFor="interestRate">Interest rate</label>
              <CurrencyInput
                id="interestRate"
                name="interestRate"
                className="form__input"
                fixedDecimalLength={2}
                suffix="%"
                defaultValue={interestRate}
                onValueChange={(value, name) => {
                  const parsedValue = parseFloat(value || "0");
                  if (parsedValue >= 1 && parsedValue <= 9.55) {
                    this.handleInputChange(value || "", "interestRate");
                  } else {
                    this.setError("interestRate", "Rate should be between 1.00% and 9.55%");
                  }
                }}
              />
              {errors?.interestRate && <span className="error">{errors.interestRate}</span>}
            </div>
            <div className="form__group">
              <div className="flex justify-space-between items-center">
                <span className="amount-text">
                  <span>
                    {this.calculateMonthlyPayment()} <span className="currency">AED</span>
                    <span className="amount-text__desc">per month</span>
                  </span>
                </span>
                <button
                  className="button"
                  type="submit"
                  disabled={
                    loading || errors?.interestRate ? true : false || errors?.propertyValue ? true : false
                  }
                >
                  {loading ? "saving" : "SAVE"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default MortagegeCalculator;
