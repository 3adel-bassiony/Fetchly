import { Params } from '../types/Params'

/**
 * Converts the given search parameters object to a string representation.
 * Only non-null, non-undefined, non-empty string, and non-NaN values are included in the resulting string.
 * @param params - The search parameters object.
 * @returns The string representation of the search parameters.
 * @example
 * const params = {
 *   q: 'apple',
 *   category: 'fruits',
 *   price: 10,
 *   inStock: true
 * };
 * const queryString = stringifyParams(params);
 * // queryString: "?q=apple&category=fruits&price=10&inStock=true"
 */
export function stringifyParams(params: Params): string {
	const queryString = Object.keys(params)
		.filter(
			(key) =>
				params[key] !== null &&
				params[key] !== undefined &&
				params[key] !== '' &&
				!Number.isNaN(params[key])
		)
		.map((key) => `${key}=${params[key]}`)
		.join('&')

	return `?${queryString}`
}
