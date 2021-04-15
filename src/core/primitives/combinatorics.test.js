
const combin = require('./combinatorics')

// Permutations
test.each([
    [1,1, ['0']],
    [2,1, ['0', '1']],
    [2,2, ['01', '10']],
    [3,2, ['01', '10', '12', '21', '02', '20']],
    [
        5,2,
        [
            '01', '10', '02', '20', '03', '30', '04', '40', '12', '21',
            '13', '31', '14', '41', '23', '32', '24', '42', '34', '43',
        ]
    ],
])('permutations', (n, k, expectedResult) => {
    const res = combin.permutations(n, k)

    expect(res.length).toBe(expectedResult.length)

    for (const per of res) {
        // [0,1] => '01'
        const perStr = per.reduce((prev, current) => prev + current, '')
        expect(expectedResult.indexOf(perStr)).not.toBe(-1)
    }
})

// Permutations error k > n
test('permutations error', () => {
    expect(() => {
        combin.permutations(5, 10)
    }).toThrow()
})

// Combinations
test.each([
    [1,1, ['0']],
    [2,1, ['0', '1']],
    [2,2, ['01']],
    [3,2, ['01', '12', '02']],
    [4,3, ['123', '023', '013', '012']],
    [5,2, ['01', '02', '03', '04', '12', '13', '14', '23', '24', '34']],
])('combinations', (n, k, expectedResult) => {
    const res = combin.combinations(n, k)

    expect(res.length).toBe(expectedResult.length)

    for (const combinations of res) {
        // [0,1] => '01'
        const combinationsStr = combinations.reduce((prev, current) => prev + current, '')
        expect(expectedResult.indexOf(combinationsStr)).not.toBe(-1)
    }
})

// Combination error k > n
test('combinations error', () => {
    expect(() => {
        combin.combinations(9, 10)
    }).toThrow()
})

