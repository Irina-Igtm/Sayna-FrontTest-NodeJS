var mongoose = require("mongoose");

var AbonnementSchema = new mongoose.Schema({
	cvc: {
        type: Number, required: true
    },
    carte_id: {
        type: String, required: true, 
    },
    type_abonnement: {
        type: String, required: true, 
    },
}, {timestamps: true});

// Virtual for user's full name
AbonnementSchema
	.virtual("abonnement")
	.get(function () {
		return this.cvc;
	});

module.exports = mongoose.model("Abonnement", AbonnementSchema);