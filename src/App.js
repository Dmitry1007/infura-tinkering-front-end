import React, { useState } from "react";
import { simpleStorage } from "./abi/abi";
import Web3 from "web3";
import "./App.css";

const web3 = new Web3(Web3.givenProvider);

const contractAddress = "0xAf6744A0242aC65Cc886775c24990C7e4EE743ed";
const storageContract = new web3.eth.Contract(simpleStorage, contractAddress);

function App() {
  const [number, setUint] = useState(0);
  // Set requires gas, get does not bc get is just viewing
  const [getNumber, setGet] = useState("0");
  
  const numberSet = async (t) => {
    t.preventDefault();
    // make sure we are calling our connected address via MetaMask.
    const accounts = await window.ethereum.enable();

    // Pulls in the connect account
    const account = accounts[0];
    
    // app needs permission to access user funds to pay for gas fees
    const gas = await storageContract.methods.set(number).estimateGas();
    
    // going to take the passed in uint256, confirm the transaction (post paying gas fee) from your MetaMask wallet on the Ropsten network
    // We create our smart contract transaction by passing in our function parameters to the smart contract  methods.set(), and estimated gas and user account address to .send().
    const post = await storageContract.methods.set(number).send({
      from: account,
      gas,
    });
  };

  const numberGet = async (t) => {
    t.preventDefault();
    // retrieves our set number and setGet passes in the new value we declared
    const post = await storageContract.methods.get().call();
    setGet(post);
  };

  return (
    <div className="main">
      <div className="card">
        <form className="form" onSubmit={numberSet}>
          <label>
            Set your uint256:
            <input
              className="input"
              type="text"
              name="name"
              onChange={(t) => setUint(t.target.value)}
            />
          </label>
          <button className="button" type="submit" value="Confirm">
            Confirm
          </button>
        </form>
        <br />
        <button className="button" onClick={numberGet} type="button">
          Get your uint256
        </button>
        {getNumber}
      </div>
    </div>
  );
}

export default App;
