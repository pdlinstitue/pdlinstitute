import NavMenu from "../components/navbar/navBar";
import InnerBanner from "../components/InnerBanner";
import Container from "../components/Container";
import UpcomingEvents from "../components/UpcomingEvents";
import PublicEventList from "../../../actions/getPublicEvents";
 
export type UpcomingEventsType = {
  _id:string,
  eveName:string,
  eveCatId:string,
  eveAud:string,
  eveType:string,
  eveMode:string,
  eveDon:number,
  eveShort:string,
  eveStartAt:string,
  eveEndAt:string,
  eveDesc: string,
  eveDate:string,
  eveLink:string,
  eveLoc:string,
  eveSpeak:string,
  evePer:string,
  eveCont:string,
  eveImg?:string
}

const EventsPage : React.FC = async () => {

    const eventsData : UpcomingEventsType[]  = await PublicEventList();

    return (
        <div>
            <NavMenu/>
            <InnerBanner/>
            <Container>
                <h1 className="text-center font-bold text-2xl my-9 uppercase">Upcoming Events</h1>
                <hr/>
                <UpcomingEvents eventsData={eventsData}/>
            </Container>
        </div>
    )
}
export default EventsPage;