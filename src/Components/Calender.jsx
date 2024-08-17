import { useState } from 'react';
import './Styles/Calender.css';

const Calender = () => {
    
    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());    
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventTime, setEventTime] = useState({hours: "00", minutes: "00"});
    const [eventText, setEventText] = useState('');
    const [editEvent, setEditEvent] = useState(null);
    const [eventCategory, setEventCategory] = useState('work');
    const [filterCategory, setFilterCategory] = useState('all');

    const firstDayInMonth = new Date(currentYear, currentMonth, 1).getDay();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const prevMonth = () => {
        setCurrentMonth(prevMonth => (prevMonth === 0 ? 11 : prevMonth - 1));
        setCurrentYear(prevYear => (currentMonth === 0 ? prevYear - 1 : prevYear));
    }

    const nextMonth = () => {
        setCurrentMonth(nextMonth => (nextMonth === 11 ? 0 : nextMonth + 1));
        setCurrentYear(nextYear => (currentMonth === 11 ? nextYear + 1 : nextYear));
    }

    const handleDayClick = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        const today = new Date();

        if (clickedDate >= today || isSameDay(today, clickedDate)) {
            setSelectedDate(clickedDate);
            setShowEventPopup(true);
            setEventText('');
            setEventTime({ hours: "00", minutes: "00" });
            setEventCategory('work');
            setEditEvent(null);
        } else {
            alert("Please choose upcoming date");
        }
    }

    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    const handleEventSubmit = () => {
        const newEvent = {
            id: editEvent ? editEvent.id : Date.now(),
            date: selectedDate,
            time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
            text: eventText,
            category: eventCategory
        }
    
        let updatedEvents = [...events];
    
        if (editEvent) {
            updatedEvents = updatedEvents.map(event =>
                event.id === editEvent.id ? newEvent : event
            );
        } else {
            updatedEvents.push(newEvent);
        }
    
        updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
        setEvents(updatedEvents);
        setEventTime({ hours: "00", minutes: "00" });
        setEventText("");
        setEventCategory('work');
        setShowEventPopup(false);
        setEditEvent(null);
    }

    const handleEditEvent = (event) => {
        setSelectedDate(new Date(event.date));
        setEventTime({
            hours: event.time.split(":")[0],
            minutes: event.time.split(":")[1],
        });
        setEventText(event.text);
        setEventCategory(event.category);
        setEditEvent(event);
        setShowEventPopup(true);
    }

    const handleDeleteEvent = (eventId) => {
        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);
        alert("Event Deleted");
    }

    const handleCategoryChange = (e) => {
        setFilterCategory(e.target.value);
    }

    return (
        <div className='calender-app'>
            <div className="calender">
                <h1 className="heading">Calender</h1>
                <div className="navigate-date">
                    <h2 className="month">{month[currentMonth]}</h2>
                    <h2 className="year">{currentYear}</h2>
                    <div className="buttons">
                        <i className='bx bx-chevron-left' onClick={prevMonth}></i>
                        <i className='bx bx-chevron-right' onClick={nextMonth}></i>
                    </div>
                </div>
                <div className="weekdays">
                    {daysOfWeek.map(day => (
                        <span key={day}>{day}</span>
                    ))}
                </div>
                <div className="days">
                    {[...Array(firstDayInMonth).keys()].map((_, i) => (
                        <span key={`empty-${i}`}></span>
                    ))}
                    {[...Array(daysInMonth).keys()].map(day => (
                        <span
                            key={day + 1}
                            className={((day + 1 === currentDate.getDate()) && (currentMonth === currentDate.getMonth()) && (currentYear === currentDate.getFullYear())) ? 'current-date' : ''}
                            onClick={() => handleDayClick(day + 1)}
                        >
                            {day + 1}
                        </span>
                    ))}
                </div>
            </div>

            <div className="events">
                <div className="filter-buttons">
                    <label><input type="radio" name="filter" value="all" checked={filterCategory === 'all'} onChange={handleCategoryChange} /> All</label>
                    <label><input type="radio" name="filter" value="work" checked={filterCategory === 'work'} onChange={handleCategoryChange} /> Work</label>
                    <label><input type="radio" name="filter" value="personal" checked={filterCategory === 'personal'} onChange={handleCategoryChange} /> Personal</label>
                    <label><input type="radio" name="filter" value="occasions" checked={filterCategory === 'occasions'} onChange={handleCategoryChange} /> Occasions</label>
                </div>

                {showEventPopup && (
                    <div className="event-popup">
                        <div className="time-input">
                            <div className="event-popup-time">Time</div>
                            <input
                                type="number"
                                name='hours'
                                min={0}
                                max={24}
                                className='hours'
                                value={eventTime.hours}
                                onChange={(e) => setEventTime({ ...eventTime, hours: e.target.value })}
                            />
                            <input
                                type="number"
                                name='minutes'
                                min={0}
                                max={60}
                                className='minutes'
                                value={eventTime.minutes}
                                onChange={(e) => setEventTime({ ...eventTime, minutes: e.target.value })}
                            />
                        </div>
                        <textarea
                            placeholder='Enter Event Title (Maximum 60 characters)'
                            name="event-title"
                            id="event-title"
                            value={eventText}
                            onChange={(e) => {
                                if (e.target.value.length <= 60) {
                                    setEventText(e.target.value);
                                }
                            }}
                        ></textarea>
                        <div className="category-select">
                            <label>Category:</label>
                            <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}>
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="occasions">Occasions</option>
                            </select>
                        </div>
                        <button className="event-add-btn" onClick={handleEventSubmit}>Add Event</button>
                        <button className="close-event" onClick={() => setShowEventPopup(false)}>
                            <i className="bx bx-x"></i>
                        </button>
                    </div>
                )}

                <div className="eventsContainer">
                    {events.filter(event => filterCategory === 'all' || event.category === filterCategory).map((event, index) => (
                        <div className="event" key={index}>
                            <div className="event-date-wrapper">
                                <div className="event-date">{`${event.date.getDate()} ${month[event.date.getMonth()]} ${event.date.getFullYear()}`}</div>
                                <div className="event-time">{event.time}</div>
                            </div>
                            <div className="event-title">
                                {event.text}
                                <div className="event-category">{event.category}</div>
                            </div>
                            <div className="event-buttons">
                                <i className="bx bxs-edit" onClick={() => handleEditEvent(event)}></i>
                                <i className="bx bxs-trash" onClick={() => handleDeleteEvent(event.id)}></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calender;
