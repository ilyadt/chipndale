const crypto = require('crypto')

/**
 *
 * @param {Buffer} data
 * @param {Buffer} secret
 * @param {int} bytes
 *
 * @return Buffer
 */
function hmac(data, secret, bytes) {

    if (bytes < 1 || bytes > 32) {
        throw new Error("Wrong number of bytes")
    }

    return  crypto.createHmac('sha256', secret)
        .update(data)
        .digest()
        .slice(0, bytes)
}

module.exports = hmac
