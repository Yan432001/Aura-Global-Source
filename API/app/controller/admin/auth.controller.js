

const { db, access_token_key } = require("../../config/utill/helper");
const { logError } = require("../../config/utill/logErr");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
// const Auth_Model = require("../../models/admins/auth.model");



// auth  or user  
exports.profile = async (req, res) => {
    try{
        res.json({
            profile: req.profile
        })
    }catch (err) {
        logError("profile.controller", err, res);
    }
}


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const query = "SELECT * FROM aura_users WHERE username = :username";
        const [data] = await db.query(query, { 
            username: username,
        });  
        if (data.length === 0) {
            res.json({
                error: {
                    message: "Username is incorrect",
                }
            })    
            
        }else {
            const isPass = data[0].password;
            const isCurrent =  bcrypt.compare(password, isPass); // true or false
            if (!isCurrent) {
                res.json({
                    error: {
                        message: "Password is incorrect",
                    }
                })
            }else {
                let obj = {
                    profile: data[0],
                    permissions : ['view','add', 'edit', 'delete'],
                }
                res.json({ 
                    success: true, 
                    ...obj,
                    access_token: await getAccessToken(obj),
                });
            }
        }
    } catch (err) {
        logError("login.controller", err, res);
    }   
};
const getAccessToken = async (data) => {
    const acess_toek = await jwt.sign({data: data}, access_token_key, {expiresIn: "1d"});
    return acess_toek;
}

exports.token_key_login = () => {
    // call in midleware in  route (role route, user route, teacher rout)
    return (req, res, next)  => {
        var authorization = req.headers.authorization; // token from client 
        var token_from_client = null;

        if (authorization != null && authorization != ""){
            token_from_client = authorization.split(" "); // authorization : "Bearer key token (ERTGGGEDSFDRE#5R###@ alraeady bycrypt)"
            token_from_client = token_from_client[1]; // get only access_token 
        }
        if (token_from_client == null){
            res.status(401).send({
                message: "Unauthorized",
            });
        }else{
            jwt.verify(token_from_client, access_token_key, (error, result) => {
                if(error){
                    res.status(401).send({
                        message: "Unauthorized",
                        error: error,
                    })
                }else{
                    req.current_id = result.data.profile.id; // write user property
                    req.profile = result.data.profile; // write user property
                    req.permissions = result.data.permissions; // write user property
                    next(); // continue controller 
                }
            })
        }

    }
}

exports.register = async (req, res) => {
    try {

        const { 
            username,
            password,
            first_name,
            last_name,
            email
        } = req.body;

        // Validate required fields
        if (!username || !password || !first_name || !last_name || !email) {
            return res.status(400).json({
                error: "username, password, first_name, last_name, email are required"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get client IP
        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // Timestamp
        const created_on = Math.floor(Date.now() / 1000);

        // Simple insert object
        const userObj = {
            group_id: 3,
            first_name,
            last_name,
            username,
            password: hashedPassword,
            email,
            active: 1,
            ip_address: clientIp,
            last_ip_address: clientIp,
            created_on
        };

        const sql = `
            INSERT INTO aura_users
            (group_id, first_name, last_name, username, password, email, active, ip_address, last_ip_address, created_on)
            VALUES
            (:group_id, :first_name, :last_name, :username, :password, :email, :active, :ip_address, :last_ip_address, :created_on)
        `;

        const [result] = await db.query(sql, userObj);

        res.json({
            success: true,
            message: "User registered successfully",
            user_id: result.insertId
        });

    } catch (err) {

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "Username or email already exists"
            });
        }

        logError("auth.register", err, res);
    }
};


// exports.register = async (req, res) => {
//     try {
//         const requiredFields = ['username', 'password', 'first_name', 'last_name', 'email'];
//         for (const field of requiredFields) {
//             if (!req.body[field]) {
//                 return res.status(400).json({
//                     error: `${field} is required`
//                 });
//             }
//         }

