
const mnemonic = require('./mnemonic')
const crypto = require('crypto')

const splitMnemonicData = [
    { // 24 words
        n: 4,
        k: 2,
        mnemonic: 'rain afford soldier infant dutch cost cabin evil myself tattoo puzzle supply round prevent health lottery alarm ill magic ten timber chest punch motion',
        shares: [
            'curtain next gate expire gather saddle ribbon cruise erosion enact omit affair chief exotic gift name ancient burger blue wedding artwork october winter raise',
            'piece champion still damp rough client demand winter cup camp donate general click fatigue better turtle butter pig learn name color surround atom stem',
            'cash rescue kitchen beef obscure police ostrich luxury twice retire intact run rain praise bunker wire bamboo skull today regular section goat garbage vacant',
            'orange doll way wing pitch lumber deal ask sibling victory wasp panther canyon state much degree cradle angle vital educate hole south upgrade honey',
        ],
        randomCsKeyVector: '1f5e6947af4d06540936e9acdf13ed0c77bae41a54ca92e698271cf3',
        randomCoordinatesVectors: [],
    },
    { // 18 words
        n: 4,
        k: 3,
        mnemonic: 'physical general six rebuild among reform army grab cram notice wrestle aspect erosion imitate alter era possible solve',
        shares: [
            'best actual raise float certain route asthma tattoo dog fly genius digital sea link soul giggle post charge',
            'window shadow code vote thank wave arena fever axis salon ski check step wash cart local captain physical',
            'evidence plunge field buzz work you annual unveil girl immense female bleak flag advice type puzzle capital example',
            'quick illegal mixture vote town use skin vibrant drip coffee regret post east talk oblige pitch rifle exhibit',
        ],
        randomCsKeyVector: 'c29fd3272086d7a2aa4e31bbafdfdefc2daab10c',
        randomCoordinatesVectors: [
            '15405ec4ac925b790386f2408b3d839efc1f0433eb0fa8a4' // x1
        ],
    },
]

test.each(splitMnemonicData)('SplitMnemonic', (item) => {

    crypto.randomBytes = jest.fn()
    crypto.randomBytes.mockReturnValueOnce(Buffer.from(item.randomCsKeyVector, 'hex'))

    item.randomCoordinatesVectors.map(v =>  crypto.randomBytes.mockReturnValueOnce(Buffer.from(v, 'hex')))

    let res = mnemonic.SplitMnemonic(item.mnemonic, item.n, item.k)

    res.map(v => {
        expect(item.shares).toContain(v)
    })
})

const recoverMnemonicData = [
    { // 2,4
        mnemonics: [
            'piece champion still damp rough client demand winter cup camp donate general click fatigue better turtle butter pig learn name color surround atom stem',
            'curtain next gate expire gather saddle ribbon cruise erosion enact omit affair chief exotic gift name ancient burger blue wedding artwork october winter raise',
        ],
        result: 'rain afford soldier infant dutch cost cabin evil myself tattoo puzzle supply round prevent health lottery alarm ill magic ten timber chest punch motion',
    },
    { // 2,5
        mnemonics: [
            'seek frame aim title tiger rifle polar super orient mosquito stem panther',
            'velvet resist length liberty six question october volcano snake area barrel law',
        ],
        result: 'celery alarm room congress noodle soon note diet foam final style scatter',
    },
    { // n=3,n=4
        mnemonics: [
            'quick illegal mixture vote town use skin vibrant drip coffee regret post east talk oblige pitch rifle exhibit',
            'best actual raise float certain route asthma tattoo dog fly genius digital sea link soul giggle post charge',
            'window shadow code vote thank wave arena fever axis salon ski check step wash cart local captain physical',
        ],
        result: 'physical general six rebuild among reform army grab cram notice wrestle aspect erosion imitate alter era possible solve',
    }
]


test.each(recoverMnemonicData)('RecoverMnemonic', (item) => {

    let res = mnemonic.RecoverMnemonic(item.mnemonics)
    expect(res).toBe(item.result)
})