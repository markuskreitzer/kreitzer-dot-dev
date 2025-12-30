---
title: "Implementing MAX31855 Thermocouple Temperature Sensing in Rust on ESP32"
description: "A deep dive into integrating a MAX31855 thermocouple amplifier with ESP32 using Rust and esp-hal 1.0, covering SPI implementation, embedded-hal compatibility challenges, and real-world integration for phase transition research"
date: "2025-12-30"
tags: ["Rust", "ESP32", "Embedded Systems", "Temperature Sensing", "SPI", "Thermocouple", "Hardware", "esp-hal"]
published: true
slug: "esp32-max31855-temperature-sensor-rust"
---

# Implementing MAX31855 Thermocouple Temperature Sensing in Rust on ESP32

Temperature measurement is crucial for understanding water-to-ice phase transitions. In this post, I'll walk through integrating a MAX31855 thermocouple amplifier into an ESP32-based water sensor system using Rust and esp-hal 1.0.

## Why Temperature Matters for Phase Transition Research

Our water sensor measures dielectric properties by monitoring oscillator frequency changes. But frequency shifts alone don't prove we're observing actual ice formation—they could be caused by environmental factors, mechanical stress, or electrical interference.

Temperature provides the ground truth: **water freezes at 0°C**. By correlating frequency changes with temperature measurements at the freezing point, we can definitively validate that our sensor is detecting real phase transitions, not noise.

## Hardware: MAX31855 Thermocouple Amplifier

The [MAX31855](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX31855.pdf) is a sophisticated thermocouple-to-digital converter that makes temperature measurement straightforward:

**Key Specifications:**
- 14-bit resolution (0.25°C)
- Built-in cold-junction compensation
- Fault detection (open circuit, shorts)
- SPI interface (read-only, up to 5 MHz)
- Temperature range: -270°C to +1800°C (K-type thermocouple)
- Accuracy: ±2°C (0-700°C range)

For water/ice experiments (0-100°C), a K-type thermocouple provides excellent accuracy with the MAX31855's ±2°C specification.

## The Implementation Challenge: embedded-hal Compatibility

