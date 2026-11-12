import { PageShell } from '../components/page-shell';
import { AboutMe } from '../sections/about-me.section';
import { Contact } from '../sections/contact.section';
import { WorkExperience } from '../sections/experience.section';
import { Expertise } from '../sections/expertise.section';
import { InfoSection } from '../sections/info.section';
import { Projects } from '../sections/projects.section';
import { TechStack } from '../sections/tech-stack.section';
import { VisitorNote } from '../sections/visitor-note.section';

export const HomePage = () => (
	<PageShell
		title='Ben Clark | AI & Software Engineer'
		home
	>
		<InfoSection />
		<Expertise />
		<WorkExperience />
		<Projects />
		<TechStack />
		<VisitorNote />
		<AboutMe />
		<Contact />
	</PageShell>
);
