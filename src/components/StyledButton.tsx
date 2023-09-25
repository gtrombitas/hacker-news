import React from 'react';
import './StyledButton.css';

export interface StyleBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
}

export default function StyledButton(props: StyleBtnProps) {
    return <button className="styled_button" {...props} >
        {props.icon && <i className={`fa fa-${props.icon}`}></i>}
        {props.children}
    </button>
}