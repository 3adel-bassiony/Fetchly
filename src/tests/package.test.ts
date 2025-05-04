import { describe, expect, it } from 'vitest'

import { Status } from '../enums/Status'
import { stringifyParams } from '../helpers/stringifyParams'
import fetchly, { Fetchly } from '../index'

// ---------------------------------------------------------------------------------------------------------------------
// MARK: Instance Creation and Configuration
// ---------------------------------------------------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------------------------------------------------
// MARK: Verification of Fetchly RESTful Operations Success Scenarios
// ---------------------------------------------------------------------------------------------------------------------
describe('Verification of RESTful Operations Success Scenarios', () => {
	it('Should be able to perform a GET request', async () => {
		const { data, error, status, statusCode, statusText, hasError, errorType, internalError } =
			await fetchly.get('/products/1')

		expect(data).toBeInstanceOf(Object)
		expect(data).toHaveProperty('id')
		expect(data).toHaveProperty('title')
		expect(data).toHaveProperty('description')
		expect(data).toHaveProperty('price')
		expect(data).toHaveProperty('discountPercentage')
		expect(data).toHaveProperty('rating')
		expect(data).toHaveProperty('stock')
		expect(data).toHaveProperty('brand')
		expect(data).toHaveProperty('category')
		expect(data).toHaveProperty('thumbnail')
		expect(data).toHaveProperty('images')

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

		expect(data).toBeInstanceOf(Object)
		expect(data).toHaveProperty('id')
		expect(data).toHaveProperty('title')

		expect(error).toBeNull()
		expect(statusCode).toBe(201)
		expect(statusText).toBe('Created')
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
			requestBody,
			{ showLogs: true }
		)

		expect(data).toBeInstanceOf(Object)
		expect(data).toHaveProperty('id')
		expect(data).toHaveProperty('title')
		expect(data).toHaveProperty('price')
		expect(data).toHaveProperty('discountPercentage')
		expect(data).toHaveProperty('stock')
		expect(data).toHaveProperty('rating')
		expect(data).toHaveProperty('images')
		expect(data).toHaveProperty('thumbnail')
		expect(data).toHaveProperty('description')
		expect(data).toHaveProperty('brand')
		expect(data).toHaveProperty('category')

		expect(error).toBeNull()
		expect(statusCode).toBe(200)
		expect(statusText).toBe('OK')
		expect(status).toBe(Status.Success)
		expect(hasError).toBe(false)
		expect(errorType).toBeNull()
		expect(internalError).toBeNull()
	})

	it('Should be able to perform a PATCH request', async () => {
		const requestBody = {
			title: 'New Product Title',
		}

		const { data, error, status, statusCode, statusText, hasError, errorType, internalError } = await fetchly.patch(
			'/products/1',
			requestBody,
			{ showLogs: true }
		)

		expect(data).toBeInstanceOf(Object)
		expect(data).toHaveProperty('id')
		expect(data).toHaveProperty('title')
		expect(data).toHaveProperty('price')
		expect(data).toHaveProperty('discountPercentage')
		expect(data).toHaveProperty('stock')
		expect(data).toHaveProperty('rating')
		expect(data).toHaveProperty('images')
		expect(data).toHaveProperty('thumbnail')
		expect(data).toHaveProperty('description')
		expect(data).toHaveProperty('brand')
		expect(data).toHaveProperty('category')

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

// ---------------------------------------------------------------------------------------------------------------------
// MARK: Fetchly Error Handling and Response Validation
// ---------------------------------------------------------------------------------------------------------------------
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

		expect(error).toBeInstanceOf(Object)
		expect(error).toHaveProperty('status', 404)
		expect(error).toHaveProperty('title')
		expect(error).toHaveProperty('type')
		expect(error).toHaveProperty('detail')
		expect(error).toHaveProperty('message')

		expect(statusCode).toBe(404)
		expect(statusText).toBe('Not Found')
		expect(status).toBe(Status.Error)
		expect(hasError).toBe(true)
		expect(errorType).toBe('api')
		expect(internalError).toBeNull()
	})

	it('Should handle an error when making a POST request using Fetchly', async () => {
		type Error = {
			status: string
			title: string
			type: string
			detail: string
			message: string
		}

		const { data, error, status, statusCode, statusText, hasError, errorType, internalError } = await fetchly.post<
			unknown,
			Error
		>('/http/500', {
			body: {},
		})

		expect(data).toBeNull()

		expect(error).toBeInstanceOf(Object)
		expect(error).toHaveProperty('status', 500)
		expect(error).toHaveProperty('title')
		expect(error).toHaveProperty('type')
		expect(error).toHaveProperty('detail')
		expect(error).toHaveProperty('message')

		expect(statusCode).toBe(500)
		expect(statusText).toBe('Internal Server Error')
		expect(status).toBe(Status.Error)
		expect(hasError).toBe(true)
		expect(errorType).toBe('api')
		expect(internalError).toBeNull()
	})
})

