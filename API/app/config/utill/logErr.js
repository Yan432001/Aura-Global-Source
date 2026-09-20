const fs = require("fs/promises");
const moment = require("moment");

exports.logError = async (controller, message_err, res) => {
    try{
        const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");  // ← This will work
        const path = "./error/" + controller + ".txt";
        const logMessage = "[" + timestamp + "]" + message_err + "\n";
        await fs.appendFile(path, logMessage);
    }catch(err){
        console.error("Error Writting to log file:", err);
    }
   
    res.status(500).json({ error: message_err.message });
};
// npm install moment    // is time 
// create new folder name logs 
