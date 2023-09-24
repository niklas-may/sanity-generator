import React, {FC, ReactElement} from 'react'
import "./styles.css";

interface Props {
  src: string
}

export const Video = ({src}: Props) => {
  return (
    <div style={{width: '100%', height: '100%'}}>
      <video src={src} playsInline muted autoPlay loop style={{objectFit: 'cover'}} />
    </div>
  )
}
