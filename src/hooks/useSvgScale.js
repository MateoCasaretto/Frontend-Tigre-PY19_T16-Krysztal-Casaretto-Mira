import { useCallback, useLayoutEffect, useRef, useState } from "react";

// Píxeles que mide un metro del plano en pantalla, con el zoom incluido. Lo usan las manijas para no cambiar de tamaño
export const useSvgScale = (plan) => {
    const svgRef = useRef(null);
    const [pixelsPerMeter, setPixelsPerMeter] = useState(1);

    const measure = useCallback(() => {
        const matrix = svgRef.current?.getScreenCTM();
        if (matrix) setPixelsPerMeter(matrix.a);
    }, []);

    // El plano aparece recién cuando termina la carga: por eso es un ref con función y no un efecto al montar
    const attachSvg = useCallback((node) => {
        svgRef.current = node;
        if (!node) return undefined;
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, [measure]);

    // Si cambia el plano cambia el viewBox, aunque el SVG siga midiendo lo mismo en pantalla
    useLayoutEffect(measure, [plan, measure]);

    return { svgRef, attachSvg, pixelsPerMeter, measure };
};
