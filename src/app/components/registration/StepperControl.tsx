import React from 'react'

interface StepperControlProps {
  handleClick: (step: any) => void, 
  currentStep: number 
}

const StepperControl : React.FC<StepperControlProps> = ({handleClick, currentStep}) => {

  return (
    <div className='flex justify-around mt-4 mb-8'>
        <button type='button' className={`btnRight ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={()=> handleClick('back')}>Back</button>
        <button type='button' className='btnLeft' onClick={()=> handleClick("next")}>
          {currentStep === 5 ? "Finish" : "Next"}
        </button>
    </div>
  )
}

export default StepperControl;
