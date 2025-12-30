export type GalleryItem = {
    id: string;
    title: string;
    subtitle: string;
    imageFileName: string;
    description: string;
    rarity: string;
};

export type GalleryCategory = {
    category: string;
    items: GalleryItem[];
};

export const galleryData: GalleryCategory[] = [
    {
        category: "THE TRINITY",
        items: [
            {
                id: "001",
                title: "KAISER",
                subtitle: "El Soberano de la Red Áurea",
                imageFileName: "image_9867e8.jpg",
                description: "El punto cero. El arquitecto silencioso que observa desde el trono digital.",
                rarity: "Legendary"
            },
            {
                id: "002",
                title: "LEGATUS",
                "subtitle": "El Rostro de la Diplomacia Digital",
                imageFileName: "Mask Sin fondo.jpg",
                description: "No es humano, es lo que viene después de nosotros. Testigo de polígonos áureos.",
                rarity: "Legendary"
            },
            {
                id: "003",
                title: "ORIGO",
                subtitle: "La Semilla Cero",
                imageFileName: "1 Sin Fondo.jpg",
                description: "El plano maestro de la existencia. Donde nace y muere la eternidad.",
                rarity: "Legendary"
            }
        ]
    },
    {
        category: "SACRED GEOMETRY",
        items: [
            {
                id: "004",
                title: "AEGIS",
                subtitle: "El Baluarte Impenetrable",
                imageFileName: "7 Sin Fondo.jpg",
                description: "Seis ángulos perfectos. La geometría de la protección absoluta.",
                rarity: "Epic"
            },
            {
                id: "005",
                title: "CHRONOS",
                subtitle: "El Motor de los Ciclos",
                imageFileName: "5 Sin Fondo.jpg",
                description: "Una meditación visual sobre el ritmo del universo. Mecanismo estelar.",
                rarity: "Epic"
            },
            {
                id: "006",
                title: "ZENITH",
                subtitle: "La Cúspide Solar",
                imageFileName: "4 Sin Fondo.jpg",
                description: "La máxima expansión de la luz congelada en simetría perfecta.",
                rarity: "Rare"
            },
            {
                id: "007",
                title: "NEXUS",
                subtitle: "La Red Neuronal",
                imageFileName: "2 Sin Fondo.jpg",
                description: "El tejido que conecta cada pieza. Una red de tensión infinita.",
                rarity: "Rare"
            },
            {
                id: "008",
                title: "REGALIA",
                subtitle: "El Sello Soberano",
                imageFileName: "8 Sin Fondo.jpg",
                description: "La joya ceremonial. Compleja, barroca y excesiva.",
                rarity: "Rare"
            }
        ]
    },
    {
        category: "ANOMALIES",
        items: [
            {
                id: "009",
                title: "VOID WALKER",
                subtitle: "Intrusión Astral",
                imageFileName: "3 Sin Fondo.jpg",
                description: "La geometría se disuelve en fluido. Frecuencia violeta detectada.",
                rarity: "Secret"
            },
            {
                id: "010",
                "title": "NOVA",
                subtitle: "Sobrecarga Prismática",
                imageFileName: "6 Sin Fondo.jpg",
                description: "Una estrella que arde en otra frecuencia. Energía fría inestable.",
                rarity: "Secret"
            }
        ]
    }
];
