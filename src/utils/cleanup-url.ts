/**
 * To absolute and sanitize URL
 * @param url URL (absolute or relative)
 * @param base Base URL
 * @returns absolute URL
 */
export function cleanupUrl(url: string | null, base: string): string | null {
	if (url == null) return null;
	try {
		const u = new URL(url, base);
		if (u.protocol === 'https:') return u.href;
		if (u.protocol === 'http:') return u.href;
		// dataはこないということに
	} catch {
		return null;
	}
	return null;
}
