import React from "react";
import { ethers } from "ethers";

import SimpleFundingArtifact from "../contracts/SimpleFunding.json";
// import contractAddress from "../contracts/contract-address.json";

import NoWalletDetected from "./NoWalletDetected";
import ConnectWallet from "./ConnectWallet";
import Loading from "./Loading";
import Alert from "./Alert";

const RINKEBY_NETWORK_ID = '4';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      contractData: undefined,
      balance: undefined,
      alertMsg: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this.connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this.dismissNetworkError()}
        />
      );
    }

    return (
      <div className="container justify-content-center">
        <span>Your address: {this.state.selectedAddress}</span>
        <div className="row p-5 align-items-start">
          <div className="col-6">
            <form onSubmit={this.handleFundMe}>
              <h4>Fund me:</h4>
              <div className="mb-3">
                <input
                  name="ether"
                  type="text"
                  className="form-control"
                  placeholder="Amount in ETH"
                />
              </div>
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
            {this.state.contractData ? 
            <form onSubmit={this.handleWithdraw}>
              <fieldset
                disabled={this.state.selectedAddress !== this.state.contractData.owner}
              >
              <h4>Withdraw funds:</h4>
              <span>Contract balance: {this.state.contractData.balance} ETH</span>
              <div className="mb-3">
                <input
                  name="address"
                  type="text"
                  className="form-control"
                  placeholder="Recipient address"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Withdraw
              </button>
              </fieldset>
            </form> : ''}
            <Alert message={this.state.alertMsg}/>
          </div>
          <div className="col-6">
            <h4>Funders:</h4>
            {this.state.contractData ? 
              this.fundersList() : <Loading /> }
          </div>
        </div>
      </div>
    );
  }

  handleFundMe = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    await this.fundMe(data.get('ether'));
  }

  async fundMe(ether) {
    try {
      await this._simpleFunding.fund({
        value: ethers.utils.parseEther(ether)
      });
    } catch(err) {
      this.setState({
        alertMsg: err.message
      });
    }
  }

  handleWithdraw = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    await this.withdrawTo(data.get('address'));
  }

  async withdrawTo(address) {
    try {
      await this._simpleFunding.withdrawTo(address);
    } catch(err) {
      this.setState({
        alertMsg: err.message
      });
    }
  }

  fundersList() {
    const { funders } = this.state.contractData;
    const listFunders = funders.map((funder, i) => 
      <ul className="list-group list-group-horizontal" key={i}>
        <li className="list-group-item flex-fill">{funder.address}</li>
        <li className="list-group-item flex-fill">{funder.amount} ETH</li>
      </ul>
    );
    return listFunders;
  }

  async connectWallet() {
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const net_version = await window.ethereum.request({ method: 'net_version' });

    if (!this.checkNetwork(net_version)) {
      return;
    }

    this.init(selectedAddress);

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress === undefined) {
        return this.resetState();
      }
      
      this.init(newAddress);
    });

    window.ethereum.on("chainChanged", ([networkId]) => {
      this.resetState();
    });
  }

  init(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });

    this.initEthers();

    this.getContractData();
  }

  async initEthers() {
    // To use Alchemy provider
    // this._provider = new ethers.providers.getDefaultProvider('rinkeby', {
    //   alchemy: process.env.REACT_APP_ALCHEMY_API_KEY
    // });
    this._provider = new ethers.providers.Web3Provider(window.ethereum, 'rinkeby');

    this._simpleFunding = new ethers.Contract(
      process.env.REACT_APP_RINKEBY_CONTRACT_ADDRESS,
      SimpleFundingArtifact.abi,
      this._provider.getSigner()
    );
  }

  async getContractData() {
    const owner = await this._simpleFunding.owner();
    const balance = await this._provider.getBalance(this._simpleFunding.address);
    const fundersAddresses = await this._simpleFunding.getFunders();
    const funders = await Promise.all(fundersAddresses.map(async (address) => {
      try {
        const amountFunded = await this._simpleFunding.funderAddressToAmount(address);
        return { address, amount: ethers.utils.formatEther(amountFunded) } 
      } catch(err) {
        this.setState({
          alertMsg: err.message
        });
      }
    }));

    this.setState({ contractData: {
      owner: owner.toLowerCase(),
      balance: ethers.utils.formatEther(balance),
      funders
    }});
  }

  checkNetwork(net_version) {
    if (net_version === RINKEBY_NETWORK_ID) {
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Rinkeby'
    });

    return false;
  }

  dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  resetState() {
    this.setState(this.initialState);
  }
}

export default App;