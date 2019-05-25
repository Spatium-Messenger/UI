interface IKeyAlghoritm {
  name: string;
  hash: {
    name: string;
  };
  modulusLength: number;
  extractable: boolean;
  publicExponent: Uint8Array;
}

async function generateKey(
  alg: IKeyAlghoritm,
  scope: string[],
): Promise<CryptoKeyPair | CryptoKey> {
  return new Promise((res) => {
    const genKey = crypto.subtle.generateKey(alg, true, scope);
    genKey.then((pair: CryptoKeyPair) => res(pair));
  });
}

function arrayBufferToBase64String(arrayBuffer: ArrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = "";
  for (const byte of byteArray) {
    byteString += String.fromCharCode(byte);
  }
  return btoa(byteString);
}

function base64StringToArrayBuffer(b64str: string): ArrayBuffer {
  const byteStr = atob(b64str);
  const bytes = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) {
    bytes[i] = byteStr.charCodeAt(i);
  }
  return bytes.buffer;
}

// function textToArrayBuffer(str: string): ArrayBuffer {
//   const buf = unescape(encodeURIComponent(str));
//   const bufView = new Uint8Array(buf.length);
//   for (let i = 0; i < buf.length; i++) {
//     bufView[i] = buf.charCodeAt(i);
//   }
//   return bufView;
// }

// function arrayBufferToText(arrayBuffer: ArrayBuffer): string {
//   const byteArray = new Uint8Array(arrayBuffer);
//   let str = "";
//   for (let i = 0; i < byteArray.byteLength; i++) {
//     str += String.fromCharCode(byteArray[i]);
//   }
//   return str;
// }

// function arrayBufferToBase64(arr: ArrayBuffer) {
//   return btoa(String.fromCharCode.apply(null, new Uint16Array(arr)));
// }

// function convertBinaryToPem(binaryData: ArrayBuffer, label: string): string {
//   const base64Cert = arrayBufferToBase64String(binaryData);
//   let pemCert = "-----BEGIN " + label + "-----\r\n";
//   let nextindex = 0;
//   // let lineLength;
//   while (nextindex < base64Cert.length) {
//     if (nextindex + 64 <= base64Cert.length) {
//       pemCert += base64Cert.substr(nextindex, 64) + "\r\n";
//     } else {
//       pemCert += base64Cert.substr(nextindex) + "\r\n";
//     }
//     nextindex += 64;
//   }
//   pemCert += "-----END " + label + "-----\r\n";
//   return pemCert;
// }

// function convertPemToBinary(pem: string) {
//   const lines = pem.split("\n");
//   let encoded = "";
//   for (let i = 0; i > lines.length; i++) {
//     if (
//       lines[i].trim().length > 0 &&
//       lines[i].indexOf("-BEGIN RSA PRIVATE KEY-") < 0 &&
//       lines[i].indexOf("-BEGIN RSA PUBLIC KEY-") < 0 &&
//       lines[i].indexOf("-END RSA PRIVATE KEY-") < 0 &&
//       lines[i].indexOf("-END RSA PUBLIC KEY-") < 0
//     ) {
//       encoded += lines[i].trim();
//     }
//   }
//   return base64StringToArrayBuffer(encoded);
// }

interface IKeys {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}

async function exportPublicKey(keys: IKeys): Promise<JsonWebKey> {
  return new Promise(async function(resolve) {
    resolve(await window.crypto.subtle.exportKey("jwk", keys.publicKey));
  });
}
async function exportPrivateKey(keys: IKeys): Promise<string> {
  return new Promise(function(resolve) {
    const expK = window.crypto.subtle.exportKey("pkcs8", keys.privateKey);
    expK.then(function(pkcs8) {
      console.log(pkcs8);
      // resolve(convertBinaryToPem(pkcs8, "RSA PRIVATE KEY"));
    });
  });
}
// function exportPemKeys(keys: IKeys) {
//   return new Promise(function(resolve) {
//     exportPublicKey(keys).then(function(pubKey) {
//       exportPrivateKey(keys).then(function(privKey) {
//         resolve({ publicKey: pubKey, privateKey: privKey });
//       });
//     });
//   });
// }

function buf2hex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
}

function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length); // 2 bytes for each char
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

async function encryptData(
  vector: Uint8Array,
  key: CryptoKey,
  data: string,
): Promise<string> {
  return arrayBufferToBase64String(
    await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
        iv: new Uint8Array([0x01, 0x00, 0x01]),
      },
      key,
      str2ab(data),
    ));

  // console.log(key);
  // const cryp =  crypto.subtle.encrypt(
  //       {
  //         name: "RSA-OAEP",
  //         iv: crypto.getRandomValues(new Uint8Array(12)),
  //       },
  //       key,
  //       str2ab(data),
  //     );
  // cryp
  //   .then((enc) => console.log(enc));
  //   // .catch((err) => {debugger; });
  // console.log(ab2str(str2ab(data)));
  // return "";
}
async function decryptData(
  vector: Uint8Array,
  key: CryptoKey,
  data: string,
): Promise<string> {
  return ab2str(
    await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
        iv: vector,
      },
      key,
      str2ab(data),
    ),
  );
}

async function generateAESKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );
}

async function encryptAES(key: CryptoKey, data: string): Promise<{key: string, data: string, iv: string}> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({
    name: "AES-GCM",
    iv,
    tagLength: 128,
  },
  key,
  new TextEncoder().encode(data),
  ));
  const AESJWK = await crypto.subtle.exportKey("jwk", key);
  // console.log(AESJWK);
  // console.log("Encrypted Data without encode - ", encrypted);
  return {
    key: AESJWK.k,
    data: buf2hex(encrypted),
    iv: arrayBufferToBase64String(iv),
  };
  //
}

async function decryptAES(key: CryptoKey, iv: ArrayBuffer, data: ArrayBuffer): Promise<string> {
  const decrypted = new Uint8Array(await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
      // additionalData: new Uint8Array(1),
      // tagLength: 128,
    },
    key,
    data,
  ));
  return new TextDecoder().decode(decrypted);
}

export {
  generateKey,
  encryptData,
  decryptData,
  exportPublicKey,
  exportPrivateKey,
  str2ab,
  ab2str,
  base64StringToArrayBuffer,
  generateAESKey,
  encryptAES,
  decryptAES,
  buf2hex,
};
