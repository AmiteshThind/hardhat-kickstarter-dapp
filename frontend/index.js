import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

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
  const ethAmount = "2";
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

async function listenForTransactionMine(transactionResponse, provider) {
  console.log(`${transactionResponse.hash}...`);
  //listem for transaction to finish
  await provider.once(transactionResponse.hash, (transactionReceipt) => {
    console.log(
      `Completed with ${transactionReceipt.confirmations} block confirmations`
    );
  });

  //create a listner for the blockchain
}
