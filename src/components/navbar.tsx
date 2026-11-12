import { useEffect, useState } from 'react';
import { navLinks } from '../data/portfolio';
import { BrandLogo } from './brand-logo';

export const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeHref, setActiveHref] = useState('#home');

	useEffect(() => {
		let lastScrolled = window.scrollY > 48;
		setScrolled(lastScrolled);

		const onScroll = () => {
			const nextScrolled = window.scrollY > 48;
			if (nextScrolled === lastScrolled) return;
			lastScrolled = nextScrolled;
			setScrolled(nextScrolled);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [menuOpen]);

	useEffect(() => {
		const sectionIds = ['home', ...navLinks.map((link) => link.href.slice(1))];
		const sections = sectionIds
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => Boolean(el));

		if (!sections.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible?.target.id) {
					setActiveHref(`#${visible.target.id}`);
				}
			},
			{ rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.35, 0.55] },
		);

		for (const section of sections) observer.observe(section);
		return () => observer.disconnect();
	}, []);

	const closeMenu = () => setMenuOpen(false);

	return (
		<header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
			<nav className='navbar-inner container'>
				<a
					href='#home'
					className='navbar-brand'
					onClick={closeMenu}
					aria-label='Ben Clark home'
				>
					<BrandLogo />
				</a>

				<ul className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
					{navLinks.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								className={
									activeHref === link.href ? 'navbar-link-active' : undefined
								}
								onClick={closeMenu}
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>

				<a
					href='#contact'
					className='comet-btn comet-btn-talk navbar-cta'
					onClick={closeMenu}
				>
					Let&apos;s Talk
				</a>

				<button
					type='button'
					className={`navbar-toggle ${menuOpen ? 'navbar-toggle-open' : ''}`}
					aria-label='Toggle menu'
					onClick={() => setMenuOpen((open) => !open)}
				>
					<span />
					<span />
					<span />
				</button>
			</nav>
		</header>
	);
};
