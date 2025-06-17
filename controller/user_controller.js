const User = require("../models/user_model");
const Profile = require("../models/profile_model");

const bcrypt = require("bcrypt");

class UserController {
    async signup(req, res){
        try {
            const {username, email, password} = req.body;
            const user = await User.create({
                username: username,
                email: email,
                password: await this.hashPassword(password)
            })
            res.redirect('/account/login'); // Redirect to login page after successful signup
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(400).json(error)
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const profiles = await Profile.findAll({ where: { userId: user.id } });
            if (profiles) {
                req.session.profiles = profiles;
            }

            req.session.user = user;
            res.redirect('/'); // Redirect to home page or dashboard
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(400).json(error);
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error logging out:", err);
                return res.status(500).json({ message: "Internal server error" });
            }
            res.redirect('/account/login'); // Redirect to login page after successful logout
        });
    }

    async editProfile(req, res) {
        try {
            const {username, email, password, bio} = req.body;
            const userId = req.session.user.id; // Assuming user ID is stored in session
            
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.username = username || user.username;
            user.email = email || user.email;
            user.bio = bio || user.bio;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt); // Hash new password if provided
            }
            await user.save();

            if (req.file) {
                let profile = new Profile({
                    userId: user.id,
                    profilePictureUrl: '/images/' + req.file.filename // Assuming file upload middleware is used
                });
                await profile.save(); // Save profile data
            }
            const profiles = await Profile.findAll({ where: { userId: user.id } });

            req.session.user = user; // Update session with new user data
            req.session.profiles = profiles; // Update session with new profile data

            // res.json({
            //     message: "Profile updated successfully",
            //     user: user,
            //     profiles: profiles,
            // })
            res.redirect('/account/profile'); // Redirect to profile page after successful edit
        } catch (error) {
            console.error("Error editing profile:", error);
            res.status(400).json(error);
        }
    }

    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            console.error("Error hashing password:", error);
            throw error;
        }
    }
}

module.exports = UserController;