// ---------------------------------------------------------------------------------------------------------------------
// MARK: Fetchly Hooks
// ---------------------------------------------------------------------------------------------------------------------
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
			onSuccess: (response) => {
				text = 'Success'

				expect(response).toBeInstanceOf(Object)
				expect(response).toHaveProperty('id')
				expect(response).toHaveProperty('title')
			},
		})

		expect(text).toBe('Success')
	})

	it('Should be able to use onError hook', async () => {
		let text = null
		await fetchly.get('/http/500', {
			onError: (error: Record<string, unknown>) => {
				text = 'Error'

				expect(error).toBeInstanceOf(Object)
				expect(error).toHaveProperty('status', 500)
				expect(error).toHaveProperty('title')
				expect(error).toHaveProperty('type')
				expect(error).toHaveProperty('detail')
				expect(error).toHaveProperty('message')
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

// ---------------------------------------------------------------------------------------------------------------------
// MARK: Fetchly Helpers
// ---------------------------------------------------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------------------------------------------------
// MARK: Next.js Support
// ---------------------------------------------------------------------------------------------------------------------
describe('Next.js Support', () => {
	it('Should make a GET request with next configuration', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: false,
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
			showLogs: false,
			next: {
				revalidate: 10,
			},
		})

		await fetchly.get('/products/1', { next: { revalidate: 20, tags: ['test2'] } })
	})

	it('Should make a GET request without next configuration', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: false,
		})

		await fetchly.get('/products/1')
	})
})

// ---------------------------------------------------------------------------------------------------------------------
// MARK: Passing Other Options
// ---------------------------------------------------------------------------------------------------------------------
describe('Passing Other Options', () => {
	it('Should make a GET request with custom global options', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: false,
			additionalOptions: {
				foo: 'bar',
			},
		})

		const { config } = await fetchly.get('/products/1')

		expect(fetchly).toHaveProperty('additionalOptions', {
			foo: 'bar',
		})

		expect(config).toHaveProperty('foo', 'bar')
	})

	it('Should make a GET request with custom local options', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: false,
		})

		const { config } = await fetchly.get('/products/1', {
			additionalOptions: {
				foo: 'bar',
			},
		})

		expect(config).toHaveProperty('foo', 'bar')
	})

	it('Should make a GET request with custom global and local options', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: false,
			additionalOptions: {
				foo: 'bar',
			},
		})

		const { config } = await fetchly.get('/products/1', {
			additionalOptions: {
				baz: 'bar',
			},
		})
		expect(fetchly).toHaveProperty('additionalOptions', {
			foo: 'bar',
		})

		expect(config).toHaveProperty('foo', 'bar')
		expect(config).toHaveProperty('baz', 'bar')
	})

	it('Should make a GET request with proxy - Bun Only', async () => {
		const fetchly = new Fetchly({
			baseURL: 'https://dummyjson.com',
			showLogs: false,
			proxy: 'http://fixie:htb8qqSUVzUYxVe@olympic.usefixie.com:80',
		})

		const { config } = await fetchly.get('/products/1', {
			additionalOptions: {
				foo: 'bar',
			},
		})

		expect(config).toHaveProperty('foo', 'bar')
	})
})
