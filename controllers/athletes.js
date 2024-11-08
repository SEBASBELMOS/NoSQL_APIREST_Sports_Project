const { response } = require('express');
const { driver, session } = require('../database/Neo4jConnection');
const neo4j = require('neo4j-driver');
const { deportistaSchema } = require('../validations/deportista');

const getAthletes = async (req, res) => {
    const query = `
        MATCH (a:Athlete)
        RETURN a
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        athlete: record.get('a').properties
    }));
    res.json({ total: data.length, data });
};

const getAthlete = async (req, res) => {
    const { id } = req.params;
    const query = `
        MATCH (a:Athlete)
        WHERE ID(a) = $id
        RETURN a
    `;
    const result = await session.run(query, { id: parseInt(id) });
    if (result.records.length === 0) {
        return res.status(404).json({ msg: 'Athlete not found' });
    }
    const athlete = result.records[0].get('a').properties;
    res.json({ athlete });
};

const addAthlete = async (req, res) => {
    const { name, country, position, number } = req.body;
    const query = `
        CREATE (a:Athlete { name: $name, country: $country, position: $position, number: $number })
        RETURN a
    `;
    const result = await session.run(query, { name, country, position, number });
    const athlete = result.records[0].get('a').properties;
    res.json({ athlete });
};

const updateAthlete = async (req, res) => {
    const { id } = req.params;
    const { name, country, position, number } = req.body;
    const query = `
        MATCH (a:Athlete)
        WHERE ID(a) = $id
        SET a.name = $name, a.country = $country, a.position = $position, a.number = $number
        RETURN a
    `;
    const result = await session.run(query, { id: parseInt(id), name, country, position, number });
    if (result.records.length === 0) {
        return res.status(404).json({ msg: 'Athlete not found' });
    }
    const athlete = result.records[0].get('a').properties;
    res.json({ athlete });
};

const deleteAthlete = async (req, res) => {
    const { id } = req.params;
    const query = `
        MATCH (a:Athlete)
        WHERE ID(a) = $id
        DETACH DELETE a
    `;
    await session.run(query, { id: parseInt(id) });
    res.json({ msg: 'Athlete deleted' });
};

module.exports = {
    getAthletes,
    getAthlete,
    addAthlete,
    updateAthlete,
    deleteAthlete
};
