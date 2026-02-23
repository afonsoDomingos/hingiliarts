// Pega automaticamente a URL correcta conforme o ambiente
// Em desenvolvimento (npm run dev): usa localhost
// Em produção (Vercel): usa a variável VITE_API_URL definida no painel do Vercel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
