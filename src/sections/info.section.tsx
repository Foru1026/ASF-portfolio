import { HeroLogo3D } from '../components/hero-logo-3d';
import { Reveal } from '../components/reveal';
import { highlights, personal } from '../data/portfolio';

export const InfoSection = () => {
	return (
		<section
			className='hero-section'
			id='home'
		>
			<div className='hero-orbs' aria-hidden='true'>
				<span className='hero-orb hero-orb-1' />
				<span className='hero-orb hero-orb-2' />
				<span className='hero-orb hero-orb-3' />
			</div>

			<div className='hero-content'>
				<Reveal delay={40}>
					<div className='hero-logo-slot'>
						<HeroLogo3D />
					</div>
				</Reveal>

				<Reveal delay={120}>
					<div className='hero-brand-meta'>
						<p className='hero-badge'>{personal.heroBadge}</p>
						<p className='hero-services'>
							{personal.heroServices.map((service, index) => (
								<span key={service}>
									<span
										className={`hero-service hero-service--${index % 2 === 0 ? 'cyan' : 'purple'}`}
									>
										{service}
									</span>
									{index < personal.heroServices.length - 1 ? (
										<span className='hero-service-sep'>, </span>
									) : null}
								</span>
							))}
						</p>
					</div>
				</Reveal>

				<Reveal delay={180}>
					<p className='hero-lead'>{personal.heroLead}</p>
				</Reveal>

				<Reveal delay={240}>
					<p className='hero-tagline'>{personal.tagline}</p>
				</Reveal>

				<Reveal delay={300}>
					<div className='hero-actions'>
						<a
							href='#about-me'
							className='comet-btn comet-btn-work comet-btn-lg'
						>
							About Me
						</a>
						<a
							href='#projects'
							className='comet-btn comet-btn-contact comet-btn-lg'
						>
							View My Work
						</a>
					</div>
				</Reveal>

				<Reveal delay={400}>
					<div className='hero-stats-shell'>
						<div className='hero-stats'>
							{highlights.map((item) => (
								<div
									className='hero-stat'
									key={item.label}
								>
									<span className='hero-stat-value'>{item.value}</span>
									<span className='hero-stat-label'>{item.label}</span>
								</div>
							))}
						</div>
					</div>
				</Reveal>
			</div>

			<div className='blur' />
		</section>
	);
};
