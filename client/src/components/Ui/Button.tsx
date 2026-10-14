

import React from 'react'


interface ButtonProps{
    className?:string,
    children: React.ReactNode,
    onClick: ()=>void,
    type?: "button"|"submit"
  
}
const Button = ({className,type,children,onClick}:ButtonProps) => {
  return (
    <button type={type} onClick={onClick}  className={className}>{children}</button>
  )
}

export default Button