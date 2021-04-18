'use strict'

const crypto = require('crypto')
const utils = require('./utils')
const config = require('./config')
const combin = require('./primitives/combinatorics')
const polynomial = require('./primitives/interpolate')
const hmac = require('./primitives/hmac')

/**
 * Divide `secret` with Shamir (k, n) threshold scheme
 *
 * @param {Buffer|string} secret byte array
 * @param {int} k
 * @param {int} n
 * @return {Buffer[]}
 */
function SplitSecret(secret, k, n) {

    // in case of hex string
    if (!Buffer.isBuffer(secret)) {
        let decoded = Buffer.from(secret, 'hex').toString('hex')

        if (decoded !== secret) {
            throw new Error("incorrect bytes representation")
        }
        secret = Buffer.from(secret, 'hex')
    }

    // irrelevant splitting secret which has too few bytes
    if (secret.length < config.minSecretLength) {
        throw new Error("Too small secret. Min " + config.minSecretLength + " bytes")
    }

    if (n > config.maxShares) {
        throw new Error("Max shares is " + config.maxShares)
    }

    if (k < 2 || k > n) {
        throw new Error("Min required shares must be >= 2 and <= total shares")
    }

    let shares = Array.from({length: n}, () => Buffer.alloc(secret.length))

    let csKeySize = secret.length - config.csHashSize
    let csKey = crypto.randomBytes(csKeySize)
    let hmacSum = hmac(secret, csKey, config.csHashSize)

    let cs = Buffer.alloc(secret.length)
    csKey.copy(cs, 0)
    hmacSum.copy(cs, csKeySize)

    let randVectors = []
    for (let x = 1; x <= k-2; x++) {
        randVectors.push(crypto.randomBytes(secret.length))
    }

    for (let byte = 0; byte < secret.length; byte++) {

        let points = [] // Exactly k points

        for (let x = 1; x <= k-2; x++) {
            points.push(new polynomial.point(x, randVectors[x-1][byte]))
            shares[x-1][byte] = randVectors[x-1][byte]
        }

        // Point containing secret
        points.push(new polynomial.point(config.keyCoordinate, secret[byte]))

        // Point containing checksum
        points.push(new polynomial.point(config.csCoordinate, cs[byte]))

        // Calculating left shares
        for (let x = k-1; x <= n; x++) {
            shares[x-1][byte] = polynomial.interpolate(x, points)
        }
    }

    // Check for one variant recover
    if (utils.sharesHaveDualism(shares, k)) {
        throw new Error("Try again please, something went wrong")
    }

    return shares
}

/**
 * Get secret from shares
 * @param {Buffer[]} shares
 * @return {Buffer}
 */
function RecoverSecret(shares) {

    if (shares.length < 2 || shares.length > config.maxShares) {
        throw new Error("Min shares is 2, max shares is " + config.maxShares)
    }

    // in case of hex strings
    shares = shares.map(share => Buffer.from(share, 'hex'))

    const shareLength = shares[0].length
    for (let i = 1; i < shares.length; i++) {
        if (shares[i].length !== shareLength) {
            throw new Error("Shares must have equal length")
        }
    }

    // Possible X coordinates of a point [1, 2, ... maxShares]
    let x = Array.from({length: config.maxShares}, (x, i) => i+1);

    for (const permutation of combin.permutations(config.maxShares, shares.length)) {

        let points = permutation.map((pVal, i) => new utils.BigPoint(x[pVal], shares[i]))

        let secret = utils.secretFromPoints(points)

        if (secret !== null) {
            return secret
        }
    }

    throw new Error("shares not valid / not enough shares to recover")
}

module.exports.SplitSecret = SplitSecret
module.exports.RecoverSecret = RecoverSecret
