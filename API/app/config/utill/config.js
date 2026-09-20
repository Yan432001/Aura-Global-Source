// config.js (updated to include db prefix)
module.exports = {
    config: {
        app_name: "AURAGROUP",
        app_version: "1.0",
        image_path: "",
        db: {
            HOST: "localhost",
            USER: "root",
            PASSWORD: "43200111",
            DATABASE: "aura_v1_db",
            PORT: 3306,
            PREFIX: "aura_" 
        },
        token: {
            access_token_key: "ERTGGGEDSFDRE#5R###@",
        },
    },
};