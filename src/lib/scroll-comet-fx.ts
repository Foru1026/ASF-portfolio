const frost = (a: number) => `rgba(236, 248, 255, ${a})`;
const ice = (a: number) => `rgba(170, 225, 255, ${a})`;
const cyan = (a: number) => `rgba(31, 195, 255, ${a})`;
const violet = (a: number) => `rgba(140, 120, 255, ${a})`;
const steel = (a: number) => `rgba(110, 160, 210, ${a})`;

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
	steps = 52,
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

const drawCometPlume = (
	ctx: CanvasRenderingContext2D,
	headX: number,
	headY: number,
	tailX: number,
	tailY: number,
	tailLen: number,
	brightness: number,
	pulse: number,
) => {
	const steps = 52;
	const maxW = 4.4 * brightness * pulse;

	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const fade = Math.pow(1 - t, 3.6);
		if (fade < 0.004) continue;

		const x = tailX + (headX - tailX) * t;
		const y = tailY + (headY - tailY) * t;
		const r = maxW * fade * fade + 0.12;
		const warmth = 0.2 + t * 0.8;
		const alpha = fade * brightness * pulse * 0.82;
		const rr = Math.round(180 + warmth * 70);
		const gg = Math.round(210 + warmth * 35);

		const stamp = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
		stamp.addColorStop(0, `rgba(${rr}, ${gg}, 255, ${alpha})`);
		stamp.addColorStop(0.32, ice(alpha * 0.5));
		stamp.addColorStop(0.65, cyan(alpha * 0.16));
		stamp.addColorStop(1, 'rgba(20, 50, 110, 0)');
		ctx.fillStyle = stamp;
		ctx.beginPath();
		ctx.ellipse(x, y, r * 1.25, r * 2.7, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	const dirX = (headX - tailX) / Math.max(tailLen, 1);
	const dirY = (headY - tailY) / Math.max(tailLen, 1);
	const hotLen = tailLen * 0.26;
	const hotX = headX - dirX * hotLen;
	const hotY = headY - dirY * hotLen;
	const hot = ctx.createLinearGradient(hotX, hotY, headX, headY);
	hot.addColorStop(0, ice(0.2 * brightness));
	hot.addColorStop(0.45, frost(0.85 * brightness));
	hot.addColorStop(1, 'rgba(255, 255, 255, 1)');
	ctx.strokeStyle = hot;
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(hotX, hotY);
	ctx.lineTo(headX, headY);
	ctx.stroke();
};

const drawCrystalOrb = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	brightness: number,
	time: number,
	energy: number,
) => {
	const breath = 0.5 + Math.sin(time * 0.0032) * 0.5;
	const scale = 1 + energy * 0.12 + breath * 0.04;

	// Soft ambient glow
	const auraR = 22 * scale;
	const aura = ctx.createRadialGradient(x, y, 0, x, y, auraR);
	aura.addColorStop(0, frost(0.35 * brightness));
	aura.addColorStop(0.25, ice(0.22 * brightness));
	aura.addColorStop(0.5, cyan(0.12 * brightness));
	aura.addColorStop(0.78, violet(0.06 * brightness));
	aura.addColorStop(1, 'rgba(20, 40, 90, 0)');
	ctx.fillStyle = aura;
	ctx.beginPath();
	ctx.arc(x, y, auraR, 0, Math.PI * 2);
	ctx.fill();

	// Orbiting dashed ring
	const orbitR = 11.5 * scale;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(time * 0.0016);
	ctx.setLineDash([3.2, 4.8]);
	ctx.beginPath();
	ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
	ctx.strokeStyle = ice(0.35 + breath * 0.2);
	ctx.lineWidth = 1.05;
	ctx.stroke();
	ctx.setLineDash([]);

	// Counter-orbit diamond ticks
	ctx.rotate(-time * 0.0032);
	for (let i = 0; i < 4; i++) {
		const a = (i / 4) * Math.PI * 2;
		const dx = Math.cos(a) * (orbitR + 1.5);
		const dy = Math.sin(a) * (orbitR + 1.5);
		ctx.beginPath();
		ctx.moveTo(dx, dy - 2.2);
		ctx.lineTo(dx + 2.2, dy);
		ctx.lineTo(dx, dy + 2.2);
		ctx.lineTo(dx - 2.2, dy);
		ctx.closePath();
		ctx.fillStyle = frost(0.35 + breath * 0.25);
		ctx.fill();
	}
	ctx.restore();

	// Expanding shock rings
	for (let i = 0; i < 3; i++) {
		const phase = (time * 0.0015 + i / 3) % 1;
		const ringR = 5 + phase * 20;
		const ringA = (1 - phase) * (0.32 - i * 0.04) * brightness;
		ctx.beginPath();
		ctx.arc(x, y, ringR, 0, Math.PI * 2);
		ctx.strokeStyle = cyan(ringA);
		ctx.lineWidth = 1.4 - phase * 0.85;
		ctx.stroke();
	}

	// Glass body
	const bodyR = 5.6 * scale;
	const body = ctx.createRadialGradient(x - 1.6, y - 2, 0, x, y, bodyR);
	body.addColorStop(0, 'rgba(255, 255, 255, 1)');
	body.addColorStop(0.28, frost(0.98 * brightness));
	body.addColorStop(0.55, ice(0.85 * brightness));
	body.addColorStop(0.82, cyan(0.55 * brightness));
	body.addColorStop(1, violet(0.25 * brightness));
	ctx.fillStyle = body;
	ctx.beginPath();
	ctx.arc(x, y, bodyR, 0, Math.PI * 2);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(x, y, bodyR + 0.4, 0, Math.PI * 2);
	ctx.strokeStyle = frost(0.7 * brightness);
	ctx.lineWidth = 1.2;
	ctx.stroke();

	// Specular
	ctx.fillStyle = frost(0.95);
	ctx.beginPath();
	ctx.ellipse(x - 1.7, y - 1.9, 1.7, 1.1, -0.45, 0, Math.PI * 2);
	ctx.fill();

	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	ctx.arc(x, y, 1.55 * scale, 0, Math.PI * 2);
	ctx.fill();
};

