import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [machine, setMachine] = useState({
    id: "ENGINE-185",

    // Sensor data
    temperature: 82,
    vibration: 0.84,
    rpm: 1800,
    load: 72,

    // ML output
    failureProbability: null,
    healthScore: null,

    // SHAP output
    explanation: {
      temperature: 0,
      vibration: 0,
      rpm: 0,
      load: 0
    },

    // Java decision - placeholder for now
    decision: "REPLACE"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // ==================================================
  // LOAD ML PREDICTION + SHAP EXPLANATION
  // ==================================================

  useEffect(() => {

    const loadMachineData = async () => {

      setLoading(true);
      setError(null);

      try {

        // ==================================================
        // 1. GET ML PREDICTION
        // ==================================================

        const predictionResponse = await fetch(
          "http://localhost:3000/api/predict",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              temperature: machine.temperature,
              vibration: machine.vibration,
              rpm: machine.rpm,
              load: machine.load
            })
          }
        );


        if (!predictionResponse.ok) {
          throw new Error("Prediction request failed");
        }


        const predictionData =
          await predictionResponse.json();


        // ==================================================
        // 2. GET SHAP EXPLANATION
        // ==================================================

        const explainResponse = await fetch(
          "http://localhost:3000/api/explain",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              temperature: machine.temperature,
              vibration: machine.vibration,
              rpm: machine.rpm,
              load: machine.load
            })
          }
        );


        if (!explainResponse.ok) {
          throw new Error("Explanation request failed");
        }


        const explainData =
          await explainResponse.json();


        // ==================================================
        // 3. UPDATE REACT STATE
        // ==================================================

        setMachine(prev => ({
          ...prev,

          failureProbability:
            predictionData.failure_probability,

          healthScore:
            predictionData.health_score,

          explanation: {
            temperature:
              explainData.features.temperature,

            vibration:
              explainData.features.vibration,

            rpm:
              explainData.features.rpm,

            load:
              explainData.features.load
          }
        }));


      } catch (err) {

        console.error(err);

        setError(err.message);

      } finally {

        setLoading(false);

      }

    };


    loadMachineData();

  }, []);


  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div>

          <h1>MACHINA</h1>

          <p>
            AI Industrial Maintenance Intelligence
          </p>

        </div>


        <div className="status">

          <span className="status-dot"></span>

          ENGINE-185 · ONLINE

        </div>

      </header>


      {/* ================= DASHBOARD ================= */}

      <main className="dashboard">


        {/* ================= HEALTH ================= */}

        <section className="health-section">


          <div className="health-card">

            <p className="label">
              MACHINE HEALTH
            </p>


            <div className="health-score">

              {loading
                ? "..."
                : machine.healthScore ?? "--"
              }

              <span>
                /100
              </span>

            </div>


            <div className="health-bar">

              <div
                className="health-fill"
                style={{
                  width: `${machine.healthScore || 0}%`
                }}
              ></div>

            </div>

          </div>



          <div className="risk-card">

            <p className="label">
              FAILURE RISK
            </p>


            <div className="risk-value">

              {loading
                ? "..."
                : machine.failureProbability !== null
                  ? `${Math.round(
                      machine.failureProbability * 100
                    )}%`
                  : "--"
              }

            </div>


            <p>
              Predicted failure probability
            </p>

          </div>

        </section>


        {/* ================= ERROR ================= */}

        {error && (

          <section className="panel">

            <p>
              ⚠ {error}
            </p>

          </section>

        )}


        {/* ================= SENSORS ================= */}

        <section className="panel">

          <h2>
            Sensor Data
          </h2>


          <div className="sensor-grid">


            <Sensor
              label="Temperature"
              value={machine.temperature}
              unit="°C"
            />


            <Sensor
              label="Vibration"
              value={machine.vibration}
              unit=""
            />


            <Sensor
              label="RPM"
              value={machine.rpm}
              unit=""
            />


            <Sensor
              label="Load"
              value={machine.load}
              unit="%"
            />

          </div>

        </section>


        {/* ================= SHAP ================= */}

        <section className="panel">

          <h2>
            Why is the model concerned?
          </h2>


          <p className="description">

            SHAP feature contributions
            for the current prediction.

          </p>


          <Explanation
            label="Vibration"
            value={machine.explanation.vibration}
          />


          <Explanation
            label="Temperature"
            value={machine.explanation.temperature}
          />


          <Explanation
            label="Load"
            value={machine.explanation.load}
          />


          <Explanation
            label="RPM"
            value={machine.explanation.rpm}
          />

        </section>


        {/* ================= DECISION ================= */}

        <section className="decision-card">

          <p className="label">
            MAINTENANCE DECISION
          </p>


          <h2>
            {machine.decision}
          </h2>


          <p>
            Decision generated by the
            Machina Decision Engine.
          </p>

        </section>


      </main>

    </div>
  );
}


/* ==================================================
   SENSOR COMPONENT
================================================== */

function Sensor({ label, value, unit }) {

  return (

    <div className="sensor">

      <p>
        {label}
      </p>


      <strong>

        {value} {unit}

      </strong>

    </div>

  );
}


/* ==================================================
   SHAP EXPLANATION COMPONENT
================================================== */

function Explanation({ label, value }) {

  const percentage = Math.min(
    Math.abs(value) * 300,
    100
  );


  return (

    <div className="explanation">


      <div className="explanation-header">

        <span>
          {label}
        </span>


        <span>

          +{value.toFixed(3)}

        </span>

      </div>


      <div className="explanation-bar">

        <div
          className="explanation-fill"
          style={{
            width: `${percentage}%`
          }}
        ></div>

      </div>

    </div>

  );
}


export default App;