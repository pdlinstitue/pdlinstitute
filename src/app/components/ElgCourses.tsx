"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MyCoursesProps {
  myCoData: any;
}

const MyElgCourses: React.FC<MyCoursesProps> = ({ myCoData }) => {

  const router = useRouter();

  return (
    <div>
      {myCoData?.map((cor: any) => (
        <div className="max-w-[400px]" key={cor._id}>
          <div className="flex flex-col bg-white rounded-md shadow-xl p-9 gap-1 border-[1.5px] border-orange-600">
            {cor.coImg ? (
              <Image
                src={`/api/image-upload?name=${cor.coImg}`}
                alt="courseImage"
                width={320}
                height={220}
              />):null
            }
            <h2 className="text-lg font-bold bg-gray-200 p-2 text-center">{cor.coName}</h2>
            <div className="flex justify-between text-sm gap-2">
              <p><span className="font-bold">Category:</span> {cor.coCat}</p>
              <p><span className="font-bold">Type:</span> {cor.coType}</p>
            </div>
            <div className="flex justify-between text-sm gap-2">
              <p><span className="font-bold">Duration:</span> {cor.durDays} DAYS</p>
              <p><span className="font-bold">Hrs:</span> {cor.durHrs}</p>
            </div>
            <div className='flex justify-between text-sm gap-2'>
              <p className="text-sm"><span className="font-bold">Eligibility:</span> {cor.eligibilityName}</p>
              <p className="text-sm"><span className="font-bold">Fee: &#8377;</span> {cor.coDon?.toLocaleString()}</p>
            </div>
            <button 
              type='button' 
              className='btnRight'
              onClick={() => cor.gglFmLink && window.open(cor.gglFmLink, '_blank')}
            >
              Google Form
            </button>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                className="btnLeft"
                onClick={() => router.push(`/account/my-courses/${cor._id}/read-more`)}
              >
                Read More
              </button>
              <button
                type="button"
                className="btnRight"
                onClick={() => router.push(`/account/my-courses/${cor._id}/enroll-course`)}
              >
                Enroll
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyElgCourses;