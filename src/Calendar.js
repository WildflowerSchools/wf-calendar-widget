import React, { useEffect, useState } from "react"
import useAxios from "axios-hooks"
import moment from "moment"
import "moment-timezone"
import queryString from "query-string"
import { FaMapMarkerAlt, FaClock } from "react-icons/fa"
import stripHtml from "string-strip-html"
import { Card } from "react-bootstrap"
import EllipsisString from "./EllipsisString"

function Calendar(props) {
  const { calendarId, apiKey, dayRange = 10 } = props

  const timeMin = moment()
    .tz("America/New_York")
    .startOf("day")

  const GOOGLE_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ssZ"
  const CAL_QUERY_PARAMS = {
    key: apiKey,
    singleEvents: true,
    orderBy: "startTime",
    timeMin: timeMin.format(GOOGLE_DATE_FORMAT),
    timeMax: timeMin.add(dayRange, "days").format(GOOGLE_DATE_FORMAT),
    timeZone: "ET"
  }
  const CAL_URL = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${queryString.stringify(
    CAL_QUERY_PARAMS
  )}`

  const FRONTEND_START_TIME_FORMAT = "MMM Do, YYYY h:mm"
  const FRONTEND_END_TIME_FORMAT = "h:mm a z"

  const [events, setEvents] = useState([])
  const [{ data, loading, error }] = useAxios(CAL_URL)

  useEffect(() => {
    if (!loading && !error && data) {
      const _events = data.items.map(event => {
        return {
          start: event?.start
            ? moment(
                event.start.date || event.start.dateTime,
                GOOGLE_DATE_FORMAT
              )
                .tz("America/New_York")
                .format(FRONTEND_START_TIME_FORMAT)
            : null,
          end: event?.end
            ? moment(event.end.date || event.end.dateTime, GOOGLE_DATE_FORMAT)
                .tz("America/New_York")
                .format(FRONTEND_END_TIME_FORMAT)
            : null,
          title: event?.summary || "",
          link: event?.htmlLink || "",
          description: stripHtml(event?.description || "", {
            ignoreTags: "<a>"
          }),
          location: event?.location || ""
        }
      })

      setEvents(_events)
    }
  }, [data, loading, error])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>
  return (
    <div className="wf-events">
      {events.map((event, idx) => {
        return (
          <Card key={idx} className="wf-event">
            <Card.Body>
              <Card.Title as="h5" className="color-wf-teal">
                <a className="color-wf-teal" href={event.link} target="_blank">
                  {event.title}
                </a>
              </Card.Title>
              {event.location && (
                <Card.Subtitle className="mb-3 text-muted">
                  <small>
                    <FaMapMarkerAlt className="pr-1" />
                    <a href={event.location} target="blank">
                      {event.location}
                    </a>
                  </small>
                </Card.Subtitle>
              )}
              {event.description && (
                <Card.Text className="mb-3">
                  <EllipsisString text={event.description} />
                </Card.Text>
              )}
              <Card.Subtitle className="text-muted">
                <small>
                  <FaClock className="pr-1" />
                  {event.start}-{event.end}
                </small>
              </Card.Subtitle>
            </Card.Body>
          </Card>
        )
      })}
    </div>
  )
}

export default Calendar
