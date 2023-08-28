const diffTime = (end: Date, start: Date, base = 60) => {
    if (!start || !end) return undefined
    return (new Date(end).getTime() - new Date(start).getTime()) / (1000 * base)
}

export default diffTime
