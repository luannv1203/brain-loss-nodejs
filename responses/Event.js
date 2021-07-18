module.exports = (data) => {
  return {
    id: data._id,
    title: data.title,
    startTime: data.startTime,
    endTime: data.endTime,
    location: data.location || null,
    isAllDay: data.isAllDay || false,
    note: data.note || null,
    notification: data.notification || null,
    tag: data.tag || null,
  }
}