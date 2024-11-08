const express = require('express');
const cors = require('cors');
const { dbNeo4j } = require('./database/Neo4jConnection');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.pathsNeo4j = {
            teams: '/api/teams',
            athletes: '/api/athletes',
            contracts: '/api/contracts',
            consultations: '/api/consultations'
        };
        // Connect to databases
        this.dbConnectionNeo4j();
        // Middlewares
        this.middlewares();
        // Routes
        this.routes();
    }

    // Neo4j connection
    async dbConnectionNeo4j() {
        await dbNeo4j();
    }

    // Load middlewares
    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    // Define routes
    routes() {
        // Neo4j routes
        this.app.use(this.pathsNeo4j.teams, require('./routes/teams'));
        this.app.use(this.pathsNeo4j.athletes, require('./routes/athletes'));
        this.app.use(this.pathsNeo4j.contracts, require('./routes/contracts'));
        this.app.use(this.pathsNeo4j.consultations, require('./routes/consultations'));
    }

    // Start server
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

module.exports = Server;
