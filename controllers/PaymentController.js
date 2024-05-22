

const SendPaystackKey = async (req, res, next) => {

    const private_Key = process.env.PAYSTACK_API_SECRET

    console.log(private_Key, "the key in env")

    res.status(200).json({
        publicKey : private_Key
    })            

}

module.exports = {
    SendPaystackKey: SendPaystackKey
}
