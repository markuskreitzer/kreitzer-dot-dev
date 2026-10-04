---
title: "Dell XPS 15 7590 Fingerprint Reader on Linux: Goodix 27c6:5395"
description: "How I used OpenAI Codex to get the Goodix 27c6:5395 fingerprint reader working on a Dell XPS 15 7590 with Omarchy and Arch Linux."
date: "2026-10-03"
tags: ["Linux", "Dell XPS 15", "Goodix", "Fingerprint", "Omarchy", "Arch Linux", "libfprint", "OpenAI Codex"]
published: true
slug: "dell-xps-15-7590-goodix-fingerprint-linux"
---

The fingerprint reader in my Dell XPS 15 7590 has been dead weight under Linux for years. The laptop has the hardware. Dell supported it in Windows. Linux could see a Goodix device on the USB bus, but the normal fingerprint stack could not use it.

That changed this summer. I can now enroll a finger, match it through `fprintd`, and use the reader with my Omarchy login stack. Seeing `verify-match` in the terminal felt oddly momentous for such a small thing. This was one of the last pieces of hardware in an otherwise excellent laptop that had never worked the way it should.

The complete package, install scripts, Omarchy integration, and troubleshooting guide are public in [markuskreitzer/goodix-5395-omarchy](https://github.com/markuskreitzer/goodix-5395-omarchy).

## The hardware that Linux could see but not use

My machine is a Dell XPS 15 7590 with this fingerprint reader:

```text
Goodix HTK32 Fingerprint Sensor
USB ID: 27c6:5395
```

You can check for it with:

```bash
lsusb -d 27c6:5395
```

That USB ID is the useful part. Laptop product names are not precise enough because Dell used different readers across configurations and model years. The upstream driver also lists the Dell XPS 15 9570 for `27c6:5395`, plus the XPS 13 9305 and XPS 13 7390 for related Goodix HTK32 devices.

Stock `libfprint` did not support this reader. `fprintd` was installed and healthy, but it had no driver that knew how to initialize the sensor, complete its encrypted handshake, capture a usable image, or match a print.

## The work that made it possible

I did not write a fingerprint driver from scratch. [AndyHazz's goodix53x5-libfprint project](https://github.com/AndyHazz/goodix53x5-libfprint) provided the current `libfprint` driver. It builds on protocol reverse engineering and SIGFM work from the [goodix-fp-linux-dev contributors](https://github.com/goodix-fp-linux-dev).

That distinction matters. The hard work of understanding the Goodix protocol, decrypting the image stream, cleaning up a tiny 108 by 88 pixel capture, and finding a matching strategy belongs to those developers.

My problem was the last mile: determine whether that work applied to my exact reader, adapt it to current Arch Linux and Omarchy, install it without leaving the authentication stack in a broken state, and prove that it worked on real hardware.

## I did this with OpenAI Codex

I used [OpenAI Codex](https://openai.com/codex/) as a pair engineer through the entire job. This was not a case where I asked it for a generic set of Linux commands and hoped for the best. Codex worked against the live machine, inspected each layer, built the package, read the service state, and adjusted the plan as the hardware answered back.

Codex helped me:

1. Identify the reader as Goodix `27c6:5395` and record the Dell model, BIOS, kernel, `libfprint`, and `fprintd` versions.
2. Find the active upstream driver and compare it with the Arch User Repository package.
3. Pin a known driver revision and adapt its `PKGBUILD` for my system.
4. Diagnose a missing `glib-mkenums` build tool and add `glib2-devel` to the package build dependencies.
5. Run the driver's GTLS/GEA crypto, SIGFM extraction, and SIGFM matching tests.
6. Build a replacement `libfprint` package and install it through Pacman.
7. Enroll my right index finger and repeat verification until we had a clean `verify-match`.
8. Configure PAM for `sudo` and Polkit, then enable fingerprint input in Hyprlock.
9. Trace a stale D-Bus device claim left by canceled authentication prompts and return `fprintd` to a clean state.
10. Turn the working process into an install script, an Omarchy configuration helper, and the public guide linked above.

That is the part of this project I find most interesting. Codex did not replace the upstream expertise or the physical testing. It connected them. It could inspect the machine, reason over the driver and package sources, watch a build fail, fix the specific dependency, and stay with the task through enrollment and verification. I supplied the computer, the finger, the authentication steps that had to remain local, and the judgment about what I was willing to change.

I would not have moved through this nearly as quickly on my own. More importantly, we kept a record that another XPS owner can follow instead of leaving the result trapped in one terminal session.

## Building a package I could undo

The driver replaces Arch Linux's stock `libfprint`, so I did not want an untracked `ninja install` writing files into `/usr`. We used a real Arch package that declares:

```text
provides: libfprint, libfprint-2, libfprint-2.so
conflicts: libfprint, libfprint-2
```

Pacman can therefore manage the replacement and put the stock package back if needed.

The package combines `libfprint` 1.94.10 with the tested Goodix driver revision. The repository does not ship a mystery binary. Its installer builds everything locally:

```bash
git clone https://github.com/markuskreitzer/goodix-5395-omarchy.git
cd goodix-5395-omarchy
./scripts/install-driver.sh
```

The script checks for `27c6:5395`, runs `makepkg`, asks Pacman to replace stock `libfprint`, restarts `fprintd`, and lists the reader. The expected device name is:

```text
Goodix HTK32 Fingerprint Sensor
```

One small packaging detail cost us some time. Current Arch splits `glib-mkenums` into `glib2-devel`. The AUR recipe had the runtime GLib package but not that build dependency, so the build stopped even though most of the expected development stack was present. Adding `glib2-devel` to `makedepends` made the build repeatable.

## Enrollment was the real proof

A clean compile only proves that the code compiles. The sensor had to open, pair, calibrate, capture a finger, store templates, and match them later.

I enrolled my right index finger with:

```bash
fprintd-enroll -f right-index-finger "$USER"
```

The reader completed all enrollment stages. My first verification returned `verify-no-match`, which was not exactly the triumphant ending I had in mind. The Goodix HTK32 has a very small sensing area, and finger placement matters. I tried again with the center of my finger flat across the reader:

```bash
fprintd-verify -f right-index-finger "$USER"
```

This time:

```text
Verify result: verify-match (done)
```

That second result is the one that mattered. The driver was talking to the real sensor and matching a fresh capture against the enrolled SIGFM templates.

## The Omarchy wrinkle

Omarchy already has a fingerprint setup command, but its normal path installs `libfprint-git`. That package conflicts with the Goodix build. Running the standard setup after installing this driver would replace the part we had just made work.

The public repository includes a separate helper:

```bash
./scripts/configure-omarchy-auth.sh
```

It adds `pam_fprintd.so` to the `sudo` and Polkit PAM files and enables `fingerprint:enabled` in Hyprlock when the setting is present. It also creates one backup of each file before it changes anything. Password authentication remains available, which is important for both recovery and security.

The most stubborn issue at the end was not the driver. A canceled `sudo` test and an abandoned Polkit prompt left the fingerprint device claimed inside `fprintd`. New authentication attempts could see the PAM module but could not acquire the reader. We found and stopped the old client processes, let the daemon return to an idle state, and confirmed that the next `sudo` attempt reached the fingerprint prompt.

It was a useful reminder that hardware enablement rarely fails in only one place. USB discovery, the device protocol, `libfprint`, `fprintd`, D-Bus, PAM, Polkit, and the lock screen all have to cooperate.

## The tested Dell XPS 15 7590 configuration

This is the exact setup that produced the successful match:

| Component | Value |
| --- | --- |
| Laptop | Dell XPS 15 7590 |
| BIOS | 1.38.0 |
| Operating system | Omarchy on Arch Linux |
| Kernel | 7.1.3-arch1-2 |
| Fingerprint reader | Goodix HTK32, `27c6:5395` |
| Driver commit | `309d4c6999a1cdce172c1ca1ee81387b5078d38f` |
| libfprint | 1.94.10 |
| fprintd | 1.94.5 |
| OpenCV | 5.0.0 |

The upstream repository has since added the Dell XPS 15 7590 to its documented device list. Its commits after the revision above only change documentation, so the code in the tested package still matches the current driver source as of October 3, 2026.

## A security caveat worth keeping

This is convenience-grade biometric authentication. I am happy to use it for routine login and elevation prompts, but I kept the password path enabled.

The sensor captures only 108 by 88 pixels and the driver uses SIFT-based matching. The GTLS implementation also uses an all-zero pre-shared key, which means a device that impersonates the sensor can derive the same session keys. The stored templates contain SIGFM features rather than raw fingerprint images, but they still represent biometric data.

That trade is acceptable for my use case. It would not be my only protection for sensitive data, and a fingerprint cannot be replaced like a compromised password.

## If your Dell XPS fingerprint reader still does nothing

Start with the USB ID:

```bash
lsusb | grep -i -E 'goodix|27c6'
```

If you see `27c6:5395`, the [Goodix 27c6:5395 Omarchy repository](https://github.com/markuskreitzer/goodix-5395-omarchy) has the complete procedure, including enrollment, rollback, updates, and the failure cases we encountered. It also packages upstream support for the related `27c6:5335` and `27c6:5385` readers, although my direct validation is on the XPS 15 7590 and `27c6:5395`.

If the ID is different, do not force this driver onto it. Goodix sold several incompatible fingerprint devices under similar names.

## Credit where it belongs

AndyHazz created and maintains the driver integration that made this possible. Matthieu Charette, Natasha England-Elbro, Timur Mangliev, and the other goodix-fp-linux-dev contributors did the protocol and SIGFM work the driver depends on. The libfprint and fprintd projects provide the standard Linux fingerprint stack around it.

OpenAI Codex helped me turn that work into a validated Dell XPS 15 7590 installation, solve the Arch and Omarchy integration problems, and publish the result in a form other people can use.

After years of treating the fingerprint reader as decorative trim, I can finally touch it and have Linux respond. That is a small win, perhaps, but it is a satisfying one.
