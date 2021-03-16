const assert = require('assert');
const EC = require('elliptic').ec;
const keccak_256 = require('js-sha3').keccak_256;


async function main() {
  try {
    const ec = new EC('secp256k1');

    // Decode public key
    const key = ec.keyFromPublic('025f37d20e5b18909361e0ead7ed17c69b417bee70746c9e9c2bcb1394d921d4ae', 'hex');

    // Convert to uncompressed format
    const publicKey = key.getPublic().encode('hex').slice(2);

    // Now apply keccak
    const address = keccak_256(Buffer.from(publicKey, 'hex')).slice(64 - 40);

    console.log(`Public Key: 0x${publicKey}`);
    console.log(`Address: 0x${address.toString()}`);
  } catch (err) {
    console.log(err);
  }
}

main();

