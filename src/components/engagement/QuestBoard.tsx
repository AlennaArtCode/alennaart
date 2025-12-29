'use client';

import { useState } from 'react';

type Quest = {
    id: string;
    title: string;
    xp: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Fun';
    completed: boolean;
};

const INITIAL_QUESTS: Quest[] = [
    { id: '1', title: 'First Steps: Verify Email', xp: 100, difficulty: 'Easy', completed: false },
    { id: '2', title: 'The Messenger: Invite 1 Friend', xp: 200, difficulty: 'Easy', completed: true },
    { id: '3', title: 'Lore Hunter: Chapter 1 Code', xp: 500, difficulty: 'Medium', completed: false },
    { id: '4', title: 'Town Hall Citizen: Attend Event', xp: 500, difficulty: 'Medium', completed: false },
    { id: '5', title: 'Content Creator: Tweet Lore', xp: 800, difficulty: 'Hard', completed: false },
    { id: '6', title: 'The Guardian: Help a Newbie', xp: 1000, difficulty: 'Hard', completed: false },
    { id: '7', title: 'Collector\'s Pride: Hold Season Pass', xp: 1500, difficulty: 'Hard', completed: true },
    { id: '8', title: 'Meme Lord: Post Meme', xp: 300, difficulty: 'Fun', completed: false },
];

export default function QuestBoard() {
    const [quests, setQuests] = useState(INITIAL_QUESTS);

    const getDifficultyColor = (diff: Quest['difficulty']) => {
        switch (diff) {
            case 'Easy': return 'text-green-400 border-green-400/20 bg-green-400/10';
            case 'Medium': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
            case 'Hard': return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
            case 'Expert': return 'text-red-400 border-red-400/20 bg-red-400/10';
            case 'Fun': return 'text-pink-400 border-pink-400/20 bg-pink-400/10';
            default: return 'text-content-muted';
        }
    };

    return (
        <div className="card-premium p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold font-serif text-content-primary">Quest Board</h3>
                <span className="text-xs uppercase tracking-widest text-content-secondary font-sans">Week 1: The Fragmentation</span>
            </div>

            <div className="space-y-3">
                {quests.map((quest) => (
                    <div
                        key={quest.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${quest.completed
                            ? 'bg-primary-dark/30 border-primary-border opacity-60'
                            : 'bg-primary-surface border-primary-border hover:border-accent/50'
                            }`}
                    >
                        <div className="flex flex-col gap-1">
                            <span className={`text-lg font-medium ${quest.completed ? 'line-through text-content-muted' : 'text-content-primary'}`}>
                                {quest.title}
                            </span>
                            <div className="flex gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded border ${getDifficultyColor(quest.difficulty)}`}>
                                    {quest.difficulty}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-accent-hover font-mono font-bold">+{quest.xp} XP</span>
                            <button
                                disabled={quest.completed}
                                className={`px-4 py-2 rounded text-sm font-bold transition-colors ${quest.completed
                                    ? 'bg-transparent text-content-muted cursor-not-allowed'
                                    : 'bg-content-primary text-primary-dark hover:bg-content-primary/80'
                                    }`}
                            >
                                {quest.completed ? 'Completed' : 'Start'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
