import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {

  

  const [currentAccount,setCurrentAccount] = useState(false)

  const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({method: 'eth_accounts'})

    if(accounts.length !== 0) {
      const account = accounts[0]
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized accounts found!");
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window
      if(!ethereum) {
        alert('install metamask')
      }
      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch(error) {
      console.log(error)
    }
  }

  

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
     <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount ?(
            <button onClick={null} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          ) : (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect to Wallet
            </button>
            )
          }
        </div>
        <div className="footer-container">
        </div>
      </div>
    </div>
  )
}
