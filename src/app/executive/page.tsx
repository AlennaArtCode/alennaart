import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ana Milena Chaves | Executive Portfolio",
    description: "Product & Project Manager · Web3, AI & Cybersecurity Strategist",
    openGraph: {
        images: [
            {
                url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTX1sJ6xFpbCOnIu11Sas1V2YKLD5lFYWM4vHa3ywV7LJ13_A-WWfjF0iYq95H6hgfpO1_Browuqri1fVCWH2NVwTKwwKYpakEYQLuow9fn9C0BuUxXuKReJJPTdvz5w8jzYFQT9f8YPcaLuBhBU4DuX_ZxSsrgUkRaHb-VZCerqRxHXcrsYQleRaqcjYOH1zd3EnkwrEBUkDtBUgd0jYQjfjQWjmapHdX1TQpihJqj4gvxyYsRjBptLe2LXvRVwN7lCKCT-CZ-A",
                width: 800,
                height: 800,
                alt: "Ana Milena Chaves Vallejos",
            },
        ],
    },
};

export default function ExecutivePortfolio() {
    return (
        <main className="w-screen h-screen m-0 p-0 overflow-hidden bg-[#0B1120]">
            <iframe
                src="/executive/index.html"
                className="w-full h-full border-none m-0 p-0"
                title="Executive Portfolio"
            />
        </main>
    );
}
