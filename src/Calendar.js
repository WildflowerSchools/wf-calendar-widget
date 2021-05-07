import React, { useEffect, useState } from "react"
import useAxios from "axios-hooks"
import moment from "moment"
import "moment-timezone"
import queryString from "query-string"
import { FaMapMarkerAlt, FaClock, FaVideo, FaPhone } from "react-icons/fa"
import { stripHtml } from "string-strip-html"
import { Card } from "react-bootstrap"
import EllipsisString from "./EllipsisString"

function Calendar(props) {
  const { calendarId, apiKey, dayRange = 10, showDescription = false } = props

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

  const FRONTEND_START_TIME_FORMAT = "dddd, MMM Do, YYYY h:mm"
  const FRONTEND_END_TIME_FORMAT = "h:mm a z"

  const [events, setEvents] = useState([])
  const [{ data, loading, error }] = useAxios(CAL_URL)

  const isValidHttpUrl = val => {
    let url

    try {
      url = new URL(val)
    } catch (_) {
      return false
    }

    return url.protocol === "http:" || url.protocol === "https:"
  }

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
          location: event?.location || "",
          video:
            event?.conferenceData?.entryPoints
              ?.filter(e => {
                return e.entryPointType === "video"
              })
              .map(e => {
                return {
                  uri: e.uri,
                  label: e.label,
                  meetingCode: e.meetingCode,
                  password: e.password
                }
              }) || [],
          phone:
            event?.conferenceData?.entryPoints
              ?.filter(e => {
                return e.entryPointType === "phone"
              })
              .map(e => {
                return {
                  uri: e.uri,
                  label: e.label,
                  meetingCode: e.meetingCode,
                  password: e.password
                }
              }) || []
        }
      })

      console.log(_events)
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
                    <FaMapMarkerAlt className="pe-1" />
                    {isValidHttpUrl(event.location) ? (
                      <a href={event.location} target="_blank">
                        {event.location}
                      </a>
                    ) : (
                      <span>{event.location}</span>
                    )}
                  </small>
                </Card.Subtitle>
              )}
              {!isValidHttpUrl(event.location) &&
                event.video.map((video, key) => (
                  <Card.Subtitle className="mb-3 text-muted" key={key}>
                    <small>
                      <FaVideo className="pe-1" />
                      <a href={video.uri} target="_blank">
                        {video.uri}
                      </a>
                      {video.meetingCode && (
                        <div className={"me-1"}>
                          Meeting Code: {video.meetingCode}
                        </div>
                      )}
                      {video.password && <div>Password: {video.password}</div>}
                    </small>
                  </Card.Subtitle>
                ))}
              {event.phone.map((phone, key) => (
                <Card.Subtitle className="mb-3 text-muted" key={key}>
                  <small>
                    <FaPhone className="pe-1" />
                    <a href={phone.uri} target="_blank">
                      {phone.label}
                    </a>
                    {phone.meetingCode && (
                      <div>Meeting Code: {phone.meetingCode}</div>
                    )}
                    {phone.password && <div>Password: {phone.password}</div>}
                  </small>
                </Card.Subtitle>
              ))}
              {showDescription && event.description && (
                <Card.Text className="mb-3">
                  <EllipsisString text={event.description} />
                </Card.Text>
              )}
              <Card.Subtitle className="text-muted">
                <small>
                  <FaClock className="pe-1" />
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
