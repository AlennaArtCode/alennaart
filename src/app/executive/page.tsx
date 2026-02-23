import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ana Milena Chaves | Executive Portfolio",
    description: "Product & Project Manager · Web3, AI & Cybersecurity Strategist",
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
