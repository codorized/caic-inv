const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, getUserByID)
{
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByName(username) 
        
        if(user == null) {
            return done(null, false, {message: 'Incorrect Username or Password! Please try again'})
        }

        try {
            if(await bcrypt.compare(password, user.password))
            {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Incorrect Username or Password! Please try again'})
            }
        } catch (error) {
            return done(error)
        }

    }
    try {
        passport.use(new localStrategy({ usernameField: 'username'}, authenticateUser))
        passport.serializeUser((user, done) => {
            
            done(null, user.id)
        })
        passport.deserializeUser(async (id, done) => {
          const user = await getUserByID(id)
          return done(null, user)
        })
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = initialize