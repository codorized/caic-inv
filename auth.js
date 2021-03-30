const { client } = require("./db/config")

function checkAuthenticated(req, res, next) {
    
    if (req.isAuthenticated()) {
      return next()
    }
    
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}
  


function authUser(req, res, next){
    if(req.user == null) {
        res.status(403)
        return res.send('Sign in first!')
    }

    next()
}

function authRole(role) {
    return (req, res, next) => {

        var ctr=0
        for(var i=0; i<role.length; i++)
        {
            if(req.user.ROLE == role[i])
            {
                ctr++ 
            }
        }

        if(ctr == 0)
        {
            res.status(401)
            return res.render('errorpages/error', {title: 'Restricted', message:'You are not allowed to access this.', errorType: 'danger'})
        }
        next()
    }
}

function authRoleByStage() {
    return async function(req, res, next) {
        var tagID = null
        if(req.params.tagid) tagID = req.params.tagid
        else if(req.params.tagID) tagID = req.params.tagID
        //Check the stage
        const stage = await client.db("caic-sample").collection("motors").findOne({tagID: parseInt(tagID)},{projection:({ status: 1, _id: 0 })});
        console.log(stage.status)


        if(stage.status == 'notstarted' && (req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor' || req.user.ROLE == 'warehouse'))
        {
            //ONCHECKUP
            next()
        }
        
        if(stage.status == 'oncheckup' && (req.user.ROLE == 'admin' || req.user.ROLE == 'marketing' || req.user.ROLE == 'warehouse'))
        {
            //PRELIMDOCS
            next()
        }
        
        if(stage.status == 'prelimdocs' && (req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor'))
        {
            //ONREWIND
            next()
        }
        
        if(stage.status == 'onrewind' && (req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor'))
        {
            //ONFABRICATION
            next()
        }

        if(stage.status == 'onfabrication' && (req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor'))
        {
            //INBAKING
            next()
        }

        if(stage.status == 'inbaking' && (req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor'))
        {
            //ASSEMBLY AND TESTING
            next()
        }

        if(stage.status == 'assemblyandtesting' && (req.user.ROLE == 'admin' || req.user.ROLE == 'supervisor'))
        {
            //PAINTING
            next()
        }

        if(stage.status == 'painting' && (req.user.ROLE == 'admin' || req.user.ROLE == 'marketing' || req.user.ROLE == 'warehouse'))
        {
            //FORDELIVERY
            next()
        }

        if(stage.status == 'fordelivery' && (req.user.ROLE == 'admin' || req.user.ROLE == 'marketing'))
        {
            //FORBILLINGSTATEMENT
            next()
        }

        res.status(401)
        return res.send('Not allowed')

    }
}

module.exports = {
    authUser,
    authRole,
    checkAuthenticated,
    checkNotAuthenticated,
    authRoleByStage
} 