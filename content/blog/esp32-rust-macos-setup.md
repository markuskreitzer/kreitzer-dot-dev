---
title: "ESP32 Rust setup on macOS: build, flash, and read serial output"
description: "Toolchain setup and the espflash 4.3.0 workaround used with an ESP32-D0WD-V3."
date: "2025-12-28"
tags: ["Rust", "ESP32", "Embedded Systems", "IoT", "macOS", "Hardware"]
published: true
slug: "esp32-rust-macos-setup"
---

There are three separate things to get working: building firmware for the right chip, putting that firmware on the board, and reading its serial output. A successful build only checks the first one.

These notes use a classic Xtensa ESP32, specifically an ESP32-D0WD-V3, on macOS. The setup used Darwin 25.1.0 and Rust 1.87.0 for the host tools. Commands and generated code below reflect that setup; check the installed tool's help when using a different version.

## Identify the chip first

The ESP32 family includes different architectures. The target must match the chip, not just the name printed on a seller's listing. An ESP8266 also won't run ESP32 firmware.

With `esptool` installed, query the board:

```bash
esptool --port /dev/cu.usbserial-XX chip_id
```

Replace the port with the device shown by `ls /dev/cu.*`. Recent esptool versions may spell this subcommand `chip-id`; `esptool --help` lists the supported form.

macOS serial devices normally appear under `/dev/cu.*`. Linux instructions involving `libudev-dev` or membership in `dialout` don't apply here. The board still needs a data-capable USB cable and, for some USB-to-serial adapters, a driver.

## Install the toolchain

The Xtensa ESP32 needs the Espressif Rust toolchain. `espup` installs it:

```bash
cargo install espup --locked
espup install
. ~/export-esp.sh
```

`--locked` uses the tool's dependency lockfile. It avoids resolving a different dependency set, though the selected tool version must still support your host Rust compiler.

The generated `export-esp.sh` sets the build environment. Source it in each terminal used for this project, or add a guarded source command to your shell startup file. A missing Xtensa linker is a reason to check that environment before reinstalling tools.

## Generate a project

Install the generator and flashing tools:

```bash
cargo install esp-generate
cargo install espflash
pipx install esptool
```

This project included WiFi, allocation support, and backtraces:

```bash
esp-generate --chip esp32 --headless \
  -o unstable-hal \
  -o alloc \
  -o wifi \
  -o esp-backtrace \
  esp32-hello-world
```

Generator options change with releases. Use `esp-generate --help` to check the available options rather than copying flags into an incompatible version. For a first serial-only check, generating fewer peripherals leaves fewer things to debug.

## Print something repeatedly

The WiFi-enabled program below initializes the generated runtime and prints a counter once a second. It initializes the radio; it does not join an access point.

```rust
use esp_backtrace as _;
use esp_hal::clock::CpuClock;
use esp_hal::main;
use esp_hal::time::{Duration, Instant};
use esp_hal::timer::timg::TimerGroup;
use esp_println::println;

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

The delay is a busy wait. That's adequate for this bring-up example, but it occupies the CPU between messages. An application's scheduler or timer should handle waiting once there is other work to run.

Build from the project directory:

```bash
cd esp32-hello-world
. ~/export-esp.sh
cargo build --release
```

## When espflash panics

The setup encountered this error with espflash 4.3.0:

```text
range end index 4 out of range for slice of length 3
```

The workaround was to use espflash to create a merged image and esptool to write it. This is a workaround for that failure, not a required step for every espflash version.

```bash
espflash save-image --chip esp32 --merge \
  target/xtensa-esp32-none-elf/release/esp32-hello-world \
  esp32-firmware.bin

esptool --chip esp32 --port /dev/cu.usbserial-XX --baud 460800 \
  write-flash 0x0 esp32-firmware.bin
```

The address `0x0` belongs with the merged image in this command. Don't assume an arbitrary application binary can be flashed at the same address.

## If the board won't enter the bootloader

First check the chip selection and serial port. Then disconnect attached peripherals and retry. A sensor connected to a boot-strapping pin can change the boot mode; a DHT11 was involved in this setup's flashing trouble.

Boards with working auto-reset circuitry normally enter the bootloader when the tool connects. If that fails, hold BOOT while resetting the board, then release BOOT after the tool starts connecting. Use the board's documentation for its button sequence.

Changing a cable is also a useful check. Power LEDs don't establish that USB data is working.

## Read the running firmware

Close any program already holding the port, then open a serial monitor:

```bash
screen /dev/cu.usbserial-XX 115200
```

Press EN/RST if startup output has already passed. The example should print its startup messages followed by an increasing loop counter. In `screen`, press Ctrl+A, then K, then Y to close the session.

If flashing succeeds but there is no output, check the baud rate, reset the board, and confirm that the monitored port is still the correct one. Repeated resets or panic output point to a different problem from a failed flash.

The [ESP-RS book](https://esp-rs.github.io/book/), [esp-generate repository](https://github.com/esp-rs/esp-generate), and [espflash repository](https://github.com/esp-rs/espflash) are the places to check when a command differs from these notes.
