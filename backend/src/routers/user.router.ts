import { Router } from 'express';
import { User, UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND} from '../constants/http_status';
import { sample_users } from '../data';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Seed Route
router.get("/seed", asyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if (usersCount > 0) {
            res.send("Seed is already done!");
            return;
        }
        await UserModel.create(sample_users);
        res.send("Seed Is Done!");
    }
));

// Login Route
router.post("/login", asyncHandler(
    async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.send(generateTokenReponse(user));
        } else {
            res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
        }
    }
));

// Register Route
router.post('/register', asyncHandler(
    async (req, res) => {
        const { name, email, password, address } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(HTTP_BAD_REQUEST)
                .send('User already exists, please login!');
            return;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
            isAdmin: false
        };

        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenReponse(dbUser));
    }
));

// Update User Route
router.put('/update/:id', asyncHandler(
    async (req, res) => {
        const { id } = req.params;
        const { name, email, password, address, isAdmin } = req.body;

        console.log(name,email,address)

        const user = await UserModel.findById(id);
        if (!user) {
            res.status(HTTP_NOT_FOUND).send('User not found!');
            return;
        }

        const updatedUser = {
            name: name || user.name,
            email: email || user.email,
            password: password ? await bcrypt.hash(password, 10) : user.password,
            address: address || user.address,
            isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin
        };

        await UserModel.findByIdAndUpdate(id, updatedUser, { new: true });
        res.send(generateTokenReponse(user));
    }
));

// Delete User Route
router.delete('/delete/:id', asyncHandler(
    async (req, res) => {
        const { id } = req.params;

        const user = await UserModel.findById(id);
        if (!user) {
            res.status(HTTP_BAD_REQUEST).send('User not found!');
            return;
        }

        await UserModel.findByIdAndDelete(id);
        res.send({ message: 'User deleted successfully' });
    }
));

// Generate Token Response
const generateTokenReponse = (user: User) => {
    const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" }
    );

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
    };
}

router.get('/list/:id', asyncHandler(
    async (req, res) => {
        const { id } = req.params;

        if (!id) {
            res.status(HTTP_BAD_REQUEST).send('User not authenticated!');
            return;
        }

        const users = await UserModel.find({ _id: { $ne: id } });

        res.json(users);
    }
));


export default router;