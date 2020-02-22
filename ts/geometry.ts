export function project_to_unit_circle(x: number, y: number, x_center: number, y_center: number, radius: number): [number, number] {
    return [(x - x_center) / radius, (y - y_center) / radius];
}
