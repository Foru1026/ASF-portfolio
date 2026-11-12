const railRgb = (alpha: number) => `rgba(148, 168, 188, ${alpha})`;
const accentRgb = (alpha: number) => `rgba(120, 168, 210, ${alpha})`;
const coreRgb = (alpha: number) => `rgba(210, 224, 236, ${alpha})`;

const endFade = (t: number, fade = 0.14) => {
	if (t < fade) return t / fade;
	if (t > 1 - fade) return (1 - t) / fade;
	return 1;
};

const drawFadedStroke = (
	ctx: CanvasRenderingContext2D,
	x: number,
	yStart: number,
	yEnd: number,
	width: number,
	colorAt: (t: number) => string,
	fadeStart = 0.14,
	fadeEnd = 0.14,
	steps = 40,
	alphaScale = 1,
) => {
	const len = yEnd - yStart;
	if (len <= 1 || alphaScale <= 0.01) return;

	for (let i = 0; i < steps; i++) {
		const t0 = i / steps;
		const t1 = (i + 1) / steps;
		const mid = (t0 + t1) * 0.5;
		const envelope =
			endFade(mid, fadeStart) * endFade(mid, fadeEnd) * alphaScale;
		if (envelope < 0.01) continue;

		const sy0 = yStart + len * t0;
		const sy1 = yStart + len * t1;

		ctx.strokeStyle = colorAt(mid);
		ctx.globalAlpha = envelope;
		ctx.lineWidth = width * (0.7 + envelope * 0.3);
		ctx.beginPath();
		ctx.moveTo(x, sy0);
		ctx.lineTo(x, sy1);
		ctx.stroke();
	}

	ctx.globalAlpha = 1;
};

/** Quiet trailing mark — thin, short, no vapor bloom. */
const drawQuietTail = (
	ctx: CanvasRenderingContext2D,
	headX: number,
	headY: number,
	tailX: number,
	tailY: number,
	tailLen: number,
	brightness: number,
) => {
	const steps = 22;

	for (let i = 0; i < steps; i++) {
		const t0 = i / steps;
		const t1 = (i + 1) / steps;
		const fade = Math.pow(t1, 2.4);
		const x0 = tailX + (headX - tailX) * t0;
		const y0 = tailY + (headY - tailY) * t0;
		const x1 = tailX + (headX - tailX) * t1;
		const y1 = tailY + (headY - tailY) * t1;

		ctx.strokeStyle = accentRgb(fade * brightness * 0.45);
		ctx.lineWidth = 0.5 + fade * 1.1;
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
	}

	const dirX = (headX - tailX) / Math.max(tailLen, 1);
	const dirY = (headY - tailY) / Math.max(tailLen, 1);
	const hotLen = tailLen * 0.22;
	const hotX = headX - dirX * hotLen;
	const hotY = headY - dirY * hotLen;
	const hotGrad = ctx.createLinearGradient(hotX, hotY, headX, headY);
	hotGrad.addColorStop(0, accentRgb(0.12 * brightness));
	hotGrad.addColorStop(0.65, coreRgb(0.55 * brightness));
	hotGrad.addColorStop(1, coreRgb(0.85 * brightness));
	ctx.strokeStyle = hotGrad;
	ctx.lineWidth = 1.35;
	ctx.beginPath();
	ctx.moveTo(hotX, hotY);
	ctx.lineTo(headX, headY);
	ctx.stroke();
};

