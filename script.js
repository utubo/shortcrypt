const BITS = 512;
const PREFIX_LEN = 4;
const DEFAULT_KEY_LEN = 32;

let prefix = ''; // for generate a different URL each time with the same password.
let data = location.search.substr(4);
if (data && data[PREFIX_LEN] === '=') {
  prefix = data.substr(0, PREFIX_LEN);
  data = data.substr(PREFIX_LEN + 1);
}

const setupTopPage = () => {
  startPage.classList.remove('hidden');

  const generateEncURL = e => {
    const prefix = Math.random()
      .toString(36)
      .substr(2, PREFIX_LEN)
      .padEnd(PREFIX_LEN, 'a');
    const passPhrase = prefix + encPass.value;
    const privateKey = cryptico.generateRSAKey(passPhrase, BITS);
    const publicKey = cryptico.publicKeyString(privateKey);
    const url = new URL(location.href);
    url.hash = encodeURI(bobName.value);
    url.search = '?enc' + prefix + '=' + publicKey;
    receiveBoxLink.href = url.href;
    receiveBoxLink.textContent = url.href;
  }

  encPass.addEventListener('input', generateEncURL);
  bobName.addEventListener('input', generateEncURL);

  createEncKeyBtn.addEventListener('click', e => {
    while (encPass.value.length < DEFAULT_KEY_LEN) {
      encPass.value += Math.random().toString(36).substr(2, DEFAULT_KEY_LEN);
    }
    generateEncURL();
  });

  showEncPass.addEventListener('change', () => {
    encPass.setAttribute('type', showEncPass.checked ? 'text': 'password');
  });
  showEncPass.checked = false;
};

const setupEncPage = () => {
  encPage.classList.remove('hidden');

  if (location.hash) {
    const name = decodeURI(location.hash.replace(/^#|\?.*$/g, ''));
    for (const b of document.getElementsByClassName('to-bob')) {
      b.textContent = b.textContent.replace('{bob}', name);
      b.classList.remove('hidden');
    }
  }

  plainText.addEventListener('input', e => {
    const publicKey = data;
    const crypted = cryptico.encrypt(encodeURI(plainText.value), publicKey);
    if (crypted.status === 'success') {
      const url = new URL(location.href);
      url.search = '?dec';
      if (prefix) {
        url.search += prefix + '=';
      }
      url.search += crypted.cipher;
      url.hash = '';
      cryptedLink.href = url.href;
      cryptedLink.textContent = url.href;
      cryptedLink.classList.remove('error');
    } else {
      cryptedLink.textContent = crypted.status;
      cryptedLink.removeAttribute('href');
      cryptedLink.classList.add('error');
    }
  });
};

const setupDecPage = () => {
  decPage.classList.remove('hidden');

  decryptedText.textContent = location.search.substr(1);

  decPass.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      decBtn.click();
    }
  });

  decBtn.addEventListener('click', e => {
    const passPhrase = prefix + decPass.value;
    const privateKey = cryptico.generateRSAKey(passPhrase, BITS);
    const publicKey = cryptico.publicKeyString(privateKey);
    const cipher = data;
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
};

if (location.search.startsWith('?enc')) {
  setupEncPage();
} else if (location.search.startsWith('?dec')) {
  setupDecPage();
} else {
  setupTopPage();
}

