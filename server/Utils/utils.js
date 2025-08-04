export const queryGen = async (query) => {
    delete query.skip;
    delete query.limit;
    let keywords = {};
    Object.keys(query).forEach((queryParam) => {
      if (query[queryParam]) {
        const field = getFieldFromQueryParam(queryParam);
        const regexSearch = new RegExp(query[queryParam], "i");
  
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
    return keywords;
  };