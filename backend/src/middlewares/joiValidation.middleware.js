import Joi from "joi";

const ALLOWED_PROPERTIES = ["body", "query", "params", "headers", "cookies"];

const DEFAULT_JOI_OPTIONS = {
    abortEarly: false,
    stripUnknown: true,
    errors: { wrap: { label: false } },
};

export const validateRequest = (schemas, properties = "body", joiOptions = {}) => {
    const isSchemaObject = typeof schemas === "object" && !schemas.isJoi;

    const props = Array.isArray(properties)
        ? properties
        : isSchemaObject
            ? Object.keys(schemas)
            : [properties];

    props.forEach(prop => {
        if (!ALLOWED_PROPERTIES.includes(prop)) {
            throw new Error(`Invalid property: ${prop}. Must be one of: ${ALLOWED_PROPERTIES.join(", ")}`);
        }
    });

    return async (req, res, next) => {
        try {
            const validationOptions = { ...DEFAULT_JOI_OPTIONS, ...joiOptions };
            const errorDetails = [];

            for (const prop of props) {
                const schema = isSchemaObject ? schemas[prop] : schemas;
                if (!schema) continue;

                const { error, value } = await schema.validateAsync(req[prop] || {}, validationOptions);

                if (error) {
                    errorDetails.push(...error.details.map(detail => ({
                        field: `${prop}.${detail.path.join(".")}`,
                        message: detail.message
                    })));
                } else {
                    req[prop] = value;
                }
            }

            if (errorDetails.length) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Validation error",
                    errors: errorDetails
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};
