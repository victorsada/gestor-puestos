const Meeting = require("../models/meeting");

module.exports.createMeeting = async (req,res) => {
    try {
        const meeting = new Meeting(req.body);    
        if(!meeting){
           throw new Error("bad request");
        }
        await meeting.save();
        res.status(200).send(meeting);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

module.exports.getMeeting = async (req,res) => {
    const meeting = await Meeting.find();
    res.send(meeting);
}