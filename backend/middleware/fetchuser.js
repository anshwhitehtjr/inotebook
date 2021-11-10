const bcrypt = require( 'bcryptjs' );
const JWT_SECRET = 'Harryisagoodb$oy';
const jwt = require( 'jsonwebtoken' );

const fetchuser = ( req, res, next ) =>
{
    // get the user from the JWT Token and add id to req body
    const token = req.header( 'auth-token' );
    if ( !token )
    {
        req.status( 401 ).send( { error: "Please authenticate using a valid token" } );
    }
    try
    {
        const data = jwt.verify( token, JWT_SECRET );
        req.user = data.user;

        next();
    } catch ( error )
    {
        req.status( 401 ).send( { error: "Please authenticate using a valid token" } );
    }
};


module.exports = fetchuser;