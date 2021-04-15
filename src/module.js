// Complete module

const mnemonic = require('./mnemonic')
const secret = require('./core/chipndale')
const bip39 = require('bip39')
const crypto = require('crypto')

module.exports.SplitSecret = secret.SplitSecret
module.exports.RecoverSecret = secret.RecoverSecret

module.exports.SplitMnemonic = mnemonic.SplitMnemonic
module.exports.RecoverMnemonic = mnemonic.RecoverMnemonic

module.exports.generateMnemonic = (wordsCount) => {
    if (![12,15,18,21,24].includes(wordsCount)) {
        throw new Error('invalid number of words')
    }

    let bytesMap = {12:16, 15:20, 18:24, 21:28, 24:32}

    let bytes = crypto.randomBytes(bytesMap[wordsCount])

    return bip39.entropyToMnemonic(bytes)
}

module.exports.generateSecret = (bytes) => {
    return crypto.randomBytes(bytes)
}

module.exports.isValidMnemonic = (mnemonic) => {
    return bip39.validateMnemonic(mnemonic)
}

module.exports.isValidHex = (hex) => {
    let reg = /^[0-9A-F]*$/i
    return reg.test(hex)
}
