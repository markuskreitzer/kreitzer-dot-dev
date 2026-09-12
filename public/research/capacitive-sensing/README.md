# Capacitive-sensor calculations and measurements

The archive contains the figures, measurements, simulation netlists, and analysis script accompanying three articles at https://kreitzer.dev/blog:

- `ide-fields`: the field around an interdigitated sensor
- `spice-oscillator`: a sensor oscillator in ngspice
- `freeze-warm-experiment`: cooling and warming a capacitive ice sensor

The recorded measurements are from January 2–3, 2026. The IDE geometry notes are dated January 16, 2026, and the circuit notes specify January 2026. The illustrative field calculation and ngspice runs were prepared in September 2026 for the retrospective articles.

## Run the analysis

The reference environment uses Python 3.13.11 and ngspice 47. Install ngspice through your operating system's package manager and ensure that `ngspice` is on your PATH. From the extracted directory, run:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python scripts/analyze.py
```

The script reads the two measurement CSV files in `data/`, solves the periodic electrostatic model, runs five oscillator simulations, and calculates temperature-bin statistics. It writes figures to `assets/`, numerical results and transient traces to `data/`, and simulation logs and input checksums to `evidence/`. Running it replaces the generated files in this directory.

The measurement files contain elapsed hours, sample number, thermocouple temperature in degrees Celsius, internal temperature in degrees Celsius, `freq_high` and `freq_low` in hertz, the thermocouple fault flag, and the recorded timestamp. The frequency-channel names are preserved from the acquisition system; their numerical ordering is opposite to their names. Samples with a nonzero fault flag remain in the CSV files and are omitted from the plots and temperature-bin statistics.

The field model uses an assumed substrate relative permittivity of 4.5 and excludes electrode ends, pads, wiring, and coatings. The ideal oscillator model omits device delay and output resistance. The experimental records do not independently establish sample phase or equilibrium dielectric hysteresis. The articles explain these limits alongside the results.
