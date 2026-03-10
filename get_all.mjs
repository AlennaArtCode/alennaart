import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://cewxeqfifxmjclwwyshq.supabase.co';
const supabaseKey = 'sb_publishable_bW85AWd40SzVevbHir-jeg_GHk5ScYn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase
        .from('artworks')
        .select('id, title, rarity, category')
        .eq('category', 'Music');

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        fs.writeFileSync('tracks.json', JSON.stringify(data, null, 2));
    }
}

main();
