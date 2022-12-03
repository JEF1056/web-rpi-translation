import React from "react";
import { atom, useRecoilValue } from "recoil";

export const loadingProgressState = atom({
    key: "loadingProgress",
    default: 0,
});

export const loadingWarmupState = atom({
    key: "loadingWarmup",
    default: ["", ""],
});

function LoadingScreen() {
    const progress = useRecoilValue(loadingProgressState);
    const warmup = useRecoilValue(loadingWarmupState);

    return (
        <div className="hero min-h-screen bg-base-400">
            <div className="hero-content text-center">
                <div className="max-w-lg">
                    <progress
                        className="progress progress-primary w-56 my-6"
                        value={progress}
                        max={100}
                    ></progress>
                    {warmup[0] ? <p>{warmup[0]}</p> : null}
                    {warmup[1] ? <p>{warmup[1]}</p> : null}
                </div>
            </div>
        </div>
    );
}

export default LoadingScreen;
