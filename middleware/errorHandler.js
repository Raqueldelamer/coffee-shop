const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    console.log("Error:" , err);
    res.status(500).json({ error: "Beep beep! Error!" });
};

module.exports = errorHandler;