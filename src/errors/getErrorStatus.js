const getErrorStatus = (error) => {
  return JSON.parse(JSON.stringify(error)).status;
}

export default getErrorStatus;
