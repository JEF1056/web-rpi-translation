import { tokenize, detokenize } from "./tokenizer";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    loadingProgressState,
    loadingWarmupState,
} from "../screens/LoadingScreen";
import { speakerTranslations } from "../components/InputBox";
import { modelLoadedState } from "../index";
import { setByArrayIndex } from "../helpers";

const model_worker = new Worker("/model_worker.js");

let warmup_prompt =
    "A journey of a thousand miles begins with a single step.";
let warmup_started = false;

function predict(id, input, language_from, language_to) {
    // Model worker accepts UUID and message id
    model_worker.postMessage([id, tokenize(`translate ${language_from} to ${language_to}: ${input}`)]);
    console.log("input", `translate ${language_from} to ${language_to}: ${input}`);
}

function ModelListener() {
    const setLoadingProgress = useSetRecoilState(loadingProgressState);
    const setLoadingWarmup = useSetRecoilState(loadingWarmupState);
    const [currentSpeakerTranslations, setCurrentSpeakerTranslations] =
        useRecoilState(speakerTranslations);
    const [modelLoaded, setModelLoaded] = useRecoilState(modelLoadedState);

    model_worker.addEventListener("message", (event) => {
        let message = event.data;

        switch (message["type"]) {
            case "info":
                switch (message["details"]) {
                    case "loaded":
                        setLoadingWarmup([warmup_prompt, "..."]);
                        break;
                    case "loading":
                        setLoadingProgress(message["progress"] * 90);
                        if (message["progress"] === 1 && !warmup_started) {
                            predict("warmup", warmup_prompt, "English", "Spanish");
                            warmup_started = true;
                        }
                        break;
                    default:
                }
                break;
            case "work":
                let detokenized = detokenize(message["tokens"]);
                if (!modelLoaded) {
                    switch (message["id"]) {
                        case "warmup":
                            setLoadingWarmup([warmup_prompt, detokenized]);
                            break;
                        default:
                    }
                }
                break;
            case "done":
                if (!modelLoaded) {
                    setTimeout(() => setModelLoaded(true), 2000);
                    setLoadingProgress(100);
                } else {
                    let detokenized = detokenize(message["tokens"]);
                    console.log("output", detokenized)
                    setCurrentSpeakerTranslations(
                        setByArrayIndex(
                            currentSpeakerTranslations,
                            message["id"] - 1,
                            detokenized
                        )
                    );
                }
                break;
            default:
        }
    });
}

export { ModelListener, predict };
