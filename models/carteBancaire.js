var mongoose = require("mongoose");

var CarteSchema = new mongoose.Schema({
	carteNumber: {
        type: String, required: true
    },
	month: {
        type: Number, required: true
    },
    year: {
        type: Number, required: true
    },
    default: {
        type: String, required: false, 
    },
    user_id: {
        type: String, required: true, 
    }

}, {timestamps: true});

// Virtual for user's full name
CarteSchema
	.virtual("carte")
	.get(function () {
		return this.month + " " + this.year;
	});

module.exports = mongoose.model("Carte", CarteSchema);