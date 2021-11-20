# Random Anime Facts

A simple webpage which I started just to learn how to use APIs with fetch in javascript.

## What it does?

- Checks local storage for a list of Animes, it it's not there
- Fetches a list of anime from API on initial request,

- stores in the local storage (so that next time data can be populated from local storage instead of send an API request)
- populates the webpage from local storage
- when any card is clicked,
- Checks local storage for facts related to the selected anime 
- if not present, fetches facts from another API-endpoint (initial request only) and
- stores the data in local storage.


## Things done from improvements
- Open graph cards
## Things to improve upon

- instead of blank screen loading when fetching data from API, I can show loading cards as placeholder which get populated as data is fetched.
- PWA?
- Dark mode
