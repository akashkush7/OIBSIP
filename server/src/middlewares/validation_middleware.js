const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (err) {
        const message = "Enter the valid Info";
        const extraDetails = err.errors[0].message;
        err = {
            status: 422,
            message: message,
            extraDetails: extraDetails
        }
        next(err);
    }
}

module.exports = validate;