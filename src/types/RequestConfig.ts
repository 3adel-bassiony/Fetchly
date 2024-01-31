import { NextFetchRequestConfig } from './NextFetchRequestConfig'

export type RequestConfig = {
	method: string
	headers?: Record<string, unknown>
	mode?: RequestMode
	cache?: RequestCache
	credentials?: RequestCredentials
	redirect?: RequestRedirect
	referrer?: string
	referrerPolicy?: ReferrerPolicy
	signal?: AbortSignal | null
	body?: unknown
	next?: NextFetchRequestConfig
}
