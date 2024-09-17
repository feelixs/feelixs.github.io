const clientId = 'f72749c20805440cb541ad0d7e82acd4';  // spotify client id
let accessToken = '';
let albumImages = [];
let albumHrefs = [];

async function getAccessToken(secret) {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + secret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    accessToken = data.access_token;
}

async function getAlbumsByArtist(artistId, secret) {
    if (!accessToken) {
        await getAccessToken(secret);
    }

    const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const data = await result.json();
    return data.items.map(album => ({
        name: album.name,
        release_date: album.release_date,
        total_tracks: album.total_tracks,
        url: album.external_urls.spotify,
        art: album.images[0].url
    }));
}

async function getMySecret() {
    // TODO: store secret in this server's environment variables
    const response = await fetch('https://trioluna.com/api/spotify-secret');
    // storing privately on this remote server and fetching it securely for now
    const data = await response.json();
    return data.secret;
}

function renderImgs(imgs, urls) {
    // Render images on the page in a table format
    const albumTable = document.getElementById('albums-table');
    document.getElementById('js-warning-albums').innerHTML = '';  // Clear warning
    // Initialize a row variable outside the loop
    let row = albumTable.insertRow();

    for (let i = 0; i < imgs.length; i++) {
        // Check if the current index is divisible by 4
        // If yes, create a new row after filling the previous one
        if (i % 4 === 0 && i !== 0) {
            row = albumTable.insertRow();
        }
        const link = document.createElement('a');
        link.href = urls[i];
        link.target = '_blank';
        link.classList.add('album-link');
        const img = document.createElement('img');
        img.src = imgs[i];
        img.alt = 'album cover';
        img.classList.add('album-image');
        link.appendChild(img);

        // Create a cell in the row and append the image
        const cell = row.insertCell();
        cell.appendChild(link);
    }
}

getMySecret().then(clientSecret => {
    const artistId = '59yZaUd3eLLGsz10hRIT3Y'; // cabin fever id
    getAlbumsByArtist(artistId, clientSecret).then(albums => {
        // console.log('Albums:', albums);
        for (const album of albums) { // populate albumImages
            albumImages.push(album.art);
            albumHrefs.push(album.url);
        }
        renderImgs(albumImages, albumHrefs);
    }).catch(error => {
        console.error('Error fetching albums:', error);
    });
}).catch(error => {
    console.error('Error fetching secret:', error);
});
