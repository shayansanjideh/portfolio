import React, {useEffect, useState} from 'react';
import './App.css';
import { useMoralisWeb3Api } from "react-moralis";

function App() {

    const [ethAddress, setEthAddress] = useState("");

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    }

    const Web3Api = useMoralisWeb3Api();

    const fetchTransactions = async () => {
        // get mainnet transactions for any ETH address
        const transactions = await Web3Api.account.getTransactions();
        console.log(transactions);

        // get ETH transactions for a given address
        // with most recent transactions appearing first
        const options = {
            chain: "eth",
            address: ethAddress,
            from_block: "0",
        };

        const addressTransactions = await Web3Api.account.getTransactions(options);
        console.log(addressTransactions);
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
                <button>Enter</button>
            </form>
        </div>
    );
}

export default App;