const drawSectionTicks = (
	ctx: CanvasRenderingContext2D,
	railX: number,
	edgeTop: number,
	edgeBottom: number,
	headY: number,
	time: number,
	brightness: number,
) => {
	const count = 6;
	const len = edgeBottom - edgeTop;
	for (let i = 1; i < count; i++) {
		const ty = edgeTop + (len * i) / count;
		const passed = headY >= ty;
		const near = 1 - Math.min(1, Math.abs(ty - headY) / 70);
		const twinkle = 0.55 + Math.sin(time * 0.003 + i * 1.7) * 0.45;
		const alpha =
			(passed ? 0.28 : 0.1) * brightness + near * 0.35 * twinkle;

		ctx.strokeStyle = passed ? ice(alpha) : steel(alpha * 0.7);
		ctx.lineWidth = passed ? 1.35 : 1;
		ctx.beginPath();
		ctx.moveTo(railX - (passed ? 5.5 : 3.5), ty);
		ctx.lineTo(railX + (passed ? 5.5 : 3.5), ty);
		ctx.stroke();

		if (passed || near > 0.4) {
			const glow = ctx.createRadialGradient(railX, ty, 0, railX, ty, 8);
			glow.addColorStop(0, frost(0.18 * near * brightness));
			glow.addColorStop(1, 'rgba(40, 90, 160, 0)');
			ctx.fillStyle = glow;
			ctx.beginPath();
			ctx.arc(railX, ty, 8, 0, Math.PI * 2);
			ctx.fill();
		}
	}
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
	const pulse = 0.9 + Math.sin(time * 0.004) * 0.1;
	const speed = Math.min(1.4, Math.abs(scrollDir));
	const moving = velocity > 0.04;
	const energy = Math.min(1, velocity * 1.25);

	const endpointFade = Math.min(progress / 0.04, (1 - progress) / 0.04, 1);
	const endpointEase = endpointFade * endpointFade * endpointFade;
	const atEndpoint = progress <= 0.012 || progress >= 0.988;

	const railX = canvasWidth - 18;
	const edgeTop = 24;
	const edgeBottom = canvasHeight - 24;
	const fade = 0.14;

	const idleTail = 48 + pulse * 18;
	const motionTail =
		Math.min(230, canvasHeight * 0.24) *
		(0.9 + speed * 0.75) *
		endpointEase *
		Math.min(1, velocity * 1.55);
	const tailLen =
		moving && !atEndpoint && endpointEase > 0.02 ? motionTail : idleTail;

	const motion = scrollDir === 0 ? 1 : scrollDir;
	const tilt = 0.34;
	const dirY = motion > 0 ? -1 : 1;
	const dirX = -tilt;
	const mag = Math.hypot(dirX, dirY);
	const tailX = headX + (dirX / mag) * tailLen;
	const tailY = headY + (dirY / mag) * tailLen;

	ctx.save();
	ctx.globalCompositeOperation = 'lighter';
	ctx.lineCap = 'round';

	// Soft vertical aurora behind rail
	drawFadedStroke(
		ctx,
		railX,
		edgeTop,
		edgeBottom,
		16,
		(t) => cyan(0.018 + Math.sin(t * Math.PI) * 0.02),
		fade,
		fade,
		36,
	);

	// Base rail
	drawFadedStroke(
		ctx,
		railX,
		edgeTop,
		edgeBottom,
		1.35,
		(t) => {
			const core = 0.07 + Math.sin(t * Math.PI) * 0.1;
			return steel(core);
		},
		fade,
		fade,
	);

	drawSectionTicks(
		ctx,
		railX,
		edgeTop,
		edgeBottom,
		headY,
		time,
		brightness,
	);

	if (progress > 0.003) {
		const fillEase = atEndpoint ? 0.7 : Math.max(0.5, endpointEase);

		drawFadedStroke(
			ctx,
			railX,
			edgeTop,
			headY,
			18,
			(t) => violet(0.02 + t * 0.04),
			fade,
			0.05,
			36,
			fillEase,
		);

		drawFadedStroke(
			ctx,
			railX,
			edgeTop,
			headY,
			3.1,
			(t) => {
				const tip = Math.pow(t, 1.25);
				return ice(0.28 + tip * 0.62);
			},
			fade,
			0.03,
			60,
			fillEase,
		);

		drawFadedStroke(
			ctx,
			railX - 1.2,
			edgeTop,
			headY,
			1.1,
			(t) => frost(0.12 + t * 0.35),
			fade,
			0.04,
			40,
			fillEase,
		);

		// Dual traveling beads
		if (headY - edgeTop > 36) {
			for (let b = 0; b < 2; b++) {
				const beadT =
					(Math.sin(time * (0.0038 + b * 0.001) + progress * 9 + b * 2.1) +
						1) *
					0.5;
				const beadY = edgeTop + (headY - edgeTop) * beadT;
				const bead = ctx.createRadialGradient(
					railX,
					beadY,
					0,
					railX,
					beadY,
					18,
				);
				bead.addColorStop(0, frost(0.65 * fillEase));
				bead.addColorStop(0.3, ice(0.32 * fillEase));
				bead.addColorStop(1, 'rgba(40, 90, 180, 0)');
				ctx.fillStyle = bead;
				ctx.beginPath();
				ctx.ellipse(railX, beadY, 3.8, 13, 0, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}

	if (tailLen > 2) {
		drawCometPlume(
			ctx,
			headX,
			headY,
			tailX,
			tailY,
			tailLen,
			brightness * (atEndpoint ? 0.6 : Math.max(0.55, endpointEase)),
			pulse,
		);
	}

	// Tiny constellation companions around head
	for (let i = 0; i < 5; i++) {
		const a = time * 0.0022 + (i / 5) * Math.PI * 2;
		const rr = 14 + Math.sin(time * 0.003 + i) * 3;
		const px = headX + Math.cos(a) * rr;
		const py = headY + Math.sin(a) * rr * 0.72;
		const aAlpha = (0.25 + Math.sin(time * 0.005 + i * 1.3) * 0.2) * brightness;
		const sparkle = ctx.createRadialGradient(px, py, 0, px, py, 3.5);
		sparkle.addColorStop(0, frost(aAlpha));
		sparkle.addColorStop(1, 'rgba(60, 120, 200, 0)');
		ctx.fillStyle = sparkle;
		ctx.beginPath();
		ctx.arc(px, py, 3.5, 0, Math.PI * 2);
		ctx.fill();
	}

	drawCrystalOrb(
		ctx,
		headX,
		headY,
		brightness,
		time,
		energy * (atEndpoint ? 0.35 : 1),
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
	x: headX + (Math.random() - 0.5) * 8,
	y: headY + (Math.random() - 0.5) * 8,
	life: 1,
	vx: -(Math.random() * 2.4 + 0.6),
	vy:
		scrollDir < 0
			? Math.random() * 3 + 1
			: -(Math.random() * 3 + 1),
	size: Math.random() * 1.5 + 0.5,
});

export const drawSparks = (ctx: CanvasRenderingContext2D, sparks: Spark[]) => {
	ctx.save();
	ctx.globalCompositeOperation = 'lighter';

	for (const spark of sparks) {
		const alpha = spark.life * spark.life;
		const glow = ctx.createRadialGradient(
			spark.x,
			spark.y,
			0,
			spark.x,
			spark.y,
			spark.size * 3.6,
		);
		glow.addColorStop(0, frost(alpha));
		glow.addColorStop(0.28, ice(alpha * 0.65));
		glow.addColorStop(0.65, cyan(alpha * 0.25));
		glow.addColorStop(1, 'rgba(31, 100, 200, 0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(spark.x, spark.y, spark.size * 3.6, 0, Math.PI * 2);
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
	if (intensity > 0.04) {
		const count = Math.min(9, Math.ceil(intensity * 10));
		for (let i = 0; i < count; i++) {
			sparks.push(createSpark(headX, headY, scrollDir));
		}
	}

	// Soft idle drift sparks so the indicator always feels alive
	if (intensity < 0.04 && Math.random() < 0.08) {
		sparks.push({
			x: headX + (Math.random() - 0.5) * 10,
			y: headY + (Math.random() - 0.5) * 10,
			life: 1,
			vx: (Math.random() - 0.5) * 0.6,
			vy: (Math.random() - 0.5) * 0.6,
			size: Math.random() * 0.9 + 0.3,
		});
	}

	for (let i = sparks.length - 1; i >= 0; i--) {
		sparks[i].x += sparks[i].vx;
		sparks[i].y += sparks[i].vy;
		sparks[i].vy += scrollDir < 0 ? -0.04 : 0.04;
		sparks[i].life -= intensity > 0.04 ? 0.03 : 0.018;
		if (sparks[i].life <= 0) sparks.splice(i, 1);
	}

	if (sparks.length > 80) sparks.splice(0, sparks.length - 80);
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
