import React, { useEffect, useState } from 'react'
import { contractABI, contractAddress } from '../utils/constants'
import { ethers } from 'ethers'
import logo from '../images/coffeeLogo.png'

const { ethereum } = window;

const HomePage = () => {
const [currentAccount, setCurrentAccount] = useState("");
const [name, setName] = useState("");
const [message, setMessage] = useState("");
const [memos, setMemos] = useState([]);

const onNameChange = (event) => {
    setName(event.target.value);
}

const onMessageChange = (event) => {
    setMessage(event.target.value);
}

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

    return buyMeACoffee;
}

// Wallet connection logic
const isWalletConnected = async () => {
try {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    console.log("accounts: ", accounts);

    if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
    } else {
        console.log("make sure MetaMask is connected");
    }
} catch (error) {
    console.log("error: ", error);
}
}

// connectiong the wallet
const connectWallet = async () => {
try {
    if (!ethereum) {
        console.log("please install MetaMask");
    }
    const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
    });

    setCurrentAccount(accounts[0]);
} catch (error) {
    console.log(error);
}
}

const buyCoffee = async () => {
try {
    if (ethereum) {
        const buyMeACoffee = getEthereumContract();

        console.log("buying coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
            name ? name : "Anonymous",
            message ? message : "Enjoy your coffee....! Have a nice day.",
            { value: ethers.utils.parseEther("0.001") }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
    }
} catch (error) {
    console.log(error);
}
};

// Function to fetch all memos stored on-chain.
const getMemos = async () => {
    try {
      if (ethereum) {
        const buyMeACoffee = getEthereumContract();
  
        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
  
        const formattedMemos = memos.map((memo) => {
          const formattedTimestamp = new Date(memo.timestamp * 1000).toLocaleString();
          return { ...memo, timestamp: formattedTimestamp };
        });
  
        setMemos(formattedMemos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };
  

useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    const onNewMemo = (from, timestamp, name, message) => {
        console.log("Memo received: ", from, timestamp, name, message);
        const formattedTimestamp = new Date(timestamp * 1000).toLocaleString;
        setMemos((prevState) => [
          ...prevState,
          { address: from, timestamp: formattedTimestamp, message, name },
        ]);
      };      

// Listen for new memo events.
    if (ethereum) {
        const buyMeACoffee = getEthereumContract()
        buyMeACoffee.on("NewMemo", onNewMemo);
    }
    return () => {
        if (buyMeACoffee) {
            buyMeACoffee.off("NewMemo", onNewMemo);
        }
    }
    }, []);

return (
    <>
<div className="relative min-h-screen">
  <div className="absolute inset-0 bg-gradient-to-r from-[#01BAEF] to-[#20BF55] "></div>
  <div className="relative container mx-auto px-4 py-8 text-center z-10">
  <div class="flex items-center justify-center mb-4">
    <h1 className="text-8xl font-bold text-black py-8 text-gradient">Buy Hasher a Coffee!</h1>
    <img src={logo} alt="Coffee Logo" className="w-10 h-15 ml-5" />
    </div>
    {/* <p className="text-white text-lg">Show your appreciation and support Hasher by buying them a coffee.</p> */}
    {currentAccount ? (
      <div className="mt-8">
        <form className="max-w-lg mx-auto">
          <div className="mb-4">
            <input id="name" type="text" placeholder="Name" className="border p-2 rounded w-full blue-glassmorphism" onChange={onNameChange} />
          </div>
          <div className="mb-4">
            <textarea placeholder="Leave a message to Hasher" id="message" onChange={onMessageChange} required className="border p-2 rounded w-full blue-glassmorphism"></textarea>
          </div>
          <div>
            <button type="button" onClick={buyCoffee} className="bg-gradient-to-r from-[#F2A65A] to-[#A55C1B] text-white px-4 py-2 border-[#A55C1B] border-b-4 rounded">Send 1 Coffee for 0.001ETH</button>
          </div>
        </form>
      </div>
    ) : (
      <button onClick={connectWallet} className="bg-[#e87e22] hover:bg-[#fa8f24] text-white font-bold py-2 px-4 border-b-4 border-[#904f17] hover:border-[#a35a1b] rounded mt-20">Connect your wallet</button>
    )}

    {currentAccount && (
      <div className="p-4 overflow-y-auto max-h-96">
        <h2 className="text-4xl font-bold text-[#5d4f1a] my-10 flex">Memos received</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memos.map((memo, idx) => {
            const time = memo.timestamp.toLocaleString();
            return (
              <div key={idx} className="rounded-lg shadow-lg p-4 white-glassmorphism">
                <p className="text-lg mb-2">"{memo.message}"</p>
                <p className="text-[#6F4E37]">
                  From: {memo.name} at {time}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    )}
  {/* <!-- Footer Section --> */}
  <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-1 text-center">
    <a href="https://github.com/ashoksivakoti" target="_blank" rel="noopener noreferrer" className="text-white">
      Created by @ashoksivakoti
    </a>
  </footer>
</div>
  </div>

</>
)
}

export default HomePage