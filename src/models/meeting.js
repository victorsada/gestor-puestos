const mongoose = require("mongoose");

const meetingSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    amountPeople: {
        type: Number
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Meeting', meetingSchema);