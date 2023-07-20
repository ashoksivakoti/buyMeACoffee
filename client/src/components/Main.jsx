import React from 'react'
import { contractABI, contractAddress } from '../utils/constants';



const { ethereum } = window;

const Main = () => {

// checking if wallet is connected or not
const checkIfWalletIsConnected = async () => {
    try {
        if (!ethereum) return alert("pleaase install metamask")
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length) {
            setCurrentAccount(accounts[0])
            getAllTransactions()
        } else {
            console.log("No accounts found")
        }
    } catch (error) {
        console.log(error);

        throw new Error("No ethereum object")
    }
}
  return (
    <div>Main</div>
  )
}

export default Main