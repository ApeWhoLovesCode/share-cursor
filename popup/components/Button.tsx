import React from 'react';
import "../style.css";

export default function Button({className, ...props}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className={`font-medium px-3 py-2 rounded flex justify-center items-center transition-all text-gray-300 bg-zinc-600 hover:bg-zinc-500 hover:text-gray-200 cursor-pointer ${className}`} {...props}></div>
  )
}