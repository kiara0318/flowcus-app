import React, {useEffect} from "react";

const WebPlayback = () => {
    useEffect(() => {
        // Load Spotify's Web Playback SDK
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        // Initialize Spotify player once the SDK is ready
        script.onload = () => {
            const token = localStorage.getItem("spotifyAccessToken");
            const player = new window.Spotify.Player({
                name: "Web Player",
                getOAuthToken: (cb) => {
                    cb(token);
                },
                volume: 0.5,
            });

            player.addListener("ready", ({device_id}) => {
                console.log("Ready with Device ID", device_id);
            });

            player.addListener("not_ready", ({device_id}) => {
                console.log("Device ID has gone offline", device_id);
            });

            player.connect(); // Connect the player
        };

        return () => {
            // Clean up the script element on unmount
            document.body.removeChild(script);
        };
    }, []);

    return <div id="web-player"/>;
};

export default WebPlayback;
