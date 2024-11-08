const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password')
);

const dbNeo4j = async () => {
    try {
        await driver.verifyConnectivity();
        console.log('Conectado a Neo4j correctamente.');
    } catch (error) {
        console.error('Error al conectar a Neo4j', error);
    }
};

module.exports = {
    dbNeo4j,
    driver
};
