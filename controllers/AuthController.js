const UserModel = require("../models/user");
const carteModel = require("../models/carteBancaire")
const TypeAbonModel = require("../models/type_abonnement")
const AbonnementModel = require("../models/abonnement")
const MusicModel = require("../models/Music")
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Enregistrer utilisateurs
exports.register = [
	//Validation des champs
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("role").isLength({ min: 1 }).trim().withMessage("Role must be specified.")
		.isAlphanumeric().withMessage("Role has non-alphanumeric characters."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
		.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
	body("sexe").isLength({ min: 1 }).trim().withMessage("sexe must be specified.")
		.isAlphanumeric().withMessage("Sexe has non-alphanumeric characters."),
	body("dateNaissance").isLength({ min: 1 }).trim().withMessage("Date naissance must be specified.")
		.isDate().withMessage("Date naissance has  non format date."),
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
			return UserModel.findOne({ email: value }).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	sanitizeBody("sexe").escape(),
	sanitizeBody("dateNaissance").escape(),
	sanitizeBody("role").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {

				bcrypt.hash(req.body.password, 10, function (err, hash) {
					let otp = utility.randomNumber(4);
					var user = new UserModel(
						{
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							email: req.body.email,
							sexe: req.body.sexe,
							role: req.body.role,
							dateNaissance: req.body.dateNaissance,
							password: hash,
						}
					);
					user.save(function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
						let userData = {
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email,
							sexe: user.sexe,
							dateNaissance: user.dateNaissance,
							role: user.role,
							subcription: "",
							createdAt: new Date(),
							updatedAt: new Date()

						};
						const data = {
							user: userData
						}
						return apiResponse.successResponseWithData(res, "L'utilsateur a bien été crée avec succès", data);
					});
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

//Authentification
exports.login = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				UserModel.findOne({ email: req.body.email }).then(user => {
					if (user) {
						//Comparer given password with db's hash.
						bcrypt.compare(req.body.password, user.password, function (err, same) {
							if (same) {
								let userData = {
									_id: user._id,
									firstName: user.firstName,
									lastName: user.lastName,
									email: user.email,
									sexe: user.sexe,
									dateNaissance: user.dateNaissance,
									createdAt: new Date(),
									updatedAt: new Date()
								};
								//Prepare JWT token for authentication
								const jwtPayload = userData;
								const jwtData = {
									expiresIn: process.env.JWT_TIMEOUT_DURATION,
								};
								const secret = process.env.JWT_SECRET;
								//Generated JWT token with Payload and secret.
								let donnee = {
									user: userData,
									access_token: jwt.sign(jwtPayload, secret, jwtData),
									refresh_token: jwt.sign(jwtPayload, secret, jwtData)
								}
								global.roleUser = user.role
								global.idUser = user._id
								return apiResponse.successResponseWithData(res, "L'utilisateur a été authentifié", donnee);
							} else {
								return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
							}
						});
					} else {
						return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


//Subcription
exports.CarteBancaire = [
	body("carteNumber").isLength({ min: 9, max: 13 }).trim().withMessage("carteNumber name must be specified.")
		.isAlphanumeric().withMessage("carteNumber name has non-number.").custom((value) => {
			return carteModel.findOne({ carteNumber: value }).then((carte) => {
				if (carte) {
					return Promise.reject("CarteNumber already in use");
				}
			});
		}),
	body("month").isLength({ min: 2 }).trim().withMessage("month must be specified.")
		.isNumeric().withMessage("month has name has non-number."),
	body("year").isLength({ min: 4 }).trim().withMessage("Last name must be specified.")
		.isNumeric().withMessage("year name has non-number."),
	body("user_id").isLength({ min: 6 }).trim().withMessage("user_id name must be specified.")
		.isAlphanumeric().withMessage("user_id name has non-number."),

	sanitizeBody("carteNumber").escape(),
	sanitizeBody("month").escape(),
	sanitizeBody("year").escape(),
	sanitizeBody("user_id").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.unauthorizedUser(res, "Veuillez compléter votre profil avec une carte de crédit" , errors.array());
			} else {
				if(global.roleUser === "client"){
				var carte = new carteModel(
					{
						carteNumber: req.body.carteNumber,
						month: req.body.month,
						year: req.body.year,
						user_id: req.body.user_id

					}
				);
				carte.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					return apiResponse.successResponseWithData(res, "Vos données ont été mise à jour", null);
				});
			}else{
				return apiResponse.unauthorizedUser(res, "Vos droits d'accès ne permettent pas d'accéder à la ressource" );
			}
		}
		}
		catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

	//Get type abonnement
	exports.typeAbonnement = [
		(req, res) => {
			TypeAbonModel.find().then(type => {
				var typeAbon = []
				if(type){
					for (let i = 0; i < type.length; i++) {
						typeAbon.push({
							libelle: type[i].libelle
						})
						
					}
					return apiResponse.successResponseWithData(res, "Données reçues avec succès", typeAbon);
				}else {
						return apiResponse.unauthorizedResponse(res, "La base de données n'est pas connecté");
					}
			});
	}];

	// Get carte par user
	exports.getCartesByUser = [
		(req, res) => {
			carteModel.find({user_id: req.body.user_id} ).then(carte => {
				if(carte){
					global._idCarte = carte._id
					return apiResponse.successResponseWithData(res, "Données reçues avec succès", carte);
				}else {
						return apiResponse.unauthorizedResponse(res, "La base de données n'est pas connecté");
					}
			});
	}];

	exports.getAbonnementByUser = [
		(req, res) => {
			AbonnementModel.find({carte_id: req.body.carte_id} ).then(abonnement => {
				if(abonnement){
					return apiResponse.successResponseWithData(res, "Données reçues avec succès", abonnement);
				}else {
						return apiResponse.unauthorizedResponse(res, "Vous n'avez pas encore éffectuer un abonnement",abonnement);
					}
			});
	}];
	
	//Abonnement
	exports.subscription = [
		body("cvc").isLength({ min: 3 }).trim().withMessage("cvc must be specified.")
		.isNumeric().withMessage("cvc has name has non-numeric characters."),

		sanitizeBody("cvc").escape(),

		(req, res) => {
			AbonnementModel.find({carte_id: req.body.carte_id} ).then(abonnement => {
				if(abonnement.length == 0){
					carteModel.findOne({carte_id: req.body.carte_id} ).then(carte => {
						if(carte){
							if( global.roleUser == "client"){
							var abonn = new AbonnementModel({
								cvc: req.body.cvc,
								carte_id: carte._id,
								type_abonnement: req.body.type_abonnement
							})
							global.type_abonnement = req.body.type_abonnement
							abonn.save(function (err) {
								if (err) { return apiResponse.ErrorResponse(res, err); }
								return apiResponse.successResponseWithData(res, "Votre abonnement a bien été mise à jour", abonn);
							});
						}else{
							return apiResponse.unauthorizedUser(res, "Vos droits d'accès ne permettent pas d'accéder à la ressource" );
						}
							
						}else {
							return apiResponse.validationErrorWithData(res, "Une ou plusieurs données obligatoire sont manquantes");
							}
					});
					
				}else {
					return apiResponse.unauthorizedAbonnement(res, "Votre offre précédent est encore disponible ");
					}					
			});
	}];

	exports.deconnection = [
		
	];

	//suppression du compte
	exports.deleteUser = [
		(req, res) => {
		UserModel.deleteOne({user_id: req.body.user_id}, function(err){
			if (err) { return apiResponse.ErrorResponse(res, err); }
			return apiResponse.successResponseWithData(res, "Votre compte et le compte de vos enfants ont été supprimés avec succès" , null);
		});
		
	}];


	//listing des sources audios
	exports.getMusic = [
		(req, res) => {
			MusicModel.find().then(music => {
				if(music){
					let liste = []
					console.log(global.type_abonnement);
						for (let i = 0; i < music.length; i++) {
							if(global.type_abonnement === music[i].type){
								liste.push(music[i]);		
							}							
						}
						if(liste.length == 0){
							return apiResponse.unauthorizedUser(res, "Votre abonnement ne permet pas d'accéder à la ressource");
						}else{
						let donne = {
							songs : liste,
							createdAt: new Date(),
							updatedAt: new Date()
						}
					return apiResponse.successResponseWithData(res, "Liste des musics pré-enregistrer" , donne);			
					}
						
			}else{
					return apiResponse.unauthorizedAbonnement(res, "Liste non-disponible ");
				}
		});
	}];

	// modification de l'utilisateur
	exports.updateUser = [
		//Validations des données
		body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
		body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
		.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
		body("sexe").isLength({ min: 1 }).trim().withMessage("sexe must be specified.")
		.isAlphanumeric().withMessage("Sexe has non-alphanumeric characters."),
		body("dateNaissance").isLength({ min: 1 }).trim().withMessage("Date naissance must be specified.")
		.isDate().withMessage("Date naissance has  non format date."),

		sanitizeBody("firstName").escape(),
		sanitizeBody("lastName").escape(),
		sanitizeBody("sexe").escape(),
		sanitizeBody("dateNaissance").escape(),
		(req, res) => {
			try {
				const errors = validationResult(req);
					if (!errors.isEmpty()) {
						return apiResponse.unauthorizedUser(res, "Veuillez compléter votre profil avec une carte de crédit" , errors.array());
					}else{
					UserModel.findOne({ _id: req.body.user_id}).then(user =>{
						if(user) {
							console.log("ato");
							user.firstName = req.body.firstName
							user.lastName = req.body.lastName
							user.sexe = req.body.sexe
							user.dateNaissance = req.body.dateNaissance
							user.save(function (err) {
								console.log("ato1");
								if (err) { return apiResponse.ErrorResponse(res, err); }
								return apiResponse.successResponseWithData(res, "Vos données ont été mise à jour");
							});
						}else {
							return apiResponse.unauthorizedResponse(res, "L'id n'éxiste pas");
						}
					});
				}	
			}catch (err) {
				console.log("ato mitsy");
				return apiResponse.ErrorResponse(res, err);
			}

		}];

		//récupération d'une source audio 
		exports.getMusicById = [
			(req, res) => {
				MusicModel.find({_id: req.params.id}).then(music => {
					if(music){
							if(music.length == 0){
								return apiResponse.unauthorizedUser(res, "Votre abonnement ne permet pas d'accéder à la ressource");
							}else{
							let donne = {
								songs : music,
								createdAt: new Date(),
								updatedAt: new Date()
							}
						return apiResponse.successResponseWithData(res, "Détails d'une audio" , donne);			
						}
							
				}else{
						return apiResponse.unauthorizedAbonnement(res, "L'id n'existe pas ");
					}
			});
			}];