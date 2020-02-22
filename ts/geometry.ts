export function project_to_unit_circle(x: number, y: number, x_center: number, y_center: number, radius: number): [number, number] {
    return [(x - x_center) / radius, (y - y_center) / radius];
}

export function map_to_control_diamond(x: number, y: number): [number, number] {
    const x_sign = Math.sign(x);
    const y_sign = Math.sign(y);
    const r = Math.sqrt(x * x + y * y)
    x = Math.abs(x);
    y = Math.abs(y);
    const angle = Math.atan2(x, y);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return [x_sign * r * sin / (sin + cos), y_sign * r * cos / (sin + cos)];
}

