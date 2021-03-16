const ethers  = require('ethers');
require("dotenv").config();

//colocar senha-wersdfxcv
const encyptedWallet = require ('./wallet.json');
const password = process.env.PASSWORD_WALLET;

//console.log(encyptedWallet);
let wallet = ethers.Wallet.fromEncryptedJsonSync(JSON.stringify(encyptedWallet), password);


console.log(wallet.address);
console.log(wallet.privateKey);
console.log(wallet.publicKey);

const provider  = new ethers.providers.JsonRpcProvider("http://35.239.231.134:4545/");

wallet = wallet.connect(provider);

console.log(wallet);

wallet.getChainId().then( (chainId) => {
    console.log(chainId);
}); 


