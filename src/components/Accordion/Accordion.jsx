import React, {useState} from "react";
import './accordion.css'
const Accordion = ({ title, content, modalMediaColor, faq, modal }) => {
    const [isOpen, setIsOpen] = useState(modal);

    const toggleAccordion = () => setIsOpen(!isOpen)

    return (
        <div className={`w-full ${faq ? "mb-3" : ""}`}>
            <div className="flex items-center justify-between cursor-pointer py-2 border-b" style={{borderColor: modalMediaColor || "#02a9ff"}} onClick={toggleAccordion}>
              <h2 className="font-Mono text-lg text-neutral-200 select-none">{title}</h2>
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
          <div className={` mt-1 accordion-content ${isOpen ? 'open' : ''} ${faq ? "text-neutral-300" : "text-neutral-200"} font-Roboto font-light`}>
            {content}
          </div>
        )}
      </div>
    );
}

export default Accordion