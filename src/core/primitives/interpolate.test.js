
const interpolation = require('./interpolate')

// Interpolation
test.each([
    [1, [[1,42], [2,15]], 42],
    [75, [[34,253], [75,149]], 149],
    [15, [[34,253], [75,149], [15,43]], 43],

    [2, [[0,4], [1,4]], 4],
    [2, [[19,5], [25,5]], 5],

    [0, [[1,3], [2,0]], 2], //  y = x + 2
    [2, [[0,1], [1,4]], 11], // y = 5x + 1

    [4, [[0,2], [1,0], [2, 0]], 30], // y = x2 + 3x + 2
    [3, [[0,20], [1,189], [2, 23]], 190], // y = 234x2 + 67x + 20
    [0, [[3,190], [1,189], [2, 23]], 20], // y = 234x2 + 67x + 20 (changed coordinates)

    [255, [[4, 144], [1,18], [2, 10]], 202], // y = 15x2 + 25x + 4
    [0, [[1, 1], [2,4], [3, 5]], 0], // y = x2

])('Interpolation (%i)', (x, points, result) => {
    expect(interpolation.interpolate(x, points.map(([x, y]) => new interpolation.point(x, y)))).toBe(result)
})

// Interpolation error
test.each([
    [1, []], // no points
    [1, [[1,42]]], // 1 point
    [1, [[1,42], [2,15], [1, 35]]], // duplicated point
    [1, [[256,42], [2,33]]], // coordinate X exceeded allowed 255
    [1, [[1,42], [2,256]]], // coordinate Y exceeded allowed 255
])('Interpolation error', (x, points) => {
    expect(() => {
        interpolation.interpolate(2, points.map(([x, y]) => new interpolation.point(x, y)))
    }).toThrow()
})
