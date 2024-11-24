import { ResponseFormat } from '../enums/ResponseFormat'

import { NextFetchRequestConfig } from './NextFetchRequestConfig'
import { Params } from './Params'

/**
 * Represents the options for making a fetch request.
 */
export type Options = {
	baseURL?: string
	headers?: Record<string, unknown>
	params?: Params
	timeout?: number
	mode?: RequestMode
	cache?: RequestCache
	credentials?: RequestCredentials
	redirect?: RequestRedirect
	referrer?: string
	referrerPolicy?: ReferrerPolicy
	signal?: AbortSignal | null
	responseFormat?: ResponseFormat
	proxy?: string
	next?: NextFetchRequestConfig | undefined
	showLogs?: boolean
	additionalOptions?: Record<string, unknown>
	onRequest?: () => void
	onSuccess?: (response: unknown) => void
	onError?: (error: unknown) => void
	onInternalError?: (error: unknown) => void
}
