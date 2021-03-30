const express = require('express');
const router = express.Router();
const methods = require('../db/methods'); 
var client = require('../db/config').client;
const { users, ROLE } = require('./../data');
const { checkAuthenticated } = require('./../auth')


router.get('/', checkAuthenticated, async function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host');
    await client.db('caic-sample').collection('motors').createIndex( { "$**": "text"})
     
    var motorCountByDateByStage = []
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'motors'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'oncheckup'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'prelimdocs'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'onrewind'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'onfabrication'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'inbaking'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'assemblyandtesting'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'painting'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'fordelivery'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'forbillingstatement'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'foror'))
    motorCountByDateByStage.push(await methods.getMotorCountByDateByStage(client, 'completed'))

    //Make username index
    await client.db('caic-sample').collection('users').createIndex({"username": 1}, {unique: true})


    if(req.user)
    {
        //var notifs = await methods.getNotifsByUser(client, req.user)
        var notifs = await methods.getNotifs(client, 5, 0)
        var notifctr = notifs.length;
        const result = await client.db("caic-sample").collection("sequence").find({}, { projection:({ _id: 0 })});
        const currTagID = await result.toArray()
        res.render('index', {
                                currTagID: currTagID[0].tagID,
                                role: req.user.ROLE,
                                notifications: notifs,
                                notifctr: notifctr,
                                fullUrl: fullUrl,
                                username: req.user.username,
                                title: "CAIC", 
                                items: await methods.getMotorItemsWithRpmAndPower(client, 10, 'motors', 0),  
                                stats: await methods.getStats(client), 
                                salesRepGraph: {salesrepByDate: await methods.getMotorSalesRepByTime(client), currSalesReps: await methods.getCurrentSalesRep(client)},
                                clientCount: await methods.getClients(client), 
                                statusStats: await methods.getStatusStats(client),
                                motorCounts: await methods.getMotorCounts(client),
                                HPandKw: await methods.getHPandKW(client),
                                motorStagesByDate: await methods.getMotorStagesByDate(client),
                                motorCountByDateByStage: motorCountByDateByStage

                            });
                                

    }
})

module.exports  = router;