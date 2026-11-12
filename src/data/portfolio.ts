import type { IconType } from 'react-icons';
import {
	FaAws,
	FaBrain,
	FaCogs,
	FaLayerGroup,
	FaLinkedin,
	FaNodeJs,
	FaPython,
	FaReact,
	FaTelegram,
	FaWhatsapp,
} from 'react-icons/fa';
import { IoMailOutline } from 'react-icons/io5';
import {
	SiDiscord,
	SiDocker,
	SiExpress,
	SiFastapi,
	SiPostgresql,
	SiRedis,
	SiTypescript,
} from 'react-icons/si';
import { TbBrandOpenai } from 'react-icons/tb';

export type SocialLink = {
	label: string;
	href: string;
	icon: IconType;
	iconColor: string;
	glowColor: string;
	action?: 'discord';
};

export type NavLink = {
	label: string;
	href: string;
};

export type Highlight = {
	value: string;
	label: string;
};

export type ExpertiseItem = {
	title: string;
	description: string;
	icon: IconType;
	iconColor: string;
	glowColor: string;
	tags: string[];
};

export type ProjectItem = {
	title: string;
	description: string;
	stack: string[];
	image?: string;
	url?: string;
	featured?: boolean;
};

export type TimelineItem = {
	role: string;
	org: string;
	period: string;
	bullets: string[];
};

export type TimelineSection = {
	heading: string;
	items: TimelineItem[];
};

export type TechItem = {
	label: string;
	icon: IconType;
	iconColor: string;
	glowColor: string;
};

export type TechGroup = {
	heading: string;
	items: TechItem[];
};

export const personal = {
	name: 'Ben',
	heroName: 'BEN CLARK',
	heroNameLines: ['BEN CLARK'],
	heroBadge: 'Senior AI & Full Stack Engineer',
	heroServices: ['AI Agents', 'Full Stack', 'Workflow Automation'],
	fullName: 'Ben Clark',
	originalName: 'Ben Clark',
	title: 'Senior AI & Full Stack Engineer',
	tagline:
		'AI & Software Engineer with 9 years of experience in AI training, LLM integration, AI agent development, workflow orchestration, and production automation systems.',
	location: 'Wrocław, Poland',
	email: 'benclarkk1026@gmail.com',
	whatsappNumber: '+1 (730) 210-3965',
	telegramUsername: 'foru10261',
	discordUsername: 'foru10261',
	discordUserId: '',
	linkedinUrl: 'https://www.linkedin.com/in/benclark1026',
	greeting: "Hi, I'm",
	heroLead: 'Senior AI & Full Stack Engineer | Agents | React & Node',
	model: 'Available for remote AI and full-stack engineering work',
};

export const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
	personal.email,
)}&su=${encodeURIComponent('Ben Clark portfolio inquiry')}`;

export const whatsappUrl = 'https://wa.me/17302103965';

export const telegramUrl = `https://t.me/${personal.telegramUsername}`;

