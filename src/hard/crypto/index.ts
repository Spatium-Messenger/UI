import {
  generateKey,
  exportPublicKey,
  exportPrivateKey,
  encryptData,
  decryptData,
} from "./methods";

let keyPair: CryptoKeyPair;
// let privatePem: string;
const vector = new Uint8Array([1, 0, 1]);

export async function GenerateKeys(): Promise<void> {
  keyPair = (await generateKey(
    {
      extractable: true,
      hash: {
        name: "SHA-1",
      },
      modulusLength: 2048,
      name: "RSA-OAEP",
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    ["encrypt", "decrypt"],
  )) as CryptoKeyPair;
  console.log("RSA Key pair generated!!!");
  return;
}

export async function publicKeyToJWT(): Promise<JsonWebKey> {
  if (!keyPair) {
    await new Promise((res) => setTimeout(res, 50));
    return publicKeyToJWT();
  }
  return exportPublicKey(keyPair);
}

// export async function privateKeyToPem(): Promise<string> {
//   if (privatePem.length === 0) {
//     privatePem = await exportPrivateKey(keyPair);
//   }
//   return privatePem;
// }

export async function Encrypt(toEncrypt: string): Promise<string> {
  return encryptData(vector, keyPair.publicKey, toEncrypt);
}

export async function Decrypt(toDecrypt: string): Promise<string> {
  return decryptData(vector, keyPair.privateKey, toDecrypt);
}

export async function Test() {
  await GenerateKeys();
  console.log(await publicKeyToJWT());

  const encrypted = await Encrypt("Hello");
  console.log(`Encrypted - ${encrypted}`);
  const decrypted = await Decrypt(encrypted);
  if (decrypted !== "Hello") {
    console.log(
      `Test failed, decrypted should be 'Hello', but got - ${decrypted}`,
    );
    return;
  } else {
    console.log("Test success!!!");
  }
}
