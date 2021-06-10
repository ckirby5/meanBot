const mysql = require( 'mysql' );

function promiseDB (config) {
    this.connection = mysql.createConnection( config );
    this.query = ( sql, args ) => {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    this.close = () => {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

module.exports = promiseDB;