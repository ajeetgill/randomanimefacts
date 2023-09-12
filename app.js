/**
 * @todo
 * 1. deploy the postgres db live
 * 2. deploy backend code on Firebase Cloud Functions (IF CARD NEEDED, SOMEWHERE ELSE)
 * 3. for PRACTICE : learn how to deploy node project in general
 * 4. do the same thing but with NEXT.js
 * 5. Deploy POSTgres with using environment variables
 */
let isLocalhost = false;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    isLocalhost = true;
}
const animeAPIUrl = `${
    isLocalhost
    ? "http://localhost:4000"
    : "https://anime-facts-rest-api.herokuapp.com"
}/api/v1`;


let animeList;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function onLoad() {
    renderAnimeCards();
    document.body.addEventListener("keyup", fadeOtherElementsExceptMeKeyboard);
    // document.body.addEventListener("keyup", removeFadeOtherElementsExceptMeKeyboard);
    document.querySelectorAll(`.card`).forEach(el => {
        el.addEventListener("mouseenter", fadeOtherElementsExceptMe);
        el.addEventListener("mouseleave", removeFadeOtherElementsExceptMe);
    });


}

async function getRandomFact(animeID) {
    // if the facts are NOT in localStorage
    //// fetch from API
    //// store the facts in localstorage
    // return random fact from localstorage
    if (!localStorage.getItem(animeID)) {
        await fetchAndStoreRandomFacts(animeID).catch((e) => {
            console.error(e);
            console.error(`caught error-1`);
        });
    }
    let randomFacts = JSON.parse(localStorage.getItem(animeID));
    let randomNumber = Math.floor(Math.random() * randomFacts.length);
    return randomFacts[randomNumber].fact;
}


function showRandomFact(e) {
    let animeID = e.id;
    const animeName = document.querySelector(`#${animeID} .card__title`).innerText;
    let htmlRandomFact = document.querySelector(`.random__fact`);
    let htmlRandomName = document.querySelector(`.random__name`);
    // at this point I'm sure AnimeList is in local storage for sure
    // get the ID from local storage then get random fact from API
    // getFact(animeID) returns the fact to be rendered

    getRandomFact(animeID).then(fact => {
        htmlRandomName.innerHTML = animeName;
        htmlRandomFact.innerHTML = fact
    })
}
async function fetchAndStoreRandomFacts(animeID) {
    let f = await fetch(`${animeAPIUrl}/${animeID}`).catch((e) => {
        console.error(e);
        console.error(`caught error-2`);
    });
    await f.json().then(facts => {
        localStorage.setItem(animeID, JSON.stringify(facts.data))
    })
}

async function fetchAnimeList() {
    let r = await fetch(animeAPIUrl).catch((e) => {
        console.error(e);
        console.error(`caught error-3`);
    });
    let result = await r.json().then((e) => { return e.data });
    return result;
}

async function renderAnimeCards() {
    let animeList = '';
    // localStorage.removeItem('animeList');
    if (localStorage.getItem('animeList')) {
        // console.log('fetching list from localStorage');
        animeList = JSON.parse(localStorage.getItem('animeList'));
    }
    else {
        // console.log('fetching list from API');
        animeList = await fetchAnimeList();
        localStorage.setItem('animeList', JSON.stringify(animeList));
    }
    const htmlResults = document.getElementById('allAnime');
    animeList.forEach(anime => {
        let name = anime.anime_name.toString().replaceAll('_', ' ');
        let imgUrl = anime.anime_img;
        name = capitalizeFirstLetter(name);
        const cardTemplate = `<button id=${anime.anime_name} onclick=showRandomFact(this) class="card">
                                    <h3 class="card__title">${name}</h3>
                                    <img src="${imgUrl}" width=150 alt="" class="card__image">
                                </button>`;
        htmlResults.innerHTML += cardTemplate;
    });

}

function clearLocalStorage() {
    console.log('cleared local storage :)');
    document.querySelector(`.random__name`).innerHTML = `One Piece`;
    document.querySelector(`.random__fact`).innerHTML = `It's best anime ever🧡`;
    localStorage.clear();
}



// Start : Fade all cards except the one that's hovering over
// applies an effect to all elements with the same class within the parent
function fadeOtherElementsExceptMe(e) {
    const parentId = e.srcElement.parentNode.id;
    const commonSiblingClass = e.target.className;
    const commonSiblingSelector = `#${parentId} .${commonSiblingClass}`;
    const activelyHoveredElementId = e.target.id;

    // // apply effect on all elements except present element
    document.querySelectorAll(commonSiblingSelector).forEach(el => {
        // console.log(el.id);
        if (activelyHoveredElementId !== el.id)
            el.style.filter = 'blur(2px) grayscale(.5)';
    })

}
function removeFadeOtherElementsExceptMe(e) {
    const parentId = e.srcElement.parentNode.id;
    const commonSiblingClass = e.target.className;
    const commonSiblingSelector = `#${parentId} .${commonSiblingClass}`;

    document.querySelectorAll(commonSiblingSelector).forEach(el => {
        el.style.filter = 'blur(0px) grayscale(0)'
    })
}

function fadeOtherElementsExceptMeKeyboard(e) {
    const parentId = e.srcElement.parentNode.id;
    const commonSiblingClass = e.target.className;
    const commonSiblingSelector = `#${parentId} .${commonSiblingClass}`;
    const activelyFocusedElementId = e.target.id;

    if (document.activeElement.className === 'card') {
        // Blur other elements except me
        document.querySelectorAll(commonSiblingSelector).forEach(el => {
            el.style.filter = 'blur(0) grayscale(0)';
        })

        document.querySelectorAll(commonSiblingSelector).forEach(el => {
            if (activelyFocusedElementId !== el.id)
                el.style.filter = 'blur(2px) grayscale(.5)';
        })
    }
    else {
        document.querySelectorAll('.card').forEach(el => {
            el.style.filter = 'blur(0) grayscale(0)';
        })
    }

}
// End : Fade all cards except the one that's hovering over
