import { ErrorType } from './enums/ErrorType'
import { Method } from './enums/Method'
import { ResponseFormat } from './enums/ResponseFormat'
import { Status } from './enums/Status'
import { stringifyParams } from './helpers/stringifyParams'
import { FetchlyResult } from './types/FetchlyResult'
import { NextFetchRequestConfig } from './types/NextFetchRequestConfig'
import { Options } from './types/Options'
import { Params } from './types/Params'
import { RequestConfig } from './types/RequestConfig'

export class Fetchly {
	private baseURL?: string
	private headers?: Record<string, unknown>
	private params?: Params
	private timeout?: number
	private mode?: RequestMode
	private cache?: RequestCache
	private credentials?: RequestCredentials
	private redirect?: RequestRedirect
	private referrer?: string
	private referrerPolicy?: ReferrerPolicy
	private responseFormat?: ResponseFormat
	private proxy?: string
	private next?: NextFetchRequestConfig | undefined
	private additionalOptions?: Record<string, unknown>
	private showLogs: boolean
	private onRequest?: () => void
	private onSuccess?: () => void
	private onError?: () => void
	private onInternalError?: () => void

	/**
	 * Constructs a new instance of the Fetchly class.
	 * @param options The options to configure the Fetchly instance.
	 * @example
	 * const fetchInstance = new Fetchly({
	 *   baseURL: 'https://api.example.com',
	 *   headers: {
	 *     'Content-Type': 'application/json',
	 *     'Authorization': 'Bearer token'
	 *   }
	 * });
	 */
	constructor(options: Options = {}) {
		this.configure(options)
	}

	/**
	 * Configures the Fetchly instance with the provided options.
	 * @param options - The configuration options.
	 * @example
	 * const fetchInstance = new Fetchly();
	 * fetchInstance.configure({
	 *   baseURL: 'https://api.example.com',
	 *   headers: {
	 *     'Authorization': 'Bearer token123'
	 *   },
	 *   timeout: 5000,
	 *   mode: 'cors',
	 *   cache: 'no-cache',
	 *   credentials: 'include',
	 *   redirect: 'manual',
	 *   referrerPolicy: 'strict-origin-when-cross-origin'
	 * });
	 */
	public async configure(options: Options = {}) {
		const {
			baseURL,
			headers,
			params,
			timeout,
			mode,
			cache,
			credentials,
			redirect,
			referrer,
			referrerPolicy,
			responseFormat,
			proxy,
			next,
			additionalOptions,
			showLogs,
			onRequest,
			onSuccess,
			onError,
			onInternalError,
		} = options

		this.baseURL = baseURL
		this.headers = headers ?? { 'Content-Type': 'application/json' }
		this.params = params
		this.timeout = timeout ?? 30000
		this.mode = mode ?? 'same-origin'
		this.cache = cache ?? 'default'
		this.credentials = credentials ?? 'same-origin'
		this.redirect = redirect ?? 'follow'
		this.referrer = referrer ?? 'about:client'
		this.referrerPolicy = referrerPolicy ?? 'no-referrer'
		this.responseFormat = responseFormat
		this.proxy = proxy
		this.next = next
		this.additionalOptions = additionalOptions
		this.showLogs = showLogs ?? false
		this.onRequest = onRequest
		this.onSuccess = onSuccess
		this.onError = onError
		this.onInternalError = onInternalError
	}

	/**
	 * Generates the configuration object for the NextFetchRequest.
	 * @param options - The options object containing the configuration parameters.
	 * @returns The NextFetchRequestConfig object or null if no configuration is provided.
	 * @example
	 * const options = {
	 *   next: {
	 *     revalidate: 60,
	 *     tags: ['posts', 'comments']
	 *   }
	 * };
	 * const config = generateNextConfig(options);
	 * console.log(config);
	 * // Output: { revalidate: 60, tags: ['posts', 'comments'] }
	 */
	private generateNextConfig(options?: Options): NextFetchRequestConfig | null {
		const revalidate = options?.next?.revalidate ?? this.next?.revalidate
		const tags = options?.next?.tags ?? this.next?.tags

		const nextConfig: NextFetchRequestConfig = {}

		if (revalidate !== undefined) {
			nextConfig.revalidate = revalidate
		}

		if (tags !== undefined) {
			nextConfig.tags = tags
		}

		return Object.keys(nextConfig).length > 0 ? nextConfig : null
	}

	/**
	 * Performs a fetch request with the specified URL, method, options, and body.
	 * @template T The type of the response data.
	 * @template E The type of the error data.
	 * @param {string} url The URL to fetch.
	 * @param {Method} method The HTTP method to use for the request.
	 * @param {Options} [options] The options for the fetch request.
	 * @param {unknown} [body] The request body.
	 * @returns {Promise<FetchlyResult<T, E>>} A promise that resolves to the fetch response.
	 *
	 * @example
	 * const response = await _fetch<UserData, APIError>('/users', 'GET', { params: { page: 1 } });
	 * if (response.status === Status.Success) {
	 *   console.log('Data:', response.data);
	 * } else {
	 *   console.error('Error:', response.error);
	 * }
	 */
	private async _fetch<T = unknown, E = unknown>(
		url: string,
		method: Method,
		options?: Options,
		body?: unknown
	): Promise<FetchlyResult<T, E>> {
		const showLogs = options?.showLogs ?? this.showLogs
		const startTime = performance.now()
		const queryString =
			this.params || options?.params ? stringifyParams({ ...this.params, ...options?.params }) : ''
		const baseURL = options?.baseURL ?? this.baseURL ?? ''
		const fullURL = baseURL + url + queryString

		// Create fetch options
		const requestConfig: RequestConfig = {
			method,
			headers: { ...this.headers, ...options?.headers },
			mode: options?.mode ?? this.mode,
			cache: options?.cache ?? this.cache,
			credentials: options?.credentials ?? this.credentials,
			redirect: options?.redirect ?? this.redirect,
			referrer: options?.referrer ?? this.referrer,
			referrerPolicy: options?.referrerPolicy ?? this.referrerPolicy,
			signal: AbortSignal.timeout(options?.timeout ?? this.timeout ?? 3000),
			proxy: options?.proxy ?? this.proxy,
			...options?.additionalOptions,
			...this.additionalOptions,
		}

		// Append body to fetch options
		if (body) {
			requestConfig.body = body instanceof FormData ? body : JSON.stringify(body)
		}

		// Create next.js fetch config
		const nextConfig = this.generateNextConfig(options)

		// Append next.js fetch config to fetch options
		if (method === Method.GET && nextConfig) {
			requestConfig.next = nextConfig
		}

		try {
			this?.onRequest?.()
			options?.onRequest?.()

			const response = await fetch(fullURL, requestConfig as RequestInit)

			let responseFormat = options?.responseFormat ?? this.responseFormat
			let parsedResponse = null

			if (!responseFormat) {
				const contentType = response.headers.get('Content-Type')

				if (contentType?.includes('application/json')) {
					responseFormat = ResponseFormat.JSON
				} else if (contentType?.includes('text')) {
					responseFormat = ResponseFormat.Text
				} else if (contentType?.includes('blob')) {
					responseFormat = ResponseFormat.Blob
				} else if (contentType?.includes('form-data')) {
					responseFormat = ResponseFormat.FormData
				} else if (contentType?.includes('array-buffer')) {
					responseFormat = ResponseFormat.ArrayBuffer
				}
			}

			switch (responseFormat) {
				case ResponseFormat.JSON:
					parsedResponse = await response.json()
					break
				case ResponseFormat.Text:
					parsedResponse = await response.text()
					break
				case ResponseFormat.Blob:
					parsedResponse = await response.blob()
					break
				case ResponseFormat.FormData:
					parsedResponse = await response.formData()
					break
				case ResponseFormat.ArrayBuffer:
					parsedResponse = await response.arrayBuffer()
					break
				default:
					parsedResponse = await response.json()
					break
			}

			if (showLogs) {
				const endTime = performance.now()

				const duration = Math.floor(endTime - startTime).toFixed(0)

				console.debug(`[ ${method} ] ${fullURL} -> `, {
					status: response.status,
					duration: `${duration} ms`,
					body: body ?? null,
					options: options ?? null,
					requestConfig,
					requestHeaders: requestConfig.headers,
					responseHeaders: Object.fromEntries(response.headers.entries()),
					response: parsedResponse,
				})
			}

			if (!response.ok) {
				this?.onError?.()
				options?.onError?.()
			} else {
				this?.onSuccess?.()
				options?.onSuccess?.()
			}

			return {
				config: requestConfig,
				status: response.ok ? Status.Success : Status.Error,
				statusCode: response.status,
				statusText: response.statusText,
				data: response.ok ? (parsedResponse as T) : null,
				hasError: !response.ok,
				errorType: response.ok ? null : ErrorType.API,
				error: !response.ok ? (parsedResponse as E) : null,
				internalError: null,
			}
		} catch (error) {
			let errorType = ErrorType.Internal
			let statusCode = 500
			let statusText = 'Internal Error'

			if (error instanceof TypeError) {
				errorType = ErrorType.Network
				statusCode = 0
				statusText = 'Network Error'
			} else if (error instanceof Response) {
				errorType = ErrorType.API
				statusCode = error.status
				statusText = error.statusText
			}

			this?.onInternalError?.()
			options?.onInternalError?.()

			if (showLogs) {
				const endTime = performance.now()

				const duration = Math.floor(endTime - startTime).toFixed(0)

				console.debug(`[ ${method} ] ${fullURL} -> `, {
					status: statusCode,
					duration: `${duration} ms`,
					body: body ?? null,
					options: options ?? null,
					requestConfig,
					requestHeaders: requestConfig.headers,
					error,
				})
			}

			return {
				config: requestConfig,
				status: Status.Error,
				statusCode,
				statusText,
				data: null,
				hasError: true,
				errorType,
				error: null,
				internalError: error,
			}
		}
	}

	/**
	 * Sends a GET request to the specified URL.
	 *
	 * @param url - The URL to send the request to.
	 * @param options - Optional request options.
	 * @returns A promise that resolves to a FetchlyResult object.
	 *
	 * @example
	 * const fetcher = new Fetchly();
	 * const response = await fetcher.get<User>('https://api.example.com/users');
	 * console.log(response.data); // Output: { id: 1, name: 'John Doe' }
	 */
	public async get<T = unknown, E = unknown>(url: string, options?: Options): Promise<FetchlyResult<T, E>> {
		return this._fetch<T, E>(url, Method.GET, options)
	}

	/**
	 * Sends a POST request to the specified URL with the given body and options.
	 * @param url - The URL to send the request to.
	 * @param body - The body of the request.
	 * @param options - The options for the request.
	 * @returns A promise that resolves to a FetchlyResult object containing the response data.
	 * @example
	 * const response = await post('/api/users', { name: 'John Doe' });
	 * console.log(response.data); // Output: { id: 1, name: 'John Doe' }
	 */
	public async post<T = unknown, E = unknown>(
		url: string,
		body: unknown,
		options?: Options
	): Promise<FetchlyResult<T, E>> {
		return this._fetch<T, E>(url, Method.POST, options, body)
	}

	/**
	 * Sends a PUT request to the specified URL with the provided body and options.
	 * @param url The URL to send the request to.
	 * @param body The body of the request.
	 * @param options The options for the request.
	 * @returns A promise that resolves to the response of the request.
	 * @example
	 * const response = await put('/api/users/1', { name: 'John Doe' });
	 * console.log(response.data); // Output: { id: 1, name: 'John Doe' }
	 */
	public async put<T = unknown, E = unknown>(
		url: string,
		body: unknown,
		options?: Options
	): Promise<FetchlyResult<T, E>> {
		return this._fetch<T, E>(url, Method.PUT, options, body)
	}

	/**
	 * Sends a DELETE request to the specified URL.
	 *
	 * @param url - The URL to send the request to.
	 * @param options - Optional request options.
	 * @returns A promise that resolves to a FetchlyResult object.
	 *
	 * @example
	 * // Delete a user by ID
	 * const response = await delete<User>(`https://api.example.com/users/${userId}`);
	 * console.log(response.data); // User object
	 * console.log(response.status); // HTTP status code
	 */
	public async delete<T = unknown, E = unknown>(url: string, options?: Options): Promise<FetchlyResult<T, E>> {
		return this._fetch<T, E>(url, Method.DELETE, options)
	}
}

const fetchly = new Fetchly()
export default fetchly
