import { tokenize, detokenize } from "./tokenizer";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    loadingProgressState,
    loadingWarmupState,
} from "../components/LoadingScreen";
import { modelLoadedState } from "../index";

const model_worker = new Worker("/model_worker.js");

let warmup_prompt = "translate English to Mandarin: A journey of a thousand miles begins with a single step.";
let warmup_started = false;

function predict(id, input) {
    // Model worker accepts UUID and message id
    model_worker.postMessage([id, tokenize(input.trim())]);
    console.log("input", input);
}

function ModelListener() {
    const setLoadingProgress = useSetRecoilState(loadingProgressState);
    const setLoadingWarmup = useSetRecoilState(loadingWarmupState);
    const [modelLoaded, setModelLoaded] = useRecoilState(modelLoadedState);

    model_worker.addEventListener("message", (event) => {
        let message = event.data;

        switch (message["type"]) {
            case "info":
                switch (message["details"]) {
                    case "loaded":
                        setLoadingWarmup(warmup_prompt + " ...");
                        break;
                    case "loading":
                        setLoadingProgress(message["progress"] * 90);
                        if (message["progress"] === 1 && !warmup_started) {
                            predict("warmup", "complete: " + warmup_prompt);
                            warmup_started = true;
                        }
                        break;
                    default:
                }
                break;
            case "work":
                if (!modelLoaded) {
                    let detokenized = detokenize(message["tokens"]);
                    switch (message["id"]) {
                        case "warmup":
                            setLoadingWarmup(
                                warmup_prompt + "<br><br>" +
                                    (detokenized.startsWith(" ")
                                        ? detokenized
                                        : " " + detokenized)
                            );
                            break;
                        default:
                    }
                }
                break;
            case "done":
                if (!modelLoaded) {
                    // setTimeout(() => setModelLoaded(true), 2000);
                    setLoadingProgress(100);
                }
                break;
            default:
        }
    });
}

export { ModelListener, predict };
