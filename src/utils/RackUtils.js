export const MIN_POSITION_WIDTH = 44;

const POSITION_GAP = 3;
const BAY_PADDING = 6;
const MAX_POSITIONS_IN_BAY = 20;

// Un id válido para el back: lo nuevo tiene que poder referenciarse antes de guardar
export const newId = () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

// La estantería se dibuja como en la realidad: el nivel 1 abajo
export const levelsFromTop = (rack) => [...rack.levels].reverse();

export const positionsInBay = (level, bayId) => level.positions.filter((position) => position.bayId === bayId);

// Todos los tramos miden lo mismo: el que más lugares necesita marca el ancho de los demás
export const getBayMinWidth = (rack) => {
    const widest = Math.max(...rack.bays.map((bay) => Math.max(
        bay.columns.length,
        ...rack.levels.map((level) => positionsInBay(level, bay._id).length),
    )));
    return widest * MIN_POSITION_WIDTH + (widest - 1) * POSITION_GAP + BAY_PADDING;
};

const numberIn = (label) => Number.parseInt(String(label).split("-").at(-1), 10) || 0;

const nextNumber = (labels) => Math.max(0, ...labels.map(numberIn)) + 1;

const levelNumber = (label) => String(label).match(/\d+/)?.[0];

const nextColumnLabel = (rack) => String(nextNumber(rack.bays.flatMap((bay) => bay.columns).map((column) => column.label)));

const nextPositionLabel = (level, offset = 0) => {
    const prefix = levelNumber(level.label) ?? level.label;
    return `${prefix}-${nextNumber(level.positions.map((position) => position.label)) + offset}`;
};

const mapLevel = (rack, levelId, change) => ({
    ...rack,
    levels: rack.levels.map((level) => (level._id === levelId ? change(level) : level)),
});

const mapPosition = (rack, positionId, change) => ({
    ...rack,
    levels: rack.levels.map((level) => ({
        ...level,
        positions: level.positions.map((position) => (position._id === positionId ? change(position) : position)),
    })),
});

const mapBay = (rack, bayId, change) => ({
    ...rack,
    bays: rack.bays.map((bay) => (bay._id === bayId ? change(bay) : bay)),
});

export const findPosition = (rack, positionId) => {
    for (const level of rack.levels) {
        const position = level.positions.find(({ _id }) => _id === positionId);
        if (position) return { level, position };
    }
    return null;
};

export const findColumn = (rack, columnId) => {
    for (const bay of rack.bays) {
        const column = bay.columns.find(({ _id }) => _id === columnId);
        if (column) return { bay, column };
    }
    return null;
};

export const renameLevel = (rack, levelId, label) => mapLevel(rack, levelId, (level) => ({ ...level, label }));

export const renamePosition = (rack, positionId, label) => mapPosition(rack, positionId, (position) => ({ ...position, label }));

export const renameColumn = (rack, columnId, label) => ({
    ...rack,
    bays: rack.bays.map((bay) => ({
        ...bay,
        columns: bay.columns.map((column) => (column._id === columnId ? { ...column, label } : column)),
    })),
});

// Una posición desactivada no puede tener producto fijo
export const togglePosition = (rack, positionId) => mapPosition(rack, positionId, (position) => ({
    ...position,
    active: !position.active,
    fixedProduct: position.active ? null : position.fixedProduct,
}));

export const setFixedProduct = (rack, positionId, product) => mapPosition(rack, positionId, (position) => ({ ...position, fixedProduct: product }));

export const addPosition = (rack, levelId, bayId) => {
    const level = rack.levels.find(({ _id }) => _id === levelId);
    if (positionsInBay(level, bayId).length >= MAX_POSITIONS_IN_BAY) return rack;
    const position = { _id: newId(), bayId, label: nextPositionLabel(level), active: true, fixedProduct: null };
    return mapLevel(rack, levelId, (current) => ({ ...current, positions: [...current.positions, position] }));
};

// Cada nivel conserva al menos una posición por tramo
export const removePosition = (rack, positionId) => {
    const { level, position } = findPosition(rack, positionId);
    if (positionsInBay(level, position.bayId).length <= 1) return rack;
    return mapLevel(rack, level._id, (current) => ({
        ...current,
        positions: current.positions.filter(({ _id }) => _id !== positionId),
    }));
};

export const addColumn = (rack, bayId) => {
    const column = { _id: newId(), label: nextColumnLabel(rack) };
    return mapBay(rack, bayId, (bay) => ({ ...bay, columns: [...bay.columns, column] }));
};

export const removeColumn = (rack, columnId) => {
    const { bay } = findColumn(rack, columnId);
    if (bay.columns.length <= 1) return rack;
    return mapBay(rack, bay._id, (current) => ({
        ...current,
        columns: current.columns.filter(({ _id }) => _id !== columnId),
    }));
};

// Tramo nuevo al final, con una posición en cada nivel
export const addBay = (rack) => {
    const bay = { _id: newId(), columns: [{ _id: newId(), label: nextColumnLabel(rack) }] };
    return {
        ...rack,
        bays: [...rack.bays, bay],
        levels: rack.levels.map((level) => ({
            ...level,
            positions: [...level.positions, { _id: newId(), bayId: bay._id, label: nextPositionLabel(level), active: true, fixedProduct: null }],
        })),
    };
};

export const removeBay = (rack, bayId) => {
    if (rack.bays.length <= 1) return rack;
    return {
        ...rack,
        bays: rack.bays.filter(({ _id }) => _id !== bayId),
        levels: rack.levels.map((level) => ({
            ...level,
            positions: level.positions.filter((position) => position.bayId !== bayId),
        })),
    };
};

// Nivel nuevo arriba, con una posición por columna
export const addLevel = (rack) => {
    const number = Math.max(0, ...rack.levels.map((level) => Number(levelNumber(level.label)) || 0)) + 1;
    let position = 0;
    const positions = rack.bays.flatMap((bay) => bay.columns.map(() => {
        position += 1;
        return { _id: newId(), bayId: bay._id, label: `${number}-${position}`, active: true, fixedProduct: null };
    }));
    return { ...rack, levels: [...rack.levels, { _id: newId(), label: `N${number}`, positions }] };
};

export const removeLevel = (rack, levelId) => {
    if (rack.levels.length <= 1) return rack;
    return { ...rack, levels: rack.levels.filter(({ _id }) => _id !== levelId) };
};

// Lo que acepta PUT /elements/:id: el producto fijo viaja como id
export const toRackPayload = ({ name, x, y, sizeX, sizeY, bays, levels }) => ({
    name,
    x,
    y,
    sizeX,
    sizeY,
    bays,
    levels: levels.map((level) => ({
        ...level,
        positions: level.positions.map((position) => ({ ...position, fixedProduct: position.fixedProduct?._id ?? null })),
    })),
});
