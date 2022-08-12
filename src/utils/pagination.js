export const getPageResults = (list, page = 1, limit = 20) => {
  const skip = limit < list.length ? (page - 1) * limit : 0
  return list.slice(skip, skip + limit)
}
