import axios from 'axios'
import ky from 'ky'
import { bench, describe } from 'vitest'

import { Fetchly } from '..'

describe('Create Cache Instance', () => {
	bench('Fetchly', async () => {
		const fetchly = new Fetchly()
		await fetchly.get('https://dummyjson.com/products/1')
	})

	bench('Fetch', async () => {
		await fetch('https://dummyjson.com/products/1')
	})

	bench('Axios', async () => {
		await axios.get('https://dummyjson.com/products/1')
	})

	bench('KY', async () => {
		await ky.get('https://dummyjson.com/products/1').json()
	})
})
