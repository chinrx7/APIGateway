const { MongoClient } = require('mongodb');
const SourceCfg = require('../conf/conf.json');
const axios = require('axios').default;
const https = require('https');
const request = require('request');
const cfg = require('dotenv').config();

const dburl = cfg.parsed.MONGO_URL;
const dbname = cfg.parsed.MONGO_PREFIX + 'SOLAR_CFG';
const cols = 'TAGS_CFG';
const client = new MongoClient(dburl);

module.exports.getAllTags = async () => {
    await client.connect();
    const db = client.db(dbname);
    const col = db.collection(cols);

    const Tags = [];

    const query = {};
    const options = { projection: { _id: 0 } }

    const Cursors = await col.find(query, options);
    for await (const tag of Cursors) {
        Tags.push(tag);
    }

    await client.close();
    tagLoaded = tag;
    return Tags;
}

module.exports.getRealtime = async (req) => {
    const tReq = genRequest(req)
    console.log(tReq)
    getResponse(tReq)
    //console.log(getGateway('J405'))
}

getResponse = (req) => {
    const res = [];
    req.forEach(r => {
        const Tags = { Tags: r.Lists }
        console.log(JSON.stringify(Tags));
        request({
            url: r.Address + '/getrealtime',
            method: "POST",
            json: true,
            body: Tags
        }, function (Error, response, body) {
           console.log(response.body)
        })
    });
}

getGateway = (site) => {
    let gwIp;
    SourceCfg.Gateways.forEach(gw => {
        const found = gw.Pointsources.filter((g) => g === site)
        if (found.length > 0) {
            gwIp = gw.Address;
        }
    });

    return gwIp;
}

genRequest = (req) => {
    const reqGroup = [];
    req.Tags.forEach(tag => {
        const t = tag.split('.');

        const exist = reqGroup.find((r) => r.Name == t[0]);
        //console.log('exist', exist)

        if (exist) {
            const idx = reqGroup.findIndex((r) => r.Name === t[0]);
            reqGroup[idx].Lists.push(t[0] + '.' + t[1]);
        }
        else {
            const gw = getGateway(t[0]);
            const grps = { Name: t[0], Address: gw, Lists: [t[0] + '.' + t[1]] }
            reqGroup.push(grps)
        }
    });
    return reqGroup;
}
