![Logo](admin/siro-thermostat.png)
# ioBroker.siro-thermostat

[![NPM version](https://img.shields.io/npm/v/iobroker.siro-thermostat.svg)](https://www.npmjs.com/package/iobroker.siro-thermostat)
[![Downloads](https://img.shields.io/npm/dm/iobroker.siro-thermostat.svg)](https://www.npmjs.com/package/iobroker.siro-thermostat)
![Number of Installations](https://iobroker.live/badges/siro-thermostat-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/siro-thermostat-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.siro-thermostat.png?downloads=true)](https://nodei.co/npm/iobroker.siro-thermostat/)

**Tests:** ![Test and Release](https://github.com/steffen-brauer/ioBroker.siro-thermostat/workflows/Test%20and%20Release/badge.svg)

## siro-thermostat adapter for ioBroker

This adapter allows you to integrate [WiFi Thermostats from SIRO](https://smart-life24.de/produktwelt/wlan-smart-raumthermostat-sl06116w/) into ioBroker.
Basically, it should be possible to integrate those devices with the tuya adapter.

tbh.. I did not try to use the tuya adapter, because it looked overkill for my usecase, so a new adapter was born :)



# Adapter Configuration
You have to add your devices to the adapter manually,
therefore you have to extract some required data from your devices.


## Extract device id & local key
For configuring the devices you need to enter the device id and local key of your devices. There are a lot of ways on how to retrieve that local key.

I like to share the way I did it.
For the time beeing I don't have an android device, nor is my iPhone jailbraked or any other dirty tricks going on. Here is how I did it.

1. Intall an android emulator. My choice [MEMU](https://www.memuplay.com/de/), but it should work with any emulator you can enable root access on. For MEMU it's jusdt a simple setting. 
!!! _INSERT_PICTURE_HERE__ !!!

2. Install Smart Life App version xx.yy
3. Open Smart Life App and login in to your account. Make your device shows up.
4. Close the app
5. Install Titanium Backup App
6. Create a backup of the smart life app
7. Copy the files to the download folder (It is link to your local Download Folder) For that step you can make use of the built-in file explorer
8. Extract the backup archive
9. Look for the file (shared_prefs)
10. Extract your device settings. You can do that manually or if you are lazy like me use the [TuyaKeyExtractor](https://github.com/MarkWattTech/TuyaKeyExtractor)
11. Here you are.

**Hint**: If you reset your device (i.e. when changing your wifi settings) a new device id and local key is generated and your have to repeat this step.


### Some personal notes on this project

I was looking for thermostats for changing our existing ones for smart thermostats.
There had been some requirements that the new thermostats had to fulfill.
- Thermostats need to fit our existing frames (AS Jung series)
- Integratable to ioBroker without another kind of hardware (IoT hub/gateway)
- no cloud connection

The main reason for changing our existing thermostats is not primarily that I want to have smart ones.
Imho, there is no need for smart thermostats when using floor heating, BUT as our thermostats are so close
to light switches we often accidentily adjust the settings.

There is not a lot of choice when looking for thermostats with these requirements.

The ioBroker requirement is solved by creating this adapter. :) 
The "no cloud" requirement is solved using the cloud connection for initial device setup. After that is finished, you can block internet traffic in your firewall settings / router settings. Ofc, this part is optional. I prefer keeping the smart devices local only. There are other possibilites to control them over the internet like VPN.

## Developer manual
This section is intended for the developer. It can be deleted later.

## Changelog
For a detailed change log see [Changelog](CHANGELOG.md)

### **TODO FEATURES**
- change device settings
    - actual temperature compensation
    - limit max desired temperature
    - limit min desired temperature
    - default device state

### **Out of scope**
Currently it is not planned to support weekly programs using device native functions. We can make use of iobroker for that. Have a look at the calender adapter or implement scheduling yourself with the javascript adapter.

## Disclaimer
**All product and company names or logos are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them or any associated subsidiaries! This personal project is maintained in spare time and has no business goal.**

## License
MIT License

Copyright (c) 2022 steffen-brauer <steffen.brauer@mail.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.