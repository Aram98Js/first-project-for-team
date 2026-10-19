

import React from 'react'


interface ButtonProps{
    className?:string,
    children: React.ReactNode,
    onClick?: ()=>void,
    type?: "button"|"submit",
    disabled?: boolean
}
const Button = ({className,type,disabled=false,children,onClick}:ButtonProps) => {
  return (
    <button disabled={disabled} type={type} onClick={onClick}  className={className}>{children}</button>
  )
}

export default Button