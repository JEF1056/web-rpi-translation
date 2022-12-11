import InputBoxLabel from "./InputBoxLabel";
import { atom, useRecoilValue } from "recoil";
import { speakerIndex } from "./InputBoxLabel";

export const speakerInputs = atom({
    key: "speakerInputs",
    default: ["", ""],
});

export const speakerTranslations = atom({
    key: "speakerTranslations",
    default: ["", ""],
});

function InputBox(props) {
    const currentSpeakerTranslations = useRecoilValue(speakerTranslations);
    const currentSpeakerInputs = useRecoilValue(speakerInputs);
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
                readOnly={true}
                value={currentSpeakerInputs[props.speakerIndex - 1].concat(
                    props.text && props.speakerIndex === currentSpeakerIndex
                        ? props.text
                        : ""
                )}
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
