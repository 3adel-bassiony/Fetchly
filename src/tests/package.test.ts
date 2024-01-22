import { describe, expect, it } from 'vitest'

import { Status } from '../enums/Status'
import fetchly, { Fetchly } from '../index'

describe('Fetchly', () => {
	it('Should verifies that a new instance of Fetchly is successfully created', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://example.com',
		})
		expect(fetchly).toBeInstanceOf(Fetchly)
	})

	it('Should configure the created instance of Fetchly correctly', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		expect(fetchly).toHaveProperty('baseURL', 'https://dummyjson.com')
		expect(fetchly).toHaveProperty('headers', {
			'Content-Type': 'application/json',
		})
	})

	it('Should configure the default instance of Fetchly correctly', async () => {
		fetchly.configure({
			baseURL: 'https://dummyjson.com',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		expect(fetchly).toHaveProperty('baseURL', 'https://dummyjson.com')
		expect(fetchly).toHaveProperty('headers', {
			'Content-Type': 'application/json',
		})
	})

	it('Should be able to convert search params to string', async () => {
		const searchParams = {
			page: 1,
			per_page: 10,
			sort_by: 'title',
			order_by: 'asc',
		}

		expect(fetchly.convertSearchParamsToString(searchParams)).toBe('?page=1&per_page=10&sort_by=title&order_by=asc')
	})
})

describe('Verification of Fetchly RESTful Operations Success Scenarios', () => {
	it('Should be able to perform a GET request', async () => {
		const { data, error, status, statusCode, statusText, hasError, errorType, internalError } =
			await fetchly.get('/products/1')

		expect(data).toStrictEqual({
			id: 1,
			title: 'iPhone 9',
			description: 'An apple mobile which is nothing like apple',
			price: 549,
			discountPercentage: 12.96,
			rating: 4.69,
			stock: 94,
			brand: 'Apple',
			category: 'smartphones',
			thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
			images: [
				'https://cdn.dummyjson.com/product-images/1/1.jpg',
				'https://cdn.dummyjson.com/product-images/1/2.jpg',
				'https://cdn.dummyjson.com/product-images/1/3.jpg',
				'https://cdn.dummyjson.com/product-images/1/4.jpg',
				'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
			],
		})

		expect(error).toBeNull()
		expect(statusCode).toBe(200)
		expect(statusText).toBe('OK')
		expect(status).toBe(Status.Success)
		expect(hasError).toBe(false)
		expect(errorType).toBeNull()
		expect(internalError).toBeNull()
	})

	it('Should be able to perform a POST request', async () => {
		const requestBody = {
			title: 'Product Title',
		}

		const { data, error, status, statusCode, statusText, hasError, errorType, internalError } = await fetchly.post(
			'/products/add',
			requestBody
		)

		expect(data).toStrictEqual({
			id: 101,
			title: 'Product Title',
		})
		expect(error).toBeNull()
		expect(statusCode).toBe(200)
		expect(statusText).toBe('OK')
		expect(status).toBe(Status.Success)
		expect(hasError).toBe(false)
		expect(errorType).toBeNull()
		expect(internalError).toBeNull()
	})

	it('Should be able to perform a PUT request', async () => {
		const requestBody = {
			title: 'New Product Title',
		}

		const { data, error, status, statusCode, statusText, hasError, errorType, internalError } = await fetchly.put(
			'/products/1',
			requestBody
		)

		expect(data).toStrictEqual({
			id: 1,
			brand: 'Apple',
			category: 'smartphones',
			description: 'An apple mobile which is nothing like apple',
			images: [
				'https://cdn.dummyjson.com/product-images/1/1.jpg',
				'https://cdn.dummyjson.com/product-images/1/2.jpg',
				'https://cdn.dummyjson.com/product-images/1/3.jpg',
				'https://cdn.dummyjson.com/product-images/1/4.jpg',
				'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
			],
			price: 549,
			rating: 4.69,
			stock: 94,
			thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
			title: 'New Product Title',
		})
		expect(error).toBeNull()
		expect(statusCode).toBe(200)
		expect(statusText).toBe('OK')
		expect(status).toBe(Status.Success)
		expect(hasError).toBe(false)
		expect(errorType).toBeNull()
		expect(internalError).toBeNull()
	})

	it('Should be able to perform a DELETE request', async () => {
		const { data, error, status, statusCode, statusText, hasError, errorType, internalError } =
			await fetchly.delete('/products/1')

		expect(data).toHaveProperty('isDeleted', true)
		expect(error).toBeNull()
		expect(statusCode).toBe(200)
		expect(statusText).toBe('OK')
		expect(status).toBe(Status.Success)
		expect(hasError).toBe(false)
		expect(errorType).toBeNull()
		expect(internalError).toBeNull()
	})
})

describe('Fetchly Error Handling and Response Validation', () => {
	it('Should handle an error when making a GET request using Fetchly', async () => {
		type Error = {
			status: string
			title: string
			type: string
			detail: string
			message: string
		}

		const { data, error, status, statusCode, statusText, hasError, errorType, internalError } = await fetchly.get<
			unknown,
			Error
		>('/http/404/Hello_Peter')

		expect(data).toBeNull()
		expect(error).toStrictEqual({
			status: '404',
			title: 'Hello_Peter',
			type: 'about:blank',
			detail: 'Hello_Peter',
			message: 'Hello_Peter',
		})
		expect(statusCode).toBe(404)
		expect(statusText).toBe('Not Found')
		expect(status).toBe(Status.Error)
		expect(hasError).toBe(true)
		expect(errorType).toBe('API')
		expect(internalError).toBeNull()
	})
})
