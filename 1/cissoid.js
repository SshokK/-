const POINTS_COUNT = 800;

// 1, 2, ...etc
const DEFAULT_A = 1;

// 1, 2, ...etc
const OFFSET_X = 0;
const OFFSET_Y = 0;

const SCALE = 150;

// 1, 2, ...etc
const CISSOID_SCALE_X = 1;
const CISSOID_SCALE_Y = 1;

// Idk what this is. Blame the previous author of this code
const DEGREE = 0.01745329251994;
const PI = 3.14159265358979323846;

let xC;
let yC;

function cissoid() {
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext("2d");

	canvas.style.position = "relative";
	canvas.style.border = "1px solid";

	context.font = "12px Arial";

	xC = 3 * canvas.width / 5;
	yC = canvas.height / 2;

	drawAxes(context, 3, 3, 0.9, "Black");
	drawCissoid(canvas, context);
}


function drawCissoid(elem, ctx) {
	const cissoidDots = drawCissoidDots(ctx);

	drawLinesBetweenCissoidDots(ctx, cissoidDots);
	drawCircleInsideCissoid(ctx, cissoidDots);
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