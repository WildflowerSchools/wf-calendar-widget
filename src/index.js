/** @format */

import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

import "./styles/index.scss"

export const render = (
  calendarId = process.env.CALENDAR_ID,
  apiKey = process.env.GOOGLE_API_KEY,
  options = {}
) =>
  ReactDOM.render(
    <App calendarId={calendarId} apiKey={apiKey} {...options} />,
    document.getElementById("root")
  )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
