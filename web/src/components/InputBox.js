import InputBoxLabel from "./InputBoxLabel";
import { atom, useRecoilValue, useRecoilState } from "recoil";
import { speakerIndex } from "./InputBoxLabel";
import { setByArrayIndex } from "../helpers";
import { selectedLanguages } from "./InputBoxLabel";
import { predict } from "../inference/predict";

export const speakerInputs = atom({
    key: "speakerInputs",
    default: ["", ""],
});

export const speakerTranslations = atom({
    key: "speakerTranslations",
    default: ["", ""],
});

function TextInput(event, speakerIndex, get, set, languages) {
    console.log(event);
    switch (event.inputType) {
        case "insertText":
            set(
                setByArrayIndex(
                    get,
                    speakerIndex - 1,
                    `${get[speakerIndex - 1]}${event.data}`
                )
            );
            break;
        case "deleteContentBackward":
            set(
                setByArrayIndex(
                    get,
                    speakerIndex - 1,
                    get[speakerIndex - 1].slice(0, -1)
                )
            );
            break;
        case "insertLineBreak":
            predict(
                speakerIndex,
                get[speakerIndex ? 0 : 1],
                languages[speakerIndex ? 0 : 1],
                languages[speakerIndex]
            );
            break;
        default:
            break;
    }
}

function InputBox(props) {
    const currentSpeakerTranslations = useRecoilValue(speakerTranslations);
    const [currentSpeakerInputs, setCurrentSpeakerInputs] =
        useRecoilState(speakerInputs);
    const currentSelectedLanguages = useRecoilValue(selectedLanguages);
    const currentSpeakerIndex = useRecoilValue(speakerIndex);

    return (
        <div className="form-control p-5">
            {props.top ? (
                <InputBoxLabel speakerIndex={props.speakerIndex} />
            ) : null}
            {!props.top ? (
                <textarea
                    className="textarea my-5 resize-none"
                    readOnly
                    value={currentSpeakerTranslations[props.speakerIndex - 1]}
                    disabled
                ></textarea>
            ) : null}
            <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Waiting for speech input..."
                value={currentSpeakerInputs[props.speakerIndex - 1].concat(
                    props.text && props.speakerIndex === currentSpeakerIndex
                        ? props.text
                        : ""
                )}
                onChange={(e) => {
                    TextInput(
                        e.nativeEvent,
                        props.speakerIndex,
                        currentSpeakerInputs,
                        setCurrentSpeakerInputs,
                        currentSelectedLanguages
                    );
                }}
            ></textarea>
            {props.top ? (
                <textarea
                    className="textarea my-5 resize-none"
                    readOnly
                    value={currentSpeakerTranslations[props.speakerIndex - 1]}
                    disabled
                ></textarea>
            ) : null}
            {!props.top ? (
                <InputBoxLabel speakerIndex={props.speakerIndex} />
            ) : null}
        </div>
    );
}

export default InputBox;