Initially, I planned to use the existing [`max31855` crate](https://crates.io/crates/max31855) from crates.io. However, I quickly discovered a fundamental incompatibility:

```rust
// The max31855 crate uses embedded-hal 0.2 API
use embedded_hal::blocking::spi::Transfer;  // Old API
use embedded_hal::digital::v2::OutputPin;   // Old API

// But esp-hal 1.0 uses embedded-hal 1.0
use embedded_hal::spi::SpiDevice;           // New API
```

The `max31855` crate was designed for embedded-hal 0.2, which uses a fundamentally different pattern:
- **Old API**: Pass chip select pin to each SPI method
- **New API**: Wrap SPI bus with CS pin into a `SpiDevice` that handles CS automatically

Rather than fighting compatibility issues or writing complex adapters, I decided to implement the MAX31855 protocol directly.

## Direct SPI Implementation: Simpler Than Expected

The MAX31855 protocol is remarkably simple—a 32-bit read operation:

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

The key insight: bit manipulation is straightforward when you understand the [datasheet format](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX31855.pdf):
- Bits 31-18: Thermocouple temperature (14-bit, 0.25°C/bit)
- Bits 15-4: Internal temperature (12-bit, 0.0625°C/bit)
- Bits 0-2: Fault indicators

## Navigating esp-hal 1.0 API Changes

The [esp-hal 1.0.0 release](https://developer.espressif.com/blog/2025/10/esp-hal-1/) (October 2025) brought significant API improvements but required updating our initialization code.

### Old Pattern (pre-1.0):
```rust
let spi = Spi::new(peripherals.SPI2, 1.MHz(), SpiMode::Mode0)
    .with_sck(io.pins.gpio18)
    .with_mosi(io.pins.gpio23)
    .with_miso(io.pins.gpio19);
```

### New Pattern (1.0):
```rust
let spi_config = SpiConfig::default().with_mode(Mode::_0);

let spi_bus = Spi::new(peripherals.SPI2, spi_config)
    .expect("Failed to create SPI bus")
    .with_sck(peripherals.GPIO18)
    .with_mosi(peripherals.GPIO23)
    .with_miso(peripherals.GPIO19);
```

Key differences:
1. **Io struct changes**: GPIO pins accessed via `peripherals.GPIOXX` instead of `io.pins.gpioXX`
2. **Config-based initialization**: `Spi::new()` now takes a `Config` struct and returns `Result`
3. **Mode enum**: `SpiMode::Mode0` becomes `Mode::_0`

### Creating SpiDevice with embedded-hal-bus

The new embedded-hal 1.0 `SpiDevice` trait requires wrapping the SPI bus with a chip select pin. The [`embedded-hal-bus`](https://docs.rs/embedded-hal-bus) crate provides the solution:

```rust
use embedded_hal_bus::spi::ExclusiveDevice;

let cs = Output::new(peripherals.GPIO15, Level::High, OutputConfig::default());
let spi_device = ExclusiveDevice::new_no_delay(spi_bus, cs).unwrap();
let mut temp_sensor = Max31855Driver::new(spi_device);
```

`ExclusiveDevice` handles chip select automatically:
- Asserts CS (pulls low) before transactions
- Deasserts CS (pulls high) after transactions
- No manual GPIO manipulation needed

## Integration with the Water Sensor System

The beauty of this implementation is how seamlessly it integrates into the existing measurement loop:

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

// Automatically included in DataPoint
let mut data_point = DataPoint::from_dual_band(dual_band, new_pos, controller.error());
if let Some(temp) = temperature {
    data_point = data_point.with_temperature(temp);
}
```

Temperature is now automatically:
- Logged to CSV output
- Uploaded to ThingSpeak (Field 6)
- Displayed in serial console

The system gracefully handles sensor failures—if the MAX31855 isn't connected or faults occur, the system continues operating and simply logs `None` for temperature.

## Wiring: Sharing the SPI Bus

One elegant aspect is sharing the SPI bus between the AD5292 digital potentiometer and the MAX31855:

```
ESP32          MAX31855      AD5292
------         --------      ------
GPIO 18  ───>  SCK      ───> SCK
GPIO 23  ───>  MOSI     ───> MOSI
GPIO 19  <───  MISO     <─── MISO
GPIO 15  ───>  CS
GPIO 5   ──────────────────> CS
```

Both devices use SPI Mode 0, making bus sharing straightforward. The `ExclusiveDevice` wrapper ensures proper chip select handling—only one device is active at a time.

## Graceful Error Handling

The driver provides multiple API patterns for different use cases:

```rust
// Pattern 1: Full error handling
match sensor.read_temperature() {
    Ok(reading) if reading.fault.is_none() => {
        println!("Temperature: {:.2}°C", reading.temperature_c);
    }
    Ok(reading) => {
        println!("Fault: {:?}", reading.fault);
    }
    Err(e) => println!("SPI Error: {:?}", e),
}

// Pattern 2: Graceful degradation (returns None on any error)
if let Some(temp) = sensor.try_read_temperature() {
    println!("Valid temperature: {:.2}°C", temp);
} else {
    println!("Sensor unavailable");
}

// Pattern 3: Health check
if sensor.is_healthy() {
    println!("Sensor operational");
}
```

The `try_read_temperature()` method is particularly useful for non-critical monitoring—it returns `Option<f32>` and swallows all errors internally.

## Example Programs

The library includes two complete examples:

### Basic Temperature Reading
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

Output:
```
╔═══════════════════════════════════════════════╗
║  MAX31855 Basic Temperature Example         ║
╚═══════════════════════════════════════════════╝

Checking sensor health...
✓ MAX31855 operational

Pin Configuration:
  SCK  (Clock):       GPIO 18
  MISO (Data In):     GPIO 19
  CS   (Chip Select): GPIO 15

Starting continuous monitoring (2-second interval)...

┌─────────────────────────────────────────┐
│ Temperature: 23.25°C
│ Internal:    22.50°C
│ Status:      ✓ OK
└─────────────────────────────────────────┘
```

### Continuous Monitoring with Statistics
The second example tracks min/max/average temperatures and fault rates:

```
═══ Statistics (last 10 readings) ═══
  Average: 23.15°C
  Min:     22.75°C
  Max:     23.50°C
  Range:   0.75°C
  Faults:  0
  Fault%:  0.0%
═══════════════════════════════════════
```

## Testing and Validation

### Ice Water Bath Calibration
To validate the ±2°C accuracy specification:

1. Fill container with ice and water
2. Stir to ensure 0°C equilibrium
3. Submerge thermocouple tip (avoid container walls)
4. Record 10 readings

Expected results:
- Average: 0°C ± 2°C
- Standard deviation: < 0.5°C
- No faults

Example validation:
```
Reading 1: 0.25°C
Reading 2: 0.50°C
Reading 3: 0.25°C
Reading 4: 0.00°C
Reading 5: 0.25°C
Reading 6: 0.50°C
Reading 7: 0.25°C
Reading 8: 0.00°C
Reading 9: 0.25°C
Reading 10: 0.50°C

Average: 0.28°C ✓
Std Dev: 0.18°C ✓
Within spec: ✓ (±2°C)
```

## Lessons Learned

### 1. Direct Implementation Can Be Simpler
The MAX31855 protocol is simple enough that implementing it directly was faster and cleaner than fighting compatibility issues with existing crates. Sometimes the "not invented here" syndrome is justified.

### 2. Embedded-hal 1.0 Improves Safety
The new `SpiDevice` pattern with automatic CS handling eliminates an entire class of bugs:
- Forgetting to toggle CS
- CS timing issues
- Race conditions on shared buses

### 3. Documentation Is Essential
Clear pin tables, wiring diagrams, and troubleshooting guides saved hours during hardware integration. When documenting embedded systems, assume the reader has the board in one hand and the documentation in the other.

### 4. Graceful Degradation Matters
Making temperature measurement optional (via `Option<f32>`) ensures the main experiment continues even if the temperature sensor fails. Critical systems should degrade gracefully.

## Performance Considerations

Temperature reading is remarkably fast:
- SPI transaction: ~320 μs (32 bits @ 1 MHz)
- Bit manipulation: < 1 μs
- Total: < 500 μs per reading

The MAX31855 updates every 100ms, so we could theoretically sample at 10 Hz. However, thermal mass of the thermocouple limits useful sampling rates to ~1 Hz for water/ice experiments.

## Future Enhancements

Possible improvements:
1. **Averaging filter** - Reduce noise in temperature readings
2. **Async support** - Non-blocking temperature reads using `into_async()`
3. **Multi-device bus** - Use `RefCellDevice` for true SPI bus sharing
4. **Temperature-based triggering** - Alert when approaching 0°C
5. **Calibration offset** - User-configurable temperature correction

## Conclusion

Integrating temperature sensing transformed our water sensor from a frequency measurement device into a validated phase transition detector. The combination of:
- Direct SPI protocol implementation
- esp-hal 1.0's improved API
- embedded-hal-bus for device management
- Graceful error handling

...resulted in a robust, maintainable solution that took less than a day to implement and integrate.

The full implementation is available in the [esp32_rust repository](https://github.com/yourusername/esp32_rust) under `libraries/max31855/`.

## References

- [MAX31855 Datasheet](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX31855.pdf) - Analog Devices
- [esp-hal 1.0.0 Release](https://developer.espressif.com/blog/2025/10/esp-hal-1/) - Espressif Developer Portal
- [embedded-hal-bus Documentation](https://docs.rs/embedded-hal-bus) - docs.rs
- [SpiDevice in embedded_hal](https://docs.esp-rs.org/esp-idf-hal/embedded_hal/spi/trait.SpiDevice.html) - ESP-RS Documentation
- [Thermocouple Types Reference](https://www.omega.com/en-us/resources/thermocouple-types) - Omega Engineering

---

*Building embedded systems in Rust? I'd love to hear about your experiences! Find me on [GitHub](https://github.com/yourusername) or reach out with questions and feedback.*
