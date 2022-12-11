import React from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import InputBox from "../components/InputBox";
import {
    languages,
    speakerIndex,
    selectedLanguages,
} from "../components/InputBoxLabel";
import { speakerInputs } from "../components/InputBox";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { setByArrayIndex } from "../helpers";
import { predict } from "../inference/predict";

export const translateInput = atom({
    key: "translateInput",
    default: "",
});

export const translateOutput = atom({
    key: "translateOutput",
    default: "",
});

let isRecording = false;

function AppScreen() {
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [currentSpeakerIndex, setCurrentSpeakerIndex] =
        useRecoilState(speakerIndex);
    const [currentSpeakerInputs, setCurrentSpeakerInputs] =
        useRecoilState(speakerInputs);
    const currentSelectedLanguages = useRecoilValue(selectedLanguages);

    return (
        <div className="hero min-h-screen bg-base-400">
            <div className="flex flex-col w-full border-opacity-50">
                <InputBox
                    top={true}
                    text={isRecording ? transcript : ""}
                    speakerIndex={1}
                />
                <div className="divider">
                    <div className="form-control">
                        <div
                            className="tooltip"
                            data-tip={
                                !SpeechRecognition.browserSupportsSpeechRecognition()
                                    ? "Speech recognition is not supported by this browser"
                                    : "Ready to record"
                            }
                        >
                            <button
                                disabled={
                                    !SpeechRecognition.browserSupportsSpeechRecognition()
                                }
                                onClick={() => {
                                    isRecording = !isRecording;
                                    if (isRecording) {
                                        resetTranscript();
                                        setCurrentSpeakerInputs(
                                            setByArrayIndex(
                                                currentSpeakerInputs,
                                                currentSpeakerIndex - 1,
                                                ""
                                            )
                                        );
                                        SpeechRecognition.startListening({
                                            language:
                                                languages[
                                                    currentSelectedLanguages[
                                                        currentSpeakerIndex - 1
                                                    ]
                                                ],
                                        });
                                    } else {
                                        let content = `${transcript}`.trim();
                                        SpeechRecognition.stopListening();
                                        setCurrentSpeakerInputs(
                                            setByArrayIndex(
                                                currentSpeakerInputs,
                                                currentSpeakerIndex - 1,
                                                content
                                            )
                                        );
                                        console.log(currentSpeakerInputs);
                                        predict(
                                            currentSpeakerIndex,
                                            content,
                                            currentSelectedLanguages[
                                                currentSpeakerIndex - 1
                                            ],
                                            currentSelectedLanguages[
                                                currentSpeakerIndex - 1 ? 0 : 1
                                            ]
                                        );
                                    }
                                }}
                            >
                                {!SpeechRecognition.browserSupportsSpeechRecognition()
                                    ? "❌🎙️"
                                    : isRecording
                                    ? "🟡🎤"
                                    : "🟢🎙️"}
                            </button>
                        </div>
                        <label className="label cursor-pointer">
                            <span className="label-text mr-5">Speaker 1</span>
                            <input
                                type="checkbox"
                                className="toggle"
                                onClick={() =>
                                    setCurrentSpeakerIndex(
                                        currentSpeakerIndex === 1 ? 2 : 1
                                    )
                                }
                            />
                            <span className="label-text ml-5">Speaker 2</span>
                        </label>
                    </div>
                </div>
                <InputBox
                    top={false}
                    text={isRecording ? transcript : ""}
                    speakerIndex={2}
                />
            </div>
        </div>
    );
}

export default AppScreen;
