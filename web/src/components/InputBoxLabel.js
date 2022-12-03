import { atom, useRecoilState, useRecoilValue } from "recoil";

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

    return (
        <label class="label">
            <span class="label-text-alt">
                Speaker {props.speakerIndex}{" "}
                {currentSpeakerIndex === props.speakerIndex
                    ? "(speaking)"
                    : null}
            </span>
            <span class="dropdown label-text-alt dropdown-end">
                <label tabindex="0">
                    {currentSelectedLanguages[props.speakerIndex - 1]}
                </label>
                <ul
                    tabindex="0"
                    class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
                >
                    {Object.keys(languages)
                        .sort()
                        .map((language) =>
                            !currentSelectedLanguages.includes(language) ? (
                                <li>
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
