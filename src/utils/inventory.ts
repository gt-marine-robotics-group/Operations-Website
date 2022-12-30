
export function getSearchTerms(name:string) {

    const terms = name.split(' ').filter(v => v && v !== '-').map(v => v.toLowerCase())

    terms.forEach(term => {
        if (!term.includes('-')) return
        term.split('-').forEach(subTerm => {
            if (!subTerm) return
            terms.push(subTerm)
        })
    }) 

    return terms
}
