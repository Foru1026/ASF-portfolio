import { useEffect, useRef } from 'react';
import * as THREE from '../vendor/three.module.min.js';

const createEnvMap = () => {
	const size = 256;
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (!ctx) return null;

	const g = ctx.createLinearGradient(0, 0, size, size);
	g.addColorStop(0, '#041018');
	g.addColorStop(0.35, '#0b2a4a');
	g.addColorStop(0.55, '#e8f6ff');
	g.addColorStop(0.7, '#1f8fff');
	g.addColorStop(1, '#02060c');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, size, size);

	// Specular streaks
	ctx.strokeStyle = 'rgba(255,255,255,0.85)';
	ctx.lineWidth = 10;
	ctx.beginPath();
	ctx.moveTo(size * 0.15, size * 0.1);
	ctx.lineTo(size * 0.55, size * 0.35);
	ctx.stroke();
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(size * 0.7, size * 0.2);
	ctx.lineTo(size * 0.95, size * 0.55);
	ctx.stroke();

	const tex = new THREE.CanvasTexture(canvas);
	tex.mapping = THREE.EquirectangularReflectionMapping;
	tex.colorSpace = THREE.SRGBColorSpace;
	return tex;
};

const createBladeGeometry = () => {
	const shape = new THREE.Shape();
	shape.moveTo(0, -0.15);
	shape.bezierCurveTo(0.28, -0.05, 0.42, 0.35, 0.18, 0.95);
	shape.bezierCurveTo(0.08, 1.12, -0.08, 1.12, -0.18, 0.95);
	shape.bezierCurveTo(-0.42, 0.35, -0.28, -0.05, 0, -0.15);

	const geom = new THREE.ExtrudeGeometry(shape, {
		depth: 0.22,
		bevelEnabled: true,
		bevelThickness: 0.06,
		bevelSize: 0.05,
		bevelSegments: 4,
		curveSegments: 24,
	});
	geom.translate(0, 0, -0.11);
	geom.computeVertexNormals();
	return geom;
};

export const HeroLogo3D = () => {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return;

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches;

		const width = mount.clientWidth || 420;
		const height = mount.clientHeight || 320;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
		camera.position.set(0, 0.15, 4.2);
		camera.lookAt(0, 0.05, 0);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance',
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(width, height, false);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.2;
		mount.appendChild(renderer.domElement);

		const envMap = createEnvMap();
		if (envMap) scene.environment = envMap;

		const glassMat = new THREE.MeshPhysicalMaterial({
			color: new THREE.Color('#d9eefe'),
			metalness: 0.05,
			roughness: 0.08,
			transmission: 0.92,
			thickness: 1.35,
			ior: 1.45,
			transparent: true,
			opacity: 1,
			envMapIntensity: 1.6,
			clearcoat: 1,
			clearcoatRoughness: 0.06,
			emissive: new THREE.Color('#1460c8'),
			emissiveIntensity: 0.08,
			side: THREE.DoubleSide,
		});

		const logo = new THREE.Group();
		scene.add(logo);

		const core = new THREE.Mesh(
			new THREE.SphereGeometry(0.42, 64, 64),
			glassMat,
		);
		logo.add(core);

		const bladeGeo = createBladeGeometry();
		for (let i = 0; i < 3; i++) {
			const blade = new THREE.Mesh(bladeGeo, glassMat);
			const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
			blade.position.set(Math.cos(angle) * 0.02, Math.sin(angle) * 0.02, 0);
			blade.rotation.z = angle + Math.PI / 2;
			blade.scale.set(1.05, 1.05, 1);
			logo.add(blade);
		}

		const glow = new THREE.PointLight(0x3aa8ff, 1.8, 6, 2);
		glow.position.set(0, 0.2, 1.2);
		logo.add(glow);

		const key = new THREE.DirectionalLight(0xffffff, 2.4);
		key.position.set(2.8, 3.5, 4);
		scene.add(key);

		const rim = new THREE.DirectionalLight(0x4eb8ff, 1.4);
		rim.position.set(-3, 1.2, -2);
		scene.add(rim);

		const fill = new THREE.DirectionalLight(0xa8d4ff, 0.7);
		fill.position.set(0, -2, 3);
		scene.add(fill);

		scene.add(new THREE.AmbientLight(0x6f88a4, 0.28));
		scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x050a12, 0.55));

		let frame = 0;
		let running = true;
		const clock = new THREE.Clock();
		let targetX = 0;
		let targetY = 0;
		let pointerX = 0;
		let pointerY = 0;

		const onPointerMove = (event: PointerEvent) => {
			const rect = mount.getBoundingClientRect();
			targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
		};

		const onResize = () => {
			const w = mount.clientWidth || 420;
			const h = mount.clientHeight || 320;
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
				logo.rotation.y = t * 0.28 + pointerX * 0.35;
				logo.rotation.x = -0.12 + Math.sin(t * 0.55) * 0.06 + pointerY * 0.18;
				logo.position.y = Math.sin(t * 0.9) * 0.06;
				glow.intensity = 1.55 + Math.sin(t * 2.2) * 0.25;
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
			envMap?.dispose();
			bladeGeo.dispose();
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
			className='hero-logo-3d'
			role='img'
			aria-label='Portfolio emblem'
		/>
	);
};
