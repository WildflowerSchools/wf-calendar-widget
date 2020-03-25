import React from "react"

function EllipsisString(props) {
  const { length = 150, useWordBoundary = true, text = "" } = props

  const truncatedText = () => {
    if (text.length <= length) {
      return text
    }
    const subString = text.substr(0, length - 1)
    return (
      (useWordBoundary
        ? subString.substr(0, subString.lastIndexOf(" "))
        : subString) + "..."
    )
  }

  return truncatedText()
}

export default EllipsisString
