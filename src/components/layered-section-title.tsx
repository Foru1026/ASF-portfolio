import { useId, type CSSProperties } from 'react';

type LayeredSectionTitleProps = {
	primary: string;
	secondary: string;
	summary?: string;
	align?: 'left' | 'right' | 'center';
	longSecondary?: boolean;
};

const getSecondarySize = (secondary: string, longSecondary?: boolean) => {
	if (longSecondary || secondary.includes(' ') || secondary.length > 9) {
		return 'layered-title-long';
	}
	if (secondary.length <= 4) {
		return 'layered-title-short';
	}
	return 'layered-title-medium';
};

const splitChars = (text: string) =>
	Array.from(text).map((char, index) => (
		<span
			key={`${char}-${index}`}
			className='layered-title-char'
			style={{ '--char-i': index } as CSSProperties}
		>
			{char === ' ' ? '\u00A0' : char}
		</span>
	));

export const LayeredSectionTitle = ({
	primary,
	secondary,
	summary,
	align = 'left',
	longSecondary = false,
}: LayeredSectionTitleProps) => {
	const sizeClass = getSecondarySize(secondary, longSecondary);
	const uid = useId();

	return (
		<div
			className={`layered-title layered-title-${align} layered-title-animate ${sizeClass}`}
			style={{ '--title-uid': `"${uid}"` } as CSSProperties}
		>
			<div className='layered-title-heading'>
				<p className='layered-title-primary'>{splitChars(primary)}</p>

				<div className='layered-title-secondary-wrap'>
					<span className='layered-title-secondary-base'>
						{splitChars(secondary)}
					</span>
				</div>
			</div>

			{summary ? (
				<p className='layered-title-summary'>{summary}</p>
			) : null}
		</div>
	);
};
