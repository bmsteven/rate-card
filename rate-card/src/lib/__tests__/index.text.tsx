import "@testing-library/jest-dom"
// import {
//   render,
//   fireEvent,
//   screen,
//   waitForElementToBeRemoved,
// } from "@testing-library/react"
// import userEvent from "@testing-library/user-event"
// import RateCard from "../"

// window.fetch = jest.fn(() => {
//   const coinsResults = {
//     SDC: 1.002529,
//     XML: 0.373613,
//   }

//   return Promise.resolve({
//     json: () => Promise.resolve(coinsResults),
//   })
// })

// window.fetch = jest.fn(() => {
//   const currenciesResults = {
//     USDTZS: 2304.999509,
//     USDKES: 111.196692,
//     USDRWF: 1000,
//   }

//   return Promise.resolve({
//     json: () => Promise.resolve(currenciesResults),
//   })
// })

// describe("Testing rate card library", () => {
//   test("renders loading is rendered", async () => {
//     render(
//       <RateCard
//         currencylayer_access_key={"1234"}
//         coinslayer_access_key={"1234"}
//       />
//     )
//     const loading = screen.getByText("Please wait")

//     expect(loading).toBeInTheDocument()

//     await waitForElementToBeRemoved(() => screen.getByText("Please wait"))
//   })

//   test("show error message", async () => {
//     window.fetch.mockImplementationsOnce(() => {
//       return Promise.reject({ message: "Api is down" })
//     })
//     render(
//       <RateCard
//         currencylayer_access_key={"1234"}
//         coinslayer_access_key={"1234"}
//       />
//     )
//     const error = screen.getByText("Api is down")
//   })

//   test("currencies are rendered", async () => {
//     render(
//       <RateCard
//         currencylayer_access_key={"1234"}
//         coinslayer_access_key={"1234"}
//         currencies={["XML", "USDC", "KES", "RWF", "TZS"]}
//         options={["USDC", "XML"]}
//       />
//     )
//     const currency = await screen.getByText("TZS")
//     expect(currency).toBeInTheDocument()
//   })
// })
