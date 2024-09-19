function name() {
    return Response.json({ id: 1, name: 'J Smith', email: 'jsmith@example.com' })
}

export {name as GET}