export const navLinks: NavLink[] = [
	{ label: 'About', href: '#about-me' },
	{ label: 'Expertise', href: '#expertise' },
	{ label: 'Path', href: '#experience' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Tech', href: '#tech-stack' },
	{ label: 'Voices', href: '#visitor-voices' },
	{ label: 'Contact', href: '#contact' },
];

export const highlights: Highlight[] = [
	{ value: '9+', label: 'Years Experience' },
	{ value: 'AI Agents', label: 'Focus' },
	{ value: 'Full Stack', label: 'React & Node' },
	{ value: 'Production', label: 'Systems' },
];

export const traits: string[] = [
	'Clear requirements first',
	'Ship in small steps',
	'Own production issues',
	'Readable code over cleverness',
	'Human review where it matters',
	'Measure before claiming wins',
];

export const expertise: ExpertiseItem[] = [
	{
		title: 'AI Agents & LLM Applications',
		description:
			'Design AI-agent workflows that combine LLM reasoning with business context, structured data, external APIs, and tool-based execution for multi-step production processes.',
		icon: FaBrain,
		iconColor: 'rgb(168, 130, 255)',
		glowColor: 'rgba(168, 130, 255, 0.55)',
		tags: ['AI Agents', 'LLM Apps', 'Tool Calling', 'MCP', 'RAG'],
	},
	{
		title: 'Full-Stack Product Engineering',
		description:
			'Ship production features with React, TypeScript, Node.js, REST APIs, and PostgreSQL across UX, service logic, and operations, with strong focus on performance and reliability.',
		icon: FaReact,
		iconColor: 'rgb(97, 219, 251)',
		glowColor: 'rgba(97, 219, 251, 0.55)',
		tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'APIs'],
	},
	{
		title: 'Workflow Automation',
		description:
			'Build reusable automations for data sync, business processes, notifications, and SaaS integrations, with validation, retries, logging, and controlled execution.',
		icon: FaCogs,
		iconColor: 'rgb(31, 195, 255)',
		glowColor: 'rgba(31, 195, 255, 0.55)',
		tags: ['Orchestration', 'n8n', 'APIs', 'Retries', 'Validation'],
	},
	{
		title: 'Backend & DevOps',
		description:
			'Python/FastAPI and Node services, Docker, CI/CD, automated testing, logging, and production debugging that keep AI and product systems available and maintainable.',
		icon: FaPython,
		iconColor: 'rgb(55, 118, 171)',
		glowColor: 'rgba(55, 118, 171, 0.6)',
		tags: ['Python', 'FastAPI', 'Docker', 'CI/CD', 'Testing'],
	},
];

const projectPreview = (siteUrl: string) =>
	`https://image.thum.io/get/width/1200/crop/675/noanimate/${siteUrl.replace(/\/$/, '')}`;

export const projects: ProjectItem[] = [
	{
		title: 'Shiba',
		description:
			'AI employees for engineering, marketing, research, and ops — brief in Slack, review the plan, and approve every action before it runs.',
		stack: ['AI Agents', 'HITL', 'Self-hosted', 'Workflows'],
		image: projectPreview('https://tryshiba.dev'),
		url: 'https://tryshiba.dev',
		featured: true,
	},
	{
		title: 'Orbi',
		description:
			'Lights-out software factory: file a GitHub Issue and get a reviewed release without supervising every step.',
		stack: ['AI Agents', 'GitHub', 'Automation', 'CI'],
		image: projectPreview('https://orbi.build'),
		url: 'https://orbi.build',
		featured: true,
	},
	{
		title: 'FineData',
		description:
			'Web scraping API for AI agents — send a URL and schema, get clean structured JSON back.',
		stack: ['API', 'Scraping', 'MCP', 'Data'],
		image: projectPreview('https://finedata.ai'),
		url: 'https://finedata.ai',
		featured: true,
	},
	{
		title: 'Eloo',
		description:
			'AI agents for busy people — a focused product surface for everyday agent workflows.',
		stack: ['AI Agents', 'Product', 'UX'],
		image: projectPreview('https://eloo.ai'),
		url: 'https://eloo.ai',
		featured: true,
	},
	{
		title: 'Virtik',
		description:
			'Operations platform that connects detection, response, and field teams around shared site models.',
		stack: ['Ops', 'Digital Twin', 'Realtime'],
		image: projectPreview('https://www.virtik.ai'),
		url: 'https://www.virtik.ai',
	},
	{
		title: 'Muvi',
		description:
			'Multi-model AI video and image studio — generate from text or photo across 20+ models in one place.',
		stack: ['Video', 'AI', 'Creative'],
		image: projectPreview('https://muvi.video'),
		url: 'https://muvi.video',
	},
	{
		title: 'Widgion',
		description:
			'AI chat, help center, and customer-support widgets you can embed into product sites.',
		stack: ['Widgets', 'Support', 'Chat'],
		image: projectPreview('https://widgion.com'),
		url: 'https://widgion.com',
	},
	{
		title: 'ClosedCast',
		description:
			'Private video streaming and archive — organize recordings and watch on web or Roku.',
		stack: ['Video', 'Privacy', 'Streaming'],
		image: projectPreview('https://closedcast.com'),
		url: 'https://closedcast.com',
	},
	{
		title: 'WorkflowHQ',
		description:
			'AI employees for voice, chat, and pipeline work — answer, qualify, book, and follow up across channels.',
		stack: ['AI Agents', 'Voice', 'CRM', 'Automation'],
		image: projectPreview('https://www.workflowhq.co'),
		url: 'https://www.workflowhq.co',
		featured: true,
	},
	{
		title: 'Mazaal AI',
		description:
			'Agent platform for sales, support, and ops — build once, deploy across Slack, email, web, and 50+ models.',
		stack: ['AI Agents', 'Workflows', 'MCP', 'Integrations'],
		image: projectPreview('https://mazaal.ai'),
		url: 'https://mazaal.ai',
	},
	{
		title: 'APInstant',
		description:
			'AI browser agent that turns natural-language goals into reusable web automation APIs.',
		stack: ['Browser Agents', 'API', 'Automation'],
		image: projectPreview('https://apinstant.app'),
		url: 'https://apinstant.app',
	},
	{
		title: 'Dugong',
		description:
			'Plain-English workflow automation — describe the steps and an AI agent calls your apps directly.',
		stack: ['No-Code', 'AI Agents', 'Integrations'],
		image: projectPreview('https://dugong.live'),
		url: 'https://dugong.live',
	},
];

