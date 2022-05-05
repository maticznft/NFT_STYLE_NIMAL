import dotenv from 'dotenv';
dotenv.config({ path: `./env/.env.${process.env.NODE_ENV}` })

var EnvName = process.env.NODE_ENV;
console.log('EnvName : api : ', EnvName);

var key = {
    limitMax: 1000,
    limitPage: 10,
    errorOccured: 'Error occured, Please try again.'
}
let currencySymbol='BNB';
let tokenSymbol='WBNB';
key.port = process.env.port;
key.mongoURI = process.env.mongoURI;
key.secretOrKey = process.env.secretOrKey;
key.ipfskey = process.env.ipfskey;
key.ipfspass = process.env.ipfspass;
key.currencySymbol=currencySymbol;
key.tokenSymbol=tokenSymbol;
console.log('EnvName : db : ', key.mongoURI,key.ipfskey,key.ipfspass);
var keyEnvBased = {};
if (EnvName === 'production') {
    keyEnvBased = {
        emailGateway: {
            fromMail: "",
            nodemailer: {
                host: "",
                port: 465,
                secure: true,
                auth: {
                    user: '',
                    pass: '',
                },
            }
        }
    };
} else if (EnvName === 'local') {
    keyEnvBased = {
        emailGateway: {
            fromMail: "",
            nodemailer: {
                host: "",
                port: 465,
                secure: true,
                auth: {
                    user: '',
                    pass: '',
                },
            }
        }
    };
}
key = {...key, ...keyEnvBased};

export default key;
