const ice = (a: number) => `rgba(210, 228, 242, ${a})`;
const steel = (a: number) => `rgba(130, 158, 188, ${a})`;
const mist = (a: number) => `rgba(150, 178, 205, ${a})`;
const pearl = (a: number) => `rgba(245, 250, 255, ${a})`;

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
	steps = 48,
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

		ctx.strokeStyle = colorAt(mid);
		ctx.globalAlpha = envelope;
		ctx.lineWidth = width * (0.65 + envelope * 0.35);
		ctx.beginPath();
		ctx.moveTo(x, yStart + len * t0);
		ctx.lineTo(x, yStart + len * t1);
		ctx.stroke();
	}

	ctx.globalAlpha = 1;
};

const drawSilkTail = (
	ctx: CanvasRenderingContext2D,
	headX: number,
	headY: number,
	tailX: number,
	tailY: number,
	tailLen: number,
	brightness: number,
) => {
	const steps = 28;

	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const fade = Math.pow(1 - t, 3.2);
		if (fade < 0.02) continue;

		const x = tailX + (headX - tailX) * (1 - t);
		const y = tailY + (headY - tailY) * (1 - t);
		const r = (0.4 + fade * 2.2) * brightness;

		const stamp = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
		stamp.addColorStop(0, ice(fade * brightness * 0.55));
		stamp.addColorStop(0.4, mist(fade * brightness * 0.22));
		stamp.addColorStop(1, 'rgba(80, 110, 150, 0)');
		ctx.fillStyle = stamp;
		ctx.beginPath();
		ctx.ellipse(x, y, r * 0.9, r * 2.1, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	const dirX = (headX - tailX) / Math.max(tailLen, 1);
	const dirY = (headY - tailY) / Math.max(tailLen, 1);
	const hotLen = tailLen * 0.28;
	const hotX = headX - dirX * hotLen;
	const hotY = headY - dirY * hotLen;
	const hot = ctx.createLinearGradient(hotX, hotY, headX, headY);
	hot.addColorStop(0, mist(0.08 * brightness));
	hot.addColorStop(0.5, ice(0.55 * brightness));
	hot.addColorStop(1, pearl(0.95 * brightness));
	ctx.strokeStyle = hot;
	ctx.lineWidth = 1.7;
	ctx.beginPath();
	ctx.moveTo(hotX, hotY);
	ctx.lineTo(headX, headY);
	ctx.stroke();
};

const drawGlassOrb = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	brightness: number,
	breath: number,
	energy: number,
) => {
	const scale = 1 + energy * 0.08;
	const auraR = (13 + breath * 2.5) * scale;

	const aura = ctx.createRadialGradient(x, y, 0, x, y, auraR);
	aura.addColorStop(0, pearl(0.22 * brightness));
	aura.addColorStop(0.28, ice(0.16 * brightness));
	aura.addColorStop(0.55, mist(0.08 * brightness));
	aura.addColorStop(1, 'rgba(90, 120, 160, 0)');
	ctx.fillStyle = aura;
	ctx.beginPath();
	ctx.arc(x, y, auraR, 0, Math.PI * 2);
	ctx.fill();

	// Outer glass ring
	const ringR = 6.4 * scale;
	ctx.beginPath();
	ctx.arc(x, y, ringR, 0, Math.PI * 2);
	ctx.strokeStyle = ice(0.55 + breath * 0.12);
	ctx.lineWidth = 1.25;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x, y, ringR + 2.2, 0, Math.PI * 2);
	ctx.strokeStyle = steel(0.18 + breath * 0.06);
	ctx.lineWidth = 0.8;
	ctx.stroke();

	// Body
	const body = ctx.createRadialGradient(
		x - 1.4,
		y - 1.8,
		0,
		x,
		y,
		5.4 * scale,
	);
	body.addColorStop(0, pearl(0.98 * brightness));
	body.addColorStop(0.35, ice(0.88 * brightness));
	body.addColorStop(0.72, mist(0.72 * brightness));
	body.addColorStop(1, steel(0.45 * brightness));
	ctx.fillStyle = body;
	ctx.beginPath();
	ctx.arc(x, y, 4.4 * scale, 0, Math.PI * 2);
	ctx.fill();

	// Specular highlight
	ctx.fillStyle = pearl(0.9 * brightness);
	ctx.beginPath();
	ctx.ellipse(x - 1.3, y - 1.5, 1.35, 0.95, -0.4, 0, Math.PI * 2);
	ctx.fill();

	// Core pin
	ctx.fillStyle = pearl(brightness);
	ctx.beginPath();
	ctx.arc(x, y, 1.15 * scale, 0, Math.PI * 2);
	ctx.fill();
};

