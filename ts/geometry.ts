// Take a point within an arbitrary circle and project it to the equivalent
// location within the unit circle.
export function project_to_unit_circle(x: number, y: number, x_centre: number, y_centre: number, radius: number): [number, number] {
    return [(x - x_centre) / radius, (y - y_centre) / radius];
}

// Take a point within the unit circle and map to the rotated square with
// vertices at (+/-1, 0), (0, +/-1).
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

// Take a point within an arbitrary circle and calculate the power for the
// left and right motors based on that, i.e. calculate motor speeds from
// joypad location.
export function calculator_motor_power(x: number, y: number, x_centre: number, y_centre: number, radius: number): [number, number] {
    const unit_circle = project_to_unit_circle(x, y, x_centre, y_centre, radius);
    const diamond = map_to_control_diamond(unit_circle[0], unit_circle[1]);
    const d_x = diamond[0];
    const d_y = diamond[1];
    const motor_left = d_y + d_x;
    const motor_right = d_y - d_x;
    return [motor_left, motor_right];
}