export const drawScrollComet = (
	ctx: CanvasRenderingContext2D,
	headX: number,
	headY: number,
	canvasWidth: number,
	canvasHeight: number,
	progress: number,
	brightness: number,
	_time: number,
	scrollDir: number,
	velocity: number,
) => {
	const speed = Math.min(1.1, Math.abs(scrollDir));
	const moving = velocity > 0.05;

	const endpointFade = Math.min(progress / 0.04, (1 - progress) / 0.04, 1);
	const endpointEase = endpointFade * endpointFade * endpointFade;
	const atEndpoint = progress <= 0.012 || progress >= 0.988;

	const tailLen =
		moving && !atEndpoint && endpointEase > 0.02
			? Math.min(110, canvasHeight * 0.12) *
				(0.7 + speed * 0.45) *
				endpointEase *
				Math.min(1, velocity * 1.2)
			: 0;

	const motion = scrollDir === 0 ? 1 : scrollDir;
	const tilt = 0.18;
	const dirY = motion > 0 ? -1 : 1;
	const dirX = -tilt;
	const mag = Math.hypot(dirX, dirY);
	const tailX = headX + (dirX / mag) * tailLen;
	const tailY = headY + (dirY / mag) * tailLen;

	const railX = canvasWidth - 14;
	const edgeTop = 24;
	const edgeBottom = canvasHeight - 24;
	const fade = 0.16;

	ctx.save();
	ctx.globalCompositeOperation = 'source-over';
	ctx.lineCap = 'round';

	// Base track — muted steel, no neon
	drawFadedStroke(
		ctx,
		railX,
		edgeTop,
		edgeBottom,
		1,
		(t) => {
			const core = 0.08 + Math.sin(t * Math.PI) * 0.06;
			return railRgb(core);
		},
		fade,
		fade,
	);

	// Progress fill — restrained cool grey-blue
	if (progress > 0.005 && !atEndpoint) {
		drawFadedStroke(
			ctx,
			railX,
			edgeTop,
			headY,
			1.6,
			(t) => {
				const intensity = 0.18 + t * 0.35;
				return accentRgb(intensity);
			},
			fade,
			0.04,
			48,
			Math.max(0.35, endpointEase),
		);
	}

	if (tailLen > 2) {
		drawQuietTail(
			ctx,
			headX,
			headY,
			tailX,
			tailY,
			tailLen,
			brightness * endpointEase,
		);
	}

	// Indicator node — small ring + soft core (no neon bloom)
	const ringR = 5.2;
	ctx.beginPath();
	ctx.arc(headX, headY, ringR, 0, Math.PI * 2);
	ctx.strokeStyle = accentRgb(0.55 * brightness);
	ctx.lineWidth = 1.1;
	ctx.stroke();

	const core = ctx.createRadialGradient(headX, headY, 0, headX, headY, 3.6);
	core.addColorStop(0, `rgba(236, 244, 250, ${0.95 * brightness})`);
	core.addColorStop(0.55, `rgba(170, 198, 220, ${0.75 * brightness})`);
	core.addColorStop(1, `rgba(90, 130, 170, ${0.2 * brightness})`);
	ctx.fillStyle = core;
	ctx.beginPath();
	ctx.arc(headX, headY, 3.2, 0, Math.PI * 2);
	ctx.fill();

	ctx.fillStyle = `rgba(250, 252, 255, ${0.9 * brightness})`;
	ctx.beginPath();
	ctx.arc(headX, headY, 1.15, 0, Math.PI * 2);
	ctx.fill();

	ctx.restore();
};

export type Spark = {
	x: number;
	y: number;
	life: number;
	vx: number;
	vy: number;
	size: number;
};

export const createSpark = (
	headX: number,
	headY: number,
	scrollDir: number,
): Spark => ({
	x: headX + (Math.random() - 0.5) * 2.5,
	y: headY + (Math.random() - 0.5) * 2.5,
	life: 1,
	vx: -(Math.random() * 0.9 + 0.25),
	vy:
		scrollDir < 0
			? Math.random() * 1.4 + 0.4
			: -(Math.random() * 1.4 + 0.4),
	size: Math.random() * 0.7 + 0.25,
});

export const drawSparks = (ctx: CanvasRenderingContext2D, sparks: Spark[]) => {
	ctx.save();
	ctx.globalCompositeOperation = 'source-over';

	for (const spark of sparks) {
		const alpha = spark.life * spark.life * 0.55;
		ctx.fillStyle = `rgba(180, 205, 225, ${alpha})`;
		ctx.beginPath();
		ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.restore();
};

export const tickSparks = (
	sparks: Spark[],
	headX: number,
	headY: number,
	intensity: number,
	scrollDir: number,
) => {
	if (intensity > 0.12) {
		const count = Math.min(2, Math.ceil(intensity * 3));
		for (let i = 0; i < count; i++) {
			sparks.push(createSpark(headX, headY, scrollDir));
		}
	}

	for (let i = sparks.length - 1; i >= 0; i--) {
		sparks[i].x += sparks[i].vx;
		sparks[i].y += sparks[i].vy;
		sparks[i].vy += scrollDir < 0 ? -0.02 : 0.02;
		sparks[i].life -= 0.045;
		if (sparks[i].life <= 0) sparks.splice(i, 1);
	}

	if (sparks.length > 24) sparks.splice(0, sparks.length - 24);
};

export const scrollProgressFromClientY = (
	clientY: number,
	canvasTop: number,
	canvasHeight: number,
	edgePad: number,
) => {
	const track = canvasHeight - edgePad * 2;
	if (track <= 0) return 0;
	const y = clientY - canvasTop - edgePad;
	return Math.min(1, Math.max(0, y / track));
};

export const scrollToProgress = (progress: number) => {
	const docHeight =
		document.documentElement.scrollHeight - window.innerHeight;
	window.scrollTo({ top: docHeight * progress, behavior: 'auto' });
};
