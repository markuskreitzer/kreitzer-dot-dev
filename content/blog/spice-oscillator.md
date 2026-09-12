---
title: "A sensor oscillator in ngspice"
description: "The timing calculation and simulation of a Schmitt-trigger RC oscillator for capacitive sensing."
date: "2026-01"
date_display: "January 2026"
tags: ["PhD research", "SPICE", "Circuits", "Capacitive sensing"]
published: true
---

The oscillator in my capacitive-sensor experiments gives the microcontroller a frequency to count, so a change in the material around the electrodes can be observed through its effect on the timing of the circuit. To interpret that frequency, though, I need to understand the contribution of the readout as well as the capacitance of the sensor. The resistor value, switching thresholds, and behavior of the output all enter the measurement, even in a circuit with very few components.

For the calculation here, I used a Schmitt-trigger inverter with a feedback resistor and a capacitor from its input to ground. This gives a simple case in which the period can be derived directly and compared with the simulation. Specifying ideal output levels and two fixed thresholds leaves the details of a particular device for a later comparison with hardware; it also makes it possible to identify a problem in the simulation setup without having to disentangle it from a more elaborate device model.

While the output is high, the capacitor charges through the resistor until its voltage reaches the upper threshold, $V_H$. The inverter then switches low, and the capacitor discharges until it reaches the lower threshold, $V_L$, where the output returns high. For output levels of 0 and $V_{DD}$, the charging and discharging intervals follow from the usual exponential response of an RC circuit:

$$
t_{\mathrm{charge}}=RC\ln\left(\frac{V_{DD}-V_L}{V_{DD}-V_H}\right),
$$

$$
t_{\mathrm{discharge}}=RC\ln\left(\frac{V_H}{V_L}\right).
$$

Their sum is the period. With a supply of $V_{DD}=3.3$ V and assumed thresholds of $V_H=1.6$ V and $V_L=1.1$ V, this becomes

$$
T\approx0.6325RC,\qquad f\approx\frac{1.581}{RC}.
$$

A 3 kΩ resistor and 200 pF capacitor therefore give an expected frequency of about 2.64 MHz. The thresholds used here belong to the example, while those in a physical device vary with supply, temperature, and the device itself. The [SN74LVC14A datasheet](https://www.ti.com/lit/gpn/SN74LVC14A) gives the specified threshold limits and the conditions for its propagation-delay measurements, which would be needed when moving beyond this idealized calculation.

The calculation exposed a discrepancy in one of my saved netlists. Its sensor capacitance was assigned as `C_SENSOR = 200p`, but the expression that printed the theoretical frequency used `72e-9`, or 72 nF. The two capacitances differ by a factor of 360, and the latter produces a frequency near 7.32 kHz with the same resistor and thresholds. This meant the printed comparison was between two different circuits. The small percentage error reported in a nearby README could not be applied to the current 200 pF deck without resolving that difference.

There was a related question about the transient settings. The saved deck permitted a maximum step of 1 µs, whereas the ideal period at 200 pF is only about 0.38 µs. Ngspice can choose smaller internal steps as the circuit changes, but I still needed to examine the result with a more restrictive maximum step. Repeating the calculation at several step sizes would show whether the measured period was settling to a consistent value.

For these runs, the hysteresis comes from ngspice's voltage-controlled switch. Its state changes above 1.60 V or below 1.10 V and remains as it was while the capacitor voltage lies between the thresholds. The following circuit connects that switch to an ideal output buffer and the RC timing network:

```spice
.param R=3000 C=200p
Vdd supply 0 3.3
Rpull supply state 1k
S1 state 0 cap 0 schmitt OFF
.model schmitt SW(VT=1.35 VH=0.25 RON=0.001 ROFF=1e9)
Ebuffer out 0 state 0 1
Rtiming out cap {R}
Csensor cap 0 {C} IC=0
```

When the switch turns on, it pulls the state node low and the buffer copies that voltage to the output. When it turns off, the pull-up returns the state node high. The `OFF` initial condition starts the circuit in its charging state, with the capacitor initially at zero. The [ngspice manual](https://ngspice.sourceforge.io/docs/ngspice-manual.pdf) describes how the threshold and hysteresis parameters determine these transitions.

The on-resistance of 1 mΩ and off-resistance of 1 GΩ make the output levels close to 0 and 3.3 V. Because the ideal buffer isolates the timing network from the pull-up, the capacitor charges and discharges through the timing resistor without appreciably loading that part of the model. This also leaves out the output resistance and propagation delay of a physical inverter. The model can therefore be compared with the ideal timing equation, but cannot stand in for the complete behavior of an MC14049 circuit or a manufacturer's transistor-level model of a 74LVC14.

![Simulated square-wave output and exponential capacitor voltage between the two Schmitt thresholds.](/research/capacitive-sensing/assets/spice-waveform.png)

*The output and timing-capacitor voltages for 3 kΩ and 200 pF, recomputed in ngspice 47 for this write-up. The dotted lines mark the two thresholds; the plotted interval begins after startup.*

To obtain the frequency, I measured crossings at the same voltage and in the same direction, once the capacitor was oscillating between the thresholds. The fifth and fifteenth rising crossings of 1.35 V span ten periods, so their separation gives the frequency as follows:

```spice
.tran 0.2n 20u 0 0.2n UIC
.control
run
meas tran t1 when v(cap)=1.35 rise=5
meas tran t2 when v(cap)=1.35 rise=15
let frequency=10/(t2-t1)
print frequency
.endc
```

The choice of crossings matters because the first charge begins at the specified initial voltage, rather than at the lower threshold of a regular cycle. A rising and a falling crossing would also enclose only part of a period. Measuring between later rising crossings avoids both problems and allows several cycles to contribute to the estimate. I used the same resistor and threshold values for each of the following runs, varying only the capacitance or the maximum time step.

| Capacitance | Maximum step | Simulated frequency | Difference from ideal equation |
|---|---|---|---|
| 100 pF | 0.2 ns | 5.27025 MHz | +0.007% |
| 200 pF | 1 ns | 2.63158 MHz | -0.128% |
| 200 pF | 0.2 ns | 2.63465 MHz | -0.012% |
| 200 pF | 0.1 ns | 2.63505 MHz | +0.004% |
| 400 pF | 0.2 ns | 1.31752 MHz | +0.004% |

The frequency falls approximately in proportion to the increase in capacitance, as the equation predicts, and the 200 pF result approaches the calculated value as the maximum step is reduced. This agreement is a check that the numerical setup reproduces the assumptions used in the derivation. Since the same assumptions underlie both results, it gives no independent measure of how closely the circuit will match a physical sensor.

A comparison with hardware would begin with known capacitors and measurements of the inverter's output levels, thresholds, and period. Once those effects were understood, connecting the interdigitated sensor would bring in its leakage, the capacitance of the wiring, and the frequency dependence of the dielectric response. Those contributions would have to be considered when deciding how much of a frequency change could be attributed to the material around the electrodes.

The [200 pF netlist](/research/capacitive-sensing/data/oscillator-200p-0.2ns.cir), [simulation results](/research/capacitive-sensing/data/spice-summary.csv), and [analysis script](/research/capacitive-sensing/scripts/analyze.py) are available with the article.

A [downloadable archive](/research/capacitive-sensing/reproduce.zip) contains the files and reproduction instructions.
