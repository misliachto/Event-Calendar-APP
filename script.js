/*VARIABLES*/
let monthNavigation = 0
let clickedDate = null
let allEvents = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : []

const contentContainerElement = document.querySelector("#content-container")
const headerContainerElement = document.querySelector("#header-container")
const calendarContainerElement = document.querySelector("#calendar-container")
const actionsContainerElement = document.querySelector("#actions-container")
const eventDateEl = document.querySelector("#event-date")
const messageElement = document.querySelector("#message")

/*selecting input elements*/
const eventTitleEl = document.querySelector("#event-title")
const eventStartTimeEl = document.querySelector("#event-start-time")
const eventEndTimeEl = document.querySelector("#event-end-time")
const eventTypeEl = document.querySelector("#event-type")

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

/*FUNCTIONS*/
const openActionsModal = (date) => {
  clickedDate = date
  actionsContainerElement.style.display = "flex"
  eventDateEl.innerText = `Chosen event date: ${clickedDate}`

  const filteredEvents = allEvents.filter((item) => clickedDate === item.date)

  if (filteredEvents) {
    document.getElementById("events-container").innerHTML =
      filteredEvents.reduce((total, item) => {
        total += `
      <ul class="list-container">
      <li><strong>Date: </strong>${clickedDate}</li>
      <li><strong>Title: ${item.title}</strong></li>
      <li><strong>Time: </strong> ${item.startTime}</li>
      <li><strong>End time: </strong>${item.endTime}</li>
      <li><strong>Event Type: </strong>${item.type}</li>
      <button class="del-btn" data-set="${item.id}">Delete</button>
      </ul>
      `
        return total
      }, "")
  }
  const delButton = document.querySelectorAll(".del-btn")
  delButton.forEach((item) => {
    item.addEventListener("click", deleteHandler)
  })
}

const deleteHandler = (e) => {
  let clickedDelete = parseFloat(e.target.dataset.set)
  const currentEvents = allEvents.filter((item) => item.id !== clickedDelete)
  localStorage.setItem("events", JSON.stringify(currentEvents))
  allEvents = currentEvents
  contentLoad()
  openActionsModal(clickedDate)
  messageElement.innerHTML = "Event was deleted"
}

const contentLoad = () => {
  const completeDate = new Date() /* Getting full date */

  if (monthNavigation !== 0) {
    completeDate.setMonth(new Date().getMonth() + monthNavigation)
  }
  /* Getting day/month/year separately */
  const day = completeDate.getDate()
  const month = completeDate.getMonth()
  const year = completeDate.getFullYear()

  const firstDayOfTheMonth = new Date(year, month, 1)
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

  const dateString = firstDayOfTheMonth.toLocaleDateString("en-gb", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  })

  headerContainerElement.innerHTML = ""
  calendarContainerElement.innerHTML = ""

  const previousMonthDays = weekdays.indexOf(dateString.split(", ")[0])

  document.querySelector(
    "#current-date-title"
  ).innerText = `${completeDate.toLocaleDateString("en-gb", {
    month: "long",
  })} ${year}`

  for (let i = 1; i <= previousMonthDays + totalDaysInMonth; i++) {
    const dayContainer = document.createElement("div")
    dayContainer.classList.add("day-container")
    calendarContainerElement.appendChild(dayContainer)

    const dateString = `${month + 1}/${i - previousMonthDays}/${year}`

    if (i > previousMonthDays) {
      dayContainer.innerText = i - previousMonthDays

      if (i - previousMonthDays === day && monthNavigation === 0) {
        dayContainer.id = "current-day"
      }

      const scheduledEvent = allEvents.filter(
        (item) => item.date === dateString
      )

      if (scheduledEvent.length > 0) {
        for (let i = 0; i < scheduledEvent.length; i++) {
          const eventDiv = document.createElement("div")
          if (scheduledEvent[i].type === "Call") {
            eventDiv.classList.add("blue")
          } else if (scheduledEvent[i].type === "Meeting") {
            eventDiv.classList.add("green")
          } else {
            eventDiv.classList.add("red")
          }
          eventDiv.innerText = scheduledEvent[i].title
          dayContainer.appendChild(eventDiv)
        }
      }
    } else {
      dayContainer.classList.add("prevous-month-days")
    }
    dayContainer.addEventListener("click", () => {
      openActionsModal(dateString)
    })
  }
  /*Laying out all weekdays from an array */
  for (let i = 0; i < weekdays.length; i++) {
    let weekdaysElement = document.createElement("div")
    weekdaysElement.classList.add("header-weekdays")
    weekdaysElement.innerText = weekdays[i]
    headerContainerElement.appendChild(weekdaysElement)
  }
}

const nextMonthHandler = () => {
  monthNavigation++
  contentLoad()
}

const previousMonthHandler = () => {
  monthNavigation--
  contentLoad()
}

const saveEventHandler = (e) => {
  e.preventDefault()
  if (
    eventTitleEl.value &&
    eventStartTimeEl.value &&
    eventEndTimeEl.value &&
    eventTypeEl.value
  ) {
    allEvents.push({
      id: Math.random(),
      date: clickedDate,
      title: eventTitleEl.value,
      startTime: eventStartTimeEl.value,
      endTime: eventEndTimeEl.value,
      type: eventTypeEl.value,
    })
    localStorage.setItem("events", JSON.stringify(allEvents))
    document.getElementById("form-container").reset()
  }
  contentLoad()
  openActionsModal(clickedDate)
  messageElement.innerHTML = "Event was added"
}

const closeEventModal = (e) => {
  e.preventDefault()
  actionsContainerElement.style.display = "none"
  document.querySelector("#events-container").innerHTML = ""
  messageElement.innerHTML = ""
}

const handler = () => {
  console.log("veikia")
}

/*EVENTS*/
document.querySelector("#save-btn").addEventListener("click", saveEventHandler)
document.querySelector("#cancel-btn").addEventListener("click", closeEventModal)
document
  .querySelector("#next-month-button")
  .addEventListener("click", nextMonthHandler)
document
  .querySelector("#previous-month-button")
  .addEventListener("click", previousMonthHandler)

contentLoad()
