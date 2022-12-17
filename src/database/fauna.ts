import fauna from 'faunadb'

export default new fauna.Client({
    secret: process.env.FAUNA_SECRET_KEY,
    observer: (res) => {
        if (process.env.NODE_ENV != 'development') return
        if (!res || !res.responseHeaders) return
        console.log(res.responseHeaders)
    }
})