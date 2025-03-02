"use server";
import { BASE_API_URL } from "@/app/utils/constant";
import { UpcomingEventsType } from "@/app/events/page";

const PublicEventList = async () => {
    const response = await fetch(`${BASE_API_URL}/api/events`);
    
    // Check if the response is OK before parsing the data
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const eventList = data.eveList;
    const publicEventList = eventList.filter((item: UpcomingEventsType) => item.eveAud === 'Public');

    return publicEventList;
}

export default PublicEventList;
