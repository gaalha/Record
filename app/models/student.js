const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StudentSchema = new Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true}
});


module.exports = mongoose.model('Student', StudentSchema, 'Student');