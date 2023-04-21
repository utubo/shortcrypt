const BITS = 512;

if (location.search.startsWith('?enc')) {
  encPage.classList.remove('hidden');
  if (location.hash) {
    const name = decodeURI(location.hash.replace(/^#|\?.*$/g, ''));
    for (const b of document.getElementsByClassName('to-bob')) {
      b.textContent = b.textContent.replace('{bob}', name);
      b.classList.remove('hidden');
    }
  }
} else if (location.search.startsWith('?dec')) {
  decPage.classList.remove('hidden');
  decryptedText.textContent = location.search.substr(4);
} else {
  startPage.classList.remove('hidden');
}

const generateEncURL = e => {
  const passPhrase = encPass.value;
  const privateKey = cryptico.generateRSAKey(passPhrase, BITS);
  const publicKey = cryptico.publicKeyString(privateKey);
  const url = new URL(location.href);
  url.hash = encodeURI(bob.value);
  url.search = '?enc' + publicKey;
  receiveBoxLink.href = url.href;
  receiveBoxLink.textContent = url.href;
}
encPass.addEventListener('input', generateEncURL);
bob.addEventListener('input', generateEncURL);

plainText.addEventListener('input', e => {
  const publicKey = location.search.substr(4).replace(/#.*$/, '');
  const crypted = cryptico.encrypt(encodeURI(plainText.value), publicKey);
  if (crypted.status === 'success') {
    const url = new URL(location.href);
    url.search = '?dec' + crypted.cipher;
    url.hash = '';
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
