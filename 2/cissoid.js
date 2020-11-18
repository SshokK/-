const POINTS_COUNT = 800;

// 1, 2, ...etc
let DEFAULT_A = 1;

// 1, 2, ...etc
let OFFSET_X = 0;
let OFFSET_Y = 0;

const SCALE = 110;

// 1, 2, ...etc
let CISSOID_SCALE_X = 1;
let CISSOID_SCALE_Y = 1;

// The count of radians in one degree
const DEGREE = 0.01745329251994;
const PI = 3.14159265358979323846;

let AXIS_ROTATION_ANGLE = 0;
let PREV_ROTATE = 0;

let xC;
let yC;

function cissoid() {
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext("2d");

	canvas.style.position = "relative";
	canvas.style.border = "1px solid";

	context.font = "17px Arial";

	xC = 2.5 * canvas.width / 5;
	yC = canvas.height / 2;

	drawAxes(context, 3, 3, 0.9, "Black");
	drawCissoid(canvas, context);


	drawUI(canvas, context)
}

function drawCissoid(elem, ctx) {
	const cissoidDots = drawCissoidDots(ctx);

	drawLinesBetweenCissoidDots(ctx, cissoidDots);
	drawCircleInsideCissoid(ctx, cissoidDots);
}

function drawUI(canvas, context) {
	const guiContainer = document.getElementById('gui_container');
	const controller = new function() {
		this.offsetX = OFFSET_X;
		this.offsetY = OFFSET_Y;

		this.scaleX = CISSOID_SCALE_X;
		this.scaleY = CISSOID_SCALE_Y;

		this.rotation = PREV_ROTATE;
		this.a = DEFAULT_A;
	}();
	const gui = new dat.GUI({ autoPlace: false });

	gui.domElement.id = 'gui';
	guiContainer.appendChild(gui.domElement);

	const folder = gui.addFolder('Циссоида');

	folder.add(controller, 'a', 1, 5).onChange(() => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		DEFAULT_A = (controller.a);

		drawAxes(context, 3, 3, 0.9, "Black");
		drawCissoid(canvas, context);
	});

	folder.add(controller, 'offsetX', -5, 5).onChange(() => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		OFFSET_X = (controller.offsetX);

		drawAxes(context, 3, 3, 0.9, "Black");
		drawCissoid(canvas, context);
	});

	folder.add(controller, 'offsetY', -5, 5).onChange(() => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		OFFSET_Y = (controller.offsetY);

		drawAxes(context, 3, 3, 0.9, "Black");
		drawCissoid(canvas, context);
	});

	folder.add(controller, 'scaleX', 1, 5).onChange(() => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		CISSOID_SCALE_X = (controller.scaleX);

		drawAxes(context, 3, 3, 0.9, "Black");
		drawCissoid(canvas, context);
	});

	folder.add(controller, 'scaleY', 1, 5).onChange(() => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		CISSOID_SCALE_Y = (controller.scaleY);

		drawAxes(context, 3, 3, 0.9, "Black");
		drawCissoid(canvas, context);
	});

	folder.add(controller, 'rotation', 0, 360).onChange(() => {
		context.rotate(-PREV_ROTATE * Math.PI / 180);
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.save();

		context.translate(canvas.width / 2, canvas.height / 2);
		context.rotate(controller.rotation * Math.PI / 180);
		context.translate(-(canvas.width / 2), -(canvas.height / 2));

		PREV_ROTATE = controller.rotation

		drawAxes(context, 3, 3, 0.9, "Black", AXIS_ROTATION_ANGLE);
		drawCissoid(canvas, context);
	});
}

function drawCissoidDots(ctx) {
	const cissoidDots = []
	const defaultFi = 180 * DEGREE / (POINTS_COUNT * 2);
	let fi = 0;

	for (let i = 0; i < POINTS_COUNT; i++) {
		fi = fi + defaultFi;

		const x = getCissoidX({ a: DEFAULT_A, t: Math.tan(fi) }) + OFFSET_X
		const y = getCissoidY({ a: DEFAULT_A, t: Math.tan(fi) }) + OFFSET_Y

		const pt1 = new Point2D(x, y);

		drawDot(ctx, pt1, 1, "R");

		cissoidDots[i] = pt1;

		fi = fi + defaultFi;
	}

	return cissoidDots
}

function drawLinesBetweenCissoidDots(ctx, cissoidDots) {
	for (let i = 0; i < POINTS_COUNT; i++) {
		const point1 = cissoidDots[i];
		const point2 = i === POINTS_COUNT - 1 ? point1 : cissoidDots[i + 1]

		drawLine(ctx, point1, point2, 1, "Black");
	}

	drawLine(ctx, cissoidDots[POINTS_COUNT - 1], cissoidDots[0], 1, "Black");
}

function drawCircleInsideCissoid(ctx, cissoidDots) {
	const highestPoint = cissoidDots[Math.round(POINTS_COUNT / 2)]

	const x1 = 0;
	const x2 = highestPoint[0] - OFFSET_X;

	const y1 = 0 - OFFSET_Y;
	const y2 = 0 - OFFSET_Y;

	// Get length between two points
	const R = Math.sqrt(
		Math.pow((x2 - x1), 2) +
		Math.pow((y2 - y1), 2)
	) / 2

	drawCircle(ctx, new Point2D(R + OFFSET_X, OFFSET_Y), R, 1, 'R')
}

function getCissoidX({ a, t }) {
	return ((a * Math.pow(t, 2)) / (1 + Math.pow(t, 2))) * CISSOID_SCALE_X;
}

function getCissoidY({ a, t }) {
	return ((a * Math.pow(t, 3)) / (1 + Math.pow(t, 2))) * CISSOID_SCALE_Y;
}