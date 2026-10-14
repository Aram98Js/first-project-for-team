

import React from 'react'


interface ButtonProps{
    className?:string,
    children: React.ReactNode,
    onClick: ()=>void,
  
}
const Button = ({className,children,onClick}:ButtonProps) => {
  return (
    <button onClick={onClick}  className={className}>{children}</button>
  )
}

export default Button