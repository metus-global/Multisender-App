import React, { useState } from 'react';
import {ethers} from 'ethers';
import contract from './abi/MultiSender.js';
import Details from './components/details';

import './App.css';

function App() {
    //Ethers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const Contract = new ethers.Contract(contract.address, contract.abi, signer);

    //Token Contract
    let tokenContract;
    let tokenDecimals;
    const tokenAbi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function balanceOf(address) view returns(uint)",
        "function transfer(address to, uint amount)",
        "function approve(address spender, uint amount) returns(bool)",
        "function decimals() view returns (uint8)"
    ];

    const [erc20, setErc20] = useState('0x9Cc33841e476946e55F95E5960E53c2276e65645');
    const [recipients, setRecipients] = useState([]);

    //Tx Status
    const [txState, setTxState] = useState(0); 

    function statusBar(state) {
        const style = {
            height: '10px',
            width:'10px',
            borderRadius: '90%',
            border: 'solid 2px',
            backgroundColor: 'white',
            margin: '0 auto'
        }
        if(txState === state) {
            style.backgroundColor = 'blue';
        }
        return style;
    };

    async function updateState() {
        if(txState === 2) {
            //Send Tokens and reset
            try{
                const addrs = recipients.map(x => x.address);
                const Amounts = recipients.map(x => Number(x.amount));
                const tx2 = await Contract.multiSender(addrs, Amounts, erc20);
                await tx2.wait();
                setTxState(0);
                alert('Transaction Send Successfully');
            } catch {
                alert('There was a problem sending the transaction, Please try again!');
            }
        } else if(txState === 0){
            try{
                //Set Token Contract 
                tokenContract = new ethers.Contract(erc20,tokenAbi,signer);
                tokenDecimals = await tokenContract.decimals();
                setTxState(1);

                //Approve amounts
                const amounts = recipients.map(x => Number(x.amount));
                const tx1 = await tokenContract.approve(contract.address, ethers.utils.parseUnits(amounts.reduce((a, b) => a + b, 0).toString(), tokenDecimals));
                await tx1.wait();
                setTxState(2);
            } catch (err) {
                const errString = String(err);
                if(err.code === 4001){setTxState(0)}
                else if(errString.indexOf('ENS') !== 0) {alert('Incorrect token address')}
                    //alert('Transaction not approved: Make sure all the values in the recipient file are correct');
            }
        }
    }

    return ( 
    <div className="App">

        <header className="App-header">
            <h1>Multisender App</h1>
            <p>
                Send any BEP-20 token to multiple users !
            </p>
            <p>Binance Smart Chain </p>

            <div style={{display:'flex'}}>
                <div className='statusBar' style={{padding:'10px'}}>
                    <div style={statusBar(0)}></div>
                    <p>Details</p>
                </div>
                <div className='statusBar' style={{padding:'10px'}}>
                    <div style={statusBar(1)}></div>
                    <p>Approve</p>
                </div>
                <div className='statusBar' style={{padding:'10px'}}>
                    <div style={statusBar(2)}></div>
                    <p>Send</p>
                </div>
            </div>
            {txState === 0 && 
            <div>
            <Details 
                tokenAddress={erc20} 
                setTokenAddress={erc20 => setErc20(erc20)}
                setRecievers={recipients => setRecipients(recipients)}
        />
                <button onClick={updateState}>Approve</button>
            </div>
            }

            {txState === 1 &&
            <p>Transaction is being approved...</p>
            }

            {txState === 2 && 
                <div>
                    <p>Send Transaction</p>
                    <button onClick={updateState}>Send</button>
                </div>
            }
        </header>

    </div>
    );
}

export default App;
