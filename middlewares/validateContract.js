const { session } = require('../database/Neo4jConnection');

const contractExistsById = async (id) => {
    const query = `
        MATCH (a:Athlete)-[c:CONTRACTED_BY]->(t:Team)
        WHERE ID(c) = $id
        RETURN c
    `;
    const result = await session.run(query, { id: parseInt(id) });
    if (result.records.length === 0) {
        throw new Error(`Contract with ID ${id} does not exist`);
    }
};

module.exports = {
    contractExistsById
};