export const expertiseSection = {
	section: {
		title: 'What I',
		subtitle: 'Build',
		summary:
			'AI agents, full-stack products, and workflow automation that connect models to real business systems.',
	},
};

export const projectsSection = {
	section: {
		title: 'Selected',
		subtitle: 'Work',
		summary:
			'Live product and platform work across AI agents, data, media, ops, and support'
	},
};

export const contact = {
	section: {
		title: 'Get In',
		subtitle: 'Touch',
		summary:
			'Open to AI engineering, full-stack product work, and longer-term collaborations.',
	},
	headline: 'Tell me what you are building.',
	subtext:
		'Send a short note about your project. I usually reply within one business day.',
};

export type VisitorNoteSentiment = 'support' | 'disagree' | 'not-care';

export const visitorNote = {
	section: {
		title: 'Visitor',
		subtitle: 'Voices',
		summary:
			'Live interested, not convinced, and neutral totals plus optional visitor notes',
	},
	headline: 'Share your take with Ben.',
	subtext:
		'Pick a status or write a note (one is enough). Name is only required when you leave a note.',
	supportLabel: 'Interested',
	disagreeLabel: 'Not convinced',
	notCareLabel: 'Neutral',
	liveCountsLabel: 'Live visitor counts',
	editResponseLabel: 'Edit my response',
	namePlaceholder: 'Your name (required for notes)',
	messagePlaceholder: 'Optional note for Ben',
	submitLabel: 'Apply',
	saveLabel: 'Save changes',
	submittingLabel: 'Applying',
	savingLabel: 'Saving',
	formNote:
		'Status and note are separate: you can apply a status twice more after the first click (2 resets), and post a note once plus edit it once. Limits do not share.',
	thanksMessage: 'Thanks! Your response is counted in the live totals.',
	repliesTitle: 'Visitor notes',
	repliesSummary: 'Sorted by newest first, then name.',
	loadingReplies: 'Loading live counts',
	loadError: 'Could not load live counts. Please refresh the page.',
	emptyReplies: 'No notes yet. Be the first to share your take.',
	notifyApplied: 'Your response was applied.',
	notifyUpdated: 'Your response was updated.',
	notifyNewReply: 'New note from {name}.',
	leaveContactLabel: 'Leave your contact',
	leaveContactHint:
		'Want Ben to reach you later? Share any contact method you prefer.',
	contactModalTitle: 'Leave your contact',
	contactModalSubtext:
		'Share WhatsApp, Telegram, email, Discord, phone, or any other way to reach you.',
	contactNamePlaceholder: 'Your name',
	contactChannelLabel: 'Contact type',
	contactValuePlaceholder: 'Your contact (number, @handle, email...)',
	contactNotePlaceholder: 'Optional short note',
	contactSubmitLabel: 'Send contact',
	contactSubmittingLabel: 'Sending...',
	contactCancelLabel: 'Cancel',
	contactThanks: 'Thanks! Your contact info was saved.',
};

