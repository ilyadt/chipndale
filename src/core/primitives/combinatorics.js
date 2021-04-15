'use strict'

/**
 *
 * @param {int} n
 * @param {int} k
 *
 * @return {array[]}
 */
const combinations = function combinations(n, k) {

    if (k > n) {
        throw new Error('invalid args')
    }

    let result= []

    function recurse(start, combos) {
        if(combos.length === k) {
            return result.push(combos.slice())
        }
        if(combos.length + (n - start) < k){
            return
        }
        recurse(start + 1, combos)
        combos.push(start)
        recurse(start + 1, combos)
        combos.pop()
    }

    recurse(0, [])

    return result
}

/**
 *
 * @param {int} n
 * @param {int} k
 * @return {int[][]} result is k size
 */
const permutations = function permutations(n, k) {

    if (k > n) {
        throw new Error('invalid args')
    }

    let result = []

    for (let combination of combinations(n, k)) {
        result.push(...permutator(combination))
    }

    return result
}

/**
 *
 * https://stackoverflow.com/questions/9960908/permutations-in-javascript
 *
 * @param {int[]} inputArr
 * @return {int[][]}
 */
const permutator = (inputArr) => {
    let result = []

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice()
                let next = curr.splice(i, 1)
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(inputArr)

    return result
}

module.exports.combinations = combinations
module.exports.permutations = permutations
