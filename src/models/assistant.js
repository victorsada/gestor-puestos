const mongoose = require("mongoose");

const assistantSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        lowercase: true
    },
    birthday: {
        type: Date
    },
    adress: {
        type: String
    },
    telf: {
        type: String
    },
    sex: {
        type: String
    },

},
{
    timestamps: true
});

module.exports = mongoose.model('Assistant', assistantSchema);