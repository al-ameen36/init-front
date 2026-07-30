import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { DeveloperProfile } from "@/features/onboarding/components/data";
import { fetchProfile } from "@/lib/api";

type ProfileContextValue = {
	profile: DeveloperProfile | null;
	loading: boolean;
	setProfile: (profile: DeveloperProfile) => void;
	clearProfile: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
	const [profile, setProfileState] = useState<DeveloperProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const data = await fetchProfile();
				if (!cancelled && data) setProfileState(data);
			} catch {
				// Profile may not exist yet — safe to ignore
			}
			if (!cancelled) setLoading(false);
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	const setProfile = (next: DeveloperProfile) => {
		setProfileState(next);
	};

	const clearProfile = () => {
		setProfileState(null);
	};

	return (
		<ProfileContext.Provider
			value={{ profile, loading, setProfile, clearProfile }}
		>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	const ctx = useContext(ProfileContext);
	if (!ctx) {
		throw new Error("useProfile must be used within a ProfileProvider");
	}
	return ctx;
}
