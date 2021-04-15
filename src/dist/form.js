
class Context {
    reset() {
        throw new Error('Not implemented')
    }
    /**
     *
     * @param {string} secret
     * @param {int} n
     * @param {int} k
     *
     * @return string[]
     */
    split(secret,n, k) {
        throw new Error('Not implemented')
    }

    /**
     * @param {string[]} shares
     *
     * @return string
     */
    recover(shares) {
        throw new Error('Not implemented')
    }

    /**
     * @param {string} secret
     * @return boolean
     */
    isValidSecret(secret) {
        throw new Error('Not implemented')
    }

    /**
     * @param {int} elements
     * @return string
     */
    generate(elements) {
        throw new Error('Not implemented')
    }
}

class MnemonicContext extends Context {
    reset() {
        $('#generator-block input').attr('step', 3)
        $('#generator-block input').attr('min', 12)
        $('#generator-block input').attr('max', 24)
        $('#generator-block label span:first').text('15')
        $('#generator-block label span:last').text('words')
        $('#generator-block input').val('15')
    }
    split(secret,n, k) {
        return chipndale.SplitMnemonic(secret, n, k)
    }
    recover(shares) {
       return chipndale.RecoverMnemonic(shares)
    }
    isValidSecret(secret) {
        secret = secret.trim().split(/\s+/).join(' ')
        return chipndale.isValidMnemonic(secret)
    }
    generate(elements) {
        return chipndale.generateMnemonic(elements)
    }
}

class HexContext extends Context {
    reset() {
        $('#generator-block input').attr('step', 4)
        $('#generator-block input').attr('min', 16)
        $('#generator-block input').attr('max', 32)
        $('#generator-block label span:first').text('20')
        $('#generator-block label span:last').text('bytes')
        $('#generator-block input').val('20')
    }
    split(secret,n, k) {
        return chipndale.SplitSecret(secret, k, n).map(share => share.toString('hex'))
    }
    recover(shares) {
        return chipndale.RecoverSecret(shares).toString('hex')
    }
    isValidSecret(secret) {
        return chipndale.isValidHex(secret)
    }
    generate(elements) {
        return chipndale.generateSecret(elements)
    }
}
