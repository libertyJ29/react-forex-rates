import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor(state, props) {
    super(state, props);
    this.state = {
      gbp_to_usd: "",
      gbp_to_eur: "",
      gbp_to_cny: "",
      gbp_to_convert: "",
      selectedCurrency: "",
      selectedSymbol: "",
      selectedMultiply: "",
      converted: ""
    };

    //get the rates using the alphavantage api
    axios
      .get(
        "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=USD&apikey={key}"
      )
      .then(response => {
        const gbp_to_usd =
          response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
        this.setState({
          gbp_to_usd: gbp_to_usd,
          selectedCurrency: "USD",
          selectedSymbol: "&#36;",
          selectedMultiply: gbp_to_usd
        });
      });

    axios
      .get(
        "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=EUR&apikey={key}"
      )
      .then(response => {
        const gbp_to_eur =
          response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
        this.setState({ gbp_to_eur });
      });

    axios
      .get(
        "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=GBP&to_currency=CNY&apikey={key}"
      )
      .then(response => {
        const gbp_to_cny =
          response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
        this.setState({ gbp_to_cny });
      });
  }

  //convert the input currency for the selected destination
  convertInputValue(evt) {
    const input_gbp_value = evt.target.value;
    const converted = (input_gbp_value * this.state.selectedMultiply).toFixed(2);

    this.setState({
      converted: converted,
      gbp_to_convert: input_gbp_value
    });
  }

  //set currency selected with the select list
  updateInputCurrency(evt) {
    const currencyValue = evt.target.value;

    const multiplyValue = this.getMultiplyValue(currencyValue);

    const symbolValue = this.getSymbolValue(currencyValue);

    //recalculate the converted value with the new multiply value
    const converted = (this.state.gbp_to_convert * multiplyValue).toFixed(2);

    this.setState({
      selectedCurrency: currencyValue,
      selectedMultiply: multiplyValue,
      selectedSymbol: symbolValue,
      converted: converted
    });
  }

  //determine currency multiply value
  getMultiplyValue(currency) {
    switch (currency) {
      case "CNY":
        return this.state.gbp_to_cny;
      case "EUR":
        return this.state.gbp_to_eur;
      case "USD":
        return this.state.gbp_to_usd;
      default:
        return 0;
    }
  }

  //determine currency symbol value
  getSymbolValue(currency) {
    switch (currency) {
      case "CNY":
        return "&#165;";
      case "EUR":
        return "&#8364;";
      case "USD":
        return "&#36;";
      default:
        return "";
    }
  }

  render() {
    //round each of the returned rates to 2 decimal places
    const cny_rounded = parseFloat(this.state.gbp_to_cny).toFixed(2);

    const eur_rounded = parseFloat(this.state.gbp_to_eur).toFixed(2);

    const usd_rounded = parseFloat(this.state.gbp_to_usd).toFixed(2);

    return (
      <div className="App">
        <header className="App-header">
          <p>
            <i>
              Latest Forex from{" "}
              <a href="https://www.alphavantage.co">Alpha Vantage</a>
            </i>
          </p>
          <div className="container">
            <img src={require("./img/gb.svg")} className="flag" alt="" /> (GBP
            Base Currency)
          </div>
          <br />

          <div className="container">
            {" "}
            <img src={require("./img/cn.svg")} className="flag" alt="" /> CNY
            &#165;{cny_rounded} (RMB)
          </div>

          <div className="container">
            <img src={require("./img/eu.svg")} className="flag" alt="" /> EUR
            &#8364;{eur_rounded} (Euro)
          </div>

          <div className="container">
            <img src={require("./img/us.svg")} className="flag" alt="" /> USD
            &#36;{usd_rounded} (Dollar)
          </div>

          <br />
          <span className="inline">
            <b>
              GBP to{" "}
              <select onChange={evt => this.updateInputCurrency(evt)}>
                <option value="CNY">CNY</option>
                <option value="EUR">EUR</option>
                <option value="USD" selected>
                  USD
                </option>
              </select>{" "}
              Currency Converter
            </b>{" "}
            <input
              value={this.state.gbp_to_convert}
              placeholder="Enter GBP to convert"
              onChange={evt => this.convertInputValue(evt)}
            />
          </span>

          <span className="inline">
            &#163;{this.state.gbp_to_convert} GBP ={" "}
            <span
              dangerouslySetInnerHTML={{ __html: this.state.selectedSymbol }}
            />
            {this.state.converted} {this.state.selectedCurrency}
          </span>
        </header>
      </div>
    );
  }
}

export default App;
