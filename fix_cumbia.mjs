import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cewxeqfifxmjclwwyshq.supabase.co';
const supabaseKey = 'sb_publishable_bW85AWd40SzVevbHir-jeg_GHk5ScYn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Let's first get the item that has 'Cumbia V- Pop!' in the title
    const { data } = await supabase.from('artworks').select('*').ilike('title', '%Cumbia%');
    console.log("Found:", data);

    if (data && data.length > 0) {
        await supabase.from('artworks')
            .update({ rarity: 'Experimental' })
            .eq('id', data[0].id);

        console.log("Updated to Experimental.");
    }
}

main();
