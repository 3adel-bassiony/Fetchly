import { SearchParams } from './SearchParams'

/**
 * Represents the options for making a fetch request.
 */
export type Options = {
	baseURL?: string
	headers?: HeadersInit
	searchParams?: SearchParams
	timeout?: number
	mode?: RequestMode
	cache?: RequestCache
	credentials?: RequestCredentials
	redirect?: RequestRedirect
	referrer?: string
	referrerPolicy?: ReferrerPolicy
	signal?: AbortSignal | null
	enableDebug?: boolean
	onRequest?: () => void
	onSuccess?: () => void
	onError?: () => void
	onInternalError?: () => void
}
