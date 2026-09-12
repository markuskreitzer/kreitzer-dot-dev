---
title: "Reading a MAX31855 thermocouple with Rust on ESP32"
description: "Decoding a four-byte SPI response and adding temperature to an oscillator measurement loop."
date: "2025-12-30"
tags: ["Rust", "ESP32", "Embedded Systems", "Temperature Sensing", "SPI", "Thermocouple", "Hardware", "esp-hal"]
published: true
slug: "esp32-max31855-temperature-sensor-rust"
---

The water sensor measures oscillator frequency as the material around the sensor changes. Temperature gives that frequency trace another point of comparison during a freezing experiment.

A thermocouple reading near freezing is useful evidence, but it can't by itself prove that a frequency change came from ice formation. Probe placement, thermal lag, and other sources of drift still need to be accounted for.

## Four bytes over SPI

The MAX31855 returns a 32-bit word containing a thermocouple reading, an internal temperature reading, and fault flags. The host supplies a clock and reads the response; the converter doesn't take a command byte.

The thermocouple field uses 0.25°C increments. The internal temperature field uses 0.0625°C increments. These are resolutions, not complete accuracy specifications. The [datasheet](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX31855.pdf) gives separate error limits and operating conditions for each thermocouple variant.

The driver reads four bytes, assembles them in wire order, and sign-extends the two temperature fields:

```rust
pub fn read_temperature(&mut self) -> Result<TempReading, Error<SPI::Error>> {
    // Read 32 bits from MAX31855
    let mut buffer = [0u8; 4];
    self.spi.read(&mut buffer).map_err(|e| Error::Spi(e))?;

    // Parse the 32-bit response
    let raw = u32::from_be_bytes(buffer);

    // Extract fault bits (bits 0, 1, 2)
    let fault_oc = (raw & 0x01) != 0;  // Open circuit
    let fault_scg = (raw & 0x02) != 0; // Short to GND
    let fault_scv = (raw & 0x04) != 0; // Short to VCC

    // Determine fault type
    let fault = if fault_oc {
        Some(Fault::OpenCircuit)
    } else if fault_scg {
        Some(Fault::ShortToGnd)
    } else if fault_scv {
        Some(Fault::ShortToVcc)
    } else {
        None
    };

    // Extract thermocouple temperature (bits 31-18, 14-bit signed)
    let thermocouple_raw = ((raw >> 18) & 0x3FFF) as u16;
    let thermocouple_raw = if thermocouple_raw & 0x2000 != 0 {
        // Negative - sign extend
        (thermocouple_raw | 0xC000) as i16
    } else {
        thermocouple_raw as i16
    };
    let temperature_c = (thermocouple_raw as f32) * 0.25;

    // Extract internal temperature (bits 15-4, 12-bit signed)
    let internal_raw = ((raw >> 4) & 0x0FFF) as u16;
    let internal_raw = if internal_raw & 0x0800 != 0 {
        (internal_raw | 0xF000) as i16
    } else {
        internal_raw as i16
    };
    let internal_c = (internal_raw as f32) * 0.0625;

    Ok(TempReading {
        temperature_c,
        internal_c,
        fault,
    })
}
```

Bits 31–18 contain the thermocouple value; bits 15–4 contain the internal value. Bits 0–2 distinguish an open circuit, a short to ground, and a short to VCC. Bit 16 is the summary fault flag. The excerpt selects one fault if several detail bits are set; retaining the raw word can help diagnose that case.

The negative-temperature branch matters. Treating a signed field as an unsigned value produces a large positive reading just when an ice experiment gets interesting.

## Give the driver a SpiDevice

The crate version considered for this project used embedded-hal 0.2, while the application used esp-hal 1.0. Implementing the short read protocol directly avoided adapting the older driver interface.

The esp-hal 1.0 initialization used here is:

```rust
let spi_config = SpiConfig::default().with_mode(Mode::_0);

let spi_bus = Spi::new(peripherals.SPI2, spi_config)
    .expect("Failed to create SPI bus")
    .with_sck(peripherals.GPIO18)
    .with_mosi(peripherals.GPIO23)
    .with_miso(peripherals.GPIO19);
```