//         // Hash password
//         const hashedPassword = bcrypt.hashSync(req.body.password, 10);

//         // Get current timestamp in MySQL format
//         const created_on = new Date().toISOString().slice(0, 19).replace('T', ' ');

//         // Fix: Changed VALUE to VALUES
//         const sql = `INSERT INTO aura_users (
//             group_id,
//             emp_id,
//             emp_code,
//             first_name,
//             last_name,
//             username,
//             password,
//             gender,
//             company,
//             phone,
//             email,
//             biller_id,
//             multi_biller,
//             warehouse_id,
//             company_id,
//             show_cost,
//             show_price,
//             view_right,
//             edit_right,
//             allow_discount,
//             language,
//             active,
//             last_login,
//             last_ip_address,
//             ip_address,
//             pin_code,
//             salt,
//             activation_code,
//             forgotten_password_code,
//             forgotten_password_time,
//             remember_code,
//             created_on,
//             avatar,
//             nationality,
//             position,
//             employeed_date,
//             user_type,
//             award_points,
//             expired_date,
//             zone_id,
//             multi_zone,
//             save_point,
//             is_remote_allow,
//             basic_salary,
//             commission,
//             commission_product,
//             saleman_group_id,
//             saleman_group,
//             saleman_commission,
//             salesman_area,
//             share_commissions,
//             payroll_option,
//             signature,
//             technician,
//             password_reset_code,
//             product_commission_id,
//             fuel_time_id,
//             money_change
//         ) VALUES (
//             :group_id,
//             :emp_id,
//             :emp_code,
//             :first_name,
//             :last_name,
//             :username,
//             :password,
//             :gender,
//             :company,
//             :phone,
//             :email,
//             :biller_id,
//             :multi_biller,
//             :warehouse_id,
//             :company_id,
//             :show_cost,
//             :show_price,
//             :view_right,
//             :edit_right,
//             :allow_discount,
//             :language,
//             :active,
//             :last_login,
//             :last_ip_address,
//             :ip_address,
//             :pin_code,
//             :salt,
//             :activation_code,
//             :forgotten_password_code,
//             :forgotten_password_time,
//             :remember_code,
//             :created_on,
//             :avatar,
//             :nationality,
//             :position,
//             :employeed_date,
//             :user_type,
//             :award_points,
//             :expired_date,
//             :zone_id,
//             :multi_zone,
//             :save_point,
//             :is_remote_allow,
//             :basic_salary,
//             :commission,
//             :commission_product,
//             :saleman_group_id,
//             :saleman_group,
//             :saleman_commission,
//             :salesman_area,
//             :share_commissions,
//             :payroll_option,
//             :signature,
//             :technician,
//             :password_reset_code,
//             :product_commission_id,
//             :fuel_time_id,
//             :money_change
//         )`;

