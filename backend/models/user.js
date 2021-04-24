var mongoose          = require('mongoose');
var bcrypt            = require('bcryptjs');
var randtoken         = require('rand-token');

generatePin = function() {
  return Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
}

var userSchema = mongoose.Schema({
  username : String,
  password : String,
  language : { type: String, default: "nl" },
  organisation: String
},
{
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified'
  }
});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);


