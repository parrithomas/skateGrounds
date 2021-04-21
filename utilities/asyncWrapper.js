function asyncWrapper(func) {
    return function (req, res, next) {
        func(req, res, next).catch(next);
    }
}
module.exports = asyncWrapper;