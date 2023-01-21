const getAPI = (() => {
    const BASE_URL = "https://itunes.apple.com/search?"

    const getAlbums = ({
        term = '',
        media = 'music',
        entity = 'album',
        attribute = 'artistTerm',
        limit = 50,
    }) => {
        const path = `term=${term}&media=${media}&entity=${entity}&attribute=${attribute}&limit=${limit}`
        return fetch(`${BASE_URL}${path}`).then((res) => res.json());
    }

    return { getAlbums };
})();

getAPI.getAlbums({
    term: 'Taylor Swift'
}).then(response => {
    console.log("response: ", response)
})

// term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=50