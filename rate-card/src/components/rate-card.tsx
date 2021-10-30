import { FC, useState, useCallback, useRef, useLayoutEffect } from "react"
import { Card, Row, Col, Select, InputNumber } from "antd"
import CurrencyInput, { formatValue } from "react-currency-input-field"
import "antd/dist/antd.css"
import "./rate-card.css"

interface Props {
  options?: []
  currencies?: []
  customStyles?: any
  defaultSelected?: any
  customClass?: any
  className?: any
  currencyConverter?: (from: string, to: string, value: number) => number
}

const customOptions = ["USDC", "XML"]

const customCurrencies = ["XML", "USDC", "KES", "RWF", "TZS"]

const customCurrencyConverter = (from: string, to: string, value: number) => {
  let usTotz = 2320
  let usToke = 115
  let usToxm = 3.01
  let usTorw = 13000
  let xmTous = 0.37
  let xmTotz = 900
  let xmToke = 50
  let xmTorw = 5400
  if (value === null) {
    return 0.0
  }
  if (value === 0) {
    return 0.0
  }
  if (from === to) {
    return value.toFixed(2)
  }
  if (from === "USDC" && to === "TZS") {
    return (value * usTotz).toFixed(2)
  } else if (from === "USDC" && to === "KES") {
    return (value * usToke).toFixed(2)
  } else if (from === "USDC" && to === "RWF") {
    return (value * usTorw).toFixed(2)
  } else if (from === "USDC" && to === "XML") {
    return (value * usToxm).toFixed(2)
  } else if (from === "XML" && to === "TZS") {
    return (value * xmTotz).toFixed(2)
  } else if (from === "XML" && to === "KES") {
    return (value * xmToke).toFixed(2)
  } else if (from === "XML" && to === "USDC") {
    return (value * xmTous).toFixed(2)
  } else if (from === "XML" && to === "RWF") {
    return (value * xmTorw).toFixed(2)
  } else {
    return value.toFixed(2)
  }
}

const RateCard: FC<Props> = ({
  options = customOptions,
  currencies = customCurrencies,
  currencyConverter,
  defaultSelected = options[0],
  customStyles,
  className,
}) => {
  const [variables, setVariables] = useState<{
    selected: string
    amount: any
  }>({
    selected: defaultSelected,
    amount: 1,
  })
  const [separator, setSeparator] = useState<boolean>(false)
  const [isFocused, setFocused] = useState<boolean>(false)
  const { selected, amount } = variables
  const { Option } = Select
  const searchInput = useRef(null)

  const handleSelectChange = useCallback(
    (value) => {
      setVariables({
        ...variables,
        selected: value,
      })
    },
    [variables]
  )

  const handleValueChange = useCallback(
    (value) => {
      setFocused(true)
      if (value >= 0) {
        // setSeparator(() => (value < 10000 ? true : false))
        setVariables({
          ...variables,
          amount: value,
        })
      } else {
        setVariables({
          ...variables,
          amount: 0,
        })
      }
    },
    [variables]
  )

  useLayoutEffect(() => {
    if (document.activeElement === searchInput.current) {
      //   if (parseFloat(amount) < 1000) {
      //     setSeparator(true)
      //   } else {
      //     setSeparator(false)
      //   }
      setSeparator(() => (parseFloat(amount) < 1000 ? true : false))
    } else {
      setSeparator(() => (parseFloat(amount) < 10000 ? true : false))
      //   if (parseFloat(amount) < 10000) {
      //     setSeparator(true)
      //   } else {
      //     setSeparator(false)
      //   }
    }
  }, [amount, isFocused])

  return (
    <Card
      style={{
        maxWidth: "100%",
        margin: "auto",
        ...customStyles,
      }}
      className={`rate-card ${className}`}
    >
      <Row
        justify="space-between"
        style={{
          gap: "1rem",
        }}
        wrap={true}
      >
        <Col span={11} className="col">
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
            style={{ width: "100%", textAlign: "right", fontWeight: 600 }}
            onChange={handleSelectChange}
          >
            {options?.length > 0 &&
              options.map((option) => (
                <Option value={option} key={option}>
                  {option}
                </Option>
              ))}
          </Select>
        </Col>
        <Col span={11} className="amount-field col">
          <div
            style={{
              textAlign: "right",
              marginBottom: ".5rem",
            }}
          >
            <label htmlFor="amount">Amount</label>
          </div>
          <CurrencyInput
            ref={searchInput}
            id="amount"
            defaultValue={1}
            decimalsLimit={2}
            disableGroupSeparators={separator}
            style={{ width: "100%", textAlign: "right", fontWeight: 600 }}
            min={0}
            onValueChange={handleValueChange}
            onFocus={() => setFocused(true)}
            onBlur={() =>
              setSeparator(() => (parseFloat(amount) < 10000 ? true : false))
            }
          />
        </Col>
      </Row>
      <Row
        wrap={true}
        justify="space-between"
        style={{
          marginTop: "3rem",
        }}
      >
        {currencies?.length > 0 &&
          currencies
            .filter((el: any) => el !== selected)
            .map((currency) => (
              <Rate
                key={currency}
                selected={selected}
                currency={currency}
                amount={amount}
                currencyConverter={currencyConverter}
              />
            ))}
      </Row>
    </Card>
  )
}

export default RateCard

interface RateProps {
  currency: string
  selected: string
  amount: number
  currencyConverter?: (from: string, to: string, value: number) => number
}

const Rate: FC<RateProps> = ({
  currency,
  amount,
  currencyConverter = customCurrencyConverter,
  selected,
}) => {
  let newAmount = currencyConverter(selected, currency, amount)
  newAmount = formatValue({
    value: newAmount + "",
    groupSeparator: ",",
    decimalSeparator: ".",
  })

  const splitValue = newAmount.split(".")
  console.log(splitValue)

  return (
    <Col
      span={11}
      style={{
        textAlign: "right",
        width: "100%",
        marginBottom: "2.5rem",
        fontWeight: 600,
      }}
      className="currency col"
    >
      <p>
        <span className="currency-code">{currency}</span>
      </p>
      <p
        className="currency-amount"
        style={{
          fontSize: 20,
        }}
      >
        {splitValue[0]}.
        <span
          style={{
            color: parseInt(splitValue[1]) === 0 ? "lightgray" : "",
          }}
        >
          {splitValue[1]}
        </span>
      </p>
    </Col>
  )
}
