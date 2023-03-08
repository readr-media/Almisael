export const formattedDate = (date) => {
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0')
  }

  if (!date) return
  const newDate = new Date(date)
  const currentDate = new Date()
  let dateString

  switch (newDate.getFullYear()) {
    case currentDate.getFullYear():
      dateString = `${padTo2Digits(newDate.getMonth() + 1)}/${padTo2Digits(
        newDate.getDate()
      )}`
      break
    default:
      dateString = `${newDate.getFullYear()}/${padTo2Digits(
        newDate.getMonth() + 1
      )}/${padTo2Digits(newDate.getDate())}`
  }

  return dateString
}
