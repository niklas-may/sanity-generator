import React, {FC, ReactElement} from 'react'
import "./styles.css";

interface Props {
  src: string
}

export const Image = ({src}: Props) => {
  return (
    <div style={{width: '100%', height: '100%'}}>
      <img src={src} style={{objectFit: 'cover'}} />
    </div>
  )
}
