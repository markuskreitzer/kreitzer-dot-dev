---
title: "Measuring a signal period on ESP32 with Rust"
description: "A polling frequency meter: edge timing, timeouts, averaging, and the limits of a loopback test."
date: "2025-12-28"
tags: ["Rust", "ESP32", "Embedded Systems", "Signal Processing", "Frequency Measurement", "IoT", "Hardware"]
published: true
slug: "esp32-frequency-meter-rust"
---

The frequency meter starts with a GPIO input and a clock. Wait for a rising edge, record the time, then wait for the next rising edge. The interval is one period.

That is a small amount of code. The awkward part is deciding how much to trust the number when the ESP32 is also handling WiFi and other work.

## Start with the period

For a periodic signal,

$$f = \frac{1}{T}$$

where $T$ is the period in seconds and $f$ is in hertz. At 1 kHz, a period lasts 1,000 microseconds.

The library calls its type `WavelengthMeter`, although it measures time between edges, not a spatial wavelength. It owns one input:

```rust
pub struct WavelengthMeter<'d> {
    pin: Input<'d>,
}
```

The period measurement uses two calls to an edge-wait helper:

```rust
fn measure_single_period(&mut self) -> Option<u64> {
    // Wait for rising edge (LOW to HIGH transition)
    self.wait_for_edge(Level::Low, Level::High)?;

    // Record start time
    let start = Instant::now();

    // Wait for next rising edge
    self.wait_for_edge(Level::Low, Level::High)?;

    // Calculate period in microseconds
    let elapsed = start.elapsed();
    Some(elapsed.as_micros())
}
```

`as_micros()` expresses the elapsed time in whole microseconds. That representation sets a limit on what the returned value can show. A fast CPU clock doesn't give this API nanosecond measurement resolution.

For a small timing error, the approximate relative frequency error is:

$$\frac{|\Delta f|}{f} \approx \frac{|\Delta T|}{T}$$

One microsecond is 0.1% of a 1 kHz period, but 1% of a 10 kHz period. Polling delays add to that quantization error.

## Don't wait forever for an edge

A disconnected sensor or a constant input must return control to the caller. The helper uses a timeout for the whole edge search:

```rust
fn wait_for_edge(&mut self, from_level: Level, to_level: Level) -> Option<()> {
    let timeout_start = Instant::now();

    while self.pin.level() != from_level {
        if timeout_start.elapsed().as_millis() > EDGE_TIMEOUT_MS {
            return None;
        }
    }

    while self.pin.level() != to_level {
        if timeout_start.elapsed().as_millis() > EDGE_TIMEOUT_MS {
            return None;
        }
    }

    Some(())
}
```

With `EDGE_TIMEOUT_MS = 1000`, a search stops after roughly one second. The lowest usable frequency also depends on signal phase and duty cycle: this code first waits for the starting level, then for the transition. A nominal 1 Hz signal is therefore a boundary case rather than a guaranteed lower limit.

The caller receives `None` on timeout. That distinguishes a missing measurement from a measured frequency of zero. A zero-microsecond period also needs to be rejected before taking its reciprocal.

## Average without promising accuracy

For $N$ period measurements:

$$T_{\mathrm{avg}} = \frac{1}{N}\sum_{i=1}^{N} T_i$$

The default uses ten samples. If their errors were independent, unbiased, and had equal variance, the standard deviation of the mean would fall by $\sqrt{N}$. Polling errors need not satisfy those assumptions. Interrupt delays can be correlated, and averaging won't recover edges the loop missed.

The sample buffer is fixed-size:

```rust
const MAX_SAMPLES: usize = 100;
let mut measurements = [0u64; MAX_SAMPLES];
```

A hundred `u64` entries occupy 800 bytes before other stack use. This implementation doesn't need a heap. `no_std` alone doesn't prohibit allocation; allocation would require an allocator and the `alloc` crate.

## The GPIO configuration

The esp-hal 1.0 form puts the pull configuration in `InputConfig`:

```rust
let config = InputConfig::default().with_pull(Pull::Down);
Input::new(pin, config)
```

The constructor carries the peripheral lifetime into the meter:

```rust
pub fn new_with_pin<P>(gpio: P) -> Self
where
    P: esp_hal::gpio::InputPin + 'd,
{
    let config = InputConfig::default().with_pull(Pull::Down);
    let pin = Input::new(gpio, config);
    Self { pin }
}
```

These types constrain how the peripheral is used. They don't guarantee that the electrical signal is clean or that the polling loop catches every transition.

## Check with a generated signal

The LEDC peripheral can supply a square wave for a loopback check:

```rust
lstimer0.configure(esp_hal::ledc::timer::config::Config {
    duty: esp_hal::ledc::timer::config::Duty::Duty13Bit,
    clock_source: esp_hal::ledc::timer::LSClockSource::APBClk,
    frequency: Rate::from_hz(1000),  // 1 kHz test signal
})
```

Wire the selected output to the measurement input and use a common ground. Useful test points include:

| Frequency | Period |
|---|---|
| 100 Hz | 10,000 µs |
| 500 Hz | 2,000 µs |
| 1,000 Hz | 1,000 µs |
| 2,000 Hz | 500 µs |
| 5,000 Hz | 200 µs |

The recorded example for this project reports 1,000 µs and 1,000 Hz with ten samples while WiFi was connected. That is a matching displayed value at one test point. It doesn't establish zero measurement error or immunity to WiFi activity. A source and a meter on the same board can also share clock error.

For a stronger check, use an independent signal source, retain individual readings, and compare idle operation with sustained radio traffic. Count timeouts as well as successful measurements.

## Calling the meter

```rust
// Basic usage
let input_pin = Input::new(peripherals.GPIO15, config);
let mut meter = WavelengthMeter::new(input_pin);

// Measure period (wavelength) in microseconds
if let Some(wavelength_us) = meter.measure_wavelength(10) {
    println!("Period: {} μs", wavelength_us);
}

// Or measure frequency directly
if let Some(freq_hz) = meter.measure_frequency(10) {
    println!("Frequency: {} Hz", freq_hz);
}
```

Polling keeps the implementation small, but occupies the CPU while it waits and can be interrupted by other work. If the application needs tighter timing or must do useful work during measurement, hardware capture or counting is worth investigating. That decision should follow the observed errors and the required frequency range.

The [ESP-RS book](https://esp-rs.github.io/book/) covers the toolchain, and the [esp-hal documentation](https://docs.esp-rs.org/esp-hal/) describes the GPIO and timer APIs. The library file is `esp32-hello-world/src/freq_meter.rs` in the project workspace.
