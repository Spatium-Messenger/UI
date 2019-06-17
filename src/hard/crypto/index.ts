import {
  generateKey,
  exportPublicKey,
  encryptData,
  generateAESKey,
  encryptAES,
  decryptData,
  base64StringToArrayBuffer,
  decryptAES,
  str2ab,
  ab2str,
} from "./methods";
//
//
// All necessary inforamtion is -> https://tools.ietf.org/html/rfc7518
//
//
// CPKey  - Client's Public Key
// SPKey  - Server's Public Key
// ENCAESKey - Encrypted AES Key
//
//
//                Client                    Server
//   Creating RSA Keys  |                         | Creating RSA Keys
//                      |       Connecting        |
//                      |   ------------------>   |
//                      |                         |
//                      |     Sending RSA CPKey   |
//                      |   ------------------>   |
//                      |                         |
//                      |     Sending RSA SPKey   |
//                      |   <------------------   |
//                      |                         |
//   Creating AES keys  |                         |
//                      |                         |
//   Encrypting message |                         |
//   by AES key         |                         |
//                      |                         |
//   Encrypting AES key |                         |
//   by SPKey           |                         |
//                      |    Sending ENCAESKey    |
//                      |           and           |
//                      |     encrypted message   |
//                      |   ------------------>   |
//                      |                         |   Decrypt ENCAESKey
//                      |                         |
//                      |                         |   Decypt message by decrypted ENCAESKey
//                      |                         |
//                      |                         |
//                      |                         |
//                      |                         |

interface IEncryptedMessage {
  Key: string;
  Data: string;
  IV: string;
}

let keyPair: CryptoKeyPair;
const vector = new Uint8Array([1, 0, 1]);

export async function GenerateKeys(): Promise<void> {
  keyPair = (await generateKey(
    {
      extractable: true,
      hash: {
        name: "SHA-256",
      },
      modulusLength: 2048,
      name: "RSA-OAEP",
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    ["encrypt", "decrypt", "wrapKey"],
  )) as CryptoKeyPair;
  console.log("RSA Key pair generated!!!");
  return;
}

export async function publicKeyToJWK(): Promise<JsonWebKey> {
  if (!keyPair) {
    await new Promise((res) => setTimeout(res, 50));
    return publicKeyToJWK();
  }
  return exportPublicKey(keyPair);
}

export async function JWKToPublicKey(key: JsonWebKey): Promise<CryptoKey> {
  // key.n = atob(key.n);
  const cryptokey = await crypto.subtle.importKey(
    "jwk",
    key,
    {
      name: "RSA-OAEP",
      hash: {
        name: "SHA-256",
      },
    },
    true,
    ["encrypt", "wrapKey"],
  );
  return cryptokey;
}

export async function EncryptMessage(pubkey: CryptoKey, data: string): Promise<IEncryptedMessage> {
  // data = btoa(data);
  // console.log()
  const aesKey = await generateAESKey();
  const encdata = await encryptAES(aesKey, data);
  // console.log("AES ENCODING --------");
  // console.log("Encrypted Data - ", base64StringToArrayBuffer(encdata.data));
  // console.log("Key Within Base64Url - ", str2ab(encdata.key));
  // console.log("Key Without Base64 - ", str2ab(atob(encdata.key)));
  // console.log("IV - ", base64StringToArrayBuffer(encdata.iv));
  // console.log(encdata.pass);
  const encryptedAESKey = await encryptData(vector, pubkey, encdata.key);
  // console.log(base64StringToArrayBuffer(encryptedAESKey));
  const message: IEncryptedMessage = {
    Key: encryptedAESKey,
    Data: encdata.data,
    IV: encdata.iv,
  };
  // console.log(`AES encrypted - ${encdata.data}, AES Key encrypted - ${encryptedAESKey}`);
  return message;
}

export async function DecryptMessage(data: IEncryptedMessage): Promise<string> {
  const IV = base64StringToArrayBuffer(data.IV);
  const Data = data.Data;
  const encryptedAESKeyValue = base64StringToArrayBuffer(data.Key);
  const AESKeyValue = await decryptData(new Uint8Array(IV), keyPair.privateKey, ab2str(encryptedAESKeyValue));
  const dataArray = new Uint8Array(Data.match(/[\da-f]{2}/gi).map(function(h) {
    return parseInt(h, 16);
  }));
  const aesKey = await crypto.subtle.importKey("jwk",
    {
      kty: "oct",
      k: AESKeyValue,
      alg: "A256GCM",
      ext: true,
    }, {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  const decryptedData = await decryptAES(aesKey, IV, dataArray);
  let decodedDecryptedData = "";
  try {
    decodedDecryptedData = atob(decryptedData);
  } catch (e) {
    decodedDecryptedData = decryptedData;
  }
  return decodedDecryptedData;
}

export async function PEMTOKEY(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(pemHeader.length + 1, pem.length - pemFooter.length - 1);
  const binaryDerString = window.atob(pemContents);
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"],
  );

}

export async function Test() {
  await GenerateKeys();
  // tslint:disable-next-line
  const testdata =  `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`;
  const jwk = await publicKeyToJWK();
  const keyByJWK = await JWKToPublicKey(jwk);
  const aesKey = await generateAESKey();
  const encdata = await encryptAES(aesKey, testdata);
  const encryptedAESKey = await encryptData(vector, keyByJWK, encdata.key);
  const message: IEncryptedMessage = {
    Key: encryptedAESKey,
    Data: encdata.data,
    IV: encdata.iv,
  };
  console.log(`Encrypted message - Data: ${message.Data}, \n key: ${message.Key}`);
  const decryptedPass = await decryptData(vector, keyPair.privateKey, atob(message.Key));
  console.log(`Decrypted Pass - ${decryptedPass} should be equal - ${encdata.key}`);
  const decryptedData = await decryptAES(aesKey, str2ab(decryptedPass), str2ab(atob(message.Data)));

  if (decryptedData !== "Hello") {
    console.log(
      `Test failed, decrypted should be 'Hello', but got - ${decryptedData}`,
    );
    return;
  } else {
    console.log("Test success!!!");
  }
}
