import { useEffect, useRef } from 'react';
import * as THREE from '../vendor/three.module.min.js';

const createTopPlateTexture = () => {
	const size = 1024;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (!ctx) return null;

	const gradient = ctx.createLinearGradient(0, 0, size, size);
	gradient.addColorStop(0, '#1a2433');
	gradient.addColorStop(0.45, '#2a3648');
	gradient.addColorStop(1, '#121820');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	// Brushed metal lines
	ctx.globalAlpha = 0.08;
	for (let i = 0; i < 120; i++) {
		const y = (i / 120) * size;
		ctx.strokeStyle = i % 2 === 0 ? '#d7e8ff' : '#0a1018';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(size, y + (i % 3) - 1);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;

	// Corner circuit grooves
	ctx.strokeStyle = 'rgba(120, 180, 220, 0.28)';
	ctx.lineWidth = 3;
	const groove = (x: number, y: number, flipX: number, flipY: number) => {
		ctx.beginPath();
		ctx.moveTo(x, y + 90 * flipY);
		ctx.lineTo(x, y + 36 * flipY);
		ctx.lineTo(x + 36 * flipX, y);
		ctx.lineTo(x + 110 * flipX, y);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x + 18 * flipX, y + 18 * flipY, 5, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(140, 200, 240, 0.35)';
		ctx.fill();
	};
	groove(70, 70, 1, 1);
	groove(size - 70, 70, -1, 1);
	groove(70, size - 70, 1, -1);
	groove(size - 70, size - 70, -1, -1);

	// Stylized A / delta logo
	const cx = size * 0.5;
	const cy = size * 0.42;
	ctx.save();
	ctx.translate(cx, cy);
	ctx.shadowColor = 'rgba(40, 160, 255, 0.55)';
	ctx.shadowBlur = 28;

	const drawA = (scale: number, fill: string) => {
		ctx.beginPath();
		ctx.moveTo(0, -150 * scale);
		ctx.bezierCurveTo(40 * scale, -130 * scale, 110 * scale, 20 * scale, 120 * scale, 120 * scale);
		ctx.bezierCurveTo(70 * scale, 70 * scale, 30 * scale, 40 * scale, 0, 55 * scale);
		ctx.bezierCurveTo(-30 * scale, 40 * scale, -70 * scale, 70 * scale, -120 * scale, 120 * scale);
		ctx.bezierCurveTo(-110 * scale, 20 * scale, -40 * scale, -130 * scale, 0, -150 * scale);
		ctx.closePath();
		ctx.fillStyle = fill;
		ctx.fill();
	};

	drawA(1.05, '#0d1520');
	ctx.shadowBlur = 0;
	drawA(1, '#c5d4e4');

	// Inner ribbon cut
	ctx.globalCompositeOperation = 'destination-out';
	ctx.beginPath();
	ctx.moveTo(0, -70);
	ctx.bezierCurveTo(28, -50, 48, 10, 42, 55);
	ctx.bezierCurveTo(18, 28, -18, 28, -42, 55);
	ctx.bezierCurveTo(-48, 10, -28, -50, 0, -70);
	ctx.closePath();
	ctx.fill();
	ctx.globalCompositeOperation = 'source-over';
	ctx.restore();

	// Blue underglow wash under logo
	const glow = ctx.createRadialGradient(cx, cy + 20, 10, cx, cy + 20, 220);
	glow.addColorStop(0, 'rgba(40, 170, 255, 0.28)');
	glow.addColorStop(0.55, 'rgba(30, 120, 220, 0.1)');
	glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, size, size);

	// Engraved text
	ctx.fillStyle = 'rgba(190, 210, 230, 0.92)';
	ctx.font = '700 42px "Segoe UI", "Helvetica Neue", sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('ARTIFICIAL', cx, size * 0.72);
	ctx.fillText('INTELLIGENCE', cx, size * 0.72 + 56);

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 8;
	return texture;
};

const createRoundedBox = (w: number, h: number, d: number, r: number) => {
	const shape = new THREE.Shape();
	const x = -w / 2;
	const y = -d / 2;
	shape.moveTo(x + r, y);
	shape.lineTo(x + w - r, y);
	shape.quadraticCurveTo(x + w, y, x + w, y + r);
	shape.lineTo(x + w, y + d - r);
	shape.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
	shape.lineTo(x + r, y + d);
	shape.quadraticCurveTo(x, y + d, x, y + d - r);
	shape.lineTo(x, y + r);
	shape.quadraticCurveTo(x, y, x + r, y);

	const geom = new THREE.ExtrudeGeometry(shape, {
		depth: h,
		bevelEnabled: true,
		bevelThickness: 0.04,
		bevelSize: 0.04,
		bevelSegments: 3,
		curveSegments: 10,
	});
	geom.rotateX(-Math.PI / 2);
	geom.translate(0, h / 2, 0);
	geom.computeVertexNormals();
	return geom;
};

const addPins = (group: THREE.Group, metal: THREE.Material) => {
	const pinGeo = new THREE.BoxGeometry(0.08, 0.28, 0.05);
	const count = 14;
	const span = 2.05;
	const edge = 1.28;

	for (let i = 0; i < count; i++) {
		const t = i / (count - 1);
		const along = -span / 2 + span * t;

		for (const side of [
			{ x: along, z: edge, ry: 0 },
			{ x: along, z: -edge, ry: 0 },
			{ x: edge, z: along, ry: Math.PI / 2 },
			{ x: -edge, z: along, ry: Math.PI / 2 },
		]) {
			const pin = new THREE.Mesh(pinGeo, metal);
			pin.position.set(side.x, -0.02, side.z);
			pin.rotation.y = side.ry;
			pin.castShadow = true;
			group.add(pin);
		}
	}
};