export const drawScrollComet = (
	ctx: CanvasRenderingContext2D,
	headX: number,
	headY: number,
	canvasWidth: number,
	canvasHeight: number,
	progress: number,
	brightness: number,
	time: number,
	scrollDir: number,
	velocity: number,
) => {
	const breath = 0.5 + Math.sin(time * 0.0024) * 0.5;
	const speed = Math.min(1.25, Math.abs(scrollDir));
	const moving = velocity > 0.04;
	const energy = Math.min(1, velocity * 1.15);

	const endpointFade = Math.min(progress / 0.04, (1 - progress) / 0.04, 1);
	const endpointEase = endpointFade * endpointFade * endpointFade;
	const atEndpoint = progress <= 0.012 || progress >= 0.988;

	const railX = canvasWidth - 14;
	const edgeTop = 24;
	const edgeBottom = canvasHeight - 24;
	const fade = 0.14;
	const trackLen = edgeBottom - edgeTop;

	const tailLen =
		moving && !atEndpoint && endpointEase > 0.02
			? Math.min(150, canvasHeight * 0.16) *
				(0.75 + speed * 0.55) *
				endpointEase *
				Math.min(1, velocity * 1.35)
			: 0;

	const motion = scrollDir === 0 ? 1 : scrollDir;
	const tilt = 0.22;
	const dirY = motion > 0 ? -1 : 1;
	const dirX = -tilt;
	const mag = Math.hypot(dirX, dirY);
	const tailX = headX + (dirX / mag) * tailLen;
	const tailY = headY + (dirY / mag) * tailLen;

	ctx.save();
	ctx.lineCap = 'round';
	ctx.globalCompositeOperation = 'source-over';

	// Soft rail glow behind track
	drawFadedStroke(
		ctx,
		railX,
		edgeTop,
		edgeBottom,
		7,
		(t) => mist(0.025 + Math.sin(t * Math.PI) * 0.02),
		fade,
		fade,
		36,
	);

	// Base track
	drawFadedStroke(
		ctx,
		railX,
		edgeTop,
		edgeBottom,
		1.15,
		(t) => steel(0.1 + Math.sin(t * Math.PI) * 0.08),
		fade,
		fade,
	);

	// Subtle section ticks
	for (let i = 1; i < 5; i++) {
		const ty = edgeTop + (trackLen * i) / 5;
		const near = 1 - Math.min(1, Math.abs(ty - headY) / 90);
		ctx.strokeStyle = ice(0.08 + near * 0.22);
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(railX - 3.5, ty);
		ctx.lineTo(railX + 3.5, ty);
		ctx.stroke();
	}

	// Progress ribbon
	if (progress > 0.004) {
		const fillEase = atEndpoint ? 0.55 : Math.max(0.4, endpointEase);

		drawFadedStroke(
			ctx,
			railX,
			edgeTop,
			headY,
			8,
			(t) => mist(0.03 + t * 0.07),
			fade,
			0.05,
			40,
			fillEase,
		);

		drawFadedStroke(
			ctx,
			railX,
			edgeTop,
			headY,
			1.85,
			(t) => {
				const tip = Math.pow(t, 1.35);
				return ice(0.22 + tip * 0.55);
			},
			fade,
			0.03,
			56,
			fillEase,
		);

		// Leading shimmer traveling up the filled rail
		const shimmerT = (Math.sin(time * 0.0032 + progress * 8) + 1) * 0.5;
		const shimmerY = edgeTop + (headY - edgeTop) * shimmerT;
		if (headY - edgeTop > 24) {
			const shimmer = ctx.createRadialGradient(
				railX,
				shimmerY,
				0,
				railX,
				shimmerY,
				14,
			);
			shimmer.addColorStop(0, pearl(0.28 * fillEase));
			shimmer.addColorStop(0.4, ice(0.12 * fillEase));
			shimmer.addColorStop(1, 'rgba(120, 150, 190, 0)');
			ctx.fillStyle = shimmer;
			ctx.beginPath();
			ctx.ellipse(railX, shimmerY, 3.5, 12, 0, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	if (tailLen > 2) {
		drawSilkTail(
			ctx,
			headX,
			headY,
			tailX,
			tailY,
			tailLen,
			brightness * endpointEase,
		);
	}

	drawGlassOrb(
		ctx,
		headX,
		headY,
		brightness,
		breath,
		energy * (atEndpoint ? 0.25 : 1),
	);

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
	x: headX + (Math.random() - 0.5) * 5,
	y: headY + (Math.random() - 0.5) * 5,
	life: 1,
	vx: -(Math.random() * 1.2 + 0.3),
	vy:
		scrollDir < 0
			? Math.random() * 1.8 + 0.5
			: -(Math.random() * 1.8 + 0.5),
	size: Math.random() * 1.05 + 0.35,
});

export const drawSparks = (ctx: CanvasRenderingContext2D, sparks: Spark[]) => {
	ctx.save();
	ctx.globalCompositeOperation = 'source-over';

	for (const spark of sparks) {
		const alpha = spark.life * spark.life * 0.7;
		const glow = ctx.createRadialGradient(
			spark.x,
			spark.y,
			0,
			spark.x,
			spark.y,
			spark.size * 2.6,
		);
		glow.addColorStop(0, pearl(alpha));
		glow.addColorStop(0.45, ice(alpha * 0.45));
		glow.addColorStop(1, 'rgba(120, 150, 190, 0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(spark.x, spark.y, spark.size * 2.6, 0, Math.PI * 2);
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
	if (intensity > 0.08) {
		const count = Math.min(4, Math.ceil(intensity * 5));
		for (let i = 0; i < count; i++) {
			sparks.push(createSpark(headX, headY, scrollDir));
		}
	}

	for (let i = sparks.length - 1; i >= 0; i--) {
		sparks[i].x += sparks[i].vx;
		sparks[i].y += sparks[i].vy;
		sparks[i].vy += scrollDir < 0 ? -0.025 : 0.025;
		sparks[i].life -= 0.038;
		if (sparks[i].life <= 0) sparks.splice(i, 1);
	}

	if (sparks.length > 40) sparks.splice(0, sparks.length - 40);
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
