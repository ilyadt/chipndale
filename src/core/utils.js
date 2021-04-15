'use strict'

const hmac = require("./primitives/hmac")
const combin = require("./primitives/combinatorics")
const interpolation = require("./primitives/interpolate")
const config = require('./config')

class BigPoint {
    /**
     * @param {int} x
     * @param {Buffer} Fx
     */
    constructor(x, Fx) {
        this.x = x;
        this.Fx = Fx;
    }
}

/**
 * @param {BigPoint[]} sharePoints
 * @return {Buffer|null}
 */
function secretFromPoints(sharePoints) {

    let secret = interpolateBigPoints(config.keyCoordinate, sharePoints)
    let cs = interpolateBigPoints(config.csCoordinate, sharePoints)

    return isSecretValid(secret, cs) ? secret : null
}

/**
 * @param {int} x
 * @param {BigPoint[]} sharePoints
 * @return {Buffer}
 */
function interpolateBigPoints(x, sharePoints) {

    let shareLength = sharePoints[0].Fx.length

    let res = Buffer.alloc(shareLength)
    for (let byte = 0; byte < shareLength; byte++) {

        let points = sharePoints.map(share => new interpolation.point(share.x, share.Fx[byte]))

        res[byte] = interpolation.interpolate(x, points)
    }

    return res
}

/**
 * Checks the correctness of the checksum
 * @param {Buffer} secret - byte array of secret
 * @param {Buffer} cs - byte array of checksum
 *
 * @return {boolean}
 */
function isSecretValid(secret, cs) {

    const {csKeySize, csHashSize} = csParams(cs.length)

    let calculatedHmac = hmac(secret, cs.slice(0, csKeySize), csHashSize)

    let hmacSum = cs.slice(csKeySize, cs.length)

    return hmacSum.equals(calculatedHmac)
}

/**
 * Only one coordinate position for all C(n,k) shares must have valid checksum
 * It guaranties that it will be decoded properly
 * @param {Buffer[]} shares
 * @param {int} k
 * @return {boolean}
 */
function sharesHaveDualism(shares, k) {

    let secretCandidate = null

    // Possible X coordinates of a point [1, 2, ... maxShares]
    let x = Array.from({length: config.maxShares}, (x, i) => i+1);

    for (let combination of combin.combinations(shares.length, k)) { // C(n,k)

        let sharesCombination = combination.map(i => shares[i])

        for (let permutation of combin.permutations(config.maxShares, sharesCombination.length)) { // P(n, k)

            let points = permutation.map((pVal, i) => new BigPoint(x[pVal], sharesCombination[i]))

            let newSecretCandidate = secretFromPoints(points)

            if (newSecretCandidate === null) {
                continue
            }

            // If we have found another keyCandidate
            if (secretCandidate !== null && !newSecretCandidate.equals(secretCandidate)) {
                return true
            }

            secretCandidate = newSecretCandidate
        }
    }

    if (secretCandidate === null) {
        throw new Error('no secret candidates')
    }

    return false
}

/**
 * @param {int} l - number of bytes of the secret
 *
 * @return {object}
 */
function csParams(l) {

    let csKeySize = (l < 64) ? Math.floor(l / 2) : l - 32;

    return {
        csKeySize: csKeySize,
        csHashSize: l - csKeySize,
    }
}

module.exports.csParams = csParams
module.exports.isSecretValid = isSecretValid
module.exports.interpolateBigPoints = interpolateBigPoints
module.exports.sharesHaveDualism = sharesHaveDualism
module.exports.BigPoint = BigPoint
module.exports.secretFromPoints = secretFromPoints