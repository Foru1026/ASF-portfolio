import type { ReactNode } from 'react';
import { useDocumentTitle } from '../hooks/use-document-title';

type PageShellProps = {
	title: string;
	children: ReactNode;
	backdrop?: ReactNode;
	home?: boolean;
};

export const PageShell = ({
	title,
	children,
	backdrop,
	home = false,
}: PageShellProps) => {
	useDocumentTitle(title);

	return (
		<main
			className={`page-shell${home ? ' page-shell-home' : ' page-shell-inner'}`}
		>
			{backdrop ? (
				<div
					className='page-shell-backdrop'
					aria-hidden='true'
				>
					{backdrop}
				</div>
			) : null}
			<div className='page-shell-content'>{children}</div>
		</main>
	);
};
