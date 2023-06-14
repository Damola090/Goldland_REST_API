

const SendPaystackKey = async (req, res, next) => {

    res.status(200).json({
        publicKey : 'pk_test_0329c7e097bed84992e1909ca336825478b40326'
        // publicKey : 'pk_live_4e5cb1d250c4e25de2e20dbff951ecc71152fd15'
    })            

}

module.exports = {
    SendPaystackKey: SendPaystackKey
}
