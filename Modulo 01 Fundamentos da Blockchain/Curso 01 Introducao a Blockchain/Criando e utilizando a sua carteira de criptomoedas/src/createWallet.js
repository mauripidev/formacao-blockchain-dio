const bip32 = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

const network = bitcoin.networks.testnet; // Use bitcoin.networks.bitcoin for production

// derivação de carteira Hierárquica Determinística (HD)
const path = "m/49'/1'/0'/0'"; // Caminho BIP44 para Testnet

//criando o memonic para a seed (palavras de senha)
let mnemonic = bip39.generateMnemonic(); // Exemplo de frase mnemônica
const seed = bip39.mnemonicToSeedSync(mnemonic);

//criando a raiz da carteira HD
const root = bip32.fromSeed(seed, network);

//criando uma conta - par de chaves (chave privada e pública)
let account = root.derivePath(path); // Derivando a primeira conta
let node = account.derive(0).derive(0); // Derivando o primeiro endereço da conta


//gerando o endereço P2SH-P2WPKH (SegWit)
const { address } = bitcoin.payments.p2sh({
  redeem: bitcoin.payments.p2wpkh({ 
    pubkey: account.publicKey, 
    network }),
  network,
});

console.log("Mnemonic:", mnemonic);
console.log("Endereço P2SH-P2WPKH:", address);
console.log("Chave Privada (WIF):", node.toWIF());
console.log("Chave Pública:", account.publicKey.toString('hex'));
