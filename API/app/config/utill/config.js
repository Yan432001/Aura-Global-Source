// config.js (updated to include db prefix)
module.exports = {
    config: {
        app_name: "AURAGROUP",
        app_version: "1.0",
        image_path: "",
        db: {
            HOST: process.env.DB_HOST || "localhost",
            USER: process.env.DB_USER || "root",
            PASSWORD: process.env.DB_PASSWORD || "43200111",
            DATABASE: process.env.DB_NAME || "bpas_v6_8_9_db",
            PORT: Number(process.env.DB_PORT || 3306),
            PREFIX: "bpas_" 
        },
        token: {
            access_token_key: "ERTGGGEDSFDRE#5R###@",
        },
    },
};