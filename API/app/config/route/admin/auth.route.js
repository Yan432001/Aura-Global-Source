const { 
        profile, 
        register, 
        // editAuth, 
        // deleteAuth,
        // getGroups,
        // addGroups,
        // updateGroups,
        // deleteGroups,
        // register_test,
        login,
        // proFile,
        token_key_login,
    } = require("../../../controller/admin/auth.controller");
module.exports = (app) => {
    app.post("/api/auth/profile", token_key_login(), profile);
    app.post("/api/auth/register", token_key_login(), register);
    app.post("/api/auth/login", login);
    // app.post("/api/auth/test", register_test);
    // app.post("/api/auth/profile", proFile);
    // app.post("/api/auth/profile",  proFile);
    // app.put("/api/auth", editAuth);
    // app.delete("/api/auth", deleteAuth);
    // app.get("/api/auth/groups", getGroups);
    // app.post("/api/auth/groups", addGroups);
    // app.put("/api/auth/groups", updateGroups);
    // app.delete("/api/auth/groups", deleteGroups);
};