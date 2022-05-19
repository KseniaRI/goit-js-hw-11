import axios from "axios";

const API_KEY = '27355574-70cda2d549cbba697ae43a74b';
const BASE_URL = 'https://pixabay.com/api/';
 
export default class PixabayApiService {

    constructor() { 
        this.searchQuery = "";
        this.page = 1;
    }

    async fetchPicters() {
        const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
   
        // const responce = await fetch(url);
        // console.log(responce.json());
        // const { hits, totalHits } = await responce.json();
        
        const responce = await axios(url);
        console.log(responce);
        const { hits, totalHits } = responce.data;
        console.log({ hits, totalHits });

        this.incrementPage();
        console.log(url);
        return { hits, totalHits };
        
        
        // return fetch(url)
        //     .then(responce => responce.json())
        //     .then(({hits, totalHits}) => {
        //         this.incrementPage();
        //         return {hits, totalHits};
        //     });
        
    }

    getPage() {
        return this.page;
    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
