const { Equipo, Futbolista, Contratacion } = require("../models");


const existeEquipoPorId = async (id) => {
    const existeEquipo = await Equipo.findById(id);
    if (!existeEquipo) {
        throw new Error(`El id del Equipo no existe: ${id}`);
    }
};


const noExistenFutbolistasPorIdEquipo = async (id) => {
    const totalJugadores = await Futbolista.countDocuments({ equipo: id });
    if (totalJugadores > 0) {
        throw new Error(`El Equipo tiene ${totalJugadores} jugadores activos y no puede ser eliminado.`);
    }
};


const noExistenContratacionesPorEquipo = async (id) => {
    const totalContrataciones = await Contratacion.countDocuments({ equipo: id });
    if (totalContrataciones > 0) {
        throw new Error(`El Equipo tiene ${totalContrataciones} contrataciones activas y no puede ser eliminado.`);
    }
};


const noExistenContratacionesPorFutbolista = async (id) => {
    const totalContrataciones = await Contratacion.countDocuments({ jugador: id });
    if (totalContrataciones > 0) {
        throw new Error(`El Jugador tiene ${totalContrataciones} contrataciones activas y no puede ser eliminado.`);
    }
};

module.exports = {
    existeEquipoPorId,
    noExistenFutbolistasPorIdEquipo,
    noExistenContratacionesPorEquipo,
    noExistenContratacionesPorFutbolista
};
