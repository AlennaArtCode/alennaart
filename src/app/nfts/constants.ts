import { ShieldCheck, Key, Zap, Users, TrendingUp, Gem } from 'lucide-react';

export const RARITY_COLOR: Record<string, string> = {
    Legendary: '#FFD700',
    Epic: '#9B59B6',
    Rare: '#4DA6FF',
};

// AURUM GENESIS — static collection data
export const AURUM_GENESIS = [
    {
        id: 'ag-001',
        num: '#001',
        name: 'The Emergence',
        edition: '1 / 50',
        rarity: 'Legendary',
        image: '/nfts/aurum-genesis-001.png',
        desc: 'El primer grito del universo de Alenna cristalizado en forma digital. La diosa emerge del oro líquido para marcar el inicio de una nueva era en el arte generacional.',
        traits: ['Aura: Gold Genesis', 'Background: Void', 'Crown: Sacred Arch'],
        color: '#C5A059',
    },
    {
        id: 'ag-002',
        num: '#002',
        name: 'The Geometry',
        edition: '1 / 50',
        rarity: 'Epic',
        image: '/nfts/aurum-genesis-002.png',
        desc: 'El lenguaje secreto del universo codificado en geometría sagrada. Cada patrón es una puerta, cada ángulo una respuesta a preguntas que el mundo aún no ha formulado.',
        traits: ['Aura: Aurora', 'Background: Cosmic', 'Pattern: Sacred'],
        color: '#9B59B6',
    },
    {
        id: 'ag-003',
        num: '#003',
        name: 'The Oracle',
        edition: '1 / 50',
        rarity: 'Epic',
        image: '/nfts/aurum-genesis-003.png',
        desc: 'La que ve más allá del velo. The Oracle guarda los secretos de lo que viene. Ser su dueño no es poseer una imagen — es ser invitado a la visión.',
        traits: ['Aura: Prophetic', 'Background: Mystic Ink', 'Element: Runes'],
        color: '#E67E22',
    },
];

// NFT Story timeline
export const NFT_STORY = [
    {
        year: '1993',
        title: 'El Arte Tiene Dueño... Pero No Lo Puedes Probar',
        body: 'Durante décadas, los artistas digitales crearon obras que el mundo amaba pero no podía poseer de verdad. Cualquiera podía copiar un archivo. Nada diferenciaba al original de la réplica. El arte digital existía en un limbo: famoso, pero sin valor comprobable.',
        color: '#C5A059',
    },
    {
        year: '2009',
        title: 'Nace la Blockchain: El Notario del Universo Digital',
        body: 'Con Bitcoin apareció algo radical: un registro público, inmutable e incorruptible que nadie controla y todos pueden verificar. Por primera vez en la historia, "esto es mío" podía ser una verdad matemática — no una promesa legal.',
        color: '#4DA6FF',
    },
    {
        year: '2017',
        title: 'Los NFTs: Cuando el Arte Digital Encontró Su Prueba',
        body: 'Los Non-Fungible Tokens adaptaron esa tecnología para el arte. Cada pieza recibe un certificado único en la cadena: serial, historial de dueños, fecha de creación. No importa cuántas copias haya — la blockchain sabe cuál es el original. Y ese original, es tuyo.',
        color: '#9B59B6',
    },
    {
        year: 'Hoy',
        title: 'Coleccionar es Creer en Algo Antes de Que Todos Lo Vean',
        body: 'Los grandes coleccionistas del arte siempre tuvieron una habilidad: reconocer el talento antes de que se hiciera famoso. Hoy, los NFTs democratizan ese privilegio. No necesitas ser millonario para ser el primero. Solo necesitas ver lo que otros aún no ven.',
        color: '#E67E22',
    },
];

export const UTILITY_CARDS = [
    {
        icon: ShieldCheck,
        color: '#C5A059',
        title: 'Propiedad Real y Verificada',
        body: 'La blockchain registra que esa pieza es tuya. Sin contratos, sin abogados, sin intermediarios. El código es la ley, y la ley dice: esto es tuyo.',
    },
    {
        icon: Key,
        color: '#9B59B6',
        title: 'Acceso al Círculo Interno',
        body: 'Los holders de AURUM GENESIS tienen acceso prioritario a drops exclusivos, eventos privados, y la comunidad cerrada. Una llave que no caduca.',
    },
    {
        icon: Zap,
        color: '#4DA6FF',
        title: 'Más Que Una Imagen',
        body: 'Tu NFT puede ser tu entrada a conciertos, ediciones físicas firmadas, o el pase para la siguiente temporada de contenido. Es un activo de membresía.',
    },
    {
        icon: TrendingUp,
        color: '#E74C3C',
        title: 'Arte con Historia Creciente',
        body: 'Ser el primero tiene un valor que el tiempo confirma. Cada holder de la génesis es parte de la historia documentada en la cadena — para siempre.',
    },
    {
        icon: Users,
        color: '#2ECC71',
        title: 'Una Comunidad de Fundadores',
        body: 'Hay algo que dinero no compra: el status de haber creído primero. Ser holder desde el inicio es pertenecer a un grupo que existirá en los archivos de este universo.',
    },
    {
        icon: Gem,
        color: '#F39C12',
        title: 'Regalías que nos Unen',
        body: 'Cada vez que una pieza se revende, quien la creó recibe regalías automáticas. Eso convierte a cada coleccionista en un aliado directo del artista.',
    },
];
