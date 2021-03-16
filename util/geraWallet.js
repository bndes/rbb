const ethers  = require('ethers');
require("dotenv").config();
const fs = require('fs');

let wallet = ethers.Wallet.createRandom();
const password = process.env.PASSWORD_WALLET;

const promisseJSON = wallet.encrypt( password);
promisseJSON.then((jsonWallet) => {
    console.log(jsonWallet);
    fs.writeFileSync("teste.json", jsonWallet);
});



