import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiService from './pixabay-service';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
searchForm.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);
document.addEventListener("scroll", slowScroll);

loadMoreBtn.classList.add('is-hidden');

const pixabayApiService = new PixabayApiService();
let gallerySlider;

async function onSearch(evt) {
  evt.preventDefault();
 
loadMoreBtn.classList.add('is-hidden');

  pixabayApiService.query = evt.currentTarget.elements.searchQuery.value;
  if (pixabayApiService.query === "") {
    Notify.failure("Enter something");
    gallery.innerHTML = "";
    loadMoreBtn.classList.add('is-hidden');
    return;
  }
  pixabayApiService.resetPage();
  gallery.innerHTML = "";
  
  try {
      const { hits, totalHits } = await pixabayApiService.fetchPicters();
      if (hits.length === 0) {
          Notify.failure("Sorry, there are no images matching your search query. Please try again.");
          loadMoreBtn.classList.add('is-hidden');
          return;
      }  
      Notify.success(`Hooray! We found ${totalHits} images.`);
    createGallery({ hits, totalHits });
    showSlider();
  } catch (error) {
    console.log(error.message);
  }

  // pixabayApiService.fetchPicters()
  //   .then(({ hits, totalHits }) => {
  //       if (hits.length === 0) {
  //         Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  //         loadMoreBtn.classList.add('is-hidden');
  //         return;
  //       }
  //       Notify.success(`Hooray! We found ${totalHits} images.`);
  //       createGallery({hits, totalHits});
  //   })
  //   .catch(console.log);
  

  // loadMoreBtn.classList.add('is-hidden');//non serve
  
}

async function onLoadMore() {
  
  const { hits, totalHits } = await pixabayApiService.fetchPicters();
  createGallery({ hits, totalHits });
  gallerySlider.refresh(); 

  // pixabayApiService.fetchPicters().then(({hits, totalHits}) => {    
  //   createGallery({hits, totalHits});
  // gallerySlider.refresh();
  // });
  
}  

function createGallery({hits, totalHits}) {
  renderGallery(hits);
  loadMoreBtn.classList.remove('is-hidden');
  onEndOfSearch(totalHits);
}
    
function renderGallery(hits) {
  const markup =  hits.map(hit => `
    <div class="photo-card">
    <a href = "${hit.largeImageURL}">
  <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${hit.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${hit.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${hit.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${hit.downloads}</span>
    </p>
  </div>
  
</div>
    `
).join("");
    
  gallery.insertAdjacentHTML("beforeend", markup);  
}
  
function showSlider() {
  gallerySlider = new SimpleLightbox('.gallery a');
  gallerySlider.on('show.simplelightbox');
}

function onEndOfSearch(totalHits) {
  const loadedPages = pixabayApiService.getPage() - 1;
    console.log(loadedPages);
    if (loadedPages === Math.ceil(totalHits / 40)) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('is-hidden');
    }
}

function slowScroll() {
  const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});
}