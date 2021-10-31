import { FC, useState, useEffect, useCallback } from "react"
import { Card, Select } from "antd"
import { formatValue, cleanValue } from "./utils"
import "antd/dist/antd.css"
import "./rate-card.css"
import axios from "axios"

interface Props {
  options?: string[]
  currencies?: string[]
  customStyles?: any
  defaultSelected?: any
  customClass?: string
  currencyStyle?: any
  currencyClass?: string
  inputClass?: string
  inputStyle?: any
  apiKey?: string
  errorStyle?: any
  errorClass?: string
}

const customOptions = ["USDC", "XML"]

const customCurrencies = ["XML", "USDC", "KES", "RWF", "TZS"]

const customCurrencyConverter = (
  target: string,
  amount: number,
  currencies: string[],
  apiKey?: string,
  setResults?: any,
  setLoading?: any,
  setError?: any
): any => {
  console.log("here")

  if (amount === undefined || amount === null) {
    setLoading(false)
    setError("Input Error")
    return null
  }
  setLoading(true)
  setError("")
  let newCurrencies = ""
  currencies.forEach((el, index) => {
    if (index === currencies?.length - 1) {
      newCurrencies = newCurrencies + el
    } else {
      newCurrencies = newCurrencies + el + ","
    }
  })

  axios
    .get(
      `http://api.currencylayer.com/live?access_key=${apiKey}&currencies=${newCurrencies}&source=${target}&format=1`
    )
    .then((res) => {
      setLoading(false)
      if (res?.data?.quotes) {
        setResults(res?.data?.quotes)
      }
      if (res.data?.error) setError(res?.data?.error?.info)
    })
    .catch((err) => {
      setLoading(false)
      if (err.message === "Network Error") {
        setError(err?.message)
      } else {
        setError("Error")
      }
    })
}

