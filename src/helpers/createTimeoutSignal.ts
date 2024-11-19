export function createTimeoutSignal(timeoutMs: number): AbortSignal {
	if (typeof AbortSignal.timeout === 'function') {
		// Use native timeout if available (modern browsers)
		return AbortSignal.timeout(timeoutMs)
	} else {
		// Fallback for React Native and older browsers
		const controller = new AbortController()
		setTimeout(() => controller.abort(), timeoutMs)
		return controller.signal
	}
}
