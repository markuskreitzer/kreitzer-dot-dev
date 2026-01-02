---
title: "Getting Started with ESP32 Rust Development on macOS"
description: "A comprehensive guide to setting up ESP32 embedded Rust development on macOS, from installation to flashing your first program"
date: "2025-12-28"
tags: ["Rust", "ESP32", "Embedded Systems", "IoT", "macOS", "Hardware"]
published: true
slug: "esp32-rust-macos-setup"
---

# Getting Started with ESP32 Rust Development on macOS

Rust's memory safety and zero-cost abstractions make it an excellent choice for embedded systems development. Combined with the powerful ESP32 microcontroller, you can build reliable IoT devices with confidence. However, setting up the development environment on macOS has its quirks. This guide walks you through the entire process, including the gotchas I encountered so you don't have to.

## Why Rust on ESP32?

Before diving into the setup, here's why this combination is worth your time:

- **Memory Safety**: Rust's ownership system prevents common embedded bugs like buffer overflows and use-after-free errors
- **Zero-Cost Abstractions**: High-level code without runtime overhead
- **Growing Ecosystem**: The esp-rs community provides excellent HAL (Hardware Abstraction Layer) support
- **Great Tooling**: Cargo makes dependency management and building a breeze
- **ESP32 Power**: WiFi, Bluetooth, dual-core processing at an affordable price point

## Prerequisites

Before starting, ensure you have:
- macOS (tested on Darwin 25.1.0)
- Rust and Cargo installed (I used Rust 1.87.0)
- An actual ESP32 board (not ESP8266 - more on this later!)
- A USB cable for your board

## Key Differences from Linux Setup

Most ESP32 Rust tutorials target Linux. Here are the main macOS differences:

1. **No system packages needed** - Skip `libudev-dev` and similar Linux dependencies
2. **No permission groups** - macOS handles USB permissions differently; no `dialout` group
3. **Serial port naming** - macOS uses `/dev/cu.*` or `/dev/tty.usbserial-*`
4. **Shell differences** - macOS defaults to zsh (not bash)
5. **Deprecated templates** - Use `esp-generate` instead of `cargo-generate esp-rs/esp-template`

## Step 1: Install the ESP Toolchain Manager

First, install `espup`, which manages Rust toolchains for Espressif chips:

```bash
cargo install espup --locked
```

**Important**: Use the `--locked` flag to avoid dependency version conflicts. I learned this the hard way when the installation failed due to a package requiring a newer Rust version than I had.

## Step 2: Install ESP32 Toolchains

Run the toolchain installer:

```bash
espup install
```

This downloads and installs:
- RISC-V targets for ESP32-C series
- Xtensa Rust 1.90.0.0 toolchain for ESP32/ESP32-S series
- Xtensa LLVM
- GCC toolchain (xtensa-esp-elf)

The installer creates `~/export-esp.sh` with environment variables needed for building.

## Step 3: Configure Your Shell Environment

The ESP environment must be loaded for each terminal session. For zsh (macOS default):

```bash
# Load for current session
. ~/export-esp.sh

# Add to .zshrc for automatic loading
echo -e "\n# ESP32 Rust environment\n[ -f ~/export-esp.sh ] && . ~/export-esp.sh" >> ~/.zshrc
```

For bash users, use `.bashrc` or `.bash_profile` instead.

## Step 4: Install Project Generator

The old `cargo-generate` template is deprecated. Use the modern `esp-generate`:

```bash
cargo install esp-generate
```

## Step 5: Create Your First Project

Generate a new ESP32 project with useful options:

```bash
esp-generate --chip esp32 --headless \
  -o unstable-hal \
  -o alloc \
  -o wifi \
  -o esp-backtrace \
  esp32-hello-world
```

**Option breakdown**:
- `--chip esp32`: Target ESP32 (use `esp32c3`, `esp32s3`, etc. for variants)
- `--headless`: Non-interactive mode
- `-o unstable-hal`: Latest HAL features
- `-o alloc`: Dynamic memory allocation
- `-o wifi`: WiFi support (requires unstable-hal and alloc)
- `-o esp-backtrace`: Panic handling and debugging

## Step 6: Install Flashing Tools

Install both `espflash` and `esptool`:

```bash
cargo install espflash
pipx install esptool
```

You'll see why we need both tools in the flashing section below.

## Writing Your First Program

Let's modify the generated code to print messages. Edit `src/bin/main.rs`:

