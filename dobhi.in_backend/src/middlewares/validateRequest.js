const { errorResponse } = require("../utils/apiResponse");

const formatZodIssues = (issues = []) => {
  if (!Array.isArray(issues) || issues.length === 0) return "Invalid request payload";
  const first = issues[0];
  const fieldPath = Array.isArray(first.path) && first.path.length > 0 ? first.path.join(".") : "field";
  return `${fieldPath}: ${first.message}`;
};

const validateRequest = (schema, source = "body") => (req, res, next) => {
  const payload = req[source] || {};
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return res.status(400).json(errorResponse(formatZodIssues(parsed.error.issues)));
  }

  req[source] = parsed.data;
  return next();
};

module.exports = validateRequest;
