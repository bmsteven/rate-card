import RateCard from "./lib"
import { access_key } from "./key"

function App() {
  return (
    <div className="App">
      <RateCard
        apiKey={access_key}
        options={["USD", "XML"]}
        currencies={["XML", "USD", "KES", "RWF", "TZS"]}
        defaultSelected="USD"
      />
    </div>
  )
}

export default App
