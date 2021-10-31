import RateCard from "./lib"
import { access_key } from "./key"

function App() {
  return (
    <div className="App">
      <RateCard
        apiKey={access_key}
        options={["USDC", "XML"]}
        currencies={["XML", "USDC", "KES", "RWF", "TZS"]}
        defaultSelected="USDC"
      />
    </div>
  )
}

export default App
