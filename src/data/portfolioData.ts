export interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    description: string;
    image?: string;
    color?: string;
    size: 'normal' | 'wide' | 'tall' | 'large';
    year: string;
    sale_status?: 'upcoming' | 'sold_out' | 'available';
}


export const defaultPortfolioItems: PortfolioItem[] = [
    {
        id: 'lion-geometric',
        title: "Lion of Judah",
        category: "Digital Art",
        description: "Geometric complexity meets spiritual ferocity. A study in golden light.",
        image: "/art/lion-geometric.jpg",
        size: "large",
        year: "2025",
        sale_status: 'available',
    },
    {
        id: 'mandala-gold',
        title: "Golden Cipher",
        category: "Sacred Geometry",
        description: "An infinite loop of divine architecture.",
        image: "/art/mandala-gold.jpg",
        size: "normal",
        year: "2024",
        sale_status: 'sold_out',
    },
    {
        id: 'mandala-tech',
        title: "Core Reactor",
        category: "Tech Art",
        description: "The energy source of the digital void.",
        image: "/art/mandala-tech.jpg",
        size: "normal",
        year: "2024",
        sale_status: 'available',
    }
];
