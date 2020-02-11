import set = Reflect.set;

function fire_button_clicked() {
    console.log('Fired');
}

function circle(context: CanvasRenderingContext2D, x: number, y: number, r: number, solid: boolean) {
    context.beginPath();
    context.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
    if (solid) {
        context.fill();
    } else {
        context.stroke();
    }
}

class Joypad {
    canvas: HTMLCanvasElement;
    parent: HTMLElement;

    centre_x: number;
    centre_y: number;
    outer_radius: number;

    stick_x: number;
    stick_y: number;

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

        this.centre_x = width / 2.0;
        this.centre_y = height / 2.0;
        this.stick_x = this.centre_x;
        this.stick_y = this.centre_y;
        this.outer_radius = Math.min(width, height) / 4.0;

        this.draw_joypad();
    }

    draw_joypad() {
        const inner_radius = this.outer_radius / 2.0;

        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.lineWidth = 5;
        circle(context, this.centre_x, this.centre_y, this.outer_radius, false);
        circle(context, this.stick_x, this.stick_y, inner_radius, true);
    }

    touch_start(evt: TouchEvent) {
        this.log_txt(evt.touches[0])
        const touch = evt.touches[0];
        this.log(touch.clientX, touch.clientY);
    }

    touch_move(evt: TouchEvent) {
        const touch = evt.touches[0];
        this.log(touch.clientX, touch.clientY);

        if (this.distance(touch) <= this.outer_radius) {
            this.stick_x = touch.clientX;
            this.stick_y = touch.clientY;
            this.draw_joypad();
        }
    }

    touch_end(evt: Event) {
        this.log_txt("Touch end");
        this.stick_x = this.centre_x;
        this.stick_y = this.centre_y;
        this.draw_joypad();
    }

    distance(touch: Touch): number {
        const dx = touch.clientX - this.centre_x;
        const dy = touch.clientY - this.centre_y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    log(x: number, y: number) {
        document.getElementById("diag_x").innerText = x.toString();
        document.getElementById("diag_y").innerText = y.toString();
    }

    log_txt(o: any) {
        document.getElementById("diag_txt").innerText = o.toString();
    }
}

var joypad;

function setup() {
    joypad = new Joypad();
    document.getElementById("fire_button").onclick = fire_button_clicked;
    // Stop scrolling on touchmove, otherwise that interferes with joypad
    document.body.addEventListener('touchmove', (e) => e.preventDefault(),
                                   { passive: false})
}

setup();