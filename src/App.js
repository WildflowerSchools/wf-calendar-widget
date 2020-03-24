import React from "react"

import Calendar from "./Calendar"
import "util"

function Index(props) {
  return <Calendar calendarId={props.calendarId} apiKey={props.apiKey} />
}

export default Index
