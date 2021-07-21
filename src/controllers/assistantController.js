const Assistant = require("../models/assistant");

module.exports.createAssistant = async (req,res) => {
    try {
        const assistant = new Assistant(req.body);    
        if(!assistant){
           throw new Error("bad request");
        }
        await assistant.save();
        res.status(200).send(assistant);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

module.exports.getAssistat = async (req,res) => {
    const assistant = await Assistant.find();
    res.send(assistant);
}