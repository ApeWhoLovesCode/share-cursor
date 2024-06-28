import React from 'react';
import "../style.css";

type Props = {
  isClosed?: boolean
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export default function SelectBox({isClosed, className, ...props}: Props) {
  return (
    <div className={`${isClosed ? ' line-through !bg-zinc-700' : ''} font-medium text-xs px-3 py-2 rounded-sm flex justify-center items-center transition-all text-gray-300 bg-zinc-600 hover:bg-zinc-500 hover:opacity-90 hover:text-gray-200 cursor-pointer ${className}`} {...props}></div>
  )
}