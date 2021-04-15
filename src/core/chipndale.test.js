const chipndale = require('./chipndale')
const crypto = require('crypto')

const splitSecretData = [
    { // 32 byte secret
        n: 4,
        k: 2,
        secret: 'b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74', // 32 byte secret
        randomCsKey: '1f5e6947af4d06540936e9acdf13ed0c',
        randomCoordinateVector: [],
        result: [
            '3632a9812836077bae41a54ca92e698271cf3349355c3e1b3779e7cbb7406a53',
            'a464c3571b9bc4558e8fe035a4190430c4d79a27e5d8737f4ccb640f1351a93a',
            '2356e5ec0a09854f673c2aeb56fdd65e5edffdf45ca448aa65a5ecba865ee81d',
            '9bc817e07dda5909ce086ac7be77de4fb5e7d3fb5ecbe9b7bab4799c407334e8',
        ],
    },
    { // 24 byte secret
        n: 4,
        k: 3,
        secret: 'a3ec1b2759a07f6883032a3232dff906b4cae2c1da62a899',
        randomCsKey: 'c29fd3272086d7a2aa4e31bb',
        randomCoordinateVector: [
            '15405ec4ac925b790386f2408b3d839efc1f0433eb0fa8a4', // x1
        ],
        result: [
            '15405ec4ac925b790386f2408b3d839efc1f0433eb0fa8a4',
            'fb7898b47afdfdefc2daab10cebc6ee9e1f9c5b30e8b5c38',
            '4dd4dd578fcfd9fe425f7362775e1471a92c23413fe65c05',
            'afae22397afe65df72a79b43b3df5bfe279241278767a681',
        ],
    },
    { // 17 byte secret (even number of bytes)
        n: 3,
        k: 2,
        secret: 'a5f071e8d211789e6027536605ec2ecb5b',
        randomCsKey: '602dfb9a0e5e2993',
        randomCoordinateVector: [], //
        result: [
            '0a642be75ae4fe1276d7f5e39fb5010be4',
            'e0c3c5f6d9e06f9d4cdc04772a5e70503e',
            '4f579ff95115e9115a2ca2f2b0075f9081',
        ],
    },
    { // 80 byte secret (more than 64)
        n: 5,
        k: 5,
        secret: 'f01ce10663b385466c8544cfe658f1183f295b3e05eb896b0200eb66b8389c2ad85a0590aa6388fcd2500baef9789619ea5a9ed5a0ad35f609f74024304cb04fbb4b1e745141c06cd0fcc70b4f5b7eca',
        randomCsKey: '5830119a334d2ab23e80117663fb408103160d070992119c9fb78e4e8983e1785afb651c59dd0d588d096e8ae1c800eb', // 48 bit key
        randomCoordinateVector: [
            '97252cc4068fd25f78dcc32eff830359668469e8e06e01050cbf84a62af348da07a4e1f294d22844731c9ccef2f0dd2ce15c48c5da0a21fd129ef7488fc9ce8ece2b5e83005ce478e0b98c926e675c5c', // x1
            'e5148d5f54078e8cd0accd263ddc5cb2c5cd027b2bb7c727341b7a4a970c843568fca0019594c86e7bbef0771cb3e8e090d153bfb2e1c2c8ef99d57d2ed24239565af6caac9c3f3b04ecd52109b7240d', // x2
            '82de838f528a47f1966c072bbe920a682e76b964067e72cb6a024c8bb59698f8c643d6f39deb81cb4bff3a7bdb2790f90a8543fd79580905220d07524ab88135f1bf43d0772570a335f8f799a49bb074', // x3
        ],
        result: [
            '97252cc4068fd25f78dcc32eff830359668469e8e06e01050cbf84a62af348da07a4e1f294d22844731c9ccef2f0dd2ce15c48c5da0a21fd129ef7488fc9ce8ece2b5e83005ce478e0b98c926e675c5c',
            'e5148d5f54078e8cd0accd263ddc5cb2c5cd027b2bb7c727341b7a4a970c843568fca0019594c86e7bbef0771cb3e8e090d153bfb2e1c2c8ef99d57d2ed24239565af6caac9c3f3b04ecd52109b7240d',
            '82de838f528a47f1966c072bbe920a682e76b964067e72cb6a024c8bb59698f8c643d6f39deb81cb4bff3a7bdb2790f90a8543fd79580905220d07524ab88135f1bf43d0772570a335f8f799a49bb074',
            '4bde5839cea5112b7b68a0dac676452fb51f10f6e3969a015cbf3af96cb124d13ee3d9c52d6aafac0b73e7e213921f5b0335025e954d969973a89a4ce5030ed7c39d5535b6fcb233983fee4ef629894c',
            '2cfb2997fa122f71984a9265aefe42196dc639a080a09c4ea9f9983f738776afdc807ceaa7494f5ae111a5f18652fe8643c476b964ae7630aaf968b1b6d2d38e6cce1d9af614f722ae87c811d275328e',
        ],
    }
]


test.each(splitSecretData)('SplitSecret', (item) => {

    crypto.randomBytes = jest.fn()

    crypto.randomBytes.mockReturnValueOnce(Buffer.from(item.randomCsKey, 'hex'))

    item.randomCoordinateVector.map(v => crypto.randomBytes.mockReturnValueOnce(Buffer.from(v, 'hex')))

    const res = chipndale.SplitSecret(Buffer.from(item.secret, 'hex'), item.k, item.n)

    expect(res.length).toBe(item.result.length)
    res.map(v => {
        expect(item.result).toContain(v.toString('hex'))
    })
})

const recoverSecretData = [
    {
        shares: [
            '3632a9812836077bae41a54ca92e698271cf3349355c3e1b3779e7cbb7406a53',
            'a464c3571b9bc4558e8fe035a4190430c4d79a27e5d8737f4ccb640f1351a93a',
        ],
        secret: 'b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74'
    },
    { // n=4,k=3
        shares: [
            'afae22397afe65df72a79b43b3df5bfe279241278767a681',
            '4dd4dd578fcfd9fe425f7362775e1471a92c23413fe65c05',
            'fb7898b47afdfdefc2daab10cebc6ee9e1f9c5b30e8b5c38',
            // '15405ec4ac925b790386f2408b3d839efc1f0433eb0fa8a4',
        ],
        secret: 'a3ec1b2759a07f6883032a3232dff906b4cae2c1da62a899'
    },
    { // n=4,k=3
        shares: [
            // 'afae22397afe65df72a79b43b3df5bfe279241278767a681',
            '4dd4dd578fcfd9fe425f7362775e1471a92c23413fe65c05',
            'fb7898b47afdfdefc2daab10cebc6ee9e1f9c5b30e8b5c38',
            '15405ec4ac925b790386f2408b3d839efc1f0433eb0fa8a4',
        ],
        secret: 'a3ec1b2759a07f6883032a3232dff906b4cae2c1da62a899'
    },
    { // 17 byte secret (even number of bytes) n=3, k=2
        randomCoordinateVector: [], //
        shares: [
            '4f579ff95115e9115a2ca2f2b0075f9081',
            '0a642be75ae4fe1276d7f5e39fb5010be4',
        ],
        secret: 'a5f071e8d211789e6027536605ec2ecb5b',
    },
]

test.each(recoverSecretData)('RecoverSecret', (item) => {
    const res = chipndale.RecoverSecret(item.shares.map(v => Buffer.from(v, 'hex')))
    expect(res.toString('hex')).toBe(item.secret)
})
