

const Error = (request, response, next) => {
    try {
        next();
    } catch (error) {
        return response.status(500).json({
            message: "Internal Server Error."
        })
    }
}

export default Error;