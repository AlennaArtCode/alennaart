export type GalleryItem = {
    id: string;
    title: string;
    subtitle: string;
    imageFileName: string;
    description: string;
    rarity: string;
    memory_log?: {
        date_recorded: string;
        origin_state: string;
        memory_fragment: string;
        custodian_mission: string;
    };
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
                subtitle: "The Sovereign of the Golden Web",
                imageFileName: "image_9867e8.jpg",
                description: "The zero point. The silent architect watching from the digital throne.",
                rarity: "Legendary",
                memory_log: {
                    date_recorded: "14 Nov, 03:45 AM",
                    origin_state: "Uncertainty / Need for Strength",
                    memory_fragment: "I remember feeling small before an immense decision. I didn't draw a lion; I drew the courage I lacked. Strength is an internal structure.",
                    custodian_mission: "When you acquire this piece, you guard the memory of courage."
                }
            },
            {
                id: "002",
                title: "LEGATUS",
                "subtitle": "The Face of Digital Diplomacy",
                imageFileName: "Mask Sin fondo.jpg",
                description: "Not human, it is what comes after us. Witness of golden polygons.",
                rarity: "Legendary",
                memory_log: {
                    date_recorded: "22 Nov, 01:15 AM",
                    origin_state: "Silence / Observation",
                    memory_fragment: "Sometimes the face we show is not ours. Legatus was born from the need for an intermediary between my chaos and the world.",
                    custodian_mission: "You guard the mask, but also the truth it hides."
                }
            },
            {
                id: "003",
                title: "ORIGO",
                subtitle: "The Zero Seed",
                imageFileName: "1 Sin Fondo.jpg",
                description: "The master blueprint of existence. Where eternity is born and dies.",
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
                subtitle: "The Impenetrable Bulwark",
                imageFileName: "7 Sin Fondo.jpg",
                description: "Six perfect angles. The geometry of absolute protection.",
                rarity: "Epic"
            },
            {
                id: "005",
                title: "CHRONOS",
                subtitle: "The Engine of Cycles",
                imageFileName: "5 Sin Fondo.jpg",
                description: "A visual meditation on the rhythm of the universe. Stellar mechanism.",
                rarity: "Epic"
            },
            {
                id: "006",
                title: "ZENITH",
                subtitle: "The Solar Maximum",
                imageFileName: "4 Sin Fondo.jpg",
                description: "The maximum expansion of light frozen in perfect symmetry.",
                rarity: "Rare"
            },
            {
                id: "007",
                title: "NEXUS",
                subtitle: "The Neural Network",
                imageFileName: "2 Sin Fondo.jpg",
                description: "The fabric that connects every piece. A network of infinite tension.",
                rarity: "Rare"
            },
            {
                id: "008",
                title: "REGALIA",
                subtitle: "The Sovereign Seal",
                imageFileName: "8 Sin Fondo.jpg",
                description: "The ceremonial jewel. Complex, baroque, and excessive.",
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
                subtitle: "Astral Intrusion",
                imageFileName: "3 Sin Fondo.jpg",
                description: "Geometry dissolves into fluid. Violet frequency detected.",
                rarity: "Secret"
            },
            {
                id: "010",
                "title": "NOVA",
                subtitle: "Prismatic Overload",
                imageFileName: "6 Sin Fondo.jpg",
                description: "A star burning at another frequency. Unstable cold energy.",
                rarity: "Secret"
            }
        ]
    }
];
