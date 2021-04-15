const gf = require('./gf')

test.each([
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
    [1, 2, 2],
    [1, 255, 255],
    [2, 2, 4],
    [2, 3, 6],
    [3, 3, 5],
    [34, 56, 49],
])('mul(%i, %i) = %i', (a, b, result) => {
    expect(gf.mul(a, b)).toBe(result)
})

test.each([
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 0],
    [1, 2, 3],
    [1, 255, 254],
    [2, 2, 0],
    [2, 3, 1],
    [3, 3, 0],
    [206, 4, 202],
])('add(%i, %i) = %i', (a, b, result) => {
    expect(gf.add(a, b)).toBe(result)
})

test.each([
    [300, 300],
    [256, 256],
    [0, 256],
    [256, 0],
])('Wrong arguments', (a, b) => {
    expect(() => {
        gf.mul(a,b)
    }).toThrow()

    expect(() => {
        gf.add(a,b)
    }).toThrow()
})


test.each([
    [0, 0],
    [1, 1],
    [255, 28],
    [2, 141],
    [56, 242],
    [34, 90],
])('inv(%i) = %i', (a, result) => {
    expect(gf.inv(a)).toBe(result)
})

test('Inv throws', () => {
    expect(() => {gf.inv(256)}).toThrow()
})