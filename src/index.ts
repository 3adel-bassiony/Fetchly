import { ErrorType } from './enums/ErrorType'
import { Method } from './enums/Method'
import { Status } from './enums/Status'
import { FetchlyResult } from './types/FetchlyResult'
import { Options } from './types/Options'
import { SearchParams } from './types/SearchParams'

export class Fetchly {
	private baseURL?: string
	private headers?: HeadersInit
	private searchParams?: SearchParams
	private timeout?: number
	private mode?: RequestMode
	private cache?: RequestCache
	private credentials?: RequestCredentials
	private redirect?: RequestRedirect
	private referrer?: string
	private referrerPolicy?: ReferrerPolicy
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
			searchParams,
			timeout,
			mode,
			cache,
			credentials,
			redirect,
			referrer,
			referrerPolicy,
			onRequest,
			onSuccess,
			onError,
			onInternalError,
		} = options

		this.baseURL = baseURL
		this.headers = headers
		this.searchParams = searchParams
		this.timeout = timeout ?? 30000
		this.mode = mode ?? 'same-origin'
		this.cache = cache ?? 'default'
		this.credentials = credentials ?? 'same-origin'
		this.redirect = redirect ?? 'follow'
		this.referrer = referrer ?? 'about:client'
		this.referrerPolicy = referrerPolicy ?? 'no-referrer'
		this.onRequest = onRequest
		this.onSuccess = onSuccess
		this.onError = onError
		this.onInternalError = onInternalError
	}

	/**
	 * Converts the given search parameters object to a string representation.
	 * Only non-null, non-undefined, non-empty string, and non-NaN values are included in the resulting string.
	 * @param searchParams - The search parameters object.
	 * @returns The string representation of the search parameters.
	 * @example
	 * const searchParams = {
	 *   q: 'apple',
	 *   category: 'fruits',
	 *   price: 10,
	 *   inStock: true
	 * };
	 * const queryString = convertSearchParamsToString(searchParams);
	 * // queryString: "?q=apple&category=fruits&price=10&inStock=true"
	 */
	public convertSearchParamsToString(searchParams: SearchParams): string {
		const queryString = Object.keys(searchParams)
			.filter(
				(key) =>
					searchParams[key] !== null &&
					searchParams[key] !== undefined &&
					searchParams[key] !== '' &&
					!Number.isNaN(searchParams[key])
			)
			.map((key) => `${key}=${searchParams[key]}`)
			.join('&')

		return `?${queryString}`
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
	 * const response = await _fetch<UserData, APIError>('/users', 'GET', { searchParams: { page: 1 } });
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
		try {
			const queryString =
				this.searchParams || options?.searchParams
					? this.convertSearchParamsToString({ ...this.searchParams, ...options?.searchParams })
					: ''
			const baseURL = options?.baseURL ?? this.baseURL ?? ''
			const fullURL = baseURL + url + queryString

			this?.onRequest?.()
			options?.onRequest?.()

			const fetchOptions: RequestInit = {
				method,
				headers: { ...this.headers, ...options?.headers },
				mode: options?.mode ?? this.mode,
				credentials: options?.credentials ?? this.credentials,
				redirect: options?.redirect ?? this.redirect,
				referrer: options?.referrer ?? this.referrer,
				referrerPolicy: options?.referrerPolicy ?? this.referrerPolicy,
				signal: AbortSignal.timeout(options?.timeout ?? this.timeout ?? 3000),
				cache: options?.cache ?? this.cache,
			}

			if (body) {
				fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body)
			}

			const response = await fetch(fullURL, fetchOptions)

			const parsedResponse = await response.json()

			if (!response.ok) {
				this?.onError?.()
				options?.onError?.()
			} else {
				this?.onSuccess?.()
				options?.onSuccess?.()
			}

			return {
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

			return {
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
