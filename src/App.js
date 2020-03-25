import React from "react"

import Calendar from "./Calendar"
import "util"

function Index(props) {
  const { calendarId, apiKey, ...other } = props
  return <Calendar calendarId={calendarId} apiKey={apiKey} {...other} />
}

export default Index
