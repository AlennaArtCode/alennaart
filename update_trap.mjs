import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cewxeqfifxmjclwwyshq.supabase.co';
const supabaseKey = 'sb_publishable_bW85AWd40SzVevbHir-jeg_GHk5ScYn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Setting Urbano Trap logic
    await supabase.from('artworks')
        .update({ rarity: 'Urbano Trap' })
        .in('title', ['El Hilo Carmesí', 'La Voz del Polvo']);

    console.log("Database updated to include Urbano Trap genre");
}

main();
