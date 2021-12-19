var mongoose = require("mongoose");

var TypeAbonnementSchema = new mongoose.Schema({
	libelle: {
        type: String, required: true
    }
	
}, {timestamps: true});

// Virtual for user's full name
TypeAbonnementSchema
	.virtual("type_abonnement")
	.get(function () {
		return this.month + " " + this.year;
	});

module.exports = mongoose.model("TypeAbonnement", TypeAbonnementSchema);