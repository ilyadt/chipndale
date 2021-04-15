
const mnemonic = require('./mnemonic')
const crypto = require('crypto')

const splitMnemonicData = [
    { // 24 words
        n: 4,
        k: 2,
        mnemonic: 'rain afford soldier infant dutch cost cabin evil myself tattoo puzzle supply round prevent health lottery alarm ill magic ten timber chest punch motion',
        shares: [
            'curtain next gate expire gather saddle ribbon cruise erosion enact omit agent brother often cave process dignity super taxi sort rocket parent power giraffe',
            'piece champion still damp rough client demand winter cup camp donate ghost estate snack panel roast inflict whip crazy siege van potato pilot edit',
            'cash rescue kitchen beef obscure police ostrich luxury twice retire intact royal unknown year sphere nest emerge farm harvest sunny position control parrot rent',
            'orange doll way wing pitch lumber deal ask sibling victory wasp panda fury try uniform sunny trust saddle public veteran series define squirrel amazing',
        ],
        randomCsKeyVector: '1f5e6947af4d06540936e9acdf13ed0c',
        randomCoordinatesVectors: [],
    },
    { // 18 words
        n: 4,
        k: 3,
        mnemonic: 'physical general six rebuild among reform army grab cram notice wrestle aspect erosion imitate alter era possible solve',
        shares: [
            'best actual raise float certain route asthma tattoo dog fly genius digital sea link soul giggle post charge',
            'window shadow code vote thank wave arena fever awkward invest brick stable buzz tissue slow sphere found shrug',
            'evidence plunge field buzz work you annual unveil give road lunar today name balance agent wolf foster club',
            'quick illegal mixture vote town use skin vibrant dry page street wisdom junior calm own undo pledge aunt',
        ],
        randomCsKeyVector: 'c29fd3272086d7a2aa4e31bb',
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
    {
        mnemonics: [
            'piece champion still damp rough client demand winter cup camp donate ghost estate snack panel roast inflict whip crazy siege van potato pilot edit',
            'curtain next gate expire gather saddle ribbon cruise erosion enact omit agent brother often cave process dignity super taxi sort rocket parent power giraffe',
        ],
        result: 'rain afford soldier infant dutch cost cabin evil myself tattoo puzzle supply round prevent health lottery alarm ill magic ten timber chest punch motion',
    },
    { // 2,5
        mnemonics: [
            'silver noodle smile basic stand ceiling deal smoke faint vapor resource spoil',
            'icon carpet later proof noodle sword sausage task essence arrange aisle execute',
           // 'bread option oblige tragic permit pass regular rib inside cheap trap donate',
        ],
        result: 'pass aisle ghost health media jealous glad tip property bar brief refuse',
    },
    { // n=3,n=4
        mnemonics: [
            'quick illegal mixture vote town use skin vibrant dry page street wisdom junior calm own undo pledge aunt',
            'best actual raise float certain route asthma tattoo dog fly genius digital sea link soul giggle post charge',
            'window shadow code vote thank wave arena fever awkward invest brick stable buzz tissue slow sphere found shrug',
        ],
        result: 'physical general six rebuild among reform army grab cram notice wrestle aspect erosion imitate alter era possible solve',
    }
]


test.each(recoverMnemonicData)('RecoverMnemonic', (item) => {

    let res = mnemonic.RecoverMnemonic(item.mnemonics)
    expect(res).toBe(item.result)
})