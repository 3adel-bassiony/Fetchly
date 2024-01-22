import { ErrorType } from '../enums/ErrorType'
import { Status } from '../enums/Status'

/**
 * Represents the result of a Fetchly operation.
 *
 * @template T - The type of the data returned by the operation.
 * @template E - The type of the error returned by the operation.
 */
export type FetchlyResult<T = unknown, E = unknown> = {
	data: T | null
	status: Status
	statusCode: number
	statusText: string
	hasError: boolean
	errorType: ErrorType | null
	error: E | null
	internalError: unknown
}
