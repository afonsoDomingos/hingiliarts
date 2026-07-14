const mongoose = require('mongoose');

const BiographySchema = new mongoose.Schema({
    artistName:  { type: String, default: 'Hingili' },
    realName:    { type: String, default: 'Lars dos Santos Chambule' },
    origin:      { type: String, default: 'Maputo, Moçambique' },
    bioText:     { type: [String], default: [
        'Hingili, nome artístico de Lars dos Santos Chambule, é um artista plástico moçambicano, natural de Maputo. Desde jovem demonstrou paixão pelas artes visuais, iniciando a sua formação artística em 2009 na Casa da Cultura do Alto Maé.',
        'Artista multifacetado, Hingili tem-se destacado na produção de murais com forte carga simbólica e social, utilizando técnicas mistas como relevo com cimento, isopor, gesso e acrílico sobre parede ou tela, assim como assemblagem.',
        'Em 2025, participou de duas residências artísticas promovidas pelo Tamos Juntos – Colectivo de Artes e Justiça Climática, onde estreou na técnica de assemblagem abordando injustiça social e justiça climática em escolas moçambicanas.',
        'De 2009 a 2018 trabalhou como colaborador em empresas de pintura publicitária para campanhas de várias marcas em Moçambique. Em 2019 decide difundir o seu talento, expandindo a pintura publicitária às zonas sul, centro e norte do país, tendo em 2021 registado a Hingili Artes Lda.',
        'Em 2025, pintou junto com a sua equipa os murais de campanha TESTA–LÁ HIV nos municípios de KaMavota e Marracuene, e realizou pinturas sacras com destaque para o mural de Jesus e São Pedro No Mar, na Igreja de São Pedro de KaTembe, Guacheni, Cidade de Maputo.',
        'Além da produção de obras visuais, Hingili actua em workshops de artes plásticas e poesia nas línguas Ronga, Changana e Português, promovendo o diálogo entre arte, cultura e identidade moçambicana.'
    ]},
    majorWorks: { type: [{
        year:  { type: String },
        title: { type: String },
        desc:  { type: String }
    }], default: [
        { year: '2026', title: 'E se fosse o seu lar?', desc: 'Mural' },
        { year: '2025', title: 'Violência cibernética baseada no género', desc: 'Mural' },
        { year: '2025', title: 'Ilícito', desc: 'Mural' },
        { year: '2025', title: 'Utopia sonora', desc: 'Mural' },
        { year: '2025', title: 'Jesus e São Pedro No Mar', desc: 'Pintura Sacra — Igreja de São Pedro de KaTembe' },
        { year: '2024', title: 'Patinagem em linha', desc: 'Mural' },
        { year: '2023', title: 'Comunicando com a comunidade', desc: 'Mural' },
        { year: '2021', title: 'Heróis da pátria', desc: 'Mural' },
        { year: '—', title: '(In)verdades', desc: 'Técnica mista — Relevo & Acrílico' },
        { year: '—', title: 'As controvérsias da esperança', desc: 'Técnica mista' },
        { year: '—', title: 'O que vês em mim?', desc: 'Técnica mista' }
    ]},
    awards: { type: [{ year: String, description: String }], default: [
        { year: '2022', description: '3º lugar na categoria de criação artística na 1ª Edição do Concurso Municipal Juventude' }
    ]},
    residencies: { type: [{ year: String, description: String }], default: [
        { year: '2015', description: 'Bienal da CPLP — Representou Moçambique na categoria de Desenho e Pintura' },
        { year: '2025', description: 'Duas residências promovidas pelo Tamos Juntos – Colectivo de Artes e Justiça Climática — Estreia na técnica de assemblagem' }
    ]},
    techniques: { type: [String], default: [
        'Relevo com Cimento', 'Assemblagem', 'Acrílico sobre Tela', 'Pintura Mural',
        'Gesso & Isopor', 'Arte Ecológica', 'Pintura Publicitária', 'Pintura Sacra',
        'Decoração de Interiores', 'Efeito Rocha'
    ]},
    languages: { type: [String], default: ['Português', 'Ronga', 'Changana'] }
}, { timestamps: true });

module.exports = mongoose.model('Biography', BiographySchema);
