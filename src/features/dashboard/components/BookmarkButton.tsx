import { Bookmark } from "lucide-react";

export function BookmarkButton({
	isActive,
	onClick,
	size = 14,
	className = "",
}: {
	isActive: boolean;
	onClick: () => void;
	size?: number;
	className?: string;
}) {
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			className={`hover:bg-white/5 p-1.5 rounded-lg transition-colors shrink-0 ${
				isActive
					? "text-primary"
					: "text-muted-foreground hover:text-foreground"
			} ${className}`}
			title={isActive ? "Remove from active" : "Mark as active"}
		>
			<Bookmark size={size} fill={isActive ? "currentColor" : "none"} />
		</button>
	);
}