//         const [data] = await db.query(sql, {
//             group_id: req.body.group_id || 3, // Default user group
//             emp_id: req.body.emp_id || 0,
//             emp_code: req.body.emp_code || null,
//             first_name: req.body.first_name,
//             last_name: req.body.last_name,
//             username: req.body.username,
//             password: hashedPassword,
//             gender: req.body.gender || null,
//             company: req.body.company || null,
//             phone: req.body.phone || null,
//             email: req.body.email,
//             biller_id: req.body.biller_id || null,
//             multi_biller: req.body.multi_biller || null,
//             warehouse_id: req.body.warehouse_id || 0,
//             company_id: req.body.company_id || null,
//             show_cost: req.body.show_cost || 0,
//             show_price: req.body.show_price || 0,
//             view_right: req.body.view_right || 0,
//             edit_right: req.body.edit_right || 0,
//             allow_discount: req.body.allow_discount || 0,
//             language: req.body.language || 'english',
//             active: req.body.active ?? 1,
//             last_login: req.body.last_login || null,
//             last_ip_address: req.body.last_ip_address || null,
//             ip_address: req.body.ip_address || null,
//             pin_code: req.body.pin_code || null,
//             salt: req.body.salt || null,
//             activation_code: req.body.activation_code || null,
//             forgotten_password_code: req.body.forgotten_password_code || null,
//             forgotten_password_time: req.body.forgotten_password_time || null,
//             remember_code: req.body.remember_code || null,
//             created_on: created_on, // Fixed timestamp format
//             avatar: req.body.avatar || null,
//             nationality: req.body.nationality || null,
//             position: req.body.position || null,
//             employeed_date: req.body.employeed_date || null,
//             user_type: req.body.user_type || null,
//             award_points: req.body.award_points || 0,
//             expired_date: req.body.expired_date || null,
//             zone_id: req.body.zone_id || null,
//             multi_zone: req.body.multi_zone || null,
//             save_point: req.body.save_point || 0,
//             is_remote_allow: req.body.is_remote_allow || 0,
//             basic_salary: req.body.basic_salary || 0,
//             commission: req.body.commission || 0,
//             commission_product: req.body.commission_product || null,
//             saleman_group_id: req.body.saleman_group_id || null,
//             saleman_group: req.body.saleman_group || null,
//             saleman_commission: req.body.saleman_commission || 0,
//             salesman_area: req.body.salesman_area || null,
//             share_commissions: req.body.share_commissions || 0,
//             payroll_option: req.body.payroll_option || null,
//             signature: req.body.signature || null,
//             technician: req.body.technician || 0,
//             password_reset_code: req.body.password_reset_code || null,
//             product_commission_id: req.body.product_commission_id || null,
//             fuel_time_id: req.body.fuel_time_id || null,
//             money_change: req.body.money_change || 0,
//         });

//         res.json({
//             success: true,
//             message: "User registered successfully",
//             userId: data.insertId
//         });

//     } catch (err) {
//         // Log the actual error for debugging
//         console.error("Registration error details:", err);

//         // Handle specific errors
//         if (err.code === 'ER_NO_DEFAULT_FOR_FIELD') {
//             return res.status(400).json({
//                 error: 'Missing required field: ' + err.sqlMessage
//             });
//         }

//         if (err.code === 'ER_DUP_ENTRY') {
//             return res.status(409).json({
//                 error: 'Username or email already exists'
//             });
//         }

//         logError('add.auth.controller', err, res);
//     }
// }


// exports.register_test = async (req, res) => {
//     try {
//         const clientIp = getClientIp(req);

//         const required = ['username', 'password', 'email', 'first_name', 'last_name'];
//         for (const field of required) {
//             if (!req.body[field]) {
//                 return res.status(400).json({ error: `${field} required` });
//             }
//         }

//         const hashedPassword = bcrypt.hashSync(req.body.password, 10);
//         const created_on = new Date();

//         const sql = `
//         INSERT INTO aura_users (
//             first_name,
//             last_name,
//             username,
//             password,
//             email,
//             group_id,
//             active,
//             ip_address,
//             last_ip_address,
//             created_on
//         ) VALUES (
//             :first_name,
//             :last_name,
//             :username,
//             :password,
//             :email,
//             :group_id,
//             :active,
//             :ip_address,
//             :last_ip_address,
//             :created_on
//         )`;

//         const [data] = await db.query(sql, {
//             first_name: req.body.first_name,
//             last_name: req.body.last_name,
//             username: req.body.username,
//             password: hashedPassword,
//             email: req.body.email,
//             group_id: req.body.group_id || 3,
//             active: req.body.active ?? 1,
//             ip_address: clientIp,
//             last_ip_address: clientIp,
//             created_on
//         });

//         res.json({ success: true, id: data.insertId });

//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.editAuth = async (req, res) => {
//     try {
//         const sql = `UPDATE aura_users SET
//                     group_id:group_id,
//                     emp_id:emp_id,
//                     emp_code:emp_code,
//                     first_name:first_name,
//                     last_name:last_name,
//                     username:username,
//                     password:password,
//                     gender:gender,
//                     company:company,
//                     phone:phone,
//                     email:email,
//                     biller_id:biller_id,
//                     multi_biller:multi_biller,
//                     warehouse_id:warehouse_id,
//                     company_id:company_id,
//                     show_cost:show_cost,
//                     show_price:show_price,
//                     view_right:view_right,
//                     edit_right:edit_right,
//                     allow_discount:allow_discount,
//                     language:language,
//                     active:active,
//                     last_login:last_login,
//                     last_ip_address:last_ip_address,
//                     ip_address:ip_address,
//                     pin_code:pin_code,
//                     salt:salt,
//                     activation_code:activation_code,
//                     forgotten_password_code:forgotten_password_code,
//                     forgotten_password_time:forgotten_password_time,
//                     remember_code:remember_code,
//                     created_on:created_on,
//                     avatar:avatar,
//                     nationality:nationality,
//                     position:position,
//                     employeed_date:employeed_date,
//                     user_type:user_type,
//                     award_points:award_points,
//                     expired_date:expired_date,
//                     zone_id:zone_id,
//                     multi_zone:multi_zone,
//                     save_point:save_point,
//                     is_remote_allow:is_remote_allow,
//                     basic_salary:basic_salary,
//                     commission:commission,
//                     commission_product:commission_product,
//                     saleman_group_id:saleman_group_id,
//                     saleman_group:saleman_group,
//                     saleman_commission:saleman_commission,
//                     salesman_area:salesman_area,
//                     share_commissions:share_commissions,
//                     payroll_option:payroll_option,
//                     signature:signature,
//                     technician:technician,
//                     password_reset_code:password_reset_code,
//                     product_commission_id:product_commission_id,
//                     fuel_time_id:fuel_time_id,
//                     money_change:money_change 
//                     WHERE id=:id

//                 `;
//         const [data] = await db.query(sql, req.body);

//         res.json({ success: true, data });


//     } catch (err) {
//         logError('edit.auth.controlle', err, res);
//     }
// }
// exports.deleteAuth = async (req, res) => {
//     try {
//         const sql = "DELETE FROM aura_users WHERE id = :id";
//         const [data] = await db.query(sql, { id: req.body.id });

//         res.json({ success: true, data });
//     } catch (err) {
//         logError("delete.auth.controller", err, res);
//     }
// }






















// permission Groups  
// exports.getGroups = async (req, res) => {
//     try {
//         const [data] = await db.query("SELECT * FROM aura_groups");
//         res.json({
//             data: data,
//         });
//     } catch (err) {
//         logError("get.groups.controller", err, res);
//     }
// }
// exports.addGroups = async (req, res) => {
//     try {
//         const insert_sql = `INSERT INTO aura_groups (name, description, status) VALUES (:name, :description, :status)`;
//         const [data] = await db.query(insert_sql, {
//             name: req.body.name,
//             description: req.body.description,
//             status: req.body.status || 0
//         });
//         res.json({ success: true, data });
//     } catch (err) {
//         logError('add.groups.controller', err, res);
//     }
// }
// exports.updateGroups = async (req, res) => {
//     try {
//         const sql = `
//       UPDATE aura_groups 
//       SET name=:name, description=:description, status=:status 
//       WHERE id=:id
//     `;

//         const [data] = await db.query(sql, req.body);

//         res.json({ success: true, data });
//     } catch (err) {
//         logError("edit.groups.controller", err, res);
//     }
// };
// exports.deleteGroups = async (req, res) => {
//     try {
//         const sql = "DELETE FROM aura_groups WHERE id = :id";
//         const [data] = await db.query(sql, { id: req.body.id });

//         res.json({ success: true, data });
//     } catch (err) {
//         logError("delete.groups.controller", err, res);
//     }
// };

