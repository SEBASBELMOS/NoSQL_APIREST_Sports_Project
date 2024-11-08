const { response } = require("express");
const { driver, session } = require('../database/Neo4jConnection');
const neo4j = require('neo4j-driver');

const getTeams = async (req, res) => {
    const query = `
        MATCH (t:Team)
        RETURN t
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        team: record.get('t').properties
    }));
    res.json({ total: data.length, data });
};

const getTeam = async (req, res) => {
    const { id } = req.params;
    const query = `
        MATCH (t:Team)
        WHERE ID(t) = $id
        RETURN t
    `;
    const result = await session.run(query, { id: parseInt(id) });
    if (result.records.length === 0) {
        return res.status(404).json({ msg: 'Team not found' });
    }
    const team = result.records[0].get('t').properties;
    res.json({ team });
};

const addTeam = async (req, res) => {
    const { name, country } = req.body;
    const query = `
        CREATE (t:Team { name: $name, country: $country })
        RETURN t
    `;
    const result = await session.run(query, { name, country });
    const team = result.records[0].get('t').properties;
    res.json({ team });
};

const updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name, country } = req.body;
    const query = `
        MATCH (t:Team)
        WHERE ID(t) = $id
        SET t.name = $name, t.country = $country
        RETURN t
    `;
    const result = await session.run(query, { id: parseInt(id), name, country });
    if (result.records.length === 0) {
        return res.status(404).json({ msg: 'Team not found' });
    }
    const team = result.records[0].get('t').properties;
    res.json({ team });
};

const deleteTeam = async (req, res) => {
    const { id } = req.params;
    const query = `
        MATCH (t:Team)
        WHERE ID(t) = $id
        DETACH DELETE t
    `;
    await session.run(query, { id: parseInt(id) });
    res.json({ msg: 'Team deleted' });
};

module.exports = {
    getTeams,
    getTeam,
    addTeam,
    updateTeam,
    deleteTeam
};
