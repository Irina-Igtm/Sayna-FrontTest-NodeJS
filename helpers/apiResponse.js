exports.successResponse = function (res, msg) {
	var data = {
		status: 201,
		message: msg
	};
	return res.status(201).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
	var resData = {
		status: 200,
		message: msg,
		data: data
	};
	return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
	var data = {
		status: 500,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
	var data = {
		status: 404,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
	var resData = {
		status: 400,
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(401).json(data);
};
exports.unauthorizedUser = function (res, msg) {
	var data = {
		status: 403,
		message: msg,
	};
	return res.status(403).json(data);
};

exports.unauthorizedAbonnement = function (res, msg) {
	var data = {
		status: 402,
		message: msg,
	};
	return res.status(402).json(data);
};
exports.DataNotValide = function (res, msg) {
	var data = {
		status: 412,
		message: msg,
	};
	return res.status(412).json(data);
};

exports.DonnéesNonConforme = function (res, msg) {
	var data = {
		status: 412,
		message: msg,
	};
	return res.status(412).json(data);
};

exports.TokenErrone = function (res, msg) {
	var data = {
		status: 401,
		message: msg,
	};
	return res.status(401).json(data);
};

exports.DataisAlwaysUSe = function (res, msg) {
	var data = {
		status: 409,
		message: msg,
	};
	return res.status(409).json(data);
};