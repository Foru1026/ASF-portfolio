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
				{/* Drop your 3D logo here */}
				<div className='hero-logo-slot' aria-hidden='true' />

				<Reveal delay={120}>
					<p className='hero-tagline'>{personal.tagline}</p>
				</Reveal>

				<Reveal delay={200}>
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

				<Reveal delay={300}>
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