export const HeroChip3D = () => {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return;

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;

		const width = mount.clientWidth || 560;
		const height = mount.clientHeight || 360;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 40);
		camera.position.set(0, 3.35, 5.4);
		camera.lookAt(0, 0.15, 0);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance',
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(width, height, false);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.15;
		mount.appendChild(renderer.domElement);

		const chip = new THREE.Group();
		scene.add(chip);

		const metalMat = new THREE.MeshStandardMaterial({
			color: new THREE.Color('#8fa4b8'),
			metalness: 0.92,
			roughness: 0.28,
			envMapIntensity: 1.2,
		});

		const bodyMat = new THREE.MeshStandardMaterial({
			color: new THREE.Color('#1c2633'),
			metalness: 0.85,
			roughness: 0.38,
		});

		const edgeGlowMat = new THREE.MeshStandardMaterial({
			color: new THREE.Color('#1a2a3a'),
			emissive: new THREE.Color('#1f8fff'),
			emissiveIntensity: 0.55,
			metalness: 0.7,
			roughness: 0.35,
		});

		const body = new THREE.Mesh(createRoundedBox(2.45, 0.28, 2.45, 0.22), bodyMat);
		body.castShadow = true;
		body.receiveShadow = true;
		chip.add(body);

		const rim = new THREE.Mesh(createRoundedBox(2.52, 0.05, 2.52, 0.24), edgeGlowMat);
		rim.position.y = 0.16;
		chip.add(rim);

		const topTex = createTopPlateTexture();
		const topMat = new THREE.MeshStandardMaterial({
			map: topTex ?? undefined,
			color: topTex ? '#ffffff' : '#2a3648',
			metalness: 0.78,
			roughness: 0.32,
		});
		const top = new THREE.Mesh(createRoundedBox(2.35, 0.07, 2.35, 0.2), topMat);
		top.position.y = 0.22;
		chip.add(top);

		// Raised logo block with blue underlight
		const logoBase = new THREE.Mesh(
			new THREE.CylinderGeometry(0.55, 0.62, 0.08, 48),
			new THREE.MeshStandardMaterial({
				color: '#9eb0c2',
				metalness: 0.9,
				roughness: 0.25,
				emissive: new THREE.Color('#1470d8'),
				emissiveIntensity: 0.25,
			}),
		);
		logoBase.position.set(0, 0.3, -0.08);
		chip.add(logoBase);

		const underGlow = new THREE.PointLight(0x2aa0ff, 2.4, 4.5, 2);
		underGlow.position.set(0, 0.22, -0.05);
		chip.add(underGlow);

		addPins(chip, metalMat);

		chip.rotation.x = -0.38;
		chip.rotation.y = 0.55;

		const key = new THREE.DirectionalLight(0xe8f4ff, 2.2);
		key.position.set(3.5, 6, 4);
		scene.add(key);

		const fill = new THREE.DirectionalLight(0x6aa8ff, 0.85);
		fill.position.set(-4, 2, -2);
		scene.add(fill);

		const rimLight = new THREE.DirectionalLight(0x3ec7ff, 1.1);
		rimLight.position.set(-2, 1.5, 5);
		scene.add(rimLight);

		scene.add(new THREE.AmbientLight(0x6b7c90, 0.35));

		const hemi = new THREE.HemisphereLight(0xb7d4ff, 0x0a1018, 0.55);
		scene.add(hemi);

		let frame = 0;
		let running = true;
		const clock = new THREE.Clock();
		let pointerX = 0;
		let pointerY = 0;
		let targetX = 0;
		let targetY = 0;

		const onPointerMove = (event: PointerEvent) => {
			const rect = mount.getBoundingClientRect();
			targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
		};

		const onResize = () => {
			const w = mount.clientWidth || 560;
			const h = mount.clientHeight || 360;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h, false);
		};

		const render = () => {
			if (!running) return;
			const t = clock.getElapsedTime();

			pointerX += (targetX - pointerX) * 0.06;
			pointerY += (targetY - pointerY) * 0.06;

			if (!reducedMotion) {
				chip.rotation.y = 0.55 + Math.sin(t * 0.35) * 0.18 + pointerX * 0.22;
				chip.rotation.x = -0.38 + pointerY * 0.12;
				chip.position.y = Math.sin(t * 0.9) * 0.05;
				underGlow.intensity = 2.1 + Math.sin(t * 2.1) * 0.35;
			}

			renderer.render(scene, camera);
			frame = requestAnimationFrame(render);
		};

		mount.addEventListener('pointermove', onPointerMove);
		window.addEventListener('resize', onResize);
		frame = requestAnimationFrame(render);

		return () => {
			running = false;
			cancelAnimationFrame(frame);
			mount.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('resize', onResize);
			renderer.dispose();
			topTex?.dispose();
			scene.traverse((obj) => {
				const mesh = obj as THREE.Mesh;
				if (mesh.isMesh) {
					mesh.geometry?.dispose();
					const mat = mesh.material;
					if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
					else mat?.dispose();
				}
			});
			if (renderer.domElement.parentElement === mount) {
				mount.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<div
			ref={mountRef}
			className='hero-chip-3d'
			role='img'
			aria-label='Artificial Intelligence chip'
		/>
	);
};