```rust
use esp_backtrace as _;
use esp_hal::clock::CpuClock;
use esp_hal::main;
use esp_hal::time::{Duration, Instant};
use esp_hal::timer::timg::TimerGroup;
use esp_println::println;  // Add this import

extern crate alloc;

esp_bootloader_esp_idf::esp_app_desc!();

#[main]
fn main() -> ! {
    let config = esp_hal::Config::default().with_cpu_clock(CpuClock::max());
    let peripherals = esp_hal::init(config);

    esp_alloc::heap_allocator!(#[esp_hal::ram(reclaimed)] size: 98768);

    let timg0 = TimerGroup::new(peripherals.TIMG0);
    esp_rtos::start(timg0.timer0);

    let radio_init = esp_radio::init()
        .expect("Failed to initialize Wi-Fi/BLE controller");
    let (mut _wifi_controller, _interfaces) =
        esp_radio::wifi::new(&radio_init, peripherals.WIFI, Default::default())
            .expect("Failed to initialize Wi-Fi controller");

    // Print startup messages
    println!("========================================");
    println!("ESP32 Rust Hello World!");
    println!("========================================");
    println!("WiFi/BLE initialized successfully");
    println!("Starting main loop...");
    println!();

    let mut counter = 0u32;

    loop {
        counter += 1;
        println!("Loop iteration: {} - ESP32 is alive!", counter);

        let delay_start = Instant::now();
        while delay_start.elapsed() < Duration::from_millis(1000) {}
    }
}
```

## Building Your Project

Build the firmware:

```bash
cd esp32-hello-world
. ~/export-esp.sh  # If not in .zshrc
cargo build --release
```

**Critical**: Always source `export-esp.sh` before building, or you'll get linker errors.

## The espflash 4.3.0 Bug and Workaround

Here's where I hit a major roadblock. The current version of espflash (4.3.0) has a bug that causes it to panic with "range end index 4 out of range for slice of length 3" when trying to flash.

**The workaround** uses `espflash` to generate the binary and `esptool` to flash it:

```bash
# Step 1: Generate merged firmware binary
espflash save-image --chip esp32 --merge \
  target/xtensa-esp32-none-elf/release/esp32-hello-world \
  esp32-firmware.bin

# Step 2: Flash with esptool
esptool --chip esp32 --port /dev/cu.usbserial-XX --baud 460800 \
  write-flash 0x0 esp32-firmware.bin
```

Replace `/dev/cu.usbserial-XX` with your actual port (find it with `ls /dev/cu.*`).

## Identifying Your Board

**Important lesson learned**: Not all boards in your parts bin are ESP32s! I initially grabbed an ESP8266 by mistake. Here's how to verify:

```bash
esptool --port /dev/cu.usbserial-XX chip_id
```

This shows your exact chip:
- ESP32-D0WD-V3 ✅ (what I had)
- ESP8266EX ❌ (what I initially tried)
- ESP32-C3, ESP32-S3, etc. ✅

The ESP8266 is a completely different architecture and won't work with ESP32 firmware.

## Entering Bootloader Mode

Most ESP32 dev boards have auto-reset circuitry. However, if flashing fails:

1. Unplug the USB cable
2. Hold down the BOOT button
3. Plug USB back in while holding BOOT
4. Release BOOT after 2-3 seconds
5. Run the flash command immediately

**Pro tip**: Disconnect any sensors or peripherals during flashing. I had a DHT11 sensor that was interfering with the bootloader.

## Monitoring Serial Output

After flashing successfully, monitor your ESP32:

```bash
# Using screen (built into macOS)
screen /dev/cu.usbserial-XX 115200

# Exit: Ctrl+A then K, then Y to confirm
```

Press the EN/RST button to reset the board, and you should see:

```
========================================
ESP32 Rust Hello World!
========================================
WiFi/BLE initialized successfully
Starting main loop...

Loop iteration: 1 - ESP32 is alive!
Loop iteration: 2 - ESP32 is alive!
Loop iteration: 3 - ESP32 is alive!
...
```

## Common Issues and Solutions

### "linker xtensa-esp32-elf-gcc not found"

You forgot to source the environment:
```bash
. ~/export-esp.sh
```

### "Wrong boot mode detected"

Try these in order:
1. Disconnect peripherals from GPIO pins
2. Manually enter bootloader mode (see above)
3. Try a different USB cable or port
4. Some cheap USB adapters don't support auto-reset

### Build succeeds but flash fails immediately

Check if you're using the right chip variant in your commands. An ESP32-C3 won't accept ESP32 firmware.

## What's Next?

Now that you have a working setup:

1. **Explore peripherals**: GPIO, I2C, SPI, PWM
2. **Try WiFi connectivity**: HTTP clients, MQTT
3. **Add sensors**: Temperature, humidity, motion detection
4. **Build something useful**: Weather station, home automation, data logger

Check out the [esp-hal examples](https://github.com/esp-rs/esp-hal/tree/main/examples) for inspiration.

## Conclusion

Setting up ESP32 Rust development on macOS has its challenges, but the result is worth it. You get Rust's safety guarantees in embedded systems, excellent tooling, and a powerful microcontroller platform.

The key takeaways:
- Use `--locked` when installing Rust tools
- Always source `export-esp.sh` before building
- Work around espflash 4.3.0 bug with save-image + esptool
- Verify your chip type before flashing
- Disconnect peripherals during flashing

Happy embedded Rust development! If you run into issues or have questions, the esp-rs community on Matrix/Discord is incredibly helpful.

## Resources

- [ESP-RS Book](https://esp-rs.github.io/book/) - Official documentation
- [esp-generate](https://github.com/esp-rs/esp-generate) - Project generator
- [esp-hal](https://docs.esp-rs.org/esp-hal/) - Hardware abstraction layer
- [espflash](https://github.com/esp-rs/espflash) - Flashing tool
- [ESP32 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