The MAX31855 doesn't need MOSI. That pin can be omitted for a dedicated MAX31855 bus; it appears here because the surrounding hardware also includes an SPI potentiometer.

`SpiDevice` associates a bus with a chip-select pin. For a dedicated bus, `embedded-hal-bus` provides `ExclusiveDevice`:

```rust
use embedded_hal_bus::spi::ExclusiveDevice;

let cs = Output::new(peripherals.GPIO15, Level::High, OutputConfig::default());
let spi_device = ExclusiveDevice::new_no_delay(spi_bus, cs).unwrap();
let mut temp_sensor = Max31855Driver::new(spi_device);
```

The wrapper manages chip select around each transaction. As its [documentation](https://docs.rs/embedded-hal-bus/latest/embedded_hal_bus/spi/struct.ExclusiveDevice.html) notes, it owns the bus exclusively. Sharing a physical bus with another driver needs a shared-bus adapter; two exclusive owners aren't a bus-sharing scheme. `new_no_delay` also requires that the driver never request a delay operation.

## Connect the sensor

| MAX31855 connection | ESP32 connection |
|---|---|
| SCK | GPIO18 |
| SO / MISO | GPIO19 |
| CS | GPIO15 |
| Ground | Common ground |
| Supply | 3.3 V for the bare converter; check the breakout board |

Check the board's pin constraints before reusing this map. In particular, attached hardware on an ESP32 strapping pin can affect booting.

If an AD5292 shares the wires, give it a separate chip-select line and verify both devices' timing requirements. Keep unselected devices inactive while another transaction runs.

## Keep a failed reading out of the data

The measurement loop distinguishes a usable temperature from a fault:

```rust
// In main measurement loop
println!("│ TEMPERATURE:");

let temperature = if temp_available {
    match temp_sensor.read_temperature() {
        Ok(reading) if reading.fault.is_none() => {
            println!("│   Thermocouple: {:.2}°C", reading.temperature_c);
            println!("│   Internal: {:.2}°C", reading.internal_c);
            Some(reading.temperature_c)
        }
        Ok(reading) => {
            println!("│   ⚠ Thermocouple fault: {:?}", reading.fault.unwrap());
            None
        }
        Err(_) => {
            println!("│   ⚠ Temperature read error");
            None
        }
    }
} else {
    println!("│   ○ Sensor not available");
    None
};

let mut data_point = DataPoint::from_dual_band(dual_band, new_pos, controller.error());
if let Some(temp) = temperature {
    data_point = data_point.with_temperature(temp);
}
```

A valid value goes into the `DataPoint`, CSV output, serial display, and ThingSpeak field 6. When a read fails, the frequency measurement can continue with temperature absent. Downstream analysis must preserve that missing value rather than treating it as zero degrees.

The convenience method `try_read_temperature()` returns `Option<f32>`. That is useful when the caller only needs availability. Keep the full result when diagnosing wiring or SPI failures, because `None` loses the reason.

## Build and flash the example

The project-local example uses this sequence:

```bash
cd libraries/max31855
. ~/export-esp.sh
cargo build --example basic_temperature --release --features esp32

espflash save-image --chip esp32 --merge \
  target/xtensa-esp32-none-elf/release/examples/basic_temperature \
  firmware.bin

esptool --chip esp32 --port /dev/cu.usbserial-10 --baud 460800 \
  write-flash 0x0 firmware.bin

screen /dev/cu.usbserial-10 115200
```

Replace the serial port with the attached board's device. The build depends on the workspace's library and Cargo configuration; the snippets in this article aren't a standalone firmware project.

## Check the reading against a reference

An ice-water bath is a useful check near zero degrees. Allow the mixture and probe to settle, keep the tip away from the container wall, and record both the reference and converter readings. Keep the raw samples, fault flags, and probe arrangement with the result.

A mean near zero checks one part of the range. A small standard deviation describes repeatability during that run. Neither establishes the full accuracy of the converter, thermocouple, wiring, and thermal setup.

At a 1 MHz SPI clock, shifting 32 bits takes 32 µs before software and chip-select overhead. The converter's temperature conversion takes much longer, so reading the bus more often doesn't necessarily produce a new sample. Choose the logging interval for the experiment's thermal behavior and the converter timing, then verify it on the actual setup.
