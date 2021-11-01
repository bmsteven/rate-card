import RateCard from "./lib"
import { coinslayer_access_key, currencylayer_access_key } from "./key"

function App() {
  return (
    <div className="App">
      <RateCard
        coinslayer_access_key={coinslayer_access_key}
        currencylayer_access_key={currencylayer_access_key}
        options={["USDC", "XML"]}
        currencies={["XML", "USDC", "KES", "RWF", "TZS"]}
        defaultSelected="USDC"
      />
    </div>
  )
}

export default App
