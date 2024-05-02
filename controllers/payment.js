const axios = require("axios");

module.exports = {
    Add: async (req, res) => {
        const url = "https://developers.flouci.com/api/generate_payment";
        const payload = {
            "app_token": "d847c176-0aae-4e0f-b6e3-e489b592cb69",
            "app_secret": "eafa137d-357e-4541-a7b6-734571249a28",
            "amount": req.body.amount,
            "accept_card": "true",
            "session_timeout_secs": 1200,
            "success_link": "https://deploiment.vercel.app/success",
            "fail_link": "https://deploiment.vercel.app/fail",
            "developer_tracking_id": "8067984e-1a19-43ff-a516-5ba36a0c33a7"
        };

        try {
            const result = await axios.post(url, payload);
            res.send(result.data);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },




    Verify: async (req, res) => {
        const id_payment = req.params.id;
        const url = `https://developers.flouci.com/api/verify_payment/${id_payment}`;

        const headers = {
            'apppublic':  'd847c176-0aae-4e0f-b6e3-e489b592cb69',
            'appsecret': 'eafa137d-357e-4541-a7b6-734571249a28'
        };

        try {
            const result = await axios.get(url, { headers });
            res.send(result.data);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    }
};

/* const axios=require("axios")
module.exports = {
    Add: async (req, res) => {
        const url = "https://developers.flouci.com/api/generate_payment"
        const payload = {
            "app_token": "d847c176-0aae-4e0f-b6e3-e489b592cb69",
            "app_secret": "eafa137d-357e-4541-a7b6-734571249a28",
             //"app_secret": process.env.FLOUCI_SECRET,
             "amount": "30500",
            //"amount": req.body.amount,
            "accept_card": "true",
            "session_timeout_secs": 1200,
            "success_link": "https://deploiment.vercel.app/",
            "fail_link": "https://deploiment.vercel.app/notFound",
            "developer_tracking_id": "8067984e-1a19-43ff-a516-5ba36a0c33a7"
        }
        await axios 
        .post(url,payload)
        .then(res=>
           {
            res.send(result.data)
           } )
        .catch(err=>console.error(err))
    }
}*/