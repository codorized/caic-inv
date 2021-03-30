const express = require('express');
const router = express.Router();
const methods = require('../db/methods');
var client = require('../db/config').client;

// @route   GET itemPrices/newMotor
// @desc    Get Items by category
// @access  Public
router.get('/items/:itemtype', async function (req, res) {
    res.send(await methods.getItemsWithPricesByModelType(client, req.params.itemtype));
})

// @route   POST prices/items/single/:collname/:modelname
// @desc    Register a motor
// @access  Public
router.post('/items/single/:operation/:collname/:modelname', async function (req, res) {
    if(req.params.operation == 'update')
    {
        res.send(await methods.editItemByCollectionAndModelName(client, req.params.collname, req.params.modelname, req.body));
        await methods.addNotif(client, req.user, 'Edited a model item in '+req.params.collname+ ' with name: '+req.params.modelname)
    }
    else if(req.params.operation == 'delete')
    {
        
        res.send(await methods.deleteItemByCollectionAndModelName(client, req.params.collname, req.params.modelname));
        await methods.addNotif(client, req.user, 'Deleted a model item in '+req.params.collname+ ' with name: '+req.params.modelname)
    }
    else if(req.params.operation == 'add')
    {
        res.send(await methods.addItemByCollectionAndModelName(client, req.params.collname, req.params.modelname, req.body['item-price']));
        await methods.addNotif(client, req.user, 'Created a model item in '+req.params.collname+ ' with name: '+req.params.modelname + ' and price: '+req.body['item-price'])
    }
})


module.exports  = router;