export const translations = {
    EN: {
        nav: {
            projects: 'Projects',
            nfts: 'NFTs',
            music: 'Music',
            contact: 'Contact',
            connect: 'Connect',
            portfolio: 'Portfolio',
            roadmap: 'Roadmap',
        },
        hero: {
            quote_1: '"Pain has no form.',
            quote_2: 'But the cure is geometric."',
            title_1: 'Minting',
            title_2: 'The Future',
            subtitle_1: 'Discover the Exemplaria collection.',
            subtitle_2: 'Exclusive Art Pieces Tokenized on the Blockchain.',
            explore: 'Explore',
            listen: 'Listen to Music',
            scroll: 'SCROLL TO EXPLORE',
        },
        universe: {
            subtitle: "Portfolio & Upcoming Mints",
            title_part1: "ALENNA'S",
            title_part2: "PROJECTS",
            description: "Discover the expanding universe of my digital art. From exclusive experimental modules to ongoing creative endeavors, explore the visions shaping the Alenna Art legacy.",
            ongoing: "Ongoing Projects",
            stay_updated: "Stay updated on future mints",
            subscribe: "Subscribe",
            placeholder: "Transmission Address...",
        }
    },
    ES: {
        nav: {
            projects: 'Proyectos',
            nfts: 'NFTs',
            music: 'Música',
            contact: 'Contacto',
            connect: 'Conectar',
            portfolio: 'Portafolio',
            roadmap: 'Hoja de Ruta',
        },
        hero: {
            quote_1: '"El dolor no tiene forma.',
            quote_2: 'Pero la cura es geométrica."',
            title_1: 'Acuñando',
            title_2: 'El Futuro',
            subtitle_1: 'Descubre la colección Exemplaria.',
            subtitle_2: 'Obras exclusivas tokenizadas en la Blockchain.',
            explore: 'Explorar',
            listen: 'Escuchar Música',
            scroll: 'DESLIZA PARA EXPLORAR',
        },
        universe: {
            subtitle: "Portafolio y Próximos Mints",
            title_part1: "PROYECTOS DE",
            title_part2: "ALENNA",
            description: "Descubre el universo en expansión de mi arte digital. Desde módulos experimentales exclusivos hasta esfuerzos creativos continuos, explora las visiones que dan forma al legado de Alenna Art.",
            ongoing: "Proyectos en Curso",
            stay_updated: "Mantente actualizado de futuros mints",
            subscribe: "Suscribirse",
            placeholder: "Dirección de Transmisión...",
        }
    }
};

export type Language = 'EN' | 'ES';
export type TranslationKey = keyof typeof translations['EN'];
