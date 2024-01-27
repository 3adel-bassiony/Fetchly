import { SearchParams } from '../types/SearchParams'

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
 * const queryString = stringifySearchParams(searchParams);
 * // queryString: "?q=apple&category=fruits&price=10&inStock=true"
 */
export function stringifySearchParams(searchParams: SearchParams): string {
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