export const socialLinks: SocialLink[] = [
	{
		label: 'WhatsApp',
		href: whatsappUrl,
		icon: FaWhatsapp,
		iconColor: 'rgb(37, 211, 102)',
		glowColor: 'rgba(37, 211, 102, 0.55)',
	},
	{
		label: 'Telegram',
		href: telegramUrl,
		icon: FaTelegram,
		iconColor: 'rgb(38, 165, 228)',
		glowColor: 'rgba(38, 165, 228, 0.55)',
	},
	{
		label: 'Discord',
		href: 'https://discord.com/channels/@me',
		icon: SiDiscord,
		iconColor: 'rgb(88, 101, 242)',
		glowColor: 'rgba(88, 101, 242, 0.65)',
		action: 'discord',
	},
	{
		label: 'LinkedIn',
		href: personal.linkedinUrl,
		icon: FaLinkedin,
		iconColor: 'rgb(10, 102, 194)',
		glowColor: 'rgba(10, 102, 194, 0.55)',
	},
	{
		label: 'Email',
		href: gmailComposeUrl,
		icon: IoMailOutline,
		iconColor: 'rgb(18, 122, 209)',
		glowColor: 'rgba(18, 122, 209, 0.7)',
	},
];

export const about = {
	section: {
		title: 'About',
		subtitle: 'Me',
		summary:
			'Senior engineer in Wrocław — I ship AI features and full-stack products that hold up in production',
	},
	intro: [
		"I'm Ben Clark. I live in Wrocław, Poland, and I've spent about nine years building software — first document and backend systems, then automation platforms, and more recently AI-assisted products people actually use day to day.",
		"Most of my work sits between product and engineering. At Devjam I shipped React/TypeScript/Node features end to end, including LLM-backed flows with permissions and fallbacks. Before that at Lindy I designed agent workflows with approval steps so uncertain actions didn't run unchecked. Earlier roles at n8n and Affinda taught me how messy real data and integrations get once you leave the demo.",
		"I care less about flashy prototypes and more about systems that stay up: validation, logging, tests, CI/CD, and clear handoffs when a human needs to decide. If you're looking for someone who can own a feature from UI through API to production ops, that's the lane I work in.",
	],
};

export const experience = {
	section: {
		title: 'Career',
		subtitle: 'Path',
		summary:
			'From document AI and automation platforms to senior AI and full-stack product engineering',
	},
	timeline: [
		{
			heading: 'Experience',
			items: [
				{
					role: 'Senior AI & Full Stack Engineer',
					org: 'Devjam · Hamburg, Germany',
					period: '2025 to 2026',
					bullets: [
						'Engineered full-stack product features using React, TypeScript, Node.js, REST APIs, and PostgreSQL across UX, service logic, and production operations.',
						'Designed AI-ready application flows for LLM-backed assistants, document retrieval, and structured output processing, with permissions and fallback behavior.',
						'Built reusable frontend components across 15+ production features and optimized rendering, APIs, and database access (~35% performance improvement).',
						'Improved resilience through incident investigation, API validation, logging, containerization, automated testing, and CI/CD; supported 99%+ availability.',
						'Collaborated with product and engineering stakeholders on architecture, trade-offs, reviews, and releases.',
					],
				},
				{
					role: 'AI Automation / AI Agent Engineer',
					org: 'Lindy · San Francisco, CA',
					period: '2022 to 2025',
					bullets: [
						'Designed AI-agent workflows for multi-step business processes involving research, communication, scheduling, and operational execution.',
						'Built agent workflows combining LLM reasoning with business context, structured data, external APIs, and application integrations.',
						'Implemented tool-based execution, workflow state management, validation, and controlled actions for production automation.',
						'Developed human-approval and exception-handling paths for tasks needing business judgment or additional verification.',
						'Partnered with product and engineering to translate operational requirements into reliable AI automation systems.',
					],
				},
				{
					role: 'Software Engineer → Automation Engineer',
					org: 'n8n · Berlin, Germany',
					period: '2021 to 2022',
					bullets: [
						'Developed backend services and workflow automations connecting APIs, databases, SaaS applications, and internal business systems.',
						'Built reusable automation workflows for data synchronization, business processes, notifications, and application integrations.',
						'Integrated AI capabilities into workflow-driven applications by combining structured business rules with model-generated decisions.',
						'Improved workflow reliability through validation, error handling, logging, retries, and controlled execution.',
					],
				},
				{
					role: 'Software Engineer',
					org: 'Affinda · Victoria, Australia',
					period: '2018 to 2021',
					bullets: [
						'Developed software and AI/ML workflows for document-intensive business processes and automated information extraction.',
						'Built Python services for processing business documents, extracting structured information, and connecting results to downstream systems.',
						'Implemented data-processing and validation workflows to improve consistency of automated document intelligence.',
						'Worked with backend services, APIs, databases, and ML components to support production document automation.',
						'Collaborated with engineering and product to translate business requirements into practical software and AI solutions.',
					],
				},
			],
		},
		{
			heading: 'Education',
			items: [
				{
					role: 'Bachelor of Science in Computer Science',
					org: 'Wrocław University of Science and Technology',
					period: '2014 to 2018',
					bullets: [
						'Completed BSc Computer Science studies in Poland.',
						'Foundation in software engineering, systems, and applied computing.',
					],
				},
			],
		},
	] satisfies TimelineSection[],
};

