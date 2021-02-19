
window.addEventListener(
    "load",
    () => {
        init();
        // alert('11')
        getCalIfSignedIn();

    },
    false,
);

let client;
const init = async () => {
    const scopes = ["user.read", "profile", "User.ReadWrite", "Files.Read", "Files.Read.All", "Files.ReadWrite", "Files.ReadWrite.All", "Mail.Read", "Mail.ReadWrite", "Mail.Send", "Calendars.Read"];
    const msalConfig = {
        auth: {
            clientId: Secrets.clientId,
            redirectUri: "http://localhost:8080",
        },
    };

    var msalApplication = new Msal.UserAgentApplication(msalConfig);
    const msalOptions = new MicrosoftGraph.MSALAuthenticationProviderOptions(scopes);
    const msalProvider = new MicrosoftGraph.ImplicitMSALAuthenticationProvider(msalApplication, msalOptions);
    client = MicrosoftGraph.Client.initWithMiddleware({
        debugLogging: true,
        authProvider: msalProvider,
    });


};

async function getCalIfSignedIn(){



    // setTimeout( getUser, 5000)
    // setTimeout( getCal, 5000)

    await getUser();
    getCal();
}

async function getCal() {
    let res = await client.api("/me/calendar/events").get();
    console.log(res)
    listMsftMeetings(res)
}

msftUserEmail = "";
async function getUser() {

let res = await client.api("/me").get();
console.log(res)
msftUserEmail = res.userPrincipalName
}
// function getCal() {
// 	getUserCalendarEvents()
// 	.then((res) => {
//         console.log(res)
//         listMsftMeetings(res)
// 	})
// 	.catch((error) => {
// 	});
// }









// 	async function getUserDetails()  {
// 		try {
// 			let res = await client.api("/me").get();
// 			return res;
// 		} catch (error) {
// 			throw error;
// 		}
// 	}

// 	async function getUserCalendarEvents()  {
// 		try {
// 			// var time =  moment().startOf('now').utc().format()
// 			let res = await client.api("/me/calendar/events").get();
// 			// let res = await client.api("/me/calendarview?startDateTime="+time+"&endDateTime="+time).get();
// 			console.log(res)
// 			return res;
// 		} catch (error) {
// 			throw error;
// 		}
// 	}



