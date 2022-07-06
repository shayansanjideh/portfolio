import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
    <React.StrictMode>
        <MoralisProvider serverUrl="https://wjgbef9f8dnj.usemoralis.com:2053/server"
                         appId="WHPNT4B0fNEle5aQJqxwkSKDfUXAV3blDM0HiMrw">
            <App />
        </MoralisProvider>
    </React.StrictMode>,
    document.getElementById("root")
);