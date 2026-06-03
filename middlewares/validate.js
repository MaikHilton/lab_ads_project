// middlewares/validate.js
const validate = (schema) => (req, res, next) => {
  // abortEarly: false дозволяє зібрати всі помилки відразу
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ success: false, errors: messages });
  }
  
  next();
};

module.exports = validate;