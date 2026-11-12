import { Navigate, Route, Routes } from 'react-router-dom';
import { HexBg } from './components/hex-bg';
import { MouseTrail } from './components/mouse-trail';
import { Navbar } from './components/navbar';
import { ScrollBar } from './components/scroll-bar';
import { SiteFooter } from './components/site-footer';
import { FallingStarsLayer, StarfieldBg } from './components/starfield-bg';
import { ToastProvider } from './components/toast-provider';
import { HomePage } from './pages/home-page';
import './styles/about-me.css';
import './styles/brand-logo.css';
import './styles/comet-btn.css';
import './styles/contact.css';
import './styles/experience.css';
import './styles/expertise.css';
import './styles/glow-box.css';
import './styles/hex-bg.css';
import './styles/hero-name-3d.css';
import './styles/info-section.css';
import './styles/layered-title.css';
import './styles/mouse-trail.css';
import './styles/navbar.css';
import './styles/page-shell.css';
import './styles/projects.css';
import './styles/reveal.css';
import './styles/scroll-bar.css';
import './styles/site-footer.css';
import './styles/starfield-bg.css';
import './styles/tech-stack.css';
import './styles/visitor-note.css';
import './styles/visitor-contact.css';

const SiteShell = () => (
	<>
		<StarfieldBg />
		<HexBg />
		<ScrollBar />
		<MouseTrail />
		<Navbar />
		<HomePage />
		<SiteFooter />
		<FallingStarsLayer />
	</>
);

function App() {
	return (
		<ToastProvider>
			<Routes>
				<Route
					path='/'
					element={<SiteShell />}
				/>
				<Route
					path='*'
					element={
						<Navigate
							to='/'
							replace
						/>
					}
				/>
			</Routes>
		</ToastProvider>
	);
}

export default App;
