import { atom, useRecoilState, useRecoilValue } from "recoil";
import { speakerInputs } from "../components/InputBox";
import { predict } from "../inference/predict";

export const languages = {
    Cantonese: "zh-HK",
    English: "en-US",
    Mandarin: "zh-CN",
    Spanish: "es-ES",
    French: "fr-FR",
    German: "de-DE",
    Japanese: "ja-JP",
    Korean: "ko-KR",
};

export const speakerIndex = atom({
    key: "speakerIndex",
    default: 1,
});

export const selectedLanguages = atom({
    key: "selectedLanguages",
    default: ["English", "Spanish"],
});

function InputBoxLabel(props) {
    const currentSpeakerIndex = useRecoilValue(speakerIndex);
    const [currentSelectedLanguages, setCurrentSelectedLanguages] =
        useRecoilState(selectedLanguages);
    const currentSpeakerInputs = useRecoilValue(speakerInputs);

    return (
        <label className="label">
            <span className="label-text-alt">
                Speaker {props.speakerIndex}{" "}
                {currentSpeakerIndex === props.speakerIndex
                    ? "(speaking)"
                    : null}
            </span>
            <span className="dropdown label-text-alt dropdown-end">
                <label tabIndex="0">
                    {currentSelectedLanguages[props.speakerIndex - 1]}
                </label>
                <ul
                    tabIndex="0"
                    className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
                >
                    {Object.keys(languages)
                        .sort()
                        .map((language) =>
                            !currentSelectedLanguages.includes(language) ? (
                                <li key={`${language}-${props.speakerIndex}`}>
                                    <div
                                        onClick={() => {
                                            let newSelectedLanguages =
                                                JSON.parse(
                                                    JSON.stringify(
                                                        currentSelectedLanguages
                                                    )
                                                );
                                            newSelectedLanguages[
                                                props.speakerIndex - 1
                                            ] = language;
                                            setCurrentSelectedLanguages(
                                                newSelectedLanguages
                                            );

                                            predict(
                                                (props.speakerIndex - 1 ? 0 : 1)+1,
                                                currentSpeakerInputs[
                                                    props.speakerIndex - 1
                                                        ? 0
                                                        : 1
                                                ],
                                                newSelectedLanguages[
                                                    props.speakerIndex - 1
                                                        ? 0
                                                        : 1
                                                ],
                                                newSelectedLanguages[
                                                    props.speakerIndex - 1
                                                ]
                                            );
                                        }}
                                    >
                                        {language}
                                    </div>
                                </li>
                            ) : null
                        )}
                </ul>
            </span>
        </label>
    );
}

export default InputBoxLabel;
