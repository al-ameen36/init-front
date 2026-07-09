import { useEffect, useRef, useState } from "react";

export function useCountUp(
	target: number,
	active: boolean,
	duration = 1200,
): number {
	const [value, setValue] = useState(0);
	const ref = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (!active) return;
		const steps = 40;
		const inc = target / steps;
		let cur = 0;
		ref.current = setInterval(() => {
			cur = Math.min(cur + inc, target);
			setValue(Math.round(cur));
			if (cur >= target && ref.current) clearInterval(ref.current);
		}, duration / steps);
		return () => {
			if (ref.current) clearInterval(ref.current);
		};
	}, [active, target, duration]);

	return value;
}
