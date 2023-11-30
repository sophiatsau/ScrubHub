// react-app/src/store/utils.js
// import Cookies from 'js-cookie';

export async function customFetch(url, options = {}) {
    /* set progress cursor */
    const bodyClasses = document.body.classList;
    bodyClasses.add("waiting");

    // set options.method to 'GET' if there is no method
    options.method = options.method || 'GET';
    // set options.headers to an empty object if there are no headers
    options.headers = options.headers || {};

    // call the default window's fetch with the url and the options passed in
    let res;
      try {
        // console.trace();
        res = await window.fetch(url, options);
      } catch (error) {
        // console.error(error);
        error.status = error.status || 500;
        if (error.errors) error.errors.fetch = "Failed to Fetch"
        else error.errors = {"fetch": "Failed to Fetch"}
        res = error;
      }

    // if there is an error in the fetch request, modify the response to signal the next promise chain

    bodyClasses.remove("waiting");

    // return the response to the next promise chain
    return res;
  }

  export const fetchData = (url, options) => {
    /* Returns Promise which resolves to either data or errors */
    return customFetch(url, options)
      .then(response => response.ok
          ? response.json()
          : response.json().then(err => err.errors ? err :
             (err.message
              ? ({...err, "errors": {"system": err.message}})
              : err )))
      .catch(systemicError => ({"errors": {"system": systemicError.message}}))
}
