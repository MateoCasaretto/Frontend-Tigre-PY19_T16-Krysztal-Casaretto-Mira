// Mismos valores que el back (ELEMENT_TYPES)
export const ELEMENT_TYPES = Object.freeze({ RACK: "rack", FLOOR_ZONE: "floorZone" });

// Lo que tiene esta clase no arrastra el plano: se mueve con useElementDrag
export const EDITABLE_CLASS = "map-editable";

export const GRID_STEP = 0.5;

const MIN_PLAN = { width: 20, height: 12 };
// Aire que queda detrás del último elemento cuando se eligió un tamaño para el plano
const GROWTH_MARGIN = 2;
const MAX_HIT_PADDING = 1;

export const isRack = (element) => element.type === ELEMENT_TYPES.RACK;

export const snapToGrid = (value) => Math.round(value / GRID_STEP) * GRID_STEP;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const lastEdge = (elements, position, size) => Math.max(0, ...elements.map((element) => element[position] + element[size]));

// Lo mínimo que puede medir el plano sin dejar afuera ningún elemento
export const getMinPlanSize = (elements) => ({
    width: lastEdge(elements, "x", "sizeX") + GROWTH_MARGIN,
    height: lastEdge(elements, "y", "sizeY") + GROWTH_MARGIN,
});

// Tamaño del plano en metros: el elegido, o lo que ocupan los elementos más un margen.
// El elegido es un mínimo: si los elementos piden más, el plano crece
export const getPlanSize = (elements, margin, chosen = {}) => {
    const minimum = getMinPlanSize(elements);
    return {
        width: chosen.width ? Math.max(chosen.width, minimum.width) : Math.max(MIN_PLAN.width, lastEdge(elements, "x", "sizeX")) + margin,
        height: chosen.height ? Math.max(chosen.height, minimum.height) : Math.max(MIN_PLAN.height, lastEdge(elements, "y", "sizeY")) + margin,
    };
};

const gapBetween = (a, b) => {
    const gapX = Math.max(a.x - b.x - b.sizeX, b.x - a.x - a.sizeX, 0);
    const gapY = Math.max(a.y - b.y - b.sizeY, b.y - a.y - a.sizeY, 0);
    return Math.max(gapX, gapY);
};

// Zona táctil extra alrededor de un elemento: ocupa parte del pasillo sin pisar la del vecino
export const getHitPadding = (element, elements) => {
    const gaps = elements.filter((other) => other._id !== element._id).map((other) => gapBetween(element, other));
    return Math.min(MAX_HIT_PADDING, ...gaps.map((gap) => gap / 2));
};

// Primer lugar libre para un elemento nuevo: a la derecha de lo que ya hay
export const getFreeSpot = (elements) => ({
    x: elements.length ? Math.max(...elements.map(({ x, sizeX }) => x + sizeX)) + 1 : 1,
    y: 1,
});
