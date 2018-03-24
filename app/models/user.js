const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

let UserSchema = new Schema({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true}
});

// MODIFICAR CONTRASENA
/* UserSchema.pre('save', (next) => {
    let user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
}); */

// COMPARAR CONTRASENAS
UserSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema, 'User');