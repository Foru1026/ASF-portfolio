import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type PointerEvent as ReactPointerEvent,
} from 'react';
import { ProjectCardImage } from './project-card-image';
import { projects, type ProjectItem } from '../data/portfolio';

const SCROLL_SPEED = 0.65;
const MIN_THUMB_RATIO = 0.18;

type ProjectCardProps = {
	project: ProjectItem;
	index: number;
};

type ScrollMetrics = {
	maxScroll: number;
	trackWidth: number;
	thumbWidth: number;
	travel: number;
};

const ProjectCard = ({ project, index }: ProjectCardProps) => {
	const hasLiveUrl = Boolean(project.url);
	const previewSrc = project.image ?? '/projects/project-ecommerce.svg';

	const media = (
		<div className='project-image-wrap'>
			<ProjectCardImage
				src={previewSrc}
				alt={`${project.title} project preview`}
			/>
			<div className='project-image-overlay' />
			<div className='project-screen-name'>
				<span className='project-index'>
					{String(index + 1).padStart(2, '0')}
				</span>
				<h3>{project.title}</h3>
			</div>
			{project.featured ? (
				<span className='project-badge'>Featured</span>
			) : null}
			<span className='project-live-badge'>
				{hasLiveUrl ? 'Live site' : 'Case study'}
			</span>
		</div>
	);

	return (
		<article
			className={`project-card glass-card ${project.featured ? 'project-card-featured' : ''}`}
			role='listitem'
		>
			{hasLiveUrl ? (
				<a
					className='project-card-link'
					href={project.url}
					target='_blank'
					rel='noopener noreferrer'
					aria-label={`Visit ${project.title}`}
					draggable={false}
				>
					{media}
				</a>
			) : (
				<div className='project-card-link'>{media}</div>
			)}

			<div className='project-card-body'>
				<p>{project.description}</p>
				<div className='project-stack'>
					{project.stack.map((tech) => (
						<span key={tech}>{tech}</span>
					))}
				</div>
				{hasLiveUrl ? (
					<a
						className='project-visit-link'
						href={project.url}
						target='_blank'
						rel='noopener noreferrer'
						draggable={false}
					>
						Visit site
					</a>
				) : null}
			</div>
		</article>
	);
};

