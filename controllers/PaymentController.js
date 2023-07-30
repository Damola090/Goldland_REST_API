

const SendPaystackKey = async (req, res, next) => {

    res.status(200).json({
        publicKey : process.env.PAYSTACK_API_SECRET
        // publicKey : 'pk_live_4e5cb1d250c4e25de2e20dbff951ecc71152fd15'
    })            

}

module.exports = {
    SendPaystackKey: SendPaystackKey
}
