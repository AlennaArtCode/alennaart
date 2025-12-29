export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            artworks: {
                Row: {
                    id: string
                    title: string
                    category: string
                    description: string | null
                    year: number | null
                    size: string | null
                    image_url: string
                    image_path: string
                    color: string | null
                    season: string | null
                    mood: string | null
                    type: string | null
                    episode: string | null
                    collection: string | null
                    marketplace_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    category: string
                    description?: string | null
                    year?: number | null
                    size?: string | null
                    image_url: string
                    image_path: string
                    color?: string | null
                    season?: string | null
                    mood?: string | null
                    type?: string | null
                    episode?: string | null
                    collection?: string | null
                    marketplace_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    category?: string
                    description?: string | null
                    year?: number | null
                    size?: string | null
                    image_url?: string
                    image_path?: string
                    color?: string | null
                    season?: string | null
                    mood?: string | null
                    type?: string | null
                    episode?: string | null
                    collection?: string | null
                    marketplace_url?: string | null
                    created_at?: string
                }
            }
            music_releases: {
                Row: {
                    id: string
                    title: string
                    artist: string
                    category: string
                    description: string | null
                    year: number
                    cover_url: string
                    cover_path: string
                    audio_url: string | null
                    audio_path: string | null
                    audio_file_name: string | null
                    color: string | null
                    size: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    artist?: string
                    category: string
                    description?: string | null
                    year: number
                    cover_url: string
                    cover_path: string
                    audio_url?: string | null
                    audio_path?: string | null
                    audio_file_name?: string | null
                    color?: string | null
                    size?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    artist?: string
                    category?: string
                    description?: string | null
                    year?: number
                    cover_url?: string
                    cover_path?: string
                    audio_url?: string | null
                    audio_path?: string | null
                    audio_file_name?: string | null
                    color?: string | null
                    size?: string | null
                    created_at?: string
                }
            }
            writings: {
                Row: {
                    id: string
                    title: string
                    excerpt: string | null
                    content: string
                    cover_url: string | null
                    cover_path: string | null
                    category: string
                    read_time: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    excerpt?: string | null
                    content: string
                    cover_url?: string | null
                    cover_path?: string | null
                    category: string
                    read_time?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    excerpt?: string | null
                    content?: string
                    cover_url?: string | null
                    cover_path?: string | null
                    category?: string
                    read_time?: number | null
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    wallet_address: string
                    username: string | null
                    avatar_url: string | null
                    is_holder: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    wallet_address: string
                    username?: string | null
                    avatar_url?: string | null
                    is_holder?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    wallet_address?: string
                    username?: string | null
                    avatar_url?: string | null
                    is_holder?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            seasons: {
                Row: {
                    id: string
                    title: string
                    start_date: string
                    end_date: string
                    is_active: boolean | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    start_date: string
                    end_date: string
                    is_active?: boolean | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    start_date?: string
                    end_date?: string
                    is_active?: boolean | null
                    created_at?: string | null
                }
            }
            quests: {
                Row: {
                    id: string
                    season_id: string | null
                    title: string
                    description: string | null
                    xp_reward: number | null
                    category: string
                    required_policy_id: string | null
                    verification_type: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    season_id?: string | null
                    title: string
                    description?: string | null
                    xp_reward?: number | null
                    category: string
                    required_policy_id?: string | null
                    verification_type?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    season_id?: string | null
                    title?: string
                    description?: string | null
                    xp_reward?: number | null
                    category?: string
                    required_policy_id?: string | null
                    verification_type?: string | null
                    created_at?: string | null
                }
            }
            user_quest_progress: {
                Row: {
                    id: string
                    user_wallet: string | null
                    quest_id: string | null
                    status: string | null
                    completed_at: string | null
                    tx_hash: string | null
                }
                Insert: {
                    id?: string
                    user_wallet?: string | null
                    quest_id?: string | null
                    status?: string | null
                    completed_at?: string | null
                    tx_hash?: string | null
                }
                Update: {
                    id?: string
                    user_wallet?: string | null
                    quest_id?: string | null
                    status?: string | null
                    completed_at?: string | null
                    tx_hash?: string | null
                }
            }
        }
        Views: {
            [_: string]: never
        }
        Functions: {
            [_: string]: never
        }
        Enums: {
            [_: string]: never
        }
    }
}
