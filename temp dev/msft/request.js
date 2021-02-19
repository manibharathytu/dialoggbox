let request = {
	

	getUserDetails: async () => {
		try {
			let res = await client.api("/me").get();
			return res;
		} catch (error) {
			throw error;
		}
	},

	getUserCalendarEvents: async () => {
		try {
			// var time =  moment().startOf('now').utc().format()
			let res = await client.api("/me/calendar/events").get();
			// let res = await client.api("/me/calendarview?startDateTime="+time+"&endDateTime="+time).get();
			console.log(res)
			return res;
		} catch (error) {
			throw error;
		}
	},


	
};
