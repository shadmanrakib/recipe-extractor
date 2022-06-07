export default function mergeArrayOfObjects(arr: { [key: string]: any }[], overrideArray = false): { [key: string]: any } {
    return arr.reduce(function (result, current) {
      if (current) {
        const keys = Object.keys(current);
  
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
  
          if (!result[key]) {
            result[key] = current[key];
          } else if (Array.isArray(result[key]) && !overrideArray) {
            if (Array.isArray(current[key])) {
              result[key] = [...result[key], ...current[key]];
            } else {
              result[key] = [...result[key], current[key]];
            }
          } else if (Array.isArray(result[key]) && result[key].length == 0 && overrideArray) {
            if (Array.isArray(current[key])) {
              result[key] = current[key];
            } else {
              result[key] = [...current[key]];
            }
          }
        }
      }
  
      return result;
    }, {});
  }