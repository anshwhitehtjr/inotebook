const express = require( 'express' );
const User = require( '../models/User' );
const router = express.Router();
const { body, validation, validationResult } = require( 'express-validator' );
const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const fetchuser = require( '../middleware/fetchuser' );

const JWT_SECRET = 'Harryisagoodb$oy';

//#region creating a user using: POST "/api/auth/createuser"
router.post( '/createuser', [
    body( 'name' ).isLength( { min: 3 } ),
    body( 'email' ).isEmail(),
    body( 'password' ).isLength( { min: 5 } ),
], async ( req, res ) =>
{
    // If there are errors return bad requests and the errors
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        return res.status( 400 ).json( { errors: errors.array() } );
    }

    // Check whether the user with this email exists already
    try
    {
        let user = await User.findOne( { email: req.body.email } );
        if ( user )
        {
            return res.status( 400 ).json( { error: "Sorry a user with this email already exists" } );
        }

        const salt = await bcrypt.genSalt( 10 );
        secPass = await bcrypt.hash( req.body.password, salt );
        // Create a new User
        user = await User.create( {
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        } );

        const data = {
            user: {
                id: user.id
            }
        };
        const AUTH_TOKEN = jwt.sign( data, JWT_SECRET );

        res.json( { AUTH_TOKEN } );
    }
    catch ( error )
    {
        console.error( error.message );
        res.status( 500 ).send( "Internal Server Error" );
    }
} );
//#endregion

//#region Authenticate a user using: POST "/api/auth/login"
router.post( '/login', [
    body( 'email', 'Enter a valid email' ).isEmail(),
    body( 'password', 'Password cannot be blank' ).exists(),
], async ( req, res ) =>
{
    // error handling
    const error = validationResult( req );
    if ( !error.isEmpty() )
    {
        return res.status( 400 ).json( { error: errors.array() } );
    }

    const { email, password } = req.body;
    try
    {
        let user = await User.findOne( { email } );
        if ( !user )
        {
            return res.status( 400 ).json( { error: "Please try to login with correct credentials" } );
        }

        const passwordCompare = await bcrypt.compare( password, user.password );
        if ( !passwordCompare )
        {
            return res.status( 400 ).json( { error: "Please try to login with correct credential" } );
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const AUTH_TOKEN = jwt.sign( data, JWT_SECRET );
        res.json( { AUTH_TOKEN } );

    } catch ( error )
    {
        console.error( error.message );
        res.status( 500 ).send( "Internal Server Error!!!" );
    }
} );
//#endregion

//#region Get Logged in User Details: POST "/api/auth/getuser"
router.post( '/getuser', fetchuser, async ( req, res ) =>
{
    try
    {
        userId = req.user.id;
        const user = await User.findById( userId ).select( "-password" );
        res.send( user );
    } catch ( error )
    {
        console.error( error.message );
        res.status( 500 ).send( "Internal Server Error!!!" );
    }
} );
//#endregion

module.exports = router;