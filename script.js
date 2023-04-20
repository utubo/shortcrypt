const BITS = 512;

if (location.search.startsWith('?enc')) {
  encPage.classList.remove('hidden');
  toName.textContent = location.search.substr(1, 10)  + '...'
} else if (location.search.startsWith('?dec')) {
  decPage.classList.remove('hidden');
  decryptedText.textContent = location.search.substr(4);
} else {
  startPage.classList.remove('hidden');
}

encPass.addEventListener('input', e => {
  const passPhrase = encPass.value;
  const privateKey = cryptico.generateRSAKey(passPhrase, BITS);
  const publicKey = cryptico.publicKeyString(privateKey);
  const url = new URL(location.href);
  url.search = '?enc' + publicKey;
  receiveBoxLink.href = url.href;
  receiveBoxLink.textContent = url.href;
});

plainText.addEventListener('input', e => {
  const publicKey = location.search.substr(4);
  const crypted = cryptico.encrypt(encodeURI(plainText.value), publicKey);
  if (crypted.status === 'success') {
    const url = new URL(location.href);
    url.search = '?dec' + crypted.cipher;
    cryptedLink.href = url.href;
    cryptedLink.textContent = url.href;
  } else {
    cryptedLink.href = '#';
    cryptedLink.textContent = crypted.status;
  }
});

decPass.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    decBtn.click();
  }
});

decBtn.addEventListener('click', e => {
  const passPhrase = decPass.value;
  const privateKey = cryptico.generateRSAKey(passPhrase, BITS);
  const publicKey = cryptico.publicKeyString(privateKey);
  const cipher = location.search.substr(4);
  const result = cryptico.decrypt(cipher, privateKey);
  if (result.status === 'success') {
    decryptedText.textContent = decodeURI(result.plaintext);
    decryptedText.classList.add('decrypted');
    decryptedText.classList.remove('error');
  } else {
    decryptedText.textContent = result.status;
    decryptedText.classList.add('error');
  }
});