export const techStack = {
	section: {
		title: 'Tech',
		subtitle: 'Stack',
		summary:
			'Frontend, backend, AI, and DevOps tools I use to ship production systems',
	},
	groups: [
		{
			heading: 'AI & Automation',
			items: [
				{
					label: 'AI Agents',
					icon: FaBrain,
					iconColor: 'rgb(168, 130, 255)',
					glowColor: 'rgba(168, 130, 255, 0.55)',
				},
				{
					label: 'LLM Apps',
					icon: TbBrandOpenai,
					iconColor: 'rgb(116, 170, 156)',
					glowColor: 'rgba(116, 170, 156, 0.55)',
				},
				{
					label: 'Workflow Automation',
					icon: FaCogs,
					iconColor: 'rgb(31, 195, 255)',
					glowColor: 'rgba(31, 195, 255, 0.55)',
				},
				{
					label: 'RAG / Tool Calling',
					icon: FaLayerGroup,
					iconColor: 'rgb(251, 191, 36)',
					glowColor: 'rgba(251, 191, 36, 0.55)',
				},
			],
		},
		{
			heading: 'Frontend',
			items: [
				{
					label: 'React',
					icon: FaReact,
					iconColor: 'rgb(97, 219, 251)',
					glowColor: 'rgba(97, 219, 251, 0.55)',
				},
				{
					label: 'TypeScript',
					icon: SiTypescript,
					iconColor: 'rgb(49, 120, 198)',
					glowColor: 'rgba(49, 120, 198, 0.55)',
				},
				{
					label: 'Node.js',
					icon: FaNodeJs,
					iconColor: 'rgb(104, 160, 99)',
					glowColor: 'rgba(104, 160, 99, 0.55)',
				},
				{
					label: 'Express.js',
					icon: SiExpress,
					iconColor: 'rgb(200, 200, 200)',
					glowColor: 'rgba(200, 200, 200, 0.45)',
				},
			],
		},
		{
			heading: 'Backend & Cloud',
			items: [
				{
					label: 'Python',
					icon: FaPython,
					iconColor: 'rgb(55, 118, 171)',
					glowColor: 'rgba(55, 118, 171, 0.6)',
				},
				{
					label: 'FastAPI',
					icon: SiFastapi,
					iconColor: 'rgb(0, 150, 136)',
					glowColor: 'rgba(0, 150, 136, 0.55)',
				},
				{
					label: 'PostgreSQL',
					icon: SiPostgresql,
					iconColor: 'rgb(51, 103, 145)',
					glowColor: 'rgba(51, 103, 145, 0.6)',
				},
				{
					label: 'Redis',
					icon: SiRedis,
					iconColor: 'rgb(220, 56, 45)',
					glowColor: 'rgba(220, 56, 45, 0.6)',
				},
				{
					label: 'Docker',
					icon: SiDocker,
					iconColor: 'rgb(36, 150, 237)',
					glowColor: 'rgba(36, 150, 237, 0.6)',
				},
				{
					label: 'AWS',
					icon: FaAws,
					iconColor: 'rgb(255, 153, 0)',
					glowColor: 'rgba(255, 153, 0, 0.6)',
				},
			],
		},
	] satisfies TechGroup[],
};
