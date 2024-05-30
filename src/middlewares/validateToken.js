export const authRequired = (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.error.map((error = error.message)) });
  }
};
