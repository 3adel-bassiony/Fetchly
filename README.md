# Fetchly

![npm](https://img.shields.io/npm/v/fetchly)
![npm bundle size](https://img.shields.io/bundlephobia/min/fetchly)
![npm package minimized gzipped size (select exports)](https://img.shields.io/bundlejs/size/fetchly)
![gh-workflow-image](https://img.shields.io/github/actions/workflow/status/3adel-bassiony/fetchly/main.yml)
![NPM](https://img.shields.io/npm/l/fetchly)

Discover Fetchly, a remarkably efficient 1kb fetchly solution for JavaScript and Node.js, ideal for developers prioritizing performance and simplicity. Written in TypeScript, it offers seamless integration for both TypeScript and JavaScript projects. Its compact size belies its powerful functionality, making it perfect for lightweight, modern applications. With ESM compatibility, Fetchly aligns with contemporary development practices, ensuring its utility in a range of projects from small-scale to complex.

&nbsp;

## Quick Navigation

1. [Installation](#installation)
2. [Usage](#usage)
3. [Documentation](#documentation)
4. [Support and Questions](#installation)
5. [Contribution](#contribution)
6. [Guidelines for Contributions](#guidelines-for-contributions)
7. [License](#license)

&nbsp;

# Installation

Getting up and running with Fetchly is a breeze. Choose your preferred package manager from the options below and follow the simple installation steps:

#### NPM

```bash
npm i fetchly
```

#### Bun

```bash
bun i fetchly
```

#### Yarn

```bash
yarn add fetchly
```

#### Pnpm

```bash
pnpm install fetchly
```

&nbsp;

# Usage

Once you have installed Fetchly, integrating it into your project is straightforward. Below are the basic steps to get you started:

First, import Fetchly into your JavaScript or TypeScript file:

```typescript
import { Fetchly } from 'fetchly'
```

Then create a new instance for Fetchly and pass the configuration to it:

```typescript
const fetchly = new Fetchly({
	baseURL: 'api.example.com',
	timeout: 1000,
})
```

And then you can use it like this:

```typescript
const { data, error } = await fetchly.get('https://api.example.com/v1')
```

Or you can import the default created instance and use it directly like this:

```typescript
import fetchly from 'fetchly'

const { data, error } = await fetchly.get('https://api.example.com/v1')
```

&nbsp;

# Documentation

The Fetchly package comes with a comprehensive set of features designed to make internationalization in your application straightforward and efficient. This section provides an overview of its capabilities and guides on how to use them effectively.

-   ### Features Overview

    -   ### Features Overview

        Fetchly offers the following features:

        -   **Simpler APIs**: Make requests with simple APIs then fetch.
        -   **Lightweight & Dependency-Free**: No external dependencies, making it a lightweight addition to projects. This ensures minimal impact on bundle size.
        -   **Ease of Use**: Designed with a user-friendly interface, making it straightforward to integrate into existing projects.
        -   **Automatic request body serialization**: Automatically serialize request bodies to the appropriate format based on the specified content type.
        -   **Automatic response serialization**: Automatically serialize response bodies based on the specified content type.
        -   **Flexible & Configurable**: Advanced support for plural forms and number formatting.
        -   **Cross-Platform Compatibility**: Compatible with various JavaScript environments, including Node.js and browser-based applications.
        -   **100% TypeScript**: This package is fully written in TypeScript, offering first-class support to leverage TypeScript's powerful type-checking and development features.
        -   **Hooks**: Support multiple hooks to execute actions during the request lifecycle.
        -   **Customizable**: Easily customize the behavior of Fetchly to suit your specific needs.

-   ### Usage & Configuration

    -   #### **Installation**:

        Refer to the [Installation](#installation) section for instructions on how to install Fetchly using various package managers.

    -   #### **Initializing the Library:**

        You can create a new instance of Fetchly and pass the configuration for it directly like this example below:

        ```typescript
        const fetchly = new Fetchly({
        	baseURL: 'https://api.example.com',
        	headers: {
        		'Content-Type': 'application/json',
        	},
        })
        ```

        Alternatively, you can split the creation of the new instance and the configuration, useful when split up into different modules for bootstrapping.

        ```typescript
        const fetchly = new Fetchly()

        fetchly.configure({
        	baseURL: 'https://api.example.com',
        	headers: {
        		'Content-Type': 'application/json',
        	},
        	showLogs: true,
        })
        ```

        Or you can import the default created instance and use it directly like this:

        ```typescript
        import fetchly from 'fetchly'

        const { data, error } = await fetchly.get('/products/1')
        ```

-   ### Request Methods

    -   **GET**: Use this method to make a GET request to retrieve the data from a server

        ```typescript
        const { data, error } = await fetchly.get('/products')
        ```

    -   **POST**: Use this method to make a POST request to submit the data

        ```typescript
        const body = {
        	title: 'Hello World!',
        }

        const { data, error } = await fetchly.post('/products', body)
        ```

    -   **PUT**: Use this method to make a PUT request to submit the data

        ```typescript
        const body = {
        	title: 'Hello World!',
        }

        const { data, error } = await fetchly.put('/products/1', body)
        ```

    -   **DELETE**: Use this method to make a DELETE request

        ```typescript
        const { data, error } = await fetchly.delete('/products/1')
        ```

-   ### Other Methods

    -   **configure**: You can configure the Fetchly instance using this method, you will find all available options below:

        ```typescript
        fetchly.configure({
        	baseURL: 'https://example.com',
        	headers: {
        		'Content-Type': 'application/json',
        	},
        })
        ```

-   ### Helpers

    -   **stringifyParams** A helper function that converts an object to a string so you can append it to the URL

        ```typescript
        import { stringifyParams } from 'fetchly/helpers/stringifyParams'

        const params = {
        	page: 1,
        	per_page: 10,
        	sort_by: 'title',
        	order_by: null,
        }

        const queryString = stringifyParams(params) // ?page=1&per_page=10&sort_by=title
        ```

-   ### Request Result

    When you make a request you can access all those proprieties like this:

    ```typescript
    const { data, status, statusCode, statusText, hasError, error, internalError } = await fetchly.get('/products')
    ```

    To get more details for the request result proprieties here are the full details below:

    | Property      | Type      | Description                                                      |
    | ------------- | --------- | ---------------------------------------------------------------- |
    | data          | T \| null | The data returned from the successful request.                   |
    | status        | string    | The status of the request.                                       |
    | statusCode    | number    | The status code of the request.                                  |
    | statusText    | string    | The status text of the request.                                  |
    | hasError      | boolean   | Indicates whether the request encountered an error.              |
    | errorType     | string    | The type of error encountered, if any.                           |
    | error         | E \| null | The error message, if any.                                       |
    | internalError | any       | Indicates whether an internal error occurred during the request. |

-   ### API Options

    When making a request or creating a new instance of Fetchly, you can configure it and pass various options. Here are the available options along with their default values:

    | option          | Type                    | Default      | Description                                                                                                                                                |
    | --------------- | ----------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | baseURL         | string                  | undefined    | Base URL for the request.                                                                                                                                  |
    | headers         | object                  | undefined    | Request headers.                                                                                                                                           |
    | params          | object                  | undefined    | Adds query params to the request URL.                                                                                                                      |
    | timeout         | number                  | 30000        | Milliseconds to automatically abort the request.                                                                                                           |
    | mode            | string                  | same-origin  | A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request mode.                                      |
    | cache           | string                  | default      | A string indicating how the request will interact with the browser's cache to set the request's cache.                                                     |
    | credentials     | string                  | same-origin  | A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request credentials.     |
    | redirect        | string                  | follow       | A string indicating whether a request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). |
    | referrer        | string                  | about:client | A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.                                                 |
    | referrerPolicy  | string                  | no-referrer  | A referrer policy to set request's referrerPolicy.                                                                                                         |
    | signal          | AbortSignal             | undefined    | An AbortSignal to set the request's signal.                                                                                                                |
    | responseFormat  | string                  | json         | A string to controls whether the response should be in JSON format or other format.                                                                        |
    | next            | NextFetchRequestConfig  | undefined    | An object to specifies the configuration for the next.js fetch request, you can pass `revalidate` or `tags` to the object.                                 |
    | additionalOptions    | Record<string, unknown> | undefined    | An object to pass a custom options to attach them to fetch options request.                                                                                |
    | showLogs        | boolean                 | false        | A boolean flag to show a console debug for the full request details.                                                                                       |
    | onRequest       | function                | undefined    | A callback function to be called before the request is sent.                                                                                               |
    | onSuccess       | function                | undefined    | A callback function to be called when the request is successful.                                                                                           |
    | onError         | function                | undefined    | A callback function to be called when an error occurs during the request.                                                                                  |
    | onInternalError | function                | undefined    | A callback function to be called when an internal error occurs during the request.                                                                         |

&nbsp;

# Support and Questions

If you have any questions or need support while using Fetchly, feel free to open an issue on our [GitHub repository](https://github.com/3adel-bassiony/Fetchly/issues) or reach out to the community for help.

For the complete and detailed guide, please refer to our [official documentation](#documentation).

&nbsp;

# Contribution

First off, thank you for considering contributing to Fetchly! It's people like you who make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

There are many ways you can contribute to Fetchly, even if you're not a technical person:

-   **Submit Bug Reports:** If you find a bug, please open an issue. Remember to include a clear description and as much relevant information as possible.
-   **Feature Suggestions:** Have an idea for a new feature or an improvement? Open an issue and tag it as a feature request.
-   **Code Contributions:** Interested in adding a feature or fixing a bug? Awesome! Please open a pull request with your changes.
-   **Documentation:** Good documentation is key to any project. If you see something unclear or missing, feel free to submit a pull request.
-   **Spread the Word:** Share Fetchly with your network and let others know about it.

&nbsp;

# Guidelines for Contributions

Ensure you use a consistent coding style with the rest of the project.
Write clear, readable, and concise code.
Add unit tests for new features to ensure reliability and maintainability.
Update the README or documentation with details of changes, this includes new environment variables, exposed ports, useful file locations, and container parameters.
Increase the version numbers in any example files and the README to the new version that this Pull Request would represent.

&nbsp;

# License

Fetchly is licensed under the MIT License. This license permits use, modification, and distribution, free of charge, for both private and commercial purposes. It also offers a good balance between protecting the author's rights and allowing for flexibility and freedom in the use of the software.