const RateCard: FC<Props> = ({
  options = customOptions,
  currencies = customCurrencies,
  defaultSelected = options[0],
  customStyles,
  customClass,
  inputClass,
  inputStyle,
  currencyStyle,
  currencyClass,
  apiKey,
  errorStyle,
  errorClass,
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [rates, setRates] = useState<any>(null)
  const [results, setResults] = useState<any>(null)
  const [variables, setVariables] = useState<{
    selected: string
    amount: any
    displayValue: any
  }>({
    selected: defaultSelected,
    amount: 0,
    displayValue: 0,
  })
  const { selected, amount, displayValue } = variables
  const { Option } = Select

  const handleSelectChange = useCallback(
    (value) => {
      setVariables({
        ...variables,
        selected: value,
      })
    },
    [variables]
  )

  const handleValueChange = (e: any) => {
    const { value } = e.target
    if (parseFloat(cleanValue({ value })) >= 0) {
      setVariables({
        ...variables,
        amount: cleanValue({ value }),
        displayValue: cleanValue({ value }),
      })
    } else {
      setVariables({
        ...variables,
        amount: 0,
        displayValue: cleanValue({ value }),
      })
    }
  }

  useEffect(() => {
    customCurrencyConverter(
      selected,
      amount,
      currencies,
      apiKey,
      setResults,
      setLoading,
      setError
    )
  }, [amount, selected])

  useEffect(() => {
    if (results) {
      let arr = Object?.keys(results)?.map(
        (key) => key && { rate: key, value: results[key] }
      )
      setRates(arr)
    }
  }, [results])

  return (
    <Card
      style={{
        ...customStyles,
      }}
      className={`rate-card ${customClass}`}
    >
      <section className="inputs-section">
        <article className="col">
          <div
            style={{
              textAlign: "right",
              marginBottom: ".5rem",
            }}
          >
            <label htmlFor="currency">Base currency</label>
          </div>
          <Select
            id="currency"
            defaultValue={options[0]}
            value={selected}
            style={{
              width: "100%",
              textAlign: "right",
              fontWeight: 600,
              ...inputStyle,
            }}
            onChange={handleSelectChange}
            className={`input-field select-input ${inputClass}`}
          >
            {options?.length > 0 &&
              options.map((option) => (
                <Option value={option} key={option}>
                  {option}
                </Option>
              ))}
          </Select>
        </article>
        <article className="amount-field col">
          <div
            style={{
              textAlign: "right",
              marginBottom: ".5rem",
            }}
          >
            <label htmlFor="amount">Amount</label>
          </div>
          <input
            value={
              parseFloat(amount) < 10000
                ? displayValue
                : formatValue({
                    value: displayValue + "",
                    groupSeparator: ",",
                    decimalSeparator: ".",
                  })
            }
            style={{
              width: "100%",
              textAlign: "right",
              fontWeight: 600,
              ...inputStyle,
            }}
            min={0}
            onChange={handleValueChange}
            className={`input-field amount-input ${inputClass}`}
          />
        </article>
      </section>
      {loading ? (
        <section>
          <p>Please wait</p>
        </section>
      ) : (
        <>
          {error ? (
            <section>
              <p
                className={`${errorClass}`}
                style={{
                  color: "red",
                  ...errorStyle,
                }}
              >
                {error}
              </p>
            </section>
          ) : (
            <section>
              {currencies?.length > 0 &&
                currencies
                  .filter((el: any) => el !== selected)
                  .map((rate: any) => (
                    <Rate
                      key={rate}
                      rates={rates}
                      currency={rate}
                      amount={amount}
                      currencyClass={currencyClass}
                      currencyStyle={currencyStyle}
                    />
                  ))}
            </section>
          )}
        </>
      )}
    </Card>
  )
}

interface RateProps {
  currency: string
  amount: number
  rates?: []
  currencyClass?: any
  currencyStyle?: any
  apiKey?: string
  errorClass?: any
  errorStyle?: any
}

const Rate: FC<RateProps> = ({
  currency,
  amount,
  rates,
  currencyClass,
  currencyStyle,
}) => {
  const [newAmount, setAmount] = useState<any>("0.00")
  const [displayAmount, setDisplayAmount] = useState<any>("0.00")
  const [isResult, setIsResult] = useState<any>(true)

  const splitValue = displayAmount.split(".")

  const decimals = () => {
    if (displayAmount) {
      let splitDecimals = splitValue[1]?.split("")
      if (splitDecimals?.length > 0) {
        return (
          splitDecimals[0] + "" + (splitDecimals[1] ? splitDecimals[1] : "0")
        )
      } else {
        return "00"
      }
    }
  }

  useEffect(() => {
    setDisplayAmount(
      formatValue({
        value: newAmount + "",
        groupSeparator: ",",
        decimalSeparator: ".",
      })
    )
  }, [newAmount])

  useEffect(() => {
    if (rates) {
      let v = 1
      rates?.forEach((el: { rate: string; value: number }) => {
        if (el?.rate?.includes(currency)) {
          v = el?.value
        }
      })
      setAmount(v * amount)
    }
  }, [rates, amount])

  useEffect(() => {
    if (rates && amount > 0) {
      setIsResult(
        rates.find((el: { rate: string }) => el.rate.includes(currency))
      )
    } else {
      setIsResult(true)
    }
  }, [rates, amount])

  console.log(
    parseFloat(splitValue[0]) === 0,
    parseFloat(splitValue[1]),
    splitValue
  )

  return (
    <article
      style={{
        textAlign: "right",
        marginBottom: "2.5rem",
        fontWeight: 600,
        ...currencyStyle,
      }}
      className={`currency col ${currencyClass}`}
    >
      <p
        style={{
          fontSize: 17,
        }}
      >
        <span className="currency-code">{currency}</span>
      </p>
      <p
        className="currency-amount"
        style={{
          fontSize: 20,
        }}
      >
        {isResult ? (
          <>
            <span
              style={{
                color:
                  parseFloat(splitValue[0]) === 0 &&
                  (splitValue[1] ? parseFloat(splitValue[1]) === 0 : true)
                    ? "lightgray"
                    : "gray",
              }}
            >
              {splitValue[0]}.
            </span>
            <span
              style={{
                color: decimals() === "00" ? "lightgray" : "gray",
              }}
            >
              {decimals()}
            </span>
          </>
        ) : (
          <span
            style={{
              color: "red",
            }}
          >
            No result returned
          </span>
        )}
      </p>
    </article>
  )
}

export default RateCard
