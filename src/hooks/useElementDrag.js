import { useRef } from "react";
import { GRID_STEP, clamp, snapToGrid } from "../utils/MapUtils";

const pointerInSvg = (svg, event) => new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());

const moveRect = (start, deltaX, deltaY, plan) => ({
    x: clamp(snapToGrid(start.x + deltaX), 0, plan.width - start.sizeX),
    y: clamp(snapToGrid(start.y + deltaY), 0, plan.height - start.sizeY),
    sizeX: start.sizeX,
    sizeY: start.sizeY,
});

// El borde opuesto a la manija queda fijo
const resizeRect = (start, corner, deltaX, deltaY, plan) => {
    const right = start.x + start.sizeX;
    const bottom = start.y + start.sizeY;
    const left = corner.includes("w") ? clamp(snapToGrid(start.x + deltaX), 0, right - GRID_STEP) : start.x;
    const top = corner.includes("n") ? clamp(snapToGrid(start.y + deltaY), 0, bottom - GRID_STEP) : start.y;
    const newRight = corner.includes("e") ? clamp(snapToGrid(right + deltaX), left + GRID_STEP, plan.width) : right;
    const newBottom = corner.includes("s") ? clamp(snapToGrid(bottom + deltaY), top + GRID_STEP, plan.height) : bottom;
    return { x: left, y: top, sizeX: newRight - left, sizeY: newBottom - top };
};

// Arrastre con Pointer Events: el mismo código sirve para mouse y para dedo
export const useElementDrag = ({ svgRef, plan, onChange, onStart, onEnd }) => {
    const drag = useRef(null);

    const start = (event, element, corner) => {
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { element, corner, origin: pointerInSvg(svgRef.current, event) };
        onStart?.();
    };

    const handlePointerMove = (event) => {
        if (!drag.current) return;
        const { element, corner, origin } = drag.current;
        const pointer = pointerInSvg(svgRef.current, event);
        const deltaX = pointer.x - origin.x;
        const deltaY = pointer.y - origin.y;
        const rect = corner ? resizeRect(element, corner, deltaX, deltaY, plan) : moveRect(element, deltaX, deltaY, plan);
        onChange(element._id, rect);
    };

    const stop = () => {
        if (!drag.current) return;
        drag.current = null;
        onEnd?.();
    };

    const dragHandlers = (element, corner = null) => ({
        onPointerDown: (event) => start(event, element, corner),
        onPointerMove: handlePointerMove,
        onPointerUp: stop,
        onPointerCancel: stop,
    });

    return { dragHandlers };
};
