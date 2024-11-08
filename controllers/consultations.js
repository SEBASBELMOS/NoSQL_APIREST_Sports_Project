const { response } = require('express');
const { session } = require('../database/Neo4jConnection');
const neo4j = require('neo4j-driver');


const recentContracts = async (req, res) => {
    const query = `
        MATCH (a:Athlete)-[c:CONTRACTED_BY]->(t:Team)
        RETURN a, t, c
        ORDER BY c.startDate DESC
        LIMIT 10
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        athlete: record.get('a').properties,
        team: record.get('t').properties,
        contract: record.get('c').properties
    }));
    res.json({ total: data.length, data });
};


const filteredAthletes = async (req, res) => {
    const { gender, athleteCountry, teamCountry, sport } = req.query;

    let query = `
        MATCH (a:Athlete)-[:PLAYS_FOR]->(t:Team)
        OPTIONAL MATCH (a)-[:PRACTICES]->(s:Sport)
        WHERE 1=1
    `;

    let params = {};

    if (gender) {
        query += ' AND a.gender = $gender';
        params.gender = gender;
    }

    if (athleteCountry) {
        query += ' AND a.country = $athleteCountry';
        params.athleteCountry = athleteCountry;
    }

    if (teamCountry) {
        query += ' AND t.country = $teamCountry';
        params.teamCountry = teamCountry;
    }

    if (sport) {
        query += ' AND s.name = $sport';
        params.sport = sport;
    }

    query += ' RETURN a, t, s';

    const result = await session.run(query, params);

    const data = result.records.map(record => ({
        athlete: record.get('a').properties,
        team: record.get('t').properties,
        sport: record.get('s') ? record.get('s').properties : null
    }));

    res.json({ total: data.length, data });
};


const millionaireContractsAthletes = async (req, res) => {
    const query = `
        MATCH (a:Athlete)-[c:CONTRACTED_BY]->(t:Team)
        WHERE c.value > 1000000
        RETURN a, t, c
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        athlete: record.get('a').properties,
        team: record.get('t').properties,
        contract: record.get('c').properties
    }));
    res.json({ total: data.length, data });
};


const athletesCountByTeam = async (req, res) => {
    const query = `
        MATCH (a:Athlete)-[:PLAYS_FOR]->(t:Team)
        RETURN t.name AS team, COUNT(a) AS count
        ORDER BY count DESC
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        team: record.get('team'),
        count: record.get('count').toNumber()
    }));
    res.json({ total: data.length, data });
};


const athletesByBirthDate = async (req, res) => {
    const { startDate, endDate } = req.query;

    let query = `
        MATCH (a:Athlete)
        WHERE 1=1
    `;

    let params = {};

    if (startDate) {
        query += ' AND a.birthDate >= $startDate';
        params.startDate = startDate;
    }

    if (endDate) {
        query += ' AND a.birthDate <= $endDate';
        params.endDate = endDate;
    }

    query += ' RETURN a';

    const result = await session.run(query, params);

    const data = result.records.map(record => ({
        athlete: record.get('a').properties
    }));

    res.json({ total: data.length, data });
};


const multinationalTeams = async (req, res) => {
    const query = `
        MATCH (t:Team)<-[:PLAYS_FOR]-(a:Athlete)
        WITH t, COLLECT(DISTINCT a.country) AS countries
        WHERE SIZE(countries) > 1
        RETURN t, countries
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        team: record.get('t').properties,
        countries: record.get('countries')
    }));
    res.json({ total: data.length, data });
};


const athletesWithoutContract = async (req, res) => {
    const query = `
        MATCH (a:Athlete)
        WHERE NOT (a)-[:CONTRACTED_BY]->(:Team)
        RETURN a
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        athlete: record.get('a').properties
    }));
    res.json({ total: data.length, data });
};


const contractValuesByTeam = async (req, res) => {
    const query = `
        MATCH (a:Athlete)-[c:CONTRACTED_BY]->(t:Team)
        RETURN t.name AS team, SUM(c.value) AS totalValue
        ORDER BY totalValue DESC
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        team: record.get('team'),
        totalValue: record.get('totalValue').toNumber()
    }));
    res.json({ total: data.length, data });
};


const athletesWithAboveAverageContracts = async (req, res) => {
    const query = `
        MATCH (a:Athlete)-[c:CONTRACTED_BY]->(t:Team)
        WITH AVG(c.value) AS averageValue
        MATCH (a)-[c]->(t)
        WHERE c.value > averageValue
        RETURN a, t, c
    `;
    const result = await session.run(query);
    const data = result.records.map(record => ({
        athlete: record.get('a').properties,
        team: record.get('t').properties,
        contract: record.get('c').properties
    }));
    res.json({ total: data.length, data });
};


module.exports = {
    recentContracts,
    filteredAthletes,
    millionaireContractsAthletes,
    athletesCountByTeam,
    athletesByBirthDate,
    multinationalTeams,
    athletesWithoutContract,
    contractValuesByTeam,
    athletesWithAboveAverageContracts
};
