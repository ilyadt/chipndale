'use strict'

const gf = require('./gf')

module.exports.point = class point {
    /**
     * @param {int} x
     * @param {int} Fx
     */
    constructor(x, Fx) {
        this.x = x;
        this.Fx = Fx;
    }
}

/**
 * Calculates y(x) for the polynomial deg y = len(points) - 1 by the given points using Lagrange formula
 *
 * @param {int} x - The date
 * @param {point[]} points - The string
 *
 * @return {int}
 */
module.exports.interpolate = function (x, points) {

    if (points.length < 2) {
        throw new Error('min interpolation points is 2')
    }

    let pointsX = points.map(point => point.x)
    if (pointsX.length !== new Set(pointsX).size) {
        throw new Error('points must be unique')
    }

    let result = 0

    for (let i = 0; i < points.length; i++) {

        let lx = 1 // l(x)

        for (let j = 0; j < points.length; j++) {
            if (j !== i) {
                lx = gf.mul(lx, gf.mul(gf.add(x, points[j].x), gf.inv(gf.add(points[i].x, points[j].x))))
            }
        }

        result = gf.add(result, gf.mul(points[i].Fx, lx))
    }

    return result
}
