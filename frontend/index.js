import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected";
    console.log("Connected");
  } else {
    console.log("no metamask injected");
    connectButton.innerHTML = "Please connect wallet";
  }
}

async function fund() {
  console.log("fund");
  const ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    //to send transaction what we need is:
    //provider(blockchain node we can connect to)/connection to the blockchain
    //signer /wallet/someoen with gas
    //contract that we are interacting with (will need ABI and address of that contract)

    const provider = new ethers.providers.Web3Provider(window.ethereum); //provider is metamask
    const signer = provider.getSigner(); //whatever metamask account is conencted
    console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      //hey wait for this tx to finish
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`${transactionResponse.hash}...`);
  //listem for transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} block confirmations`
      );
      resolve();
    });
  });
  //lsiteners are put into the event loop and then rest is executed, if u want to wait then need a promise so await knows it needs to wait for promise to resolve or reject before moving on

  //create a listner for the blockchain
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); //whatever metamask account is conencted
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const TransactionResponse = await contract.withdraw();
      await listenForTransactionMine(TransactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
