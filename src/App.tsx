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
                let net_token_value = 0;
                let net_eth_value = 0;
                // If a tx is an ERC-20 token tx.value will be 0
                if (tx.value === "0") {
                    let erc20_args = {
                        address: ethAddress,
                        to_block: parseInt(tx.block_number),
                    };
                    // Retrieve complete list of all ERC-20 tokens in a wallet
                    let erc20_tokens = await Web3Api.account.getTokenBalances(erc20_args);

                    // Loop through the list of ERC-20 tokens
                    // Here the various metadata is initialized
                    for (let token of erc20_tokens) {
                        let token_balance = parseInt(token.balance);
                        let token_decimals = parseInt(token.decimals);
                        // let token_logo = token.logo;
                        // let token_name = token.name;
                        // let token_symbol = token.symbol;
                        // let token_thumbnail = token.thumbnail;
                        let token_address = token.token_address;

                        let token_price_args = {
                            address: token_address,
                            to_block: parseInt(tx.block_number),
                        }
                        // Retrieve the token's price at the block of the transaction
                        let token_price = await Web3Api.token.getTokenPrice(token_price_args);

                        // Calculate value of a particular token
                        let token_value = token_balance * Math.pow(10, -(token_decimals)) * token_price.usdPrice;

                        net_token_value += token_value;
                    }
                    // console.log("list of ERC-20 tokens: ", erc20_tokens);
                    console.log("net_token_value: ", net_token_value);

                    // If a tx has a non-zero value it is in native ETH
                } else {
                    let eth_balance = parseInt(tx.value) * Math.pow(10, -18);
                    const wETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
                    let token_price_args = {
                        address: wETH_ADDRESS,
                        to_block: parseInt(tx.block_number),
                    }
                    // Retrieve the token's price at the block of the transaction
                    let eth_price = await Web3Api.token.getTokenPrice(token_price_args);
                    net_eth_value = eth_balance * eth_price.usdPrice;
                    console.log("eth_value: ", net_eth_value);
                }
                // TODO: Make this logic work somehow?
                let net_portfolio_value = net_eth_value + net_token_value;
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
