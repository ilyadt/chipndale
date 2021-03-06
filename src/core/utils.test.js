
const utils = require('./utils')

test.each([
    [ // 256 bit
        'b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74',
        '1f5e6947af4d06540936e9acdf13ed0cbb7ef233144c1d538af7b38ee2129c62'
    ],
    [ // 128 bit
        'edf5d7ad1da2ec057d039a062cc2b197',
        '6a73952bbd68bded48afe51378a6493c',
    ],
])('isSecretValid=true', (secret, checksum) => {
    expect(utils.isSecretValid(Buffer.from(secret, 'hex'), Buffer.from(checksum, 'hex'))).toBe(true)
})

test.each([
    [
        'b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74',
        '1f5e6947af4d06540936e9acdf13ed0cbb7ef233144c1d538af7b38ee2129c63'
    ],
])('isSecretValid=false', (secret, checksum) => {
    expect(utils.isSecretValid(Buffer.from(secret, 'hex'), Buffer.from(checksum, 'hex'))).toBe(false)
})


test.each([
    {
        x: 0,
        points: [
            {x: 1, y: '0304'},
            {x: 2, y: '000b'},
        ],
        res: '0201'
    },
    {
        x: 1,
        points: [
            {x: 0, y: 'b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74'},
            {x: 255, y: '1f5e6947af4d06540936e9acdf13ed0cbb7ef233144c1d538af7b38e003d6b6d'},
        ],
        res: '3632a9812836077bae41a54ca92e698271cf3349355c3e1b3779e7cbb7406a53'
    },
    {
        x: 2,
        points: [
            {x: 0, y: 'b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74'},
            {x: 255, y: '1f5e6947af4d06540936e9acdf13ed0cbb7ef233144c1d538af7b38e003d6b6d'},
        ],
        res: 'a464c3571b9bc4558e8fe035a4190430c4d79a27e5d8737f4ccb640f1351a93a'
    },
])('interpolateBigPoints', (item) => {

    let bigPoints = item.points.map(p => new utils.BigPoint(p.x, Buffer.from(p.y, 'hex')))

    expect(utils.interpolateBigPoints(item.x, bigPoints).toString('hex')).toEqual(item.res)
})

test.each([
    {
        points: [
            {x:1,y:'3632a9812836077bae41a54ca92e698271cf3349355c3e1b3779e7cbe1598be7'},
            {x:2,y:'a464c3571b9bc4558e8fe035a4190430c4d79a27e5d8737f4ccb640fbf637049'}
        ],
        secret: Buffer.from('b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74', 'hex')
    },
    {
        points: [
            {x:1,y:'3632a9812836077bae41a54ca92e698271cf3349355c3e1b3779e7cbe1598be7'},
            {x:2,y:'a464c3571b9bc4558e8fe035a4190430c4d79a27e5d8737f4ccb640fbf637048'}
        ],
        secret: null
    }
])('secretFromPoints', (item) => {
    let bigPoints = item.points.map(p => new utils.BigPoint(p.x, Buffer.from(p.y, 'hex')))

    expect(utils.secretFromPoints(bigPoints)).toEqual(item.secret)
})

