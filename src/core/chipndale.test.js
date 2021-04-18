'use strict'

const chipndale = require('./chipndale')
const combin = require('./primitives/combinatorics')
const crypto = require('crypto')
const testVectors = require('./test_vectors.json')

test.each(testVectors)('SplitSecret', (testVector) => {

    crypto.randomBytes = jest.fn()
    crypto.randomBytes.mockReturnValueOnce(Buffer.from(testVector.randomCsKey, 'hex'))

    testVector.randomCoordinateVector.map(v => crypto.randomBytes.mockReturnValueOnce(Buffer.from(v, 'hex')))

    const res = chipndale.SplitSecret(Buffer.from(testVector.secret, 'hex'), testVector.k, testVector.n)

    expect(res.length).toBe(testVector.shares.length)
    res.map(v => {
        expect(testVector.shares).toContain(v.toString('hex'))
    })
})

test.each([
    '11223344556677', // < min length
    '1122334455667788112233445566778811223344556677889', // incorrect bytes representation
])('SplitSecret invalid secret', (secret) => {
    expect(() => chipndale.SplitSecret(secret, 2, 4)).toThrow()
})

test.each(testVectors)('RecoverSecret', (testVector) => {

    let combinations = combin.combinations(testVector.n, testVector.k)

    for (let combination of combinations) {

        let shares = []
        for (let i = 0; i < testVector.k; i++) {
            shares.push(testVector.shares[combination[i]])
        }

        const res = chipndale.RecoverSecret(shares)

        expect(res.toString('hex')).toBe(testVector.secret)
    }
})


test.each(testVectors)('RecoverSecret k-1 shares', (testVector) => {

    let combinations = combin.combinations(testVector.n, testVector.k-1)

    for (let combination of combinations) {

        let shares = []
        for (let i = 0; i < testVector.k - 1; i++) {
            shares.push(testVector.shares[combination[i]])
        }

        expect(() => chipndale.RecoverSecret(shares)).toThrow()
    }
})

