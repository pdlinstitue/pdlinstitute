import Image from "next/image"
import NavMenu from "./components/navbar/navBar"


export default function Home() {
  return (
    <div>
      <NavMenu/>
      <div className="h-screen">
        <div className="w-full">
          <Image src="/images/cover image.jpg" alt="pdlInstitute" width={1560} height={600}/>
        </div>
      </div>
    </div>
  )
}
