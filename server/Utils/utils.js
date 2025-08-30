export const queryGen=async(query)=>{
  delete query.skip
  delete query.limit
  let keywords = {};
  Object.keys(query).forEach(queryParam => {
    if (query[queryParam]) {
      const field = getFieldFromQueryParam(queryParam);
      const regexSearch = new RegExp(query[queryParam], 'i');

      if (field) {
        if (queryParam.endsWith("Contains")) {
          keywords.$or = keywords.$or || [];
          keywords.$or.push({ [field]: { $regex: regexSearch } });
        } else {
          keywords[field] = parseQueryParam(query[queryParam]);
        }
      }
    }
  });
  return keywords
}

export const getFieldFromQueryParam = (queryParam) => {
  return queryParam.endsWith("Contains") ? queryParam.slice(0, -8) : queryParam;
};

export const parseQueryParam = (value) => {
  if (!isNaN(value)) {
    return parseFloat(value);
  } else {
    return value;
  }
};

export const generateRandomString = (length = 10,alphabets = true,numbers = true,specialChars = true) => {
  let charset = "";
  if(alphabets){
    charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  }
  if(numbers){
    charset += "0123456789";
  }
  if(specialChars){
    charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  }
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return randomString;
};