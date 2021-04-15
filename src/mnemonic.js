'use strict'

const bip39 = require('bip39')
const chipndale = require('./core/chipndale')
const wordlist = bip39.wordlists['english']

/**
 *
 * @param {string} mnemonic
 * @param {int} n
 * @param {int} k
 *
 * @return string[]
 */
module.exports.SplitMnemonic = function (mnemonic, n, k)
{
    mnemonic = mnemonic.trim().split(/\s+/).join(' ')

    preCheckMnemonic(mnemonic)

    let entropy = Buffer.from(bip39.mnemonicToEntropy(mnemonic), 'hex')

    let shares = chipndale.SplitSecret(entropy, k, n)

    return shares.map(share => bip39.entropyToMnemonic(share))
}

/**
 *
 * @param {string[]} mnemonics
 *
 * @return string
 */
module.exports.RecoverMnemonic = function (mnemonics)
{
    let shares = mnemonics
        .map(mnemonic => {
            mnemonic = mnemonic.trim().split(/\s+/).join(' ')

            preCheckMnemonic(mnemonic)

            return bip39.mnemonicToEntropy(mnemonic)
        })

    return bip39.entropyToMnemonic(chipndale.RecoverSecret(shares))
}

function preCheckMnemonic(mnemonic) {

    if (mnemonic === '') {
        throw new Error('Empty mnemonic')
    }

    mnemonic.split(' ').map(word => {
        if (wordlist.indexOf(word) === -1) {

            throw new Error(`Invalid mnemonic, word '${word}' is unknown`)
        }
    })
}
