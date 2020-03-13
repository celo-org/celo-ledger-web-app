import "@babel/polyfill";
import "./index.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import Eth from "@ledgerhq/hw-app-eth";

class App extends Component {
  state = {
    address: null,
    error: null
  };
  onGetLedgerCeloAddress = async () => {
    try {
      this.setState({ error: null });
      let transport;
      if (window.USB) {
        transport = await TransportUSB.create();
      } else if (window.u2f) {
        transport = await TransportU2F.create();
      } else {
        this.setState({ error: new Error('Browser not supported. Use Chrome, Firefox, Brave or Opera.') });
        return;
      }
      const eth = new Eth(transport);
      const { address } = await eth.getAddress("44'/52752'/0'/0/0");
      this.setState({ address });
    } catch (error) {
      this.setState({ error });
    }
  };
  render() {
    const { address, error } = this.state;
    return (
      <div>
        <p>
          <button onClick={this.onGetLedgerCeloAddress}>
            Get Ledger Celo Address
          </button>
        </p>
        <p>
          {error ? (
            <code className="error">{error.toString()}</code>
          ) : (
            <code className="address">{address}</code>
          )}
        </p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
