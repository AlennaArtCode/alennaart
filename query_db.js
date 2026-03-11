const https = require('https');
const fs = require('fs');
const envFile = fs.existsSync('.env.local') ? '.env.local' : '.env';
const envContent = fs.readFileSync(envFile, 'utf8');

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const url = urlMatch[1].trim().replace(/['"]/g, '') + '/rest/v1/artworks?select=*&title=eq.Cumbia%20V-%20Pop!';
const options = {
    headers: {
        'apikey': keyMatch[1].trim().replace(/['"]/g, ''),
        'Authorization': 'Bearer ' + keyMatch[1].trim().replace(/['"]/g, '')
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const items = JSON.parse(data);
        console.dir(items, { depth: null });
    });
}).on('error', (e) => {
    console.error(e);
});
