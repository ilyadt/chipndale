const hmac = require('./hmac')

test.each([
    ['data',    'secret', 32, '1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db'],
    ['data',    'others', 32, '0a02849748330331f6c33ed7edefad10ad1faef2982947f0b12bd6267d3cb300'],
    ['trimmed', 'others', 16, '5cbccb77fd942a11d8e5a18ea3ad8113'],
    ['trimmed', 'others', 2,  '5cbc'],
])('hmac(%x) = %x', (data, secret, bytes, result) => {
    expect(hmac(Buffer.from(data), Buffer.from(secret), bytes).toString('hex')).toBe(result)
})

test.each([
    ['b1008f3a39a4466147f26f925bcabbecebc7549a8c2005ce1e176f7e224f2b74', '1f5e6947af4d06540936e9acdf13ed0c', 16, 'bb7ef233144c1d538af7b38e003d6b6d'],
])('hmac hex(%x) = %x', (data, secret, bytes, result) => {
    expect(hmac(Buffer.from(data, 'hex'), Buffer.from(secret, 'hex'), bytes).toString('hex')).toBe(result)
})

test('hmac bytes exceeded', () => {
    expect(() => {
        hmac(
            Buffer.from('somedata'),
            Buffer.from('somesecret'),
            33,
        )
    }).toThrow()

    expect(() => {
        hmac(
            Buffer.from('somedata'),
            Buffer.from('somesecret'),
            0,
        )
    }).toThrow()
})