export const ProjectsGallery = () => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const railRef = useRef<HTMLDivElement>(null);
	const thumbRef = useRef<HTMLDivElement>(null);
	const loopWidthRef = useRef(0);
	const pausedRef = useRef(false);
	const scrollbarDraggingRef = useRef(false);
	const pointerOffsetInThumbRef = useRef(0);
	const metricsRef = useRef<ScrollMetrics | null>(null);

	const [showAll, setShowAll] = useState(false);
	const [thumbHidden, setThumbHidden] = useState(false);

	const flowProjects = useMemo(
		() => [...projects, ...projects],
		[],
	);

	const getMetrics = useCallback((): ScrollMetrics | null => {
		const scroll = scrollRef.current;
		const rail = railRef.current;
		if (!scroll || !rail) return null;

		const maxScroll = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
		if (maxScroll <= 0) return null;

		const trackWidth = rail.getBoundingClientRect().width;
		const thumbWidth = Math.max(
			trackWidth * MIN_THUMB_RATIO,
			trackWidth * (scroll.clientWidth / scroll.scrollWidth),
		);
		const travel = Math.max(trackWidth - thumbWidth, 1);
		const metrics = { maxScroll, trackWidth, thumbWidth, travel };
		metricsRef.current = metrics;
		return metrics;
	}, []);

	const paintThumb = useCallback((leftPx: number, widthPx: number) => {
		const thumb = thumbRef.current;
		if (!thumb) return;
		thumb.style.width = `${widthPx}px`;
		thumb.style.transform = `translate3d(${leftPx}px, -50%, 0)`;
	}, []);

	const syncScrollbar = useCallback(() => {
		const scroll = scrollRef.current;
		const metrics = getMetrics();
		if (!scroll || !metrics) {
			paintThumb(0, 0);
			return;
		}

		const loopWidth = loopWidthRef.current || metrics.maxScroll;
		const progressBase = loopWidth > 0 ? scroll.scrollLeft % loopWidth : 0;
		const progress = loopWidth > 0 ? progressBase / loopWidth : 0;
		paintThumb(progress * metrics.travel, metrics.thumbWidth);
	}, [getMetrics, paintThumb]);

	const measureScroll = useCallback(() => {
		const track = trackRef.current;
		if (track) {
			loopWidthRef.current = track.scrollWidth / 2;
		}
		syncScrollbar();
	}, [syncScrollbar]);

	const setScrollFromThumbLeft = useCallback(
		(thumbLeftPx: number) => {
			const scroll = scrollRef.current;
			const metrics = getMetrics();
			const loopWidth = loopWidthRef.current;
			if (!scroll || !metrics || loopWidth <= 0) return;

			const clamped = Math.min(metrics.travel, Math.max(0, thumbLeftPx));
			const base = Math.floor(scroll.scrollLeft / loopWidth) * loopWidth;
			scroll.scrollLeft = base + (clamped / metrics.travel) * loopWidth;
			paintThumb(clamped, metrics.thumbWidth);
		},
		[getMetrics, paintThumb],
	);

	useEffect(() => {
		if (showAll) return;

		measureScroll();
		const track = trackRef.current;
		const observer =
			track && typeof ResizeObserver !== 'undefined'
				? new ResizeObserver(measureScroll)
				: null;
		if (track) observer?.observe(track);

		window.addEventListener('resize', measureScroll);
		const timers = [0, 250, 800, 1600].map((ms) =>
			window.setTimeout(measureScroll, ms),
		);

		return () => {
			observer?.disconnect();
			window.removeEventListener('resize', measureScroll);
			timers.forEach((id) => window.clearTimeout(id));
		};
	}, [measureScroll, showAll, flowProjects.length]);

	useEffect(() => {
		if (showAll) return;
		const scroll = scrollRef.current;
		if (!scroll) return;

		const onScroll = () => syncScrollbar();
		scroll.addEventListener('scroll', onScroll, { passive: true });
		return () => scroll.removeEventListener('scroll', onScroll);
	}, [syncScrollbar, showAll]);

	useEffect(() => {
		if (showAll) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		let frame = 0;
		const tick = () => {
			const scroll = scrollRef.current;
			const loopWidth = loopWidthRef.current;

			if (
				scroll &&
				!pausedRef.current &&
				!scrollbarDraggingRef.current &&
				loopWidth > 0
			) {
				scroll.scrollLeft += SCROLL_SPEED;
				if (scroll.scrollLeft >= loopWidth) {
					scroll.scrollLeft -= loopWidth;
				}
				syncScrollbar();
			}

			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [syncScrollbar, showAll]);

	const onRailPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.button !== 0 || showAll) return;
		event.preventDefault();

		const metrics = getMetrics();
		const rail = railRef.current;
		if (!metrics || !rail) return;

		setThumbHidden(false);
		pausedRef.current = true;
		scrollbarDraggingRef.current = true;
		rail.setPointerCapture(event.pointerId);

		const rect = rail.getBoundingClientRect();
		const pointerX = event.clientX - rect.left;
		const isThumb = (event.target as HTMLElement).closest(
			'.projects-scroll-thumb',
		);

		const loopWidth = loopWidthRef.current || 1;
		const currentThumbLeft =
			((scrollRef.current!.scrollLeft % loopWidth) / loopWidth) *
			metrics.travel;

		if (isThumb) {
			pointerOffsetInThumbRef.current = pointerX - currentThumbLeft;
		} else {
			pointerOffsetInThumbRef.current = metrics.thumbWidth / 2;
			setScrollFromThumbLeft(pointerX - pointerOffsetInThumbRef.current);
		}

		const onMove = (moveEvent: PointerEvent) => {
			moveEvent.preventDefault();
			const liveRect = rail.getBoundingClientRect();
			const thumbLeft =
				moveEvent.clientX -
				liveRect.left -
				pointerOffsetInThumbRef.current;
			setScrollFromThumbLeft(thumbLeft);
		};

		const onUp = (upEvent: PointerEvent) => {
			if (rail.hasPointerCapture(upEvent.pointerId)) {
				rail.releasePointerCapture(upEvent.pointerId);
			}
			rail.removeEventListener('pointermove', onMove);
			rail.removeEventListener('pointerup', onUp);
			rail.removeEventListener('pointercancel', onUp);
			scrollbarDraggingRef.current = false;
			pausedRef.current = false;
		};

		rail.addEventListener('pointermove', onMove);
		rail.addEventListener('pointerup', onUp);
		rail.addEventListener('pointercancel', onUp);
	};

	return (
		<div className='projects-gallery-wrap'>
			{showAll ? (
				<div
					className='projects-grid'
					role='list'
					aria-label='All selected work'
				>
					{projects.map((project, idx) => (
						<div
							key={project.title}
							className='projects-grid-item'
						>
							<ProjectCard
								project={project}
								index={idx}
							/>
						</div>
					))}
				</div>
			) : (
				<>
					<div className='projects-gallery-viewport'>
						<div
							ref={scrollRef}
							className='projects-gallery'
							role='list'
							aria-label='Selected work gallery'
						>
							<div
								ref={trackRef}
								className='projects-gallery-track'
							>
								{flowProjects.map((project, idx) => (
									<div
										key={`${project.title}-${idx}`}
										className='projects-gallery-item'
									>
										<ProjectCard
											project={project}
											index={idx % projects.length}
										/>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className='projects-scroll-rail'>
						<div
							ref={railRef}
							className='projects-scroll-track'
							role='scrollbar'
							aria-label='Gallery scroll position'
							aria-valuemin={0}
							aria-valuemax={100}
							onPointerDown={onRailPointerDown}
						>
							<div
								ref={thumbRef}
								className={`projects-scroll-thumb ${thumbHidden ? 'projects-scroll-thumb-hidden' : ''}`}
							/>
						</div>
					</div>
				</>
			)}

			<div className='projects-actions'>
				<button
					type='button'
					className='comet-btn comet-btn-contact projects-show-all'
					onClick={() => {
						setShowAll((open) => !open);
						pausedRef.current = false;
						setThumbHidden(false);
					}}
				>
					{showAll ? 'Show less' : 'Show all'}
				</button>
			</div>
		</div>
	);
};
