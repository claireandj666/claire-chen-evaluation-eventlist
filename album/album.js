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

// getAPI.getAlbums({
//     term: 'Taylor Swift'
// }).then(response => {
//     console.log("response: ", response)
// })

class AlbumsModel {
    constructor() {
        this.albums = []
    }

    fetchAlbums(params) {
        return getAPI.getAlbums(params).then(searchResults => {
            this.setAlbums(searchResults);

            return searchResults;
        })
    }

    setAlbums(data) {
        this.albums = data;
    }

    getAlbums() {
        return this.albums;
    }
}


class AlbumsView {
    constructor() {
        this.searchInput = document.querySelector(".artist-name__input")
        this.searchBtn = document.querySelector(".album-search__button")
        this.albumsLists = document.querySelector(".albums-list")
        this.albumsSearchSummary = document.querySelector(".albums-search-summary")
    }

    appendAlbum(data) {
        const albumElem = document.createElement("div")
        albumElem.classList.add("album-item")

        const albumCover = document.createElement("img")
        albumCover.src = data.artworkUrl100

        const albumName = document.createElement("p")
        albumName.classList.add("album-name")
        albumName.textContent = data.collectionName

        albumElem.append(albumCover, albumName)
        this.albumsLists.append(albumElem)
    }

    removeAllAlbums() {
        const parent = this.albumsLists;

        while (parent.hasChildNodes()) {
            parent.firstChild.remove()
        }
    }

    updateSearchResultsSummary(summary) {
        this.albumsSearchSummary.textContent = summary
    }
}

class AlbumsController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.init();
    }

    init() {
        this.setupEvents()
    }

    setupEvents () {
        this.setupFormEvents()
    }

    getSearchInputValue () {
        return this.view.searchInput.value;
    }

    setupFormEvents() {
        this.view.searchInput.addEventListener("keypress", (event) => {
            const currentInput = this.getSearchInputValue();

            if (event.key === "Enter") {
                event.preventDefault()

                this.model.fetchAlbums({
                    term: currentInput,
                }).then(response => {
                    // console.log(response)

                    this.view.removeAllAlbums()

                    const count = response.resultCount
                    const summary = `${count} Results for: "${currentInput}"`

                    this.view.updateSearchResultsSummary(summary)

                    response.results.forEach(albumData => {
                        this.view.appendAlbum(albumData)
                    })
                })
            }
        });

        this.view.searchBtn.addEventListener("click", () => {
            const currentInput = this.getSearchInputValue()
        
            this.model.fetchAlbums({
                term: currentInput,
            }).then(response => {
                this.view.removeAllAlbums()

                const count = response.resultCount
                const summary = `${count} Results for: "${currentInput}"`

                this.view.updateSearchResultsSummary(summary)

                response.results.forEach(albumData => {
                    this.view.appendAlbum(albumData)
                })
            })
        })

    }
}




const albumsModel = new AlbumsModel()
const albumsView = new AlbumsView()

new AlbumsController(albumsView, albumsModel)