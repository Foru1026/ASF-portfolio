const tailRgb = (warmth: number, alpha: number) => {
	const r = Math.round(195 + warmth * 55);
	const g = Math.round(218 + warmth * 28);
	const b = 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
		ctx.lineWidth = width * (0.55 + envelope * 0.45);
		ctx.beginPath();
		ctx.moveTo(x, yStart + len * t0);
		ctx.lineTo(x, yStart + len * t1);
		ctx.stroke();
	}

	ctx.globalAlpha = 1;
};

const drawVividTail = (
	ctx: CanvasRenderingContext2D,
	headX: number,
	headY: number,
	tailX: number,
	tailY: number,
	tailLen: number,
	brightness: number,
	pulse: number,
) => {
	const steps = 46;
	const maxWidth = 3.6 * brightness * pulse;

	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const fade = Math.pow(1 - t, 3.8);
		if (fade < 0.004) continue;

		const x = tailX + (headX - tailX) * t;
		const y = tailY + (headY - tailY) * t;
		const radius = maxWidth * fade * fade + 0.1;
		const warmth = 0.25 + t * 0.75;
		const alpha = fade * brightness * pulse * 0.78;

		const stamp = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
		stamp.addColorStop(0, tailRgb(warmth, alpha * 0.95));
		stamp.addColorStop(0.35, tailRgb(warmth * 0.7, alpha * 0.48));
		stamp.addColorStop(0.7, `rgba(31, 140, 255, ${alpha * 0.14})`);
		stamp.addColorStop(1, 'rgba(20, 60, 120, 0)');

		ctx.fillStyle = stamp;
		ctx.beginPath();
		ctx.ellipse(x, y, radius * 1.2, radius * 2.5, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	const dirX = (headX - tailX) / Math.max(tailLen, 1);
	const dirY = (headY - tailY) / Math.max(tailLen, 1);

	for (let i = 0; i < 30; i++) {
		const t0 = i / 30;
		const t1 = (i + 1) / 30;
		const fade1 = Math.pow(t1, 3.2);
		const x0 = tailX + (headX - tailX) * t0;
		const y0 = tailY + (headY - tailY) * t0;
		const x1 = tailX + (headX - tailX) * t1;
		const y1 = tailY + (headY - tailY) * t1;

		ctx.strokeStyle = tailRgb(0.5 + t1 * 0.5, fade1 * brightness * pulse * 0.95);
		ctx.lineWidth = 0.1 + fade1 * fade1 * 1.85;
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
	}

	const hotLen = tailLen * 0.22;
	const hotX = headX - dirX * hotLen;
	const hotY = headY - dirY * hotLen;
	const hotGrad = ctx.createLinearGradient(hotX, hotY, headX, headY);
	hotGrad.addColorStop(0, `rgba(140, 205, 255, ${0.35 * brightness})`);
	hotGrad.addColorStop(0.5, `rgba(230, 248, 255, ${0.92 * brightness})`);
	hotGrad.addColorStop(1, 'rgba(255, 255, 255, 1)');
	ctx.strokeStyle = hotGrad;
	ctx.lineWidth = 2.15;
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
	time: number,
	scrollDir: number,
	velocity: number,
) => {
	const pulse = 0.88 + Math.sin(time * 0.0042) * 0.12;
	const ringPulse = 0.7 + Math.sin(time * 0.006) * 0.3;
	const speed = Math.min(1.35, Math.abs(scrollDir));
	const moving = velocity > 0.04;

	const endpointFade = Math.min(progress / 0.04, (1 - progress) / 0.04, 1);
	const endpointEase = endpointFade * endpointFade * endpointFade;
	const atEndpoint = progress <= 0.012 || progress >= 0.988;

	const tailLen =
		moving && !atEndpoint && endpointEase > 0.02
			? Math.min(210, canvasHeight * 0.22) *
				(0.85 + speed * 0.7) *
				endpointEase *
				Math.min(1, velocity * 1.5)
			: Math.min(70, canvasHeight * 0.08) * (0.35 + pulse * 0.25);

	const motion = scrollDir === 0 ? 1 : scrollDir;
	const tilt = 0.32;
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
	ctx.globalCompositeOperation = 'lighter';
	ctx.lineCap = 'round';

	drawFadedStroke(
		ctx,
		railX,
		edgeTop,
		edgeBottom,
		1.25,
		(t) => {
			const core = 0.05 + Math.sin(t * Math.PI) * 0.09;
			return `rgba(100, 175, 255, ${core})`;
		},
		fade,
		fade,
	);

	if (progress > 0.004) {
		const fillEase = atEndpoint ? 0.65 : Math.max(0.45, endpointEase);

		drawFadedStroke(
			ctx,
			railX,
			edgeTop,
			headY,
			2.6,
			(t) => {
				const intensity = 0.22 + t * 0.58 + Math.pow(t, 1.4) * 0.28;
				return `rgba(${Math.round(70 + t * 110)}, ${Math.round(175 + t * 45)}, 255, ${intensity})`;
			},
			fade,
			0.04,
			56,
			fillEase,
		);

		drawFadedStroke(
			ctx,
			railX - 1,
			edgeTop,
			headY,
			14,
			(t) => `rgba(70, 160, 255, ${0.045 + t * 0.07})`,
			fade * 1.2,
			0.06,
			40,
			fillEase * 0.9,
		);

		// Traveling energy bead on filled rail
		const beadT = (Math.sin(time * 0.0045 + progress * 10) + 1) * 0.5;
		const beadY = edgeTop + (headY - edgeTop) * beadT;
		if (headY - edgeTop > 30) {
			const bead = ctx.createRadialGradient(railX, beadY, 0, railX, beadY, 16);
			bead.addColorStop(0, `rgba(255, 255, 255, ${0.55 * fillEase})`);
			bead.addColorStop(0.35, `rgba(160, 225, 255, ${0.28 * fillEase})`);
			bead.addColorStop(1, 'rgba(40, 100, 200, 0)');
			ctx.fillStyle = bead;
			ctx.beginPath();
			ctx.ellipse(railX, beadY, 4, 14, 0, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	if (tailLen > 2) {
		drawVividTail(
			ctx,
			headX,
			headY,
			tailX,
			tailY,
			tailLen,
			brightness * (atEndpoint ? 0.55 : endpointEase || 0.7),
			pulse,
		);
	}

	// Expanding pulse rings
	for (let i = 0; i < 2; i++) {
		const phase = (time * 0.0018 + i * 0.5) % 1;
		const ringR = 6 + phase * 16;
		const ringA = (1 - phase) * 0.28 * brightness * ringPulse;
		ctx.beginPath();
		ctx.arc(headX, headY, ringR, 0, Math.PI * 2);
		ctx.strokeStyle = `rgba(140, 210, 255, ${ringA})`;
		ctx.lineWidth = 1.2 - phase * 0.6;
		ctx.stroke();
	}

	const bloomR = 12.5 * pulse;
	const bloom = ctx.createRadialGradient(headX, headY, 0, headX, headY, bloomR);
	bloom.addColorStop(0, 'rgba(255, 255, 255, 1)');
	bloom.addColorStop(0.18, `rgba(230, 248, 255, ${0.95 * brightness})`);
	bloom.addColorStop(0.42, `rgba(31, 195, 255, ${0.48 * brightness})`);
	bloom.addColorStop(0.7, `rgba(120, 100, 255, ${0.16 * brightness})`);
	bloom.addColorStop(1, 'rgba(20, 60, 140, 0)');
	ctx.fillStyle = bloom;
	ctx.beginPath();
	ctx.arc(headX, headY, bloomR, 0, Math.PI * 2);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(headX, headY, 5.2 * pulse, 0, Math.PI * 2);
	ctx.strokeStyle = `rgba(180, 230, 255, ${0.55 * brightness})`;
	ctx.lineWidth = 1.15;
	ctx.stroke();

	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	ctx.arc(headX, headY, 1.7 * pulse, 0, Math.PI * 2);
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
	x: headX + (Math.random() - 0.5) * 5,
	y: headY + (Math.random() - 0.5) * 5,
	life: 1,
	vx: -(Math.random() * 2 + 0.55),
	vy:
		scrollDir < 0
			? Math.random() * 2.6 + 0.9
			: -(Math.random() * 2.6 + 0.9),
	size: Math.random() * 1.35 + 0.45,
});

export const drawSparks = (ctx: CanvasRenderingContext2D, sparks: Spark[]) => {
	ctx.save();
	ctx.globalCompositeOperation = 'lighter';

	for (const spark of sparks) {
		const alpha = spark.life * spark.life * 0.95;
		const glow = ctx.createRadialGradient(
			spark.x,
			spark.y,
			0,
			spark.x,
			spark.y,
			spark.size * 3.2,
		);
		glow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
		glow.addColorStop(0.3, `rgba(180, 230, 255, ${alpha * 0.6})`);
		glow.addColorStop(1, 'rgba(31, 195, 255, 0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(spark.x, spark.y, spark.size * 3.2, 0, Math.PI * 2);
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
	if (intensity > 0.05) {
		const count = Math.min(7, Math.ceil(intensity * 8));
		for (let i = 0; i < count; i++) {
			sparks.push(createSpark(headX, headY, scrollDir));
		}
	}

	for (let i = sparks.length - 1; i >= 0; i--) {
		sparks[i].x += sparks[i].vx;
		sparks[i].y += sparks[i].vy;
		sparks[i].vy += scrollDir < 0 ? -0.035 : 0.035;
		sparks[i].life -= 0.032;
		if (sparks[i].life <= 0) sparks.splice(i, 1);
	}

	if (sparks.length > 70) sparks.splice(0, sparks.length - 70);
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
