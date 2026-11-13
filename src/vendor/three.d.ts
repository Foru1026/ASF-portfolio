declare module '../vendor/three.module.min.js' {
	export * from 'three';
}

declare module './three.module.min.js' {
	export * from 'three';
}

declare module '*/three.module.min.js' {
	export * from 'three';
}

declare module 'three' {
	export class Vector3 {
		constructor(x?: number, y?: number, z?: number);
		x: number;
		y: number;
		z: number;
		set(x: number, y: number, z: number): this;
	}
	export class Color {
		constructor(color?: string | number);
	}
	export class Object3D {
		position: Vector3;
		rotation: { x: number; y: number; z: number };
		scale: Vector3;
		add(object: Object3D): this;
		traverse(callback: (object: Object3D) => void): void;
	}
	export class Scene extends Object3D {
		environment: Texture | null;
	}
	export class Group extends Object3D {}
	export class Camera extends Object3D {
		aspect: number;
		updateProjectionMatrix(): void;
		lookAt(x: number | Vector3, y?: number, z?: number): void;
	}
	export class PerspectiveCamera extends Camera {
		constructor(fov: number, aspect: number, near: number, far: number);
	}
	export class Light extends Object3D {
		intensity: number;
	}
	export class AmbientLight extends Light {
		constructor(color?: string | number, intensity?: number);
	}
	export class DirectionalLight extends Light {
		constructor(color?: string | number, intensity?: number);
	}
	export class HemisphereLight extends Light {
		constructor(
			skyColor?: string | number,
			groundColor?: string | number,
			intensity?: number,
		);
	}
	export class PointLight extends Light {
		constructor(
			color?: string | number,
			intensity?: number,
			distance?: number,
			decay?: number,
		);
	}
	export class Material {
		dispose(): void;
	}
	export class MeshStandardMaterial extends Material {
		constructor(parameters?: Record<string, unknown>);
	}
	export class MeshPhysicalMaterial extends MeshStandardMaterial {
		constructor(parameters?: Record<string, unknown>);
	}
	export class Texture {
		colorSpace: string;
		anisotropy: number;
		mapping: number;
		dispose(): void;
	}
	export class CanvasTexture extends Texture {
		constructor(canvas: HTMLCanvasElement);
	}
	export class BufferGeometry {
		rotateX(angle: number): this;
		translate(x: number, y: number, z: number): this;
		computeVertexNormals(): void;
		dispose(): void;
	}
	export class BoxGeometry extends BufferGeometry {
		constructor(width?: number, height?: number, depth?: number);
	}
	export class SphereGeometry extends BufferGeometry {
		constructor(
			radius?: number,
			widthSegments?: number,
			heightSegments?: number,
		);
	}
	export class CylinderGeometry extends BufferGeometry {
		constructor(
			radiusTop?: number,
			radiusBottom?: number,
			height?: number,
			radialSegments?: number,
		);
	}
	export class ExtrudeGeometry extends BufferGeometry {
		constructor(shapes: unknown, options?: Record<string, unknown>);
	}
	export class Shape {
		moveTo(x: number, y: number): this;
		lineTo(x: number, y: number): this;
		quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this;
		bezierCurveTo(
			cp1x: number,
			cp1y: number,
			cp2x: number,
			cp2y: number,
			x: number,
			y: number,
		): this;
	}
	export class Mesh extends Object3D {
		constructor(geometry?: BufferGeometry, material?: Material | Material[]);
		isMesh: boolean;
		geometry: BufferGeometry;
		material: Material | Material[];
		castShadow: boolean;
		receiveShadow: boolean;
	}
	export class WebGLRenderer {
		constructor(parameters?: Record<string, unknown>);
		domElement: HTMLCanvasElement;
		outputColorSpace: string;
		toneMapping: number;
		toneMappingExposure: number;
		setPixelRatio(value: number): void;
		setSize(width: number, height: number, updateStyle?: boolean): void;
		render(scene: Scene, camera: Camera): void;
		dispose(): void;
	}
	export class Clock {
		getElapsedTime(): number;
	}
	export const SRGBColorSpace: string;
	export const ACESFilmicToneMapping: number;
	export const EquirectangularReflectionMapping: number;
	export const DoubleSide: number;
}
