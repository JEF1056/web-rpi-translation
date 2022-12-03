import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { ModelListener } from "./inference/predict";
import LoadingScreen from "./screens/LoadingScreen";
import { RecoilRoot, atom, useRecoilValue } from "recoil";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import AppScreen from "./screens/AppScreen";

export const modelLoadedState = atom({
    key: "modelLoaded",
    default: false,
});

function Layout() {
    const loaded = useRecoilValue(modelLoadedState);

    return (
        <React.StrictMode>
            {!loaded ? <LoadingScreen /> : <AppScreen />}
        </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <RecoilRoot>
        <Layout />
        <ModelListener />
    </RecoilRoot>
);

// Use a service worker: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
