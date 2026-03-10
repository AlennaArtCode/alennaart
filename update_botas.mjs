import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cewxeqfifxmjclwwyshq.supabase.co';
const supabaseKey = 'sb_publishable_bW85AWd40SzVevbHir-jeg_GHk5ScYn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    await supabase.from('artworks')
        .update({ rarity: 'Trap/Reggaeton' })
        .in('title', ['Botas de Gato']);

    console.log("Database updated: Botas de Gato changed to Trap/Reggaeton");
}

main();
