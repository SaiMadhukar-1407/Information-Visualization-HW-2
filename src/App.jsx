import { useEffect, useState } from "react";
import MainPlot from "./components/MainPlot";
import ScatterplotGroup from "./components/ScatterplotGroup";
import "./index.css";

const App = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/datasaurus.json")
            .then((response) => response.json())
            .then((jsonData) => setData(jsonData));
    }, []);

    return (
        <div className="container">
            {data && (
                <>
                    {/* Row for Dino Plot and Bar Chart */}
                    <div className="row">
                        <MainPlot data={data} />
                    </div>

                    {/* Scatterplot Group Centered */}
                    <div className="scatterplot-group-container">
                        <ScatterplotGroup data={data} />
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
