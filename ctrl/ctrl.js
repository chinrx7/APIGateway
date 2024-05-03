const auth = require('../mdware/auth');
const data = require('../mdware/data');

chkToken = (token) => {
    let res = false;
    if (auth.ValidateToken(token)) {
        res = true;
    }
    return res;
}

module.exports.login_post = async (req, res) => {
    const { user, password } = req.body;
    const acess = await auth.Login(user, password);
    if (acess) {
        res.status(200).json({ Access: { Token: acess } });
    }
    else {
        res.status(403);
    }
}

module.exports.getAllTag = async (req, res) => {
    const token = req.headers["authorization"];
    if(auth.ValidateToken(token)){
        const tagcfgs = await data.getAllTags();
        if(tagcfgs){
            res.status(200).json(tagcfgs);
        }
        else{
            res.status(200).json({Info: 'No tag configure.'});
        }
    }
    else{
        res.status(401).json({ Error: 'Access denied!!!'});
    }
}

module.exports.getRealtime = async (req,res) => {
    const token = req.headers['authorization'];
    if(auth.ValidateToken(token)){
        const TagCfgs = JSON.parse(JSON.stringify(req.body));

        const realtime = await data.getRealtime(TagCfgs);

        res.status(200).json('ok');
    }
    else{
        res.status(401).json({ Error: 'Access denied!!!'});
    }
}