import set = Reflect.set;

function fire_button_clicked() {
    setup_canvas();
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

function draw_joypad(px: number, py: number) {
    const canvas = document.getElementById("joypad_canvas") as HTMLCanvasElement;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const centre_x = width / 2.0;
    const centre_y = height / 2.0;
    const radius = Math.min(width, height) / 4.0;

    const context = canvas.getContext('2d');
    context.lineWidth = 5;
    circle(context, centre_x, centre_y, radius, false);
    circle(context, centre_x, centre_y, radius / 2.0, true);
}

function setup_canvas() {
    const canvas = document.getElementById("joypad_canvas") as HTMLCanvasElement;
    if (!canvas) {
        console.error("Cannot find joypad canvas element.");
        return;
    }

    const parent =  canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    draw_joypad(0, 0);
}

function setup() {
    setup_canvas();
    document.getElementById("fire_button").onclick = fire_button_clicked;

    window.onresize = () => { setup_canvas(); }
}

setup();