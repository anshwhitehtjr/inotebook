import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const s1 = {
        "name": "Harry",
        "class": "5B"
    };
    const [ state, setstate ] = useState(s1);

    const update = () => {
        setTimeout(() => {
            setstate({
                "name": "Larry",
                "class": "10B"
            });
        }, 1000);
    };

    return (
        <NoteContext.Provider value={{ state, update }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;