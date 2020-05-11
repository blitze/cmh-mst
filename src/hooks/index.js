import { useEffect } from 'react';

export const useOutsideClick = (ref, isDropped, callBack) => {
	useEffect(() => {
		const handleClick = e => {
			if (isDropped && ref && !ref.contains(e.target)) {
				callBack();
			}
		};
		document.addEventListener('click', handleClick);

		return () => document.removeEventListener('click', handleClick);
	}, [ref, isDropped, callBack]);
};
