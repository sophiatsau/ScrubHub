export const normalizeObj = arr => {
    const obj = {};
    arr.forEach(el => obj[el.id] = el);
    return obj;
}

export const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

export const CATEGORIES = [
  "Amphibians",
  "Arthropods",
  "Birds",
  "Cats",
  "Dogs",
  "Fish",
  "Marines",
  "Other Mammals",
  "Other Critters",
  "Rabbits",
  "Reptiles",
  "Rodents",
]

export const ALLOWED_EXTENSIONS = ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/svg", "image/bmp", "image/tiff", "image/jfif"]

export const formatBusinessHours = (obj) => {
    const errors = []
    const businessHours = DAYS.map(day => {
      const {active, open, close} = obj[day]
      const hours = active ? open+"-"+close : "Closed"

      if (active && (!open || !close)) {
        errors.push(`Please set your shop's hours on ${day}.`)
      }

      else if (active && open >= close) {
        errors.push(`Opening hours must be before closing hours on ${day}.`)
      }

      return `${day} ${hours}`
    }).join("\n")

    if (errors.length) throw Error(errors.join("\n"))

    return businessHours
}

export const formatPhoneNumber = (num) => {
    return `(${num.slice(0,3)}) ${num.slice(3,6)}-${num.slice(6)}`
}

export const parseBusinessHours = (str) => {
    if (!str) return null

    const hoursObj = {}

    // ["Mon 00:00-00:00", ...]
    str.split(/\r?\n/).forEach(ele => {
        let [day, time] = ele.split(" ")
        if (time.endsWith("/r")) time = time.splice(-2,2)
        const [open, close, active] =
            time==="Closed" ?
                ["","",false]
                : [...time.split("-"), true]

        hoursObj[day] = {open, close, active}
    })

    return hoursObj;
}

export const getFullAddress = (addressObj) => {
  const {address, city, state, zipCode} = addressObj;
  return `${address}\n${city}, ${state} ${zipCode}`;
}

export const componentsToAddressLines = (addressObj) => {
  const {address, city, state, zipCode} = addressObj;
  return [`${address}`, `${city}, ${state} ${zipCode}`];
}

export const fullAddressToComponents = (str) => {
  //1 World Way, Los Angeles, CA 90045-5803, USA
  const [address, city, stateZip, _country] = str.split(", ")
  const [state, zipCode] = stateZip.split(" ")
  const data = {address, city, state, zipCode}
  data.fullAddress = getFullAddress(data)
  // console.log("🚀 ~ fullAddressToComponents ~ data.fullAddress:", data.fullAddress)
  return data
}

export const fetchData = async (path, options) => {
  // returns data + status
  let res, data = {};
  try {
    res = await fetch(path, options);
    data = await res.json();
    data.status = res.status || 500;
  } catch (res) {
    res.status = res.status || 500;
    if (res.errors) res.errors.fetch = "Failed to Fetch"
    else res.errors = {"fetch": "Failed to Fetch"};
    if (res.status >= 500) res.errors.UnknownError = "An error occurred. Please try again.";
    data = res;
  }

  return data;
}
