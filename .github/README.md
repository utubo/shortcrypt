# Shortcrypt

A easy page to RSA encrypt short text.

**⚠Caution**
- This is not secure. (This is easily brute-force attacked.)
- The URLs contains all encrypted data, so better not to have long text.

## Usage
1. Bob (he wants to receive a message) opens [here](https://utubo.github.io/shortcrypt/), inputs a key(passphrase) to generate the URL of the page for encryption, and publishes the URL.
2. Alice (she wants to send a message) opens the URL published by Bob, inputs the text and passes the generated URL to Bob.
3. Bob opens the URL received from Alice, and can input the key(passphrase) to decrypt the text.

## Thx
Shortcrypt is powered by [cryptico](https://github.com/wwwtyro/cryptico).

