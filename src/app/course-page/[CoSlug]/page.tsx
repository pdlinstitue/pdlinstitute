import MarkettingCourseById from '@/app/components/MarkettingCourseById';
import { BASE_API_URL } from '@/app/utils/constant';
import React from 'react';

interface ICourseParams {
  params: Promise<{
    CoSlug: string;
  }>;
}

interface CourseItems {
  _id: string,
  coName: string, 
  coSlug: string,
  coNick:string,
  coShort:string, 
  prodType:string, 
  coElgType: string,
  coCat:string,
  coElg: string,    
  coImg: string,
  coType: string,
  coDesc:string, 
  coDon:number, 
  durDays:number, 
  durHrs:number, 
  eligibilityName?:string,
}

const CoursePage: React.FC<ICourseParams> = async ({ params }) => {

  const { CoSlug } = await params;
  let courseById : CourseItems = {
    _id: '',
    coName: '',
    coSlug: '',
    coNick: '',
    coShort: '',
    prodType: '',
    coElgType: '',
    coCat: '',
    coElg: '',
    coImg: '',
    coType: '',
    coDesc: '',
    coDon: 0,
    durDays: 0,
    durHrs: 0,
    eligibilityName: ''
  };
  
  try {
      const res = await fetch(`${BASE_API_URL}/api/marketting-courses/${CoSlug}/view-marketting-course`, {
      method: 'GET',
      cache: 'no-store', 
    });
    if (!res.ok) {
      throw new Error('Failed to fetch course data');
    }
    const data = await res.json();
    courseById = data.corById;
  } catch (error:any) {
    console.error('Error fetching course data:', error.message);
  }

  return (
    <div>
      <MarkettingCourseById courseById={courseById} />
    </div>
  );
};

export default CoursePage;
