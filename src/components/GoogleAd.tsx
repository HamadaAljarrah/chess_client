import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const GoogleAd = () => {
    useEffect(() => {
        if (window.adsbygoogle) window.adsbygoogle.push({});
    }, []);

    return (
        <ins
            className="adsbygoogle"
            data-adtest="on"
            style={{ display: "block" }}
            data-ad-client="ca-pub-5090202305243130"
            data-ad-slot="2997873164"
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    );
};

export default GoogleAd;
