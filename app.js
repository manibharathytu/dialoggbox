// Copyright © 2020 IdealilyCorp. All rights reserved

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function listGoogleMeetings(event) {
    console.log(event)

    var when = event.start.dateTime;
    if (!when) {
        when = event.start.date;
    }

    var meeting = {}
    meeting.meetingId = event.id
    meeting.attendees = event.attendees ? event.attendees.map(x => x.email) : []
    meeting.meetingLink = event.hangoutLink
    meeting.start = when
    meeting.subject = event.summary
    meeting.user_email = loggedInUserGoogle
    meeting.cal_id = loggedInUserGoogle
    meeting.desc = event.description ? event.description : undefined
    meeting.cal_prov = "google"


    console.log("google meetings func")
    listMeetingsinView(meeting)


}

function appendTitle(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n\n');
    pre.appendChild(textContent);

}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        // appendTitle('Upcoming events:');
        console.log(response)
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];



                listGoogleMeetings(event)

            }
        } else {
            // appendTitle('No upcoming events found.');
        }
    });
}

function listMsftMeetings(res) {
    res.value.forEach(x => {
    var meeting = {}

        meeting.meetingId = x.iCalUId
        meeting.attendees = x.attendees ? x.attendees.map(x => x.emailAddress.name) : []
        console.log(x.onlineMeeting)
        meeting.meetingLink = x.onlineMeeting ? x.onlineMeeting.joinUrl : undefined
        console.log(meeting.meetingLink)

        meeting.start = x.start.dateTime
        meeting.subject = x.subject
        meeting.user_email = msftUserEmail
        meeting.cal_id = x.id
        meeting.desc = x.bodyPreview
        meeting.cal_prov = "msft"


console.log("msft meeting:"+meeting)
        listMeetingsinView(meeting)

console.log(" meetings:"+meetings.map(x=>x.subject))



    })
}

meetings = []
function listMeetingsinView(meeting) {
    // console.log(meeting.attendees)
    // if(meeting.attendees.length ==0 ){console.log("entered");meeting.attendees.push(meeting.user_email)} // use display name may be?
    if (!meeting.attendees.includes(meeting.user_email)) meeting.attendees.push(meeting.user_email)
    meeting.meetingLink = getMeetingLink(meeting)
    // console.log(meetingLink)
    meeting.ourMeetLink = 'http://mydialogs.com?user_email=' + meeting.user_email + "&mtg_link=" + meeting.meetingLink + '&cal_id=' + meeting.cal_id + '&mtg_id=' + meeting.meetingId
    // console.log(ourMeetLink)
    meeting.start = new Date(meeting.start).toLocaleString()
    // var d = new Date(meeting.start)
    // meeting.start = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
    // d.getHours() + ":" + d.getMinutes(); // bug :minutes print only 1 zero 
    // // todo : no date needed for today, only time is good 

    meeting.icon = meeting.cal_prov == 'google' ? "https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" : "https://outlook-1.cdn.office.net/owamail/20201221002.01/resources/images/favicon-calendar.ico"

    meetings.push(meeting)

    setTimeout(createView, 1000)
}

function createView1() {
    var pre = document.getElementById('content');
    pre.innerHTML = ""

    for (i in meetings) {
        var textContent = document.createTextNode('\n' + '  ' + meetings[i].cal_prov + '  ' + meetings[i].start + '  ' + meetings[i].subject + '  ' + meetings[i].attendees);
        var button = document.createElement('button')
        button.textContent = "meet & transcribe"
        button.onclick = function () { window.open(meetings[i].ourMeetLink) }
        pre.appendChild(textContent);
        pre.appendChild(button);
    }
}

function getMeetingLink(meeting) {
    console.log(meeting.desc)
    link = undefined

    if (meeting.meetingLink) return meeting.meetingLink
    if (meeting.desc == undefined || null || "") return undefined

    function getUrls(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex)
    }

meeting.desc = meeting.desc.replace(/(<([^>]+)>)/g, " ");
    urls = getUrls(meeting.desc)

    function isMatchingUrl(x) {
        // this causes 100% cpu and growing mem. infi loop. so commenting for now 
        // linkMatch = ["meet.google.com", "zoom", "skype"]

        //     console.log("isMatchingURL")
        //     for (i in linkMatch) { 
        //     console.log("isMatchingURL for " + i)
        //     if (x.includes(linkMatch[i])) { 
        //     console.log("isMatchingURL if " + x +" " + linkMatch[i])
        //     return true; 
        //         } 
        //     } 
        return true
    }

    if (urls) {

        console.log(urls)
        link = urls.filter(isMatchingUrl)[0]
        console.log("result " + link)
        return link
    }

    else
        return undefined
}


function createView() {



    var pre = document.getElementById('content');
    pre.innerHTML = ""

    for (i in meetings) {
        pre.innerHTML = pre.innerHTML + getMeetingHtml(meetings[i])


    }





}

function getMeetingHtml(meeting) {
    var html = ' <div class="meetingContainer">\
    <img style="width:20px;margin-left:400px" src="'+meeting.icon +'">\
    <br>\
<b>Subject</b>\
<div>'+meeting.subject+'</div>\
<br>\
\
<b>Date & Time</b>\
<div>'+ meeting.start + '</div>\
<br>\
\
<b>Participants</b>\
<div>'+meeting.attendees.join('\n')+'</div>\
<br>\
\
<button class="joinButton" onclick=window.open(\''+ meeting.ourMeetLink + '\')> Join and Transcribe Meeting</button>\
\
</div>\
<br>'

return html
}