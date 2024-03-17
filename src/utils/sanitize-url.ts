export function sanitizeUrl(str: string | null): string | null {
	if (str == null) return str;
	try {
		const u = new URL(str);
		if (u.protocol === 'https:') return str;
		if (u.protocol === 'http:') return str;
		if (u.protocol === 'data:') return str;
	} catch {
		return null;
	}
	return null;
}
