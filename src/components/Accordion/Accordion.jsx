import React, {useState} from "react";
import './accordion.css'
const Accordion = ({ title, content, modalMediaColor }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => setIsOpen(!isOpen)

    return (
        <div className="w-full">
            <div className="flex items-center justify-between cursor-pointer py-2 border-b" style={{borderColor: modalMediaColor}} onClick={toggleAccordion}>
                <h2 className="font-Mono text-lg text-neutral-200">{title}</h2>
                <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                >
                    <path d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        {isOpen && (
          <div className={`accordion-content py-2 text-neutral-200 font-Roboto font-light transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            {content}
          </div>
        )}
      </div>
    );
}

export default Accordion