const db = require("../db/index");
const nodemailer = require("nodemailer");

const addUser = async (req,res) => {
    try {
        const { user_firstname, user_lastname, user_phone, user_location, pref_start_work_hour, pref_end_work_hour, account_id } = req.body.user;
        const newUser = await db.query(
            "INSERT INTO users (user_firstname, user_lastname, user_phone, user_location, pref_start_work_hour, pref_end_work_hour, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [user_firstname, user_lastname, user_phone, user_location, pref_start_work_hour, pref_end_work_hour, account_id]
        );
        res.status(201).json(newUser.rows[0]);
        emailVerification(newUser.rows[0]['user_id']);
    } catch (err) {
        console.log(err);
    }
}

//Send Email Verification
const emailVerification = async (req) => {
    try {

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
            },
        });
        ///Use token with email things
        
        /////////////Test
        const user_id = req.body;
        const q = await db.query("SELECT email From account NATURAL INNER JOIN users WHERE user_id = $1",[user_id]);
        const email = q.rows[0]['email'];
        // console.log(username);
        const url = `http://localhost:3000/confirmation/${user_id}`;

        let info = await transporter.sendMail({
            from: '"SYNCLINK" <synclink@comp.com>', // sender address
            to: `${email}`, // list of receivers
            subject: "Validate", // Subject line
            text: "Validate your account.", // plain text body
            html: `<b>${url}</b>`, // html body
          });

        console.log(info);
    } catch (err) {
        console.log(err);
    }
}

const getAllUsers = async (req,res) => {
    try {
        const allUsers = await db.query("SELECT * FROM users");
        res.status(200).json({
            status: "success",
            results: allUsers.rows.length,
            data: {
                users: allUsers.rows
            },
        });
    } catch (err) {
        console.log(err);
    }
}

const getUserById = async (req,res) => {
    try {
        const user = await db.query("SELECT * FROM users WHERE user_id = $1", [req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                user: user.rows[0]
            },
        });
    } catch (err) {
        console.log(err);
    }
}

// add search gets

const updateUser = async (req,res) => {
    try {
        const { user_firstname, user_lastname, user_phone, pref_start_work_hour, pref_end_work_hour, user_location } = req.body;
        const result = await db.query(
            "UPDATE users SET user_firstname = $1, user_lastname = $2, user_phone = $3, user_location = $4, pref_start_work_hour = $5, pref_end_work_hour = $6 WHERE user_id = $7 RETURNING *",
            [user_firstname, user_lastname, user_phone, user_location, pref_start_work_hour, pref_end_work_hour, req.params.id]
            ); 

        res.status(200).json({
            status: "success",
            data: {
                user: result.rows[0]
            },
        });
    } catch (err) {
        console.log(err);
    }
}

const deleteUser = async (req,res) => {
    try {
        const result = await db.query("DELETE FROM user_schedule WHERE user_id = $1", [req.params.id])
        res.status(204).json({
            status: "success",
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}