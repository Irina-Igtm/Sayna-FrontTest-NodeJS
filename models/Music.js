var mongoose = require("mongoose");

var MusicSchema = new mongoose.Schema({
	name: {
        type: String, required: true
    },
	url: {
        type: String, required: false
    },
    cover: {
        type: Boolean, required: false
    },
    time: {
        type: String, required: true
    },
	type: {
        type: String, required: true
    }
}, {timestamps: true});

// Virtual for user's full name
MusicSchema.virtual("music").get(function () {
		return this.name + " " + this.type;
	});

module.exports = mongoose.model("Music", MusicSchema);