const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const Project = require('./models/Project');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL, // Ex: https://hingiliarts.vercel.app
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Sem origin (Postman, curl) → permite
        if (!origin) return callback(null, true);

        // Origin na whitelist → permite
        if (allowedOrigins.includes(origin)) return callback(null, true);

        // Qualquer subdomínio .vercel.app → permite (segurança adicional para deploys preview)
        if (origin.endsWith('.vercel.app')) return callback(null, true);

        // Bloqueia tudo o resto
        callback(new Error(`CORS bloqueado para: ${origin}`));
    },
    credentials: true
}));


app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('MongoDB Connection Error ❌:', err));

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hingile_portfolio',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const upload = multer({ storage: storage });

// Admin Seeder
const seedAdmin = async () => {
    try {
        const adminCount = await User.countDocuments();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
            await User.create({
                email: process.env.ADMIN_EMAIL || 'admin@hingilearts.com',
                password: hashedPassword,
                name: 'Hingili Admin'
            });
            console.log('Admin user seeded ✨');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
};
seedAdmin();

// --- Routes ---

// Public: Get Portfolio
app.get('/api/portfolio', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public: Submit Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso!' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Admin: Auth Login
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to protect admin routes
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Não autorizado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

// Admin: CRUD Projects
app.post('/api/admin/projects', protect, upload.array('images', 5), async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path);
        const newProject = new Project({
            ...req.body,
            images: imageUrls
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/admin/projects/:id', protect, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Projeto removido' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/admin/messages', protect, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
