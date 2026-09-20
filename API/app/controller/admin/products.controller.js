const { db } = require("../../config/utill/helper");
const { logError } = require("../../config/utill/logErr");


exports.getProducts = async (req, res) => {
    try{
        const [data] = await db.query("SELECT * FROM aura_products");
        
        res.json({
            data: data,
        });
    }catch(err){
        logError("products.controller", err, res);
    }
}

exports.addProducts = async (req, res) => {
    try{
        const [data] = await db.query("INSERT INTO aura_products");
        res.json({
            data: data,
        });
    }catch(err){
        logError("products.controller", err, res);
    }
}

exports.updateProducts = async (req, res) => {
    try {
        const [data] = await db.query("UPDATA aura_producs");
    }catch(err){
        logError("products.controller", err, res);
    }
}

exports.deleteProducts = async (req, res) => {
    try{
        const [data] = await db.query("DELETE aura_products WHERE id = ");
    }catch(err){
        logError("products.controller", err, res);
    }
}