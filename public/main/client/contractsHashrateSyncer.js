
const { create: createAxios } = require('axios')
const { getDb } = require('./database');

const startMonitoringHashrate = (url, period) => {
    return;
    console.log("🚀 ~ file: contractsHashrateSyncer.js:5 ~ startMonitoringHashrate ~ url, period:", url, period)
    const interval = setInterval(async () => {
        try {
            const items = (await createAxios({ baseURL: "http://proxyapi.dev.lumerin.io?ET" })('/contracts')).data;
            persistData(items)
        }
        catch(e) {
            console.log(e.message, 'NO UPDATES');
            persistData();
        }
    }, period)
    return interval;
}

const persistData = (data) => {

    const db = getDb();
    const collection = db.collection('hashrate');

    if(!data) {
        const datetime = new Date().getTime();
        console.log("🚀 ~ file: contractsHashrateSyncer.js:27 ~ persistData ~ datetime:", datetime)

        
        collection.insert({
            id : "0x3f3B057691Fdb136F4657F4559d16C723B3549f5",
            hashrate: Math.floor(Math.random() * 100),
            timestamp: datetime});
        return;
    }

    data.forEach((item) => {
        const id = item.ID;
        const currentHashrate = item.ResourceEstimatesActual['ema--5m'];
        collection.insert(
        {
            id,
            hashrate: currentHashrate,
            timestamp: new Date().getTime()
        });
    })
}

module.exports = { startMonitoringHashrate };