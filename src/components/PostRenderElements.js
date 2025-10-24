import { useEffect, useState } from 'react';

/**
 * Used as a workaround for adding components post render.
 * @param {*} param0 
 * @returns 
 */
export default function PostRenderElements({ newElements }) {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        if (newElements) {
            setElements(newElements);
        }
    }, [newElements]);

    return (
        <>
            {elements.map((element) => {
                return <div>{element}</div>
            })}
        </>
    );
}