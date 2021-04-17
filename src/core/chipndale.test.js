const chipndale = require('./chipndale')
const crypto = require('crypto')

const splitSecretData = [
    { // 32 byte secret
        n: 4,
        k: 2,
        secret: 'b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74', // 32 byte secret
        randomCsKey: '1f5e6947af4d06540936e9acdf13ed0c77bae41a54ca92e698271cf3',
        randomCoordinateVector: [],
        result: [
            '3632a9812836077bae41a54ca92e6982227ca01874960883d4617c70d3323f05',
            'a464c3571b9bc4558e8fe035a419043062aaa78567571f5491fb4962dbb50396',
            '2356e5ec0a09854f673c2aeb56fdd65eab1153079fe112195b8d5a6c2ac817e7',
            '9bc817e07dda5909ce086ac7be77de4fe21da9a441ce31e11bd42346cba07bab',
        ],
    },
    { // 24 byte secret
        n: 4,
        k: 3,
        secret: 'a3ec1b2759a07f6883032a3232dff906b4cae2c1da62a899',
        randomCsKey: 'c29fd3272086d7a2aa4e31bbafdfdefc2daab10c',
        randomCoordinateVector: [
            '15405ec4ac925b790386f2408b3d839efc1f0433eb0fa8a4', // x1
        ],
        result: [
            '15405ec4ac925b790386f2408b3d839efc1f0433eb0fa8a4',
            'fb7898b47afdfdefc2daab10f7d329138d57eec8c41a2234',
            '4dd4dd578fcfd9fe425f73624e31538bc582083af5772209',
            'afae22397afe65df72a79b4325a6d2d4545bbb260d2cb9a9',
        ],
    },
    { // 17 byte secret (even number of bytes)
        n: 3,
        k: 2,
        secret: 'a5f071e8d211789e6027536605ec2ecb5b',
        randomCsKey: '602dfb9a0e5e2993e0c3c5f6d9',
        randomCoordinateVector: [], //
        result: [
            '0a642be75ae4fe12e239423f8d7c8f3991',
            'e0c3c5f6d9e06f9d7f1b71d40ed77734d4',
            '4f579ff95115e911fd05608d8647d6c61e',
        ],
    },
    { // 80 byte secret (more than 64)
        n: 5,
        k: 5,
        secret: 'f01ce10663b385466c8544cfe658f1183f295b3e05eb896b0200eb66b8389c2ad85a0590aa6388fcd2500baef9789619ea5a9ed5a0ad35f609f74024304cb04fbb4b1e745141c06cd0fcc70b4f5b7eca',
        randomCsKey: '5830119a334d2ab23e80117663fb408103160d070992119c9fb78e4e8983e1785afb651c59dd0d588d096e8ae1c800eb72cb6a024c8bb59698f8c643d6f39deb81cb4bff3a7bdb279f10f6bc', // 76 byte key
        randomCoordinateVector: [
            '97252cc4068fd25f78dcc32eff830359668469e8e06e01050cbf84a62af348da07a4e1f294d22844731c9ccef2f0dd2ce15c48c5da0a21fd129ef7488fc9ce8ece2b5e83005ce478e0b98c926e675c5c', // x1
            'e5148d5f54078e8cd0accd263ddc5cb2c5cd027b2bb7c727341b7a4a970c843568fca0019594c86e7bbef0771cb3e8e090d153bfb2e1c2c8ef99d57d2ed24239565af6caac9c3f3b04ecd52109b7240d', // x2
            '82de838f528a47f1966c072bbe920a682e76b964067e72cb6a024c8bb59698f8c643d6f39deb81cb4bff3a7bdb2790f90a8543fd79580905220d07524ab88135f1bf43d0772570a335f8f799a49bb074', // x3
        ],
        result: [
            '97252cc4068fd25f78dcc32eff830359668469e8e06e01050cbf84a62af348da07a4e1f294d22844731c9ccef2f0dd2ce15c48c5da0a21fd129ef7488fc9ce8ece2b5e83005ce478e0b98c926e675c5c',
            'e5148d5f54078e8cd0accd263ddc5cb2c5cd027b2bb7c727341b7a4a970c843568fca0019594c86e7bbef0771cb3e8e090d153bfb2e1c2c8ef99d57d2ed24239565af6caac9c3f3b04ecd52109b7240d',
            '82de838f528a47f1966c072bbe920a682e76b964067e72cb6a024c8bb59698f8c643d6f39deb81cb4bff3a7bdb2790f90a8543fd79580905220d07524ab88135f1bf43d0772570a335f8f799a49bb074',
            '4bde5839cea5112b7b68a0dac676452fb51f10f6e3969a015cbf3af96cb124d13ee3d9c52d6aafac0b73e7e213921f5b9bce80195d5fb4bc9e2d4d95a04039dcc13d615bc31343e9f7761a594bb6a970',
            '2cfb2997fa122f71984a9265aefe42196dc639a080a09c4ea9f9983f738776afdc807ceaa7494f5ae111a5f18652fe86db3ff4feacbc5415477cbf68f391e4856e6e29f483fb06f8c1ce3c066fea12b2',
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
    { // n=4,k=2
        shares: [
            '9bc817e07dda5909ce086ac7be77de4fe21da9a441ce31e11bd42346cba07bab',
            '3632a9812836077bae41a54ca92e6982227ca01874960883d4617c70d3323f05',
        ],
        secret: 'b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74'
    },
    { // n=4,k=3
        shares: [
            '4dd4dd578fcfd9fe425f73624e31538bc582083af5772209',
            'fb7898b47afdfdefc2daab10f7d329138d57eec8c41a2234',
            '15405ec4ac925b790386f2408b3d839efc1f0433eb0fa8a4',
        ],
        secret: 'a3ec1b2759a07f6883032a3232dff906b4cae2c1da62a899'
    },
    { // n=4,k=3
        shares: [
            'afae22397afe65df72a79b4325a6d2d4545bbb260d2cb9a9',
            'fb7898b47afdfdefc2daab10f7d329138d57eec8c41a2234',
            '4dd4dd578fcfd9fe425f73624e31538bc582083af5772209',
        ],
        secret: 'a3ec1b2759a07f6883032a3232dff906b4cae2c1da62a899'
    },
    { // 17 byte secret (even number of bytes) n=3, k=2
        randomCoordinateVector: [], //
        shares: [
            '0a642be75ae4fe12e239423f8d7c8f3991',
            '4f579ff95115e911fd05608d8647d6c61e',
        ],
        secret: 'a5f071e8d211789e6027536605ec2ecb5b',
    },
]

test.each(recoverSecretData)('RecoverSecret', (item) => {
    const res = chipndale.RecoverSecret(item.shares.map(v => Buffer.from(v, 'hex')))
    expect(res.toString('hex')).toBe(item.secret)
})
