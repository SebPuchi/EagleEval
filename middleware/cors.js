// function to handle cors
export const handleCors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", [
    "https://www.eagleeval.com",
    "https://eagleeval.com",
  ]);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};
