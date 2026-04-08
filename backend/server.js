const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const Project = require('./models/Project');
const Message = require('./models/Message');
const User = require('./models/User');
const Auction = require('./models/Auction');
const VisitorStamp = require('./models/VisitorStamp');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// Rate Limiting para o login (protege contra ataques de força bruta)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // limite de 10 tentativas por IP
    message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://hingiliarts.vercel.app',
    'https://www.hingiliartes.com',
    'https://hingiliartes.com',
    process.env.FRONTEND_URL,
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
        console.warn(`⚠️ CORS bloqueado para: ${origin}`);
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
                email: process.env.ADMIN_EMAIL || 'admin@hingiliarts.com',
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

// --- Auction Routes ---

// Public: Get All Auctions (Only active/approved)
app.get('/api/auctions', async (req, res) => {
    try {
        const auctions = await Auction.find({ status: { $in: ['active', 'scheduled'] } }).sort({ endTime: 1 });
        res.json(auctions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public: Artist Submit Auction
app.post('/api/auctions/submit', upload.single('image'), async (req, res) => {
    try {
        const { title, description, startingPrice, endTime, artistName, artistContact } = req.body;
        const imageUrl = req.file ? req.file.path : '';

        if (!imageUrl) return res.status(400).json({ message: 'Imagem é obrigatória' });

        const newAuction = new Auction({
            title,
            description,
            startingPrice,
            currentPrice: startingPrice,
            endTime,
            imageUrl,
            artistName,
            artistContact,
            status: 'pending' // Always pending until admin approves
        });

        await newAuction.save();
        res.status(201).json({ message: 'Proposta enviada com sucesso! Aguarde pela aprovação do administrador.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Public: Get Single Auction
app.get('/api/auctions/:id', async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) return res.status(404).json({ message: 'Leilão não encontrado' });
        res.json(auction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public: Place a Bid
app.post('/api/auctions/:id/bid', async (req, res) => {
    const { bidderName, email, amount } = req.body;
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) return res.status(404).json({ message: 'Leilão não encontrado' });

        if (auction.status !== 'active') {
            return res.status(400).json({ message: 'Este leilão não está ativo' });
        }

        if (new Date() > auction.endTime) {
            auction.status = 'ended';
            await auction.save();
            return res.status(400).json({ message: 'Este leilão já terminou' });
        }

        const minBid = (auction.currentPrice || auction.startingPrice) + 1;
        if (amount < minBid) {
            return res.status(400).json({ message: `A licitação deve ser de pelo menos ${minBid} MT` });
        }

        auction.currentPrice = amount;
        auction.highestBidder = { name: bidderName, email };
        auction.bids.push({ bidderName, amount, timestamp: new Date() });

        await auction.save();
        res.json(auction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public: Increment Auction Views
app.post('/api/auctions/:id/view', async (req, res) => {
    try {
        await Auction.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public: Toggle/Increment Auction Likes
app.post('/api/auctions/:id/like', async (req, res) => {
    try {
        const auction = await Auction.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.json({ likes: auction.likes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Public: Submit Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new Message(req.body);
        await newMessage.save();

        // Configuração do Nodemailer (opcional no .env)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || 'hingiliarteslda@gmail.com',
                subject: `Nova Mensagem: ${name}`,
                text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`
            };

            transporter.sendMail(mailOptions).catch(err => console.log('Mail error:', err));
        }

        res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso!' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- Visitor Mural Routes ---

// Public: Get Stamps
app.get('/api/stamps', async (req, res) => {
    try {
        console.log('📬 GET /api/stamps - Buscando selos...');
        const stamps = await VisitorStamp.find().sort({ createdAt: -1 }).limit(50);
        res.json(stamps);
    } catch (err) {
        console.error('❌ Erro ao buscar selos:', err);
        res.status(500).json({ message: err.message });
    }
});

// Public: Add Stamp
app.post('/api/stamps', async (req, res) => {
    try {
        const { name } = req.body;
        console.log(`🖋️ POST /api/stamps - Novo carimbo de: ${name}`);

        if (!name) {
            console.warn('⚠️ Nome ausente na requisição /api/stamps');
            return res.status(400).json({ message: 'Nome é obrigatório' });
        }

        const newStamp = new VisitorStamp({
            name,
            styleIndex: Math.floor(Math.random() * 12)
        });

        await newStamp.save();
        console.log('✅ Carimbo salvo com sucesso!', newStamp._id);
        res.status(201).json(newStamp);
    } catch (err) {
        console.error('❌ Erro ao salvar carimbo:', err);
        res.status(400).json({ message: err.message });
    }
});

// Admin: Auth Login
app.post('/api/admin/login', loginLimiter, async (req, res) => {
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

// Admin: Update Project
app.put('/api/admin/projects/:id', protect, upload.array('images', 5), async (req, res) => {
    try {
        const { title, category, description } = req.body;

        // Criamos o objeto de atualização apenas com o que foi enviado
        let updateData = {};
        if (title) updateData.title = title;
        if (category) updateData.category = category;
        if (description !== undefined) updateData.description = description;

        // Se houver novas imagens, anexamos
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            const project = await Project.findById(req.params.id);
            if (project) {
                updateData.images = [...(project.images || []), ...newImages];
            }
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Projeto não encontrado' });
        }

        res.json(updatedProject);
    } catch (err) {
        console.error('Update Error:', err);
        res.status(400).json({ message: err.message });
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

// Admin: Get All Auctions (Including Pending)
app.get('/api/admin/auctions', protect, async (req, res) => {
    try {
        const auctions = await Auction.find().sort({ createdAt: -1 });
        res.json(auctions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Approve/Reject Auction
app.patch('/api/admin/auctions/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'rejected', 'ended'].includes(status)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }
        const auction = await Auction.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(auction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Auction Management
app.post('/api/admin/auctions', protect, upload.single('image'), async (req, res) => {
    try {
        const { title, description, startingPrice, endTime } = req.body;
        const imageUrl = req.file ? req.file.path : '';

        if (!imageUrl) return res.status(400).json({ message: 'Imagem é obrigatória' });

        const newAuction = new Auction({
            title,
            description,
            startingPrice,
            currentPrice: startingPrice,
            endTime,
            imageUrl
        });

        await newAuction.save();
        res.status(201).json(newAuction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/admin/auctions/:id', protect, async (req, res) => {
    try {
        await Auction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leilão removido' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: User/Admin Management
app.get('/api/admin/users', protect, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/admin/users', protect, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Este email já está registado.' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ _id: newUser._id, name: newUser.name, email: newUser.email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/admin/users/:id/password', protect, async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
        
        res.json({ message: 'Senha atualizada com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/admin/users/:id', protect, async (req, res) => {
    try {
        if (req.params.id === req.userId) {
            return res.status(400).json({ message: 'Não pode eliminar o seu próprio utilizador.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Administrador removido' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
