import React, { useState } from 'react';
import './App.css';
import { useMoralisWeb3Api } from "react-moralis";

function App() {

    const [ethAddress, setEthAddress] = useState("");

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    }

    const Web3Api = useMoralisWeb3Api();

    // get ETH transactions for a given address
    // with most recent transactions appearing first
    const fetchTransactions = async () => {

        const options = {
            address: ethAddress,
        };

        // `transactions` refers to the entire JSON object of transactions pulled from the Moralis library
        const transactions = await Web3Api.account.getTransactions(options);
        // `txs` refers to the individual transactions and their associated metadata
        const txs = transactions.result;

        if (txs) {
            txs.forEach(tx => {
                // getEthPrice(tx.block_number)
            })
        }

        // const getEthPrice

    };

    return (
        <div>
            <h1>Historical Portfolio Tracker</h1>
            <h2>Enter an Ethereum address:</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={ethAddress}
                    onChange={(e) => setEthAddress(e.target.value)}
                />
                <button onClick={fetchTransactions}>
                    Enter
                </button>
            </form>
        </div>
    );
}

export default App;

