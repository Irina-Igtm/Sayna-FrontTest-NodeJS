var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	firstName: {
        type: String, required: true
    },
	lastName: {
        type: String, required: true
    },
    sexe: {
        type: String, required: true
    },
    dateNaissance: {
        type: Date, required: true
    },
	email: {
        type: String, required: true
    },
	password: {
        type: String, required: true
    },
    subcription: {
        type: [String],
        required: false,
        defaultValue: []
    },
    role: {
                    type: String,
                    values: ['ADMIN', 'CLIENT'],
                    defaultValue: 'CLIENT',
                    required: true
         },
}, {timestamps: true});

// Virtual for user's full name
UserSchema.virtual("fullName").get(function () {
		return this.firstName + " " + this.lastName;
	});

// userSchema.methods.deleteToken=function(token,cb){
//         var user=this;   
//         user.update({$unset : {token :1}},function(err,user){
//             if(err) return cb(err);
//             cb(null,user);
//         })
    // }

module.exports = mongoose.model("User", UserSchema);