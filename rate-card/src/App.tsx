import RateCard from "./lib"
import { coinslayer_access_key, currencylayer_access_key } from "./key"

function App() {
  return (
    <div className="App">
      <RateCard
        coinslayer_access_key={coinslayer_access_key}
        currencylayer_access_key={currencylayer_access_key}
        coins={["XLM", "USDT"]}
        currencies={["XLM", "USDT", "KES", "RWF", "TZS"]}
        defaultSelected="USDT"
      />
    </div>
  )
}

export default App
