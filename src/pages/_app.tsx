import '../styles/globals.css'
import { ThemeProvider, CssBaseline } from '@mui/material'
import createCache, { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { theme } from '../styles/theme'
import type { AppProps } from 'next/app'
import axios from 'axios'

export interface CustomAppProps extends AppProps {
	emotionCache: EmotionCache;
}

export function createEmotionCache() {
	return createCache({key: 'css', prepend: true})
}

const clientSideEmotionCache = createEmotionCache()

axios.defaults.baseURL = process.env.BASE_URL
axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.withCredentials = true

axios.interceptors.response.use(undefined, (err) => {
	const {config, message} = err
	if (config.method !== 'get' && config.method !== 'GET') {
		console.log('not get!')
		return Promise.reject(err)
	}
	if (!config || !config.retry) {
		return Promise.reject(err)
	}
	// if (!message.includes('timeout') && !message.includes('Network Error')) {
	// 	return Promise.reject(err)
	// }
	config.retry -= 1
	const delayRetryRequest = new Promise<void>((resolve) => {
		setTimeout(() => {
			console.log(`retrying request to ${config.url}`)
			resolve()
		}, config.retryDelay || 1000)
	})
	return delayRetryRequest.then(() => axios(config))
})

export default function MyApp({ Component, pageProps, 
	emotionCache=clientSideEmotionCache }:CustomAppProps) {
	return (
		<CacheProvider value={emotionCache}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</CacheProvider>
	)
}
