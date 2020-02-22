import { calculate_motor_power } from './geometry';

function circle(context: CanvasRenderingContext2D, x: number, y: number, r: number, solid: boolean) {
    context.beginPath();
    context.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
    if (solid) {
        context.fill();
    } else {
        context.stroke();
    }
}

function log_coord(x: number, y: number) {
    document.getElementById("diag_x").innerText = x.toString();
    document.getElementById("diag_y").innerText = y.toString();
}

function log_txt(o: any) {
    document.getElementById("diag_txt").innerText = o.toString();
}

class Joypad {
    canvas: HTMLCanvasElement;
    parent: HTMLElement;

    joypad_centre_x: number;
    firebutton_centre_x: number;
    centre_y: number;
    outer_radius: number;

    stick_x: number;
    stick_y: number;
    firing: boolean;

    constructor() {
        this.canvas = document.getElementById('joypad_canvas') as HTMLCanvasElement;
        this.parent = this.canvas.parentElement;
        this.parent.onresize = this.resize.bind(this);

        this.resize();

        this.canvas.ontouchstart = this.touch_start.bind(this);
        this.canvas.ontouchmove = this.touch_move.bind(this);
        this.canvas.ontouchend = this.touch_end.bind(this);
    }

    resize() {
        this.canvas.width = this.parent.offsetWidth;
        this.canvas.height = this.parent.offsetHeight;

        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.joypad_centre_x = width / 6.0;
        this.firebutton_centre_x = 5 * width / 6.0;
        this.centre_y = height / 2.0;
        this.stick_x = this.joypad_centre_x;
        this.stick_y = this.centre_y;
        this.outer_radius = Math.min(width, height) / 6.0;

        this.firing = false;

        this.redraw();
    }

    redraw() {
        this.draw_joypad();
        this.draw_firebutton();
    }

    draw_joypad() {
        const inner_radius = this.outer_radius / 2.0;

        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.lineWidth = 5;
        context.fillStyle = 'black';
        circle(context, this.joypad_centre_x, this.centre_y, this.outer_radius, false);
        circle(context, this.stick_x, this.stick_y, inner_radius, true);
    }

    draw_firebutton() {
        const context = this.canvas.getContext('2d');
        context.lineWidth = 5;
        context.fillStyle = this.firing ? 'darkred' : 'orangered';
        circle(context, this.firebutton_centre_x, this.centre_y, this.outer_radius, true);
    }

    touch_start(evt: TouchEvent) {
        const was_firing = this.firing;
        this.firing = this.fire_pressed(evt);
        if (this.firing && !was_firing) {
            this.send_to_websocket('shoot');
        }
        this.redraw();
    }

    touch_move(evt: TouchEvent) {
        const touch = evt.touches[0];
        this.firing = this.fire_pressed(evt);
        if (this.joypad_distance(touch) <= this.outer_radius) {
            this.stick_x = touch.screenX;
            this.stick_y = touch.screenY;
            this.send_motor_setting();
            this.redraw();
        }
    }

    touch_end(evt: TouchEvent) {
        this.stick_x = this.joypad_centre_x;
        this.stick_y = this.centre_y;
        this.send_motor_setting()
        this.firing = this.fire_pressed(evt);
        this.redraw();
    }

    fire_pressed(evt: TouchEvent) {
        for (let touch of evt.touches) {
            if (this.fire_distance(touch) <= this.outer_radius) {
                return true;
            }
        }

        return false;
    }

    joypad_distance(touch: Touch): number {
        const dx = touch.screenX - this.joypad_centre_x;
        const dy = touch.screenY - this.centre_y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    fire_distance(touch: Touch): number {
        const dx = touch.screenX - this.firebutton_centre_x;
        const dy = touch.screenY - this.centre_y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    send_motor_setting() {
        const speeds = calculate_motor_power(this.stick_x, this.stick_y,
                                             this.joypad_centre_x, this.centre_y,
                                             this.outer_radius);
        // log_coord(speeds[0], -speeds[1]);
        const message = `motor ${speeds[0].toFixed(2)} ${-speeds[1].toFixed(2)}`;
        this.send_to_websocket(message);
    }

    send_to_websocket(message: string) {
        log_txt(message);
    }
}

export default function setup_joypad() {
    const joypad = new Joypad();
    // Stop scrolling on touchmove, otherwise that interferes with joypad
    document.body.addEventListener('touchmove', (e) => e.preventDefault(),
                                   { passive: false});
    window.addEventListener('resize', () => {
        joypad.resize();
    });
}

setup_joypad();
