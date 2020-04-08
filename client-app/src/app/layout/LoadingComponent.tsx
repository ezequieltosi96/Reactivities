import React from 'react'
// importamos semantic ui
import {Dimmer, Loader} from 'semantic-ui-react'

interface IProps {
    // el "?" significa parametro opcional
    inverted?: boolean,
    content?: string
}

export const LoadingComponent: React.FC<IProps> = ({inverted = true, content}) => {
    return (
        <Dimmer active inverted={inverted} >
            <Loader content={content} />
        </Dimmer>
    )
}
