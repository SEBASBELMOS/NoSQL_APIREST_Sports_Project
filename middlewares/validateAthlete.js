const { session } = require('../database/Neo4jConnection');
const neo4j = require('neo4j-driver');

const athleteExistsById = async (id) => {
    const query = `
        MATCH (a:Athlete)
        WHERE ID(a) = $id
        RETURN a
    `;
    const result = await session.run(query, { id: parseInt(id) });
    if (result.records.length === 0) {
        throw new Error(`Athlete with ID ${id} does not exist`);
    }
};

const noContractsForAthlete = async (id) => {
    const query = `
        MATCH (a:Athlete)-[c:CONTRACTED_BY]->(t:Team)
        WHERE ID(a) = $id
        RETURN c
    `;
    const result = await session.run(query, { id: parseInt(id) });
    if (result.records.length > 0) {
        throw new Error(`Athlete with ID ${id} has existing contracts`);
    }
};

module.exports = {
    athleteExistsById,
    noContractsForAthlete
};
