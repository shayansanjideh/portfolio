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

        const address = {
            address: ethAddress,
            from_block: 0,
        };

        // `transactions` refers to the entire JSON object of transactions pulled from the Moralis library
        const transactions = await Web3Api.account.getTransactions(address);
        // `txs` refers to the individual transactions and their associated metadata
        const txs = transactions.result;

        if (txs) {
            for (let tx of txs) {

                // If a tx is an ERC-20 token tx.value will be 0
                if (tx.value === "0") {
                    // Initialize net_value_token, i.e. the total value of a particular ERC-20 token in a user's
                    // wallet
                    // let net_token_value: number = 0

                    let erc20_args = {
                        address: ethAddress,
                        to_block: parseInt(tx.block_number),
                    };
                    let erc20_tokens = await Web3Api.account.getTokenBalances(erc20_args);

                    // Loop through the complete list of ERC-20 tokens in a user's wallet
                    // Here the various metadata is initialized
                    for (let token of erc20_tokens) {
                        let token_balance = token.balance;
                        let token_decimals = token.decimals;
                        let token_logo = token.logo;
                        let token_name = token.name;
                        let token_symbol = token.symbol;
                        let token_thumbnail = token.thumbnail;
                        let token_address = token.token_address;

                        let token_price_args = {
                            address: token_address,
                        }

                        let token_price = await Web3Api.token.getTokenPrice(token_price_args);
                    }
                    console.log(erc20_tokens)

                    // If a tx has a non-zero value it is in native ETH
                } else {
                    console.log(tx.value)
                }
            }
        }
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

