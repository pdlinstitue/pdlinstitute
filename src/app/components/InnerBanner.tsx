"use client";
import Image from "next/image";


const InnerBanner:React.FC = () => {

    return ( 
        <div>
            <div className="flex flex-col h-full">
                <div className="h-[1px]"></div>
                <Image
                    alt="pdlinstitute"
                    src="/images/inr bnr.png"
                    width={1540}
                    height={250}
                />
            </div>
        </div>
     );
}
 
export default InnerBanner;