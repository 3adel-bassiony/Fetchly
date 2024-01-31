import { describe, expect, it } from 'vitest'

import { Status } from '../enums/Status'
import { stringifyParams } from '../helpers/stringifyParams'
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
		expect(errorType).toBe('api')
		expect(internalError).toBeNull()
	})
})

describe('Fetchly Hooks', () => {
	it('Should be able to use onRequest hook', async () => {
		let text = null
		await fetchly.get('/products/1', {
			onRequest: () => {
				text = 'Requested'
			},
		})

		expect(text).toBe('Requested')
	})

	it('Should be able to use onSuccess hook', async () => {
		let text = null
		await fetchly.get('/products/1', {
			onSuccess: () => {
				text = 'Success'
			},
		})

		expect(text).toBe('Success')
	})

	it('Should be able to use onError hook', async () => {
		let text = null
		await fetchly.get('/http/404/Hello_Peter', {
			onError: () => {
				text = 'Error'
			},
		})

		expect(text).toBe('Error')
	})

	it('Should be able to use onInternalError hook', async () => {
		let text = null

		const fetchly = new Fetchly()

		await fetchly.get('//', {
			onInternalError: () => {
				text = 'Internal Error'
			},
		})

		expect(text).toBe('Internal Error')
	})
})

describe('Fetchly Helpers', () => {
	it('Should stringify the search params and return a string', async () => {
		const params = {
			page: 1,
			per_page: 10,
			sort_by: 'title',
			order_by: 'asc',
		}

		expect(stringifyParams(params)).toBe('?page=1&per_page=10&sort_by=title&order_by=asc')
	})
})

describe('Next.js Support', () => {
	it('Should make a GET request with next configuration', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: true,
			next: {
				revalidate: 10,
			},
		})

		await fetchly.get('/products/1')

		expect(fetchly).toHaveProperty('next', {
			revalidate: 10,
		})
	})

	it('Should make a GET request with global and local next configuration', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: true,
			next: {
				revalidate: 10,
			},
		})

		await fetchly.get('/products/1', { next: { revalidate: 20, tags: ['test2'] } })
	})

	it('Should make a GET request without next configuration', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: true,
		})

		await fetchly.get('/products/1')
	})
})

describe('Passing Other Options', () => {
	it('Should make a GET request with custom global options', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: true,
			additionalOptions: {
				foo: 'bar',
			},
		})

		const { options } = await fetchly.get('/products/1')

		expect(fetchly).toHaveProperty('additionalOptions', {
			foo: 'bar',
		})

		expect(options).toHaveProperty('foo', 'bar')
	})

	it('Should make a GET request with custom local options', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: true,
		})

		const { options } = await fetchly.get('/products/1', {
			additionalOptions: {
				foo: 'bar',
			},
		})

		expect(options).toHaveProperty('foo', 'bar')
	})

	it('Should make a GET request with custom global and local options', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: true,
			additionalOptions: {
				foo: 'bar',
			},
		})

		const { options } = await fetchly.get('/products/1', {
			additionalOptions: {
				baz: 'bar',
			},
		})
		expect(fetchly).toHaveProperty('additionalOptions', {
			foo: 'bar',
		})

		expect(options).toHaveProperty('foo', 'bar')
		expect(options).toHaveProperty('baz', 'bar')
	})
})
