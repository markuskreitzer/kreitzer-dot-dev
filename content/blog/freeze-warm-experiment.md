---
title: "Cooling and warming a capacitive ice sensor"
description: "Temperature and oscillator measurements from the January 2–3, 2026 experiments."
date: "2026-01-03"
date_display: "January 3, 2026"
tags: ["PhD research", "Experiments", "Ice sensing", "Data analysis"]
published: true
---

The recording from the evening of January 2, 2026 runs for a little over ten hours, through an overnight experiment in the freezer. At the beginning, the thermocouple reads 19.5°C; by the end it has fallen to −25.75°C. Between those readings there is a long interval during which the temperature changes very little, although the electrical response of the capacitive sensor continues to change. That part of the recording is of particular interest to me, because I am trying to understand what the sensor can tell us about the material around its electrodes while it cools and freezes.

Temperature and capacitance give different views of this process. The thermocouple measures at its junction, while the capacitive sensor responds to the material within the field of its electrodes. Their readings may be affected by different parts of the sample and may change on different timescales. Recording them together allows the electrical response to be followed through the cooling process, including any changes that occur during a thermal plateau.

The setup used an RP2040 to record a MAX31855 thermocouple interface and a relaxation oscillator, with a relay selecting between two circuit settings. The experiment plan specified deionized water. Along with the time and sample number, each record contains the thermocouple temperature, the MAX31855's internal temperature, the two frequency readings, and a fault flag from the thermocouple interface. The frequency fields are named `freq_high` and `freq_low`, although their numerical values run in the opposite order: the former contains a few kilohertz and the latter a few hundred kilohertz. I have retained those names in the plots to keep the connection with the recorded data clear.

There are 3,244 rows in the January 2 file, of which 26 have a nonzero thermocouple fault flag. I omitted those rows from all three plotted traces, leaving gaps in place of the affected measurements. The remaining samples are shown without smoothing, including the first few minutes of the recording.

![January 2 cooling experiment with separate panels for temperature, freq_high, and freq_low over 10.27 hours.](/research/capacitive-sensing/assets/cooling.png)

*Temperature and the two recorded frequency channels during cooling. All three panels use the same time axis, with the frequencies converted from hertz to kilohertz.*

Both frequency channels make a large excursion near the beginning. Once that initial interval has passed, `freq_low` settles near 210 kHz for roughly the first two hours before rising over several hours toward 283 kHz. The temperature remains near +2°C for much of the early recording, then drops below zero and eventually approaches −26°C. Keeping the beginning in the plot makes it possible to distinguish its brief excursion from the much slower change that follows; a minimum and maximum taken over the whole file would combine the two.

The plateau near +2°C needs some care in interpretation. Its position on the recorded temperature scale could be affected by the thermocouple calibration and by the location of the junction relative to the electrodes. I have left the temperatures as recorded, because assigning an exact freezing point would require that information. The electrical change and the plateau can be described from these traces, while the amount of ice and its distribution around the sensor remain questions for further observation.

The response in `freq_high` is more complicated. Around four hours it falls toward 2.0 kHz, then rises, dips again, and gradually approaches 2.4 kHz. This differs from the broad rise in `freq_low`, which is why I have kept the channels separate in the initial analysis. A ratio might eventually be useful, but it would combine these two responses and would need to be interpreted in terms of the circuit settings that produced them.

The next file begins on January 3, a little over two minutes after the first one ends, with a higher sample count and the same initial temperature of −25.75°C. Over the next 8.63 hours the temperature rises to 13.5°C. Although its folder is labeled as a freeze-cycle follow-up, the measurements describe warming, and that is how I refer to this trace. It contains 2,724 rows, with 19 thermocouple-fault rows omitted by the same rule used for the cooling recording.

![January 3 warming trace with temperature rising from below freezing and the freq_low channel falling through a long plateau.](/research/capacitive-sensing/assets/warming.png)

*The following recording, in which the temperature rises and the higher-valued frequency channel gradually declines.*

Within the first hour, the thermocouple reaches another plateau near +2°C, where it remains for several hours. During much of that time, `freq_low` continues to decline, eventually reaching about 206 kHz at the warmer end of the recording. There is therefore an extended interval in which the electrical response changes while the thermocouple reading is comparatively steady. This is the behavior I would like to examine in a repeat experiment, with enough information about the sample to relate the frequency to what is happening around the electrodes.

Changes in phase or in the distribution of material near the sensor could contribute to this response, as could temperature lag or changes in contact and coverage. The recordings do not separate those possibilities. They do, however, allow a comparison of the electrical readings over similar temperature ranges, provided the different histories of the two runs are kept in view. For the table below, I grouped fault-free samples into intervals that include the lower temperature limit and exclude the upper one, then calculated the median `freq_low` in each group.

| Recorded temperature | Cooling median | Cooling samples | Warming median | Warming samples |
|---|---|---|---|---|
| −25 to −20°C | 283.20 kHz | 1,016 | 282.86 kHz | 18 |
| −10 to −5°C | 277.59 kHz | 133 | 278.44 kHz | 35 |
| 0 to 5°C | 210.11 kHz | 1,040 | 235.03 kHz | 1,749 |
| 10 to 15°C | 210.24 kHz | 53 | 206.04 kHz | 324 |

The medians are close in the two cold intervals, while the warming median in the 0–5°C interval is about 24.9 kHz higher than the cooling median. Much of each recording lies in this broad temperature range, but the time spent there and the course of the electrical change are different. The sample counts reflect that duration, and adjacent readings are correlated, so they cannot be treated as independent repetitions of the experiment. The comparison describes the two recorded paths rather than establishing intrinsic dielectric hysteresis at matched equilibrium temperatures.

For the same reason, I have kept the labels as cooling and warming throughout. Sorting every point below zero into an ice group and every point above zero into a water group would give the thermocouple more authority over the state of the sample than these records support. The long plateaus, and the frequency changes within them, are part of what still needs to be explained.

In a repeat, I would record when the container enters and leaves the freezer, check the thermocouple against a temperature reference, and document the positions of the junction and electrodes. Photographs or another independent observation during the transition would help establish whether the sample's phase and coverage were changing as the electrical readings changed. Verifying the relay settings and measuring the oscillator with known capacitors before the run would also provide a reference for the readout circuit. With those observations alongside the same continuous recording, the changes seen here could be related more closely to the condition of the sample.

The [cooling data](/research/capacitive-sensing/data/2026-01-02_water-freeze-cycle.csv), [warming data](/research/capacitive-sensing/data/2026-01-03_water-freeze-cycle.csv), [temperature-bin calculations](/research/capacitive-sensing/data/temperature-bins.csv), and [analysis script](/research/capacitive-sensing/scripts/analyze.py) accompany the plots.

A [downloadable archive](/research/capacitive-sensing/reproduce.zip) contains the files and reproduction instructions.
