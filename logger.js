const logger = (req, res, next) => {
    let datum = new Date();
    console.log(req.protocol + "://" + req.get("host") + req.originalUrl);
    next();
}

module.exports = logger;