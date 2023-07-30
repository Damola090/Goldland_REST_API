

const SendPaystackKey = async (req, res, next) => {

    const private_Key = process.env.PAYSTACK_API_SECRET

    res.status(200).json({
        publicKey : private_Key
        // publicKey : 'pk_live_4e5cb1d250c4e25de2e20dbff951ecc71152fd15'
    })            

}

module.exports = {
    SendPaystackKey: SendPaystackKey
}
