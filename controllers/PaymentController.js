

const SendPaystackKey = async (req, res, next) => {

    const private_Key = process.env.PAYSTACK_API_SECRET

    res.status(200).json({
        publicKey : private_Key
    })            

}

module.exports = {
    SendPaystackKey: SendPaystackKey
}
