import '../styles/globals.css'
import { ThemeProvider, CssBaseline } from '@mui/material'
import createCache, { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { theme } from '../styles/theme'
import type { AppProps } from 'next/app'

export interface CustomAppProps extends AppProps {
	emotionCache: EmotionCache;
}

export function createEmotionCache() {
	return createCache({key: 'css', prepend: true})
}

const clientSideEmotionCache = createEmotionCache()

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
