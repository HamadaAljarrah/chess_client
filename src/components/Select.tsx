import React, { useEffect, useRef, useState } from 'react';

export interface SelectOption {
    label: string,
    value: string
}

interface Props {
    options: SelectOption[],
    onSelect: (option: SelectOption) => void
    disabled?: boolean,
}


const Select = ({ onSelect, options, disabled }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption>(options[0]);

    const selectRef = useRef<HTMLDivElement>(null);

    const handleSelect = (option: SelectOption) => {
        onSelect(option);
        setIsOpen(false);
        setSelectedOption(option);
    };

    const handleClick = () => setIsOpen(prev => !prev);


    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node))
            setIsOpen(false);
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);

    }, []);

    return (
        <div ref={selectRef} className='relative w-full'>
            <div className={`px-3 w-full h-10 rounded-md flex justify-between items-center cursor-pointer border-[1px] border-black/15 ${disabled ? "bg-accent text-black/50" : ""}`} onClick={handleClick}><p>{selectedOption.label}</p> </div>
            <div className={`transition-all absolute left-0 right-0 bg-white border-[0.5px] border-black/30 py-4 shadow-sm rounded-md z-10 flex flex-col ${isOpen ? "top-12 opacity-100 pointer-events-auto w-auto" : "top-6 opacity-0 pointer-events-none w-0"} `}>
                {options.map((option, i) => (
                    <div className='cursor-pointer px-4 hover:bg-accent py-2' key={option.value} onClick={() => handleSelect(option)}>{option.label}</div>
                ))}
            </div>
        </div>
    );
};

export default Select;
