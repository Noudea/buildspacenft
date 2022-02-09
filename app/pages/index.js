import { ethers } from 'ethers'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import GradientButton from '../components/GradientButton'
import styles from '../styles/Home.module.css'
import myEpicNft from '../utils/MyEpicNFT.json'

export default function Home() {

  

  const [currentAccount,setCurrentAccount] = useState(false)
  const [isMinting,setIsMinting] = useState(false)
  const [hasMinted,setHasMinted] = useState(false)
  const [tokenId,setTokenId] = useState(false)
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
      setupEventListener()
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
      setupEventListener() 
    } catch(error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    setIsMinting(false)
    setHasMinted(false)
    setTokenId(false)
    const CONTRACT_ADDRESS = "0xa33c278a6B38d439B5BD1Ec55440136046e6CfB7";
    try {
      const {ethereum} = window
      if(ethereum) {
        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4"; 
        if (chainId !== rinkebyChainId) {
          alert("You are not connected to the Rinkeby Test Network!");
          return false
        }
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)
        console.log("going to pop wallet now to pay gas ...")
        let nftTxn = await connectedContract.makeAnEpicNFT()
        console.log("Mining...please wait.")
        setIsMinting(true)
        await nftTxn.wait()
        setIsMinting(false)
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
      } else {
        console.log('Ethereum is not available')
      }
    } catch (error) {
      console.log(error)
    }
  }

    // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    const CONTRACT_ADDRESS = "0xa33c278a6B38d439B5BD1Ec55440136046e6CfB7";
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          setTokenId(tokenId.toNumber())
          setHasMinted(true)
          //alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
     <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.gradientText}>My NFT Collection</h1>
          <p>
            Each unique. Each beautiful. Discover your NFT today. Each nft is compose of 3 randoms words.
          </p>
          {currentAccount ?(
            <>
              {isMinting != true && <GradientButton text='Mint NFT' onClick={askContractToMintNft} />}
            </>
          ) : (
            <GradientButton text='Connect to Wallet' onClick={connectWallet} />
            )
          }
        </div>
        {isMinting && <p>minting nft please wait</p>}
        {hasMinted && 
          <div className="nft preview">
            <p>Your nft is avaible <a rel="noreferrer" href={`https://rinkeby.rarible.com/token/0xa33c278a6B38d439B5BD1Ec55440136046e6CfB7:${tokenId}`} target="_blank">here</a>, it can take up to 5 minutes to see your nft</p>
          </div>
        }
        <div>
          <a  target="_blank" rel="noreferrer" href='https://rinkeby.rarible.com/collection/0xa33c278a6b38d439b5bd1ec55440136046e6cfb7/items'><svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#FEDA03"></rect><path d="M27.6007 19.8536C28.8607 19.5262 29.9817 18.5838 29.9817 16.6889C29.9817 13.5342 27.3031 12.8 23.8706 12.8H10.2V27.0064H15.9539V22.185H22.7793C23.8309 22.185 24.446 22.6016 24.446 23.6334V27.0064H30.2V23.4548C30.2 21.5203 29.1087 20.3 27.6007 19.8536ZM22.8785 18.3556H15.9539V16.9667H22.8785C23.6325 16.9667 24.0888 17.0659 24.0888 17.6612C24.0888 18.2564 23.6325 18.3556 22.8785 18.3556Z" fill="black"></path></svg> View Collection on Rarible</a>
        </div>
    
    </div>
  )
}
