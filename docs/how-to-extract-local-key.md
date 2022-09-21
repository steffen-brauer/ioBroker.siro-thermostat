# TODO!!! 

